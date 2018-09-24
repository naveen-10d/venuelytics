"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');
const pluralize = require('pluralize');
const SUPORTED_TYPES = {
    GuestList: "Advance.GuestList.enable",
    PrivateEvent: "Advance.BookBanquetHall.enable",
    Bottle: "Advance.BottleService.enable",
    Reservation: "Advance.Reservation.enable",

};

const FACILITY_NAMES = {
    GuestList: "GUESTLIST SERVICE",
    PrivateEvent: "PRIVATE EVENT SERVICE",
    Bottle: "BOTTLE SERVICE",
    Reservation: "RESERVATION SERVICE",
};
const sendAnswer = function(userId, response, channel) {

    const user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    const venue = user.state.get("venue");
    if (!user.hasParameter('facilityInfo')) {
        serviceApi.getFacilityInfo(venue.id, result => {
            user.state.set("facilityInfo", result);
            processRequest(userId, response, channel);
        });
    } else {
        processRequest(userId, response, channel);
    }
};

function  processRequest(userId, response, channel) {
    const user = Users.getUser(userId);
    const venue = user.state.get("venue");
    const venueInfo = venue.info;
    const serviceType = response.parameters.serviceType;
    var data = user.state.get('facilityInfo');
    const frontDeskNumber = venue.info['hotel.frontdesk.number'];
    let contactAddress = "";
    if (frontDeskNumber) {
        contactAddress = `@ ${frontDeskNumber}`;
    }
    if(aiUtil.hasParam(response, 'enquire') && aiUtil.hasParam(response, 'action', 'meeting')) {
       if (aiUtil.hasParam(response, 'facilityName', 'meeting room') || aiUtil.hasParam(response, 'facilityName', 'event room')) {
        channel.sendMessage(userId,"You can reserve a meeting room / event room for you meetings.");
       } else {
        channel.sendMessage(userId,`You can have meeting only in a meeting room or an event room. You need to reserve the meeting room / event room for that. Please contact front desk ${contactAddress} to book/reserve a meeting room.`); 
       }
       return;
    }
    if(aiUtil.hasParam(response, 'enquire')  && (aiUtil.hasParam(response, 'action', 'rent') || aiUtil.hasParam(response, 'action', 'book'))) {
        channel.sendMessage(userId,`To rent or book our facilities, please contact our front desk ${contactAddress}.`); 
        return;
    }
    if (aiUtil.hasParam(response, 'serviceType')) {
        const supported = SUPORTED_TYPES[serviceType];
        if (supported) {
            if (venueInfo[supported] === 'N') {
                channel.sendMessage(userId,`Sorry, We don't provide this service ${serviceType}`);
            } else {
                let dataObj = aiUtil.getFacilityObjectFromResponse(FACILITY_NAMES[serviceType], data, response);
                if (!dataObj || dataObj.present === 'N') {
                    channel.sendMessage(userId,`Sorry, We don't provide this service.`);
                } else {
                    channel.sendMessage(userId, dataObj.text || `Contact Front Desk @ ${contactAddress} for information about this.`);
                }
                
            }
            return;
        } 

        if (serviceType && serviceType.toUpperCase() === 'DELIVERY') {
            let dataObj = aiUtil.getFacilityObjectFromResponse('DELIVERY', data, response);
            if (!dataObj || dataObj.present === 'N') {
                channel.sendMessage(userId,`Sorry, We don't provide delivery service.`);
            } else {
                channel.sendMessage(userId,dataObj.text || `Contact Front Desk @ ${contactAddress} for information about this.`);
            }
            return;
        } else {
            channel.sendMessage(userId,`Sorry, We don't provide this service ${serviceType}`);
            return;
        }
    }    
    channel.sendMessage(userId,`Sorry, I don't have information about it.`);
}

module.exports = {
    sendAnswer: sendAnswer
};
