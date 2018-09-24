"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');

const sendAnswer = function(userId, response, channel) {
    const user = Users.getUser(userId);
    const venue = user.state.get("venue");
    let data = user.state.get('facilityInfo');
    if (!data) {
        serviceApi.getFacilityInfo(venue.id, result => {
            user.state.set("facilityInfo", result);
            sendAnswerAboutAmenities(user, response, channel);
        });
        
    } else {
        sendAnswerAboutAmenities(user, response, channel);
    }

};


function sendAnswerAboutAmenities(user, response, channel) {
    var data = user.state.get('facilityInfo');
    var dataObj = data['Amenities'.toUpperCase()];
  
    if (dataObj && dataObj.text) {
      channel.sendMessage(user.id, dataObj.text);
    } else {
      channel.sendMessage(user.id, "Sorry, I don't have that amenities information.");
    }
}
  

module.exports = {
    sendAnswer: sendAnswer
};