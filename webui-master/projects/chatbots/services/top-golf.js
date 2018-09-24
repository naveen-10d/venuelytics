"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const pluralize = require('pluralize');
const aiUtil = require('../lib/aiutils');

const sendAnswer = function(userId, response, channel) {
    let user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    const venueId = user.state.get("selectedVenueId");
    const info = user.state.get("venue").info;

    if (aiUtil.hasParam(response, 'item', "club")) {
        if (aiUtil.hasParam(response, 'cost')) {
            channel.sendMessage(userId, info["_golf.club.cost"]);
        } else if (aiUtil.hasParam(response, 'actions', 'bring') && aiUtil.hasParam(response, 'question') ) {
            channel.sendMessage(userId, info['_golf.club.personal']);
        } else {
            channel.sendMessage(userId, info['_golf.club.policy']);
        }
        return;
    }
    
    if (aiUtil.hasParam(response, 'quantity') && aiUtil.hasParam(response, 'actions', "play")) {
        channel.sendMessage(userId, info['_golf.play.people.policy']);
        return;
    }

    if (aiUtil.hasParam(response, 'quantity') && aiUtil.hasParam(response, 'cost')) {
        channel.sendMessage(userId, info["_golf.play.cost"]);
        return;
    }

    if (aiUtil.hasParam(response, 'question') && aiUtil.hasParam(response, 'action', 'close') && aiUtil.hasParam(response, 'criteria', 'weather')) {
        channel.sendMessage(userId, info["_golf.play.weather"]);
        return;
    }

    if (aiUtil.hasParam(response, 'question') && aiUtil.hasParam(response, 'action', 'close')) {
        channel.sendMessage(userId, info["_golf.play.holiday"]);
        return;
    }

    channel.sendAnswer(userId, "Hmm, I didn't understand your question");


};



module.exports = {
    sendAnswer: sendAnswer
};