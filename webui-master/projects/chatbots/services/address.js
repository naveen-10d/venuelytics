"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');
const pluralize = require('pluralize');
const sendAnswer = function(userId, response, channel) {
    const user = Users.getUser(userId);
    const venue = user.state.get("venue");
    
    let facilityType = "";
    if (aiUtil.hasParam(response, 'facilityOriginal')) {
        facilityType = response.parameters.facilityOriginal;
        facilityType = facilityType.replace("?", "");
        facilityType = facilityType.replace("-", " ");
        facilityType = pluralize.singular(facilityType);
    } else {
        if(aiUtil.hasParam(response, 'address', 'cross street')) {
            let data = user.state.get('facilityInfo');
            if (!data) {
                serviceApi.getFacilityInfo(venue.id, result => {
                    user.state.set("facilityInfo", result);
                    let m = aiUtil.getFacility("cross street", result);
                    channel.sendMessage(user.id, m.text ? m.text : `We are located at - ${venue.address}` );
                });
                return;
            } else {
                let m = aiUtil.getFacility("cross street", data);
                channel.sendMessage(user.id, m.text ? m.text : `We are located at - ${venue.address}` ); 
            } 
        } else {
            channel.sendMessage(user.id, "We are located at - "+  venue.address);  
        }
      
        return;
    }
    let facilityTypeOriginal = facilityType;
    let data = user.state.get('facilityInfo');
    if (!data) {
        serviceApi.getFacilityInfo(venue.id, result => {
            user.state.set("facilityInfo", result);
            sendAnswer(userId, response, channel);
        });
        return;
    }

    let dataObj = aiUtil.getFacilityObjectFromResponse(facilityTypeOriginal, data, response);
    if (!dataObj) {
        channel.sendMessage(user.id, "Sorry, I don't know this.");  
        return;
    }
    if (dataObj.type === "TEXT") {
        if (dataObj.text) {
            channel.sendMessage(user.id, dataObj.text);  
        } else if (dataObj.present === 'Y') {
            channel.sendMessage(user.id, `We have ${facilityTypeOriginal} but I am not sure about its location.`);  
        } else {
            channel.sendMessage(user.id, `Sorry, we don't have ${facilityTypeOriginal}.`);  
        }
        return;
    }
    if (user.hasParameter('service-time')) {
        sendAddressForServiceTimeTypeFacility(user, channel, dataObj, facilityTypeOriginal);
        return;
    } else {
        const venue = user.state.get("venue");
        serviceApi.getServiceTimes(venue.id, result => {
          user.state.set("service-time", result);
          sendAddressForServiceTimeTypeFacility(user, channel, dataObj, facilityTypeOriginal);
        });
        return;
    }

};

function sendAddressForServiceTimeTypeFacility(user, channel, dataObj, facilityTypeOriginal) {
    let serviceTimes = user.state.get('service-time');
    let locations = [];
    let hasFacility = false;

    for (let i = 0; i < serviceTimes.length; i++) {
      if (serviceTimes[i].type.toLowerCase() === dataObj.commonName.toLowerCase()) {
          channel.sendMessage(user.id,  serviceTimes[i].location );
          return;
      } else if (serviceTimes[i].type.toLowerCase().indexOf(dataObj.commonName.toLowerCase())> -1) {
        locations.push(serviceTimes[i].location);
        hasFacility = true;
      }
    }
    if (hasFacility) {
        if (locations.length > 1) {
            let locationsStr = locations.slice(0, -1).join(', ') +', and '+ locations.slice(-1);
            channel.sendMessage(user.id, `We have the following kind of ${dataObj.commonName}s - ${locationsStr}`);
        } else {
            let locationsStr  = locations[0];
            channel.sendMessage(user.id, locationsStr);
        }
        return;
    } else {
      channel.sendMessage(user.id, `Sorry, We don't have ${facilityTypeOriginal}.`);
    }
}

module.exports = {
    sendAnswer: sendAnswer
};