"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');
const pluralize = require('pluralize');

const sendAnswer = function(userId, response, channel) {

    let user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    const venue = user.state.get("venue");
    if (!user.hasParameter('facilityInfo')) {
        serviceApi.getFacilityInfo(venue.id, result => {
            user.state.set("facilityInfo", result);
            processRequest(userId, response, channel);
        });
    } else {
        processRequest(userId, response, channel);
    }
};

function processRequest(userId, response, channel) {

    let user = Users.getUser(userId);
    const venue = user.state.get("venue");
    if (!user.hasParameter('service-time')) {
        serviceApi.getServiceTimes(venue.id, result => {
            user.state.set("service-time", result);
            processRequest(userId, response, channel);
        });
        return;
    }
    let facilityType = "";
    if (aiUtil.hasParam(response, 'facilityName')) {
        facilityType = response.parameters.facilityName;
        facilityType = facilityType.replace("?", "");
        facilityType = facilityType.replace("-", " ");
        facilityType = pluralize.singular(facilityType);
    } else if (aiUtil.hasParam(response, 'room-amenities')){
        facilityType = response.parameters['room-amenities'];
    }

    if (!aiUtil.isNotEmpty(facilityType)){
        channel.sendMessage(user.id, `Sorry, We don't understand the facility you are talking about. You can ask about Pool, Jacuzzi or SPA temperature.`);
        return;
    }
    var data = user.state.get('facilityInfo');
    let dataObj = aiUtil.getFacilityObjectFromResponse(facilityType, data, response);
    
    let serviceTimes = user.state.get('service-time');
    let hasFacility = false;
    for (var i = 0; i < serviceTimes.length; i++) {
      if (serviceTimes[i].type.toLowerCase() === facilityType.toLowerCase()) {
        hasFacility = true;
      }
    }
    if (!hasFacility) {
        channel.sendMessage(user.id, `Sorry, We don't have ${response.parameters.facilityName}.`);
        return;
    }
    if (aiUtil.hasParam(response, 'facility', 'pool') ) {
       

        let tempInfo = data['POOL TEMPERATURE'];
        if (tempInfo) {
            channel.sendMessage(userId,tempInfo.text);
            return;
        } 
       
    }  else if (facilityType.toUpperCase().indexOf("JACUZZI") >=0 || 
        facilityType.toUpperCase().indexOf("TUB") >=0  || 
        facilityType.toUpperCase().indexOf("SPA") >=0) {
        let tempInfo = data['JACUZZI TEMPERATURE'];
        if (tempInfo) {
            channel.sendMessage(userId,tempInfo.text);
            return;
        }     

    }

    channel.sendMessage(userId,`Sorry, I don't have the temperature information of ${response.parameters.facilityName}`);
}
module.exports = {
    sendAnswer: sendAnswer
};
