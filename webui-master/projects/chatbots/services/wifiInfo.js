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
            sendWifiPasswordInfo(user, response, channel);
        });
        
    } else {
        sendWifiPasswordInfo(user, response, channel);
    }

};


function sendWifiPasswordInfo( user, response, channel) {
    var data = user.state.get('facilityInfo');
    var dataObj = data['WIFI Password'.toUpperCase()];
    if ( dataObj && dataObj.text) {
      channel.sendMessage(user.id, dataObj.text);
    } else if (dataObj && dataObj.present === 'N') {
      channel.sendMessage(user.id, 'Sorry, We don\'t have WIFI');
    } else {
      channel.sendMessage(user.id, 'Hmm, I am surprised, I can\'t find the WIFI name and password');
    }
}
  

module.exports = {
    sendAnswer: sendAnswer
};