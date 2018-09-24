"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');
const pluralize = require('pluralize');

const sendAnswer = function(userId, response, channel) {
    const user = Users.getUser(userId);
    const venue = user.state.get("venue");
    if (user.hasParameter('facilityInfo')) {
        sendFacilityCountImpl(user, response, channel);
    } else {
        serviceApi.getFacilityInfo(venue.id, result => {
            user.state.set("facilityInfo", result);
            sendFacilityCountImpl(user, response, channel);
        });
    }

};

function sendFacilityCountImpl(user, response, channel) {
    let facilityType = "";
    let data = user.state.get('facilityInfo');
    if (aiUtil.hasParam(response, 'facilityOriginal')) {
        facilityType = response.parameters.facilityOriginal;
        facilityType = facilityType.replace("?", "");
        facilityType = facilityType.replace("-", " ");
        facilityType = pluralize.singular(facilityType);
    } else if (aiUtil.hasParam(response, 'room-amenities')){
        facilityType = response.parameters['room-amenities'];
    } else {
        if (aiUtil.hasParam(response, 'count') && aiUtil.hasParam(response, 'item')) {
            let facility = null;
            let facilityName = null;
            if (aiUtil.hasParam(response, 'item', 'accessible')) {
                facilityName = "Accessible Rooms";
            } else if (aiUtil.hasParam(response, 'item', 'suite')) {
                facilityName = "Total Suites";
            }else if (aiUtil.hasParam(response, 'item', 'room')) { 
                facilityName = "Total Rooms";
            } else {
                facilityName = "Total Rooms";
            }
            facility = aiUtil.getFacility(facilityName, data);
            if (facility && facility.text) {
                channel.sendMessage(user.id, facility.text);
                return;
            } else if (facility && facility.present === 'Y') {
                channel.sendMessage(user.id, `Sorry, I don't have count information about ${response.parameters.item}`);
                return;
            }
        }
    channel.sendMessage(user.id, "Sorry, I don't have information about this. " );
    return;
  }
  
  let facilityTypeOriginal = facilityType;

  

  let dataObj = aiUtil.getFacilityObjectFromResponse(facilityType, data, response);

  if (!dataObj || dataObj.present === 'N') {
    channel.sendMessage(user.id, `Sorry, We don't have ${facilityTypeOriginal}.`);
    return;
  } else if (dataObj && dataObj.type === "TEXT") {
    channel.sendMessage(user.id, "I don't understand your question but I can tell you that we have this item/facility.");
    return;
  } else {
    let count = 0;
    let locations = [];
    let facilityText = "";
    let hasFacility = false;
   
    let serviceTimes = user.state.get('service-time');
    for (var i = 0; i < serviceTimes.length; i++) {
      if (serviceTimes[i].type.toLowerCase() === facilityType.toLowerCase()) {
        hasFacility = true;
        facilityText = serviceTimes[i].valueText;
        count += serviceTimes[i].count;
        locations.push(serviceTimes[i].location);
      }
    } 
    
    if (!hasFacility) {
      if ( Array.isArray(response.parameters.facilities) && response.parameters.facilities.length > 0) {
        facilityType = response.parameters.facilities[0]; // generic
      } else if (! Array.isArray(response.parameters.facilities)) {
        facilityType = response.parameters.facilities; // generic
      }
      
      for (i = 0; i < serviceTimes.length; i++) {
        if (serviceTimes[i].type.toLowerCase().indexOf(facilityType.toLowerCase())>-1) {
          hasFacility = true;
          facilityText = serviceTimes[i].valueText;
          count += serviceTimes[i].count;
          locations.push(serviceTimes[i].location);
        }
      } 
    }
  
    if (hasFacility) {
      if (count === 1) {
        channel.sendMessage(user.id, `There is one ${facilityType} located in the ${locations[0]}.`);
        return;
      } else {
        var locationsStr = locations.slice(0, -1).join(', ') +', and '+ locations.slice(-1);
        channel.sendMessage(user.id, `There are ${count} ${facilityType}'s located in the ${locationsStr}.`);
        return;
      }
    }   else {
      channel.sendMessage(user.id, `Sorry, We don't have ${facilityTypeOriginal}.`);
    }
  }
}

module.exports = {
    sendAnswer: sendAnswer
};