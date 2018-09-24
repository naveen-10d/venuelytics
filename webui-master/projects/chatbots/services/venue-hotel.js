"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const pluralize = require('pluralize');
const aiUtil = require('../lib/aiutils');
const moment = require("moment");
const facilities = require("./venue-facilities");

const sendAnswer = function(userId, response, channel) {
    let user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    const venue = user.state.get("venue");
    const info = user.state.get("facilityInfo");
    
     if (aiUtil.hasParam(response,'facilities', 'attractions') || (aiUtil.hasParam(response,'proximity', 'nearby') && aiUtil.hasParam(response,'facilities') )) {
        let f = response.parameters.facilityOriginal.toLowerCase();
        f = f.replace("?", "");
        let sf = pluralize.singular(f);
        let pf = pluralize.plural(sf);
        let m = info[`nearby ${sf}`.toUpperCase()];

        let message = null;
        if (m && m.text){
            message = m.text;
        } else {
            f = response.parameters.facilities.toLowerCase();
            f = f.replace("?", "");
            sf = pluralize.singular(f);
            m = info[`nearby ${sf}`.toUpperCase()];
            if (m && m.text){
                message = m.text;
            }
      
        }
        
        sendAnswerImpl(channel, userId, message, `Sorry, I am not aware of nearby ${pf}.`);
        return;
    } else if (aiUtil.hasParam(response,'action', 'clean')) {
        const m = info['House Keeping'.toUpperCase()];
        sendAnswerImpl(channel, userId, m.text, "I will send housekeeping to take care of it.");
        return;
    }else if(aiUtil.hasParam(response,'actionOriginal', 'bellman') || aiUtil.hasParam(response,'actionOriginal', 'luggage')) {
        sendAnswerImpl(channel, userId,  "We don't have a bellman.", null);
        return;
    }   else if (aiUtil.hasParam(response,'toilettes')) {
        sendAnswerImpl(channel, userId, null, "I will send housekeeping to take care of it.");
        return;
        
    } else if (aiUtil.hasParam(response,'action', 'extend')) {
        if(aiUtil.hasParam(response, 'OpenClosingTimes', 'checkout time')) {
            sendAnswerImpl(channel, userId, null, "You can extend your checkout till 2 pm the latest without charge. Please call frontdesk to extend the checkout time.");
            return;
        }
        if (aiUtil.hasParam(response, 'duration')) {
            sendAnswerImpl(channel, userId, null, "I will send your request to frontdesk they will contact you soon.");
        } else {
            sendAnswerImpl(channel, userId, null, "For how many days you want to extend your stay.");
            user.setConversationContext('EXTEND_STAY', true, extendSayDuration, response);
        }
        return;
    } else if (aiUtil.hasParam(response,'action', 'find') && aiUtil.hasParam(response, 'remote')) {  
        sendAnswerImpl(channel, userId, null, "Please check in the cabinet right below the TV.");
        return;
    } else if (aiUtil.hasParam(response,'item') || aiUtil.hasParam(response,'in-room-media') || aiUtil.hasParam(response,'room-amenities')){
        
        let item = response.parameters['room-amenities'] ||  response.parameters['in-room-media'] || response.parameters.item;
        if (aiUtil.hasParam(response,'cost')) {
            let text = aiUtil.facilityCost(item, info);
            sendAnswerImpl(channel, userId, text, `Sorry I don't have this information.`);
        } else if (aiUtil.hasParam(response,'size')) {
            let text = aiUtil.facilityValue(item.toUpperCase() + ' SIZE', info);
            sendAnswerImpl(channel, userId, text, `Sorry I don't have this information.`);

        } else {
            let text = aiUtil.facilityValue(item, info);
            sendAnswerImpl(channel, userId, text, `Sorry we don't have ${item}`);
        }
        return;
    } else if (aiUtil.hasParam(response, 'sound')) {
        sendAnswerImpl(channel, userId, null, "Sorry for the inconvenience! You request has been sent to Front Desk and our staff will contact you shortly to address your concern.");
        return;
    } else if (aiUtil.hasParam(response, 'actionOriginal', 'change')) {
        sendAnswerImpl(channel, userId, null, "You request has been sent to Front Desk and our staff will contact you shortly to address your concern.");
        return;
    } else if (aiUtil.hasParam(response, 'facilities', 'smoking-room') || aiUtil.hasParam(response, 'facilities', 'non-smoking')) {
        sendAnswerImpl(channel, userId, null, "You request has been sent to Front Desk and our staff will contact you shortly to address your concern.");
        return;
    }  else if (aiUtil.hasParam(response, 'facilities') ) {
        facilities.sendAnswer('Q_FACILITY', userId, response, channel);
        return;
    }
    const frontDeskNumber = venue.info['hotel.frontdesk.number'];
    let contactAddress = "";
    if (frontDeskNumber) {
        contactAddress = `@ ${frontDeskNumber}`;
    }
    sendAnswerImpl(channel, userId, null, `Sure, I will send your request to Front Desk or you can call Front Desk at ${contactAddress} `);
   
 };

 
function extendSayDuration(channel, userId, text, type, originalResponse) {
    console.log(text);
    sendAnswerImpl(channel, userId, null, "I will send your request to frontdesk they will contact you soon.");
}
  
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