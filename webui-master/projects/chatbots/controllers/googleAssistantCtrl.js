'use strict';

const venueService = require('../services/venue-service');

class GoogleAssistantChannel {

    constructor(response) {
        this.response = response;
    }

    getName() {
        return "googleAssistant";
    }

    sendMessage(message) {
        sendMsg(message, this.response);
    }
}

module.exports.getwebhook = function (req, res) {

    let message = req.result.resolvedQuery;
    console.log("message >>>>>>>>>>>>>>>>>", message)

    venueService.processMessage(1, message, new GoogleAssistantChannel(res));
    res.end();
};

module.exports.setwebhook = function (req, res) {

    var intentName = req.body.result.metadata.intentName;
    var params = req.body.result.parameters;

    if (intentName === 'Address and Location') {
        console.log("ONE >>> Address and Location")
        if (params.bar) {
            return sendMsg('bar is near by 1 kilometer', res)
        } else if (params.facilities) {
            return sendMsg('near by ..slam gym avaliable', res)
        } else if (params.address) {
            return sendMsg('its in feathers hotel...near by 2kilometer', res)
        } else {
            return sendMsg('Seems like some problem. Speak again...', res)
        }
    } else if (intentName === 'AGE Policy') {
        console.log("TWO >>> AGE Policy")
        if (params.criteria || params.common - entities) {
            return sendMsg('18 and above', res)
        }
    } else if (intentName === 'Charger') {
        console.log("THREE >>> Charger")
        if (params.item || params.device) {
            return sendMsg('yup! I have', res)
        }
    } else if (intentName === 'Charges?') {
        console.log("FOUR >>> Charges")
        if (params.chargeType) {
            return sendMsg('30 dollars', res)
        }
    } else if (intentName === 'Count of facilities') {
        console.log("FIVE >>> Count of facilities")
        if (params.count) {
            return sendMsg('20', res)
        }
    } else if (intentName === 'Events') {
        console.log("SIX >>> Events")
        if (params.eventType) {
            return sendMsg('party event, birthday celebration, musical event', res)
        } else if (params.actions) {
            return sendMsg('Yes', res)
        }
    } else if (intentName === 'Reservation') {
        console.log("SEVEN >>> Reservation")
        if (params.reservationDate) {
            return sendMsg('sure...send your details', res)
        }
    } else if (intentName === 'Rate Service') {
        console.log("EIGHT >>> Rate Service")
        if (params.rating) {
            return sendMsg('Yes.. Please send your feedack and queries', res)
        }
    } else if (intentName === 'Pet policy') {
        console.log("NINE >>> Pet policy")
        if (params.pets) {
            return sendMsg('Yes.. We allow pets', res)
        }
    } else if (intentName === 'RESTART') {
        console.log("TEN >>> RESTART")
        if (params.Proximity) {
            return sendMsg('your request has been loading...', res)
        }
    } else {
        throw new Error('Invalid intent');
    }
};

var sendMsg = (message, res) => {
    res.json({
        speech: message,
        display: message,
        source: 'venuelytics'
    })
}