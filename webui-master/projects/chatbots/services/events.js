"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');

//ANSWERS["Q_EVENTS"] = { text: "VALUE", api_name: "info", value: "_events"};
const sendAnswer = function(userId, response, channel) {
    let user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    const venue = user.state.get("venue");
    const info = venue.info;
    
    if (aiUtil.hasParam(response, 'actions', 'bring')) {
        if(aiUtil.hasParam(response, 'eatNDrink', 'cake')) {
            channel.sendMessage(userId, info['_events.celebrate.bring.food']);
            return;
        }
    } else if (aiUtil.hasParam(response, 'actions', 'celebrate') || aiUtil.hasParam(response, 'enquire', 'celebrate')) {
        if(aiUtil.hasParam(response, 'eventType')) {
            channel.sendMessage(userId, info['_events.celebrate.special.day']);
            return;
        }
    }  else if (aiUtil.hasParam(response, 'enquire') || aiUtil.hasParam(response, 'question')) {
        if(aiUtil.hasParam(response, 'eventType')) {
            channel.sendMessage(userId, info['_events.celebrate.special.day']);
            return;
        }
    }else {
        const events = info['_events'];
        if (events && events.length > 0) {
            channel.sendMessage(userId, events); 
            return;
        } else {
            channel.sendMessage(userId, "Sorry, We don't have events."); 
            return;
        }
    }
     
    
    if (aiUtil.hasParam(response, 'actions', 'request') || aiUtil.hasParam(response, 'actions', 'organize')) {
        channel.sendMessage(userId, info['_events.organize']);
        return;
    } 
    
    if (aiUtil.hasParam(response, 'eventType'))  {
        if (aiUtil.hasParam(response, 'date')) {
            channel.sendMessage(userId, "There are no events scheduled today");
            return;
        } else {
            const events = info['_events'];
            if (events && events.length > 0) {
                channel.sendMessage(userId, events); 
                return;
            } else {
                channel.sendMessage(userId, "Sorry, We don't have events."); 
                return;
            }

        }
    }
    


};


module.exports = {
    sendAnswer: sendAnswer
};