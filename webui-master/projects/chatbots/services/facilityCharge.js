"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');

const sendAnswer = function(userId, response, channel) {
    const user = Users.getUser(userId);
    const venue = user.state.get("venue");
    if (user.hasParameter('service-time')) {
        sendChargeImpl(user, response, channel);
        return;
    } else {
        const venue = user.state.get("venue");
        serviceApi.getServiceTimes(venue.id, result => {
          user.state.set("service-time", result);
          sendChargeImpl(user, response, channel);
        });
        return;
    }
};

function sendChargeImpl(user, response, channel) {
    const chargeType = response.parameters.chargeType;
    let data = user.state.get("service-time");
    let name="";
    if (chargeType.toLowerCase().indexOf("cover") >=0 ) {
      name = "CoverCharges";
    } else if (chargeType.toLowerCase().indexOf("fastlane") >=0 || chargeType.toLowerCase().indexOf("fast lane") >= 0){
      name = "FastLaneCharges";
    }
    
  
    if (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].type.toLowerCase() === name) {
          let startTime = aiUtil.formatTime(data[i]['startTime']);
          let endTime = aiUtil.formatTime(data[i]['endTime']);
          if (data[i].value > 0.0) {
            channel.sendMessage(user.id, `We charge a cover charge of ${data[i].value} between ${startTime} and ${endTime}`);
          } else {
            channel.sendMessage(user.id, `We don't have ${chargeType}`);
          }
          
          return;
        }
      }
    }
  
    channel.sendMessage(user.id, `We don't have ${chargeType}`);
}

module.exports = {
    sendAnswer: sendAnswer
};