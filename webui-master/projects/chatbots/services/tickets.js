"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');

const sendAnswer = function(userId, response, channel) {
    let user = Users.getUser(userId);
    //we assume if we are here we have the venueId
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

    var dataObj = data['TICKET COUNTER'];

    if (dataObj && dataObj.text) {
        channel.sendMessage(userId, dataObj.text);
        return;
    } else {
        channel.sendMessage(userId,'Please contact our concierge service, they will assist you in getting tickets for Events & Shows');
        return;
    }
    
};



module.exports = {
    sendAnswer: sendAnswer
};
