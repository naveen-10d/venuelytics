"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');
const moment = require("moment");
const sendAnswer = function(userId, response, channel) {
    let user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    const venue = user.state.get("venue");
    const info = venue.info;
    
    if (aiUtil.hasParam(response, "item", "menu")) {    
        if (aiUtil.hasParam(response, 'meal', "food") || aiUtil.hasParam(response, 'meal', "lunch")) {
            if (info['Food.menuUrl'] &&  info['Food.menuUrl'].length > 0) {
                channel.sendMessage(userId,`Yes, please visit this link to check our Food menu - ${info['Food.menuUrl']}`);
            } else {
                channel.sendMessage(userId,`Sorry We don't have food menu`);
            }
            return;
        }

        if (aiUtil.hasParam(response, 'eatNDrink', "drink")) {
            if (info['Drinks.menuUrl'] &&  info['Drinks.menuUrl'].length > 0) {
                channel.sendMessage(userId,`Yes, please visit this link to check our Drinks menu - ${info['Drinks.menuUrl']}`);
            } else {
                channel.sendMessage(userId,`Sorry We don't have Drinks menu`);
            }
            return;
        }

        if (aiUtil.hasParam(response, 'eatNDrink', "beer")) {
            if (info['Drinks.beerMenuUrl'] &&  info['Drinks.beerMenuUrl'].length > 0) {
                channel.sendMessage(userId,`Yes, please visit this link to check our Beers menu - ${info['Drinks.beerMenuUrl']}`);
            } else {
                channel.sendMessage(userId,`Sorry We don't have Drinks menu`);
            }
            return;
        }

        if (aiUtil.hasParam(response, 'eatNDrink', "wine")) {
            if (info['Wine.menuUrl'] &&  info['Wine.menuUrl'].length > 0) {
                channel.sendMessage(userId,`Yes, please visit this link to check our Wine menu - ${info['Wine.menuUrl']}`);
            } else {
                channel.sendMessage(userId,`Sorry We don't have Wine menu`);
            }
            return;
        }
           
        if (aiUtil.hasParam(response, 'eatNDrink')) {
            channel.sendMessage(userId,`Sorry We don't carry menu you are looking for.`);
            return;
        } else {
            channel.sendMessage(userId, "What kind of menu you are looking for - Food, Drinks, Dessert, Wine ...");
            return;
        }
    }
    if (aiUtil.hasParam(response, "action", "serve") || aiUtil.hasParam(response, "action", "deliver")) {    
        if (aiUtil.hasParam(response, 'eatNDrink', 'food') && aiUtil.hasParam(response, 'eatNDrink', 'alcohol')) {
            channel.sendMessage(userId,`Yes we serve/deliver food and alcohol both`);
            return;
        }
        if (aiUtil.hasParam(response, 'eatNDrink', 'food')) {
            channel.sendMessage(userId,`Yes we serve/deliver food`);
            return;
        }

        if (aiUtil.hasParam(response, 'eatNDrink', 'alcohol')) {
            channel.sendMessage(userId,`Yes we serve/deliver alcoholic and non-alcoholic drinks`);
            return;
        }

        if (aiUtil.hasParam(response, 'meal', 'breakfast') || aiUtil.hasParam(response, 'meal', 'lunch') || aiUtil.hasParam(response, 'meal', 'dinner')) {

            channel.sendMessage(userId,`Yes we serve/deliver breakfast, lunch and dinner.`);
            return;
        }

    }

    if (aiUtil.hasParam(response, "action", "order") && aiUtil.hasParam(response, 'eatNDrink')) {    
        if (user.hasParameter('service-time')) {
            let serviceTimes = user.state.get('service-time');
            sendOrderingInfo(serviceTimes, channel, userId, venue);
            return;
          } else {
            const venue = user.state.get("venue");
            serviceApi.getServiceTimes(venue.id, result => {
                user.state.set("service-time", result);
                sendOrderingInfo(result, channel, userId, venue);
            });
            return;
          } 
    }

    channel.sendMessage(userId,"sorry, I didn't understand you question.");
 };
  

 function sendOrderingInfo(serviceTimes, channel, userId, venue) {
    let orderingText = null;
    for (let i = 0; i < serviceTimes.length; i++) { 
        if (serviceTimes[i].type.toLowerCase() === "ordering service") {
            orderingText = serviceTimes[i].valueText;
            let openTime = aiUtil.formatTime(serviceTimes[i].startTime);
            let closeTime = aiUtil.formatTime(serviceTimes[i].endTime);
            if (openTime === closeTime) {
                orderingText +=" We are Open 24 hours.";
            } else {
                let open = aiUtil.isBetween(moment().format("hh:mm:ss"), openTime, closeTime, venue.timezone);
                if (open) {
                    orderingText += " We are open now.";
                } else {
                    orderingText += " Currently we are closed.";
                }
            }
            break;
        }
    }
    if (orderingText) {
        channel.sendMessage(userId,orderingText);
    } else {
        channel.sendMessage(userId, "I will send room service to take your order.");
    }
}

module.exports = {
  sendAnswer: sendAnswer
};