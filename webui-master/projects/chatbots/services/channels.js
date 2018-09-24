"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');

const sendAnswer = function(userId, response, channel) {

    let user = Users.getUser(userId);
    //we assume if we are here we have the venueId
    
    let channelInfo = user.state.get("channelInfo");
    const venue = user.state.get("venue");
    if (!channelInfo) {
        
        serviceApi.getTVChannelInfo(venue.id, null, function(channels) {
            if (channels && channels.length > 0) {
                user.state.set("channelInfo", channels);
                sendAnswer(userId, response, channel);
            } else {
                channel.sendMessage(userId, "Sorry, I don't have this information.");
            }
        }, function(error) {
            console.log(error);
        });
       return;
    }
    /*
    * Example: DO you have sports channel or what sports channels you have
    * 
    */
    if (aiUtil.hasParam(response, 'show-genre') && !aiUtil.hasParam(response, 'channelName')) {
        let genre = response.parameters['show-genre'];
        genre = genre.replace("movies","");
        genre = genre.replace("movie", "");
        genre = genre.replace("channel", "");
        
        serviceApi.getTVChannelInfo(venue.id, genre, function(channels) {
            sendChannelMessage(userId, genre, channel, channels);
        });
        return;
    }

    if (aiUtil.hasParam(response, 'channelName')) {
        let channelName = response.parameters['channelName'];
        let channels = [];
        for(let i =0; i < channelInfo.length; i++) {
            if (channelInfo[i].name.toLowerCase().indexOf(channelName.toLowerCase()) >= 0){
                channels.push(channelInfo[i]);
            }
            
        }
        sendChannelMessage(userId, channelName, channel, channels);
        return;
    }

    if (aiUtil.hasParam(response, 'lineup')) {
        if (channelInfo.length === 0) {
            channel.sendMessage(userId,"Sorry, Channel lineup information is not available.");
        } else {
            channel.sendMessage(userId,"You can click this link to view the channel lineup.\n "+ serviceApi.getChannelLineupUrl(venue.uniqueName || venue.id));
        }
        return;
    }
 
    if (aiUtil.hasParam(response, 'channels')) {
        let channelCategory = response.parameters['channels'];
        channelCategory = channelCategory.replace("channels", "");
        channelCategory = channelCategory.replace("channel", "");
        serviceApi.getTVChannelInfo(venue.id, channelCategory, function(channels) {
            sendChannelMessage(userId, channelCategory, channel, channels);
        });
        return;

    }
    channel.sendMessage(userId,"Hmm, I don't know the answer, please check the channel guide available in the your room.");
};

function sendChannelMessage(userId, channelName, channel, channels) {
    if (channels.length === 0) {
        channel.sendMessage(userId, `Sorry, We don't have ${channelName} channels`);
        return;
    }
    if (channels.length > 10) {
        channel.sendMessage(userId, `We have many ${channelName} channels. Here are some of them.`);   
    }
    
    channel.sendMessage(userId, printChannels(channels));  
}
function printChannels(channels) {
    let channelList = "";
    for (let i = 0; i < channels.length &&  i < 10; i++ ) {
        channelList += `${channels[i].name} - ${channels[i].mappedChannel}\n`;
    }
    return channelList;
} 

module.exports = {
    sendAnswer: sendAnswer
};
