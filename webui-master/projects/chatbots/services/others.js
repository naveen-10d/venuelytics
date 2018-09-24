"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');

const sendAnswer = function(userId, response, channel) {

    const user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    const venue = user.state.get("venue");
    if (aiUtil.hasParam(response, 'discount') && aiUtil.hasParam(response, 'negative')) {
        channel.sendMessage(userId,'Sorry, I am not aware of any discounts.');
        return;
    }
    if (aiUtil.hasParam(response, 'discount')) {
        channel.sendMessage(userId,'Please visit our website for information about various discounts.');
    }
    const frontDeskNumber = venue.info['hotel.frontdesk.number'];
    let contactAddress = ".";
    if (frontDeskNumber) {
        contactAddress = `@ ${frontDeskNumber}`;
    }
    channel.sendMessage(userId,`Sorry, I didn't understand the question. Please contact front desk @ ${contactAddress}`);
};


module.exports = {
    sendAnswer: sendAnswer
};
