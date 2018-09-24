"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');

const sendAnswer = function(userId, response, channel) {
    let user = Users.getUser(userId);
    const venue = user.state.get("venue");
    //we assume if we are here we have the venueId
    var data = user.state.get('facilityInfo');
    if (!data) {
        serviceApi.getFacilityInfo(venue.id, result => {
            user.state.set("facilityInfo", result);
            sendAnswer(userId, response, channel);
        });
        return;
    }

    var dataObj = data['AGE'];

    if (dataObj && dataObj.text) {
        channel.sendMessage(userId, dataObj.text);
        return;
    } else {
        channel.sendMessage(userId,'All guest are welcome to use our facility.');
        return;
    }
    
};



module.exports = {
    sendAnswer: sendAnswer
};
