"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');

const PLACES = 8323072;
const sendAnswer = function(userId, response, channel) {

    let user = Users.getUser(userId);
    const venue = user.state.get("venue");

    
    if (aiUtil.hasParam(response, "address") || aiUtil.hasParam(response, "place") || aiUtil.hasParam(response, "given-name")) {
        let placeWithName = '';
        if (aiUtil.hasParam(response, "given-name")) {
            placeWithName = response.parameters['given-name'];
        }

        if (aiUtil.hasParam(response, "place")) {
            if (placeWithName.length > 0) {
                placeWithName += ' ';
            }
            placeWithName += response.parameters['place'];
        }

        let search = response.parameters.address || placeWithName;
        serviceApi.searchVenue(null, search, PLACES, venue.latitude, venue.longitude, 50,5,function(result){
            if (result.length > 0) {
                channel.sendMessage(userId, `${result[0].distanceInMiles} miles from ${venue.venueName}`);
                return;
            } else {
                serviceApi.queryUsingGooglePlaces(response.queryText, venue.latitude, venue.longitude,function(result) {
                    if (result.candidates.length > 0) {
                        const placeName = result.candidates[0].name;
                        serviceApi.getDrivingDistance( venue.latitude,venue.longitude,
                             result.candidates[0].geometry.location.lat,  result.candidates[0].geometry.location.lng, function(distanceObj) {
                            channel.sendMessage(userId, `${placeName} is ${distanceObj.distance.value/1600} miles from ${venue.venueName}`);
                        });
                    } else {
                        channel.sendMessage(userId, `Sorry, Didn't find any information about this place - ${search}`);
                    }
                    
                });
                
            }
        });
    }

};

module.exports = {
    sendAnswer: sendAnswer
};
