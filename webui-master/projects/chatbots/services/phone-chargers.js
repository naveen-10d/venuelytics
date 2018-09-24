"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');

const sendAnswer = function(userId, response, channel) {
    let user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    const venue = user.state.get("venue");
    const facilityInfo = user.state.get("facilityInfo");
    if (aiUtil.hasParam(response, 'device')) {
        let device = response.parameters.device;
        let computerDevices = ['computer', 'laptop', 'notebook', 'macbook', 'mac'];
        let text = null;
        if (computerDevices.includes(device.toLowerCase())) {
            text = aiUtil.facilityValue("computer charger", facilityInfo);
            if (!text) {
                text = `Sorry we don't have chargers for computers or laptops`;
            }
            
        } else {
            text = aiUtil.facilityValue("phone charger", facilityInfo);
            if (!text) {
                text = `Sorry we don't have chargers for phones.`;
            }
        }
        channel.sendMessage(userId,text);
        return;
    }
    
    let c1 = aiUtil.getFacility("computer charger", facilityInfo);
    let p1 = aiUtil.getFacility("phone charger", facilityInfo);

    if ((c1 && c1.present === 'Y') || (p1 && p1.present === 'Y')) {
        const frontDeskNumber = venue.info['hotel.frontdesk.number'];
    let contactAddress = "";
    if (frontDeskNumber) {
        contactAddress = `@ ${frontDeskNumber}`;
    }
        channel.sendMessage(userId,`Please call Front Desk @ ${contactAddress} to see if chargers are available and not borrowed by other guests.`);
        return;
    } 
    channel.sendMessage(userId,"Sorry we don't have chargers.");
};



module.exports = {
    sendAnswer: sendAnswer
};
