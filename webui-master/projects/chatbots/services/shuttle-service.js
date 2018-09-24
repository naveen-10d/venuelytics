"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');

const sendAnswer = function(userId, response, channel) {
    let user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    let facilityData = user.state.get("facilityInfo");
    let m = "";
    if (aiUtil.hasParam(response, 'shuttle', 'airport') || aiUtil.hasParam(response, 'place', 'airport') ) {
        m = facilityData['Airport Shuttle'.toUpperCase()]; 
    } else {
        m = facilityData['Shuttle Service'.toUpperCase()]; 
    }
    let message = null;
    if (m && m.text) {
       message = m.text;
    }
    sendAnswerImpl(channel, userId, message, "Sorry, we don't provide shuttle services.");

};

function sendAnswerImpl(channel, userId, pMessage, nMessage) {
    if (pMessage && pMessage.length > 0) {
        channel.sendMessage(userId, pMessage);
    } else {
        channel.sendMessage(userId, nMessage);
    }
}


module.exports = {
    sendAnswer: sendAnswer
};