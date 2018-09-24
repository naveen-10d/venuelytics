"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');


const sendAnswer = function(userId, response, channel) {
    
  
  let user = Users.getUser(userId);
  let venue = user.state.get("venue");
  
  let data = venue.info;
  if (!(venue.info['Advance.Deals.enable'] && venue.info['Advance.Deals.enable'].toLowerCase() === 'y') ) {
    channel.sendMessage(user.id, "Sorry, We are not running any specials or deals at this time."); 
    return;
  } 

  if (!aiUtil.hasParam(response, 'dealsNSpecials')){
    channel.sendMessage(userId, "Can you please repeat the question?");
    return;  
  }


  let queryParameters = {};
  if (response && response.parameters) {
    queryParameters = Object.assign({}, response.parameters);
    delete queryParameters['enquire'];
  }

  let dealsUrl = serviceApi.getDealsUrl(venue.uniqueName, venue.id, venue.city);

  serviceApi.getDealInfo(venue.id, queryParameters , function(data) {
    //"parameters":{"dealsNSpecials":"","date-period":"2018-07-08/2018-07-14","Venue":"","Enquire":"","date":"","EventType":"","dealsOriginalValue":""}}
    //"parameters":{"dealsNSpecials":"deals","date-period":"","Enquire":"","date":"2018-07-12","EventType":"","dealsOriginalValue":"deals"}

    if (data.totalCount === 0) {
      channel.sendMessage(user.id, "Sorry, We are not running any specials or deals at this time.");  
      return;
    }
    
    if (aiUtil.hasParam(response, 'dealType')) {
      channel.sendMessage(user.id, `Yes, We do have ${response.parameters.dealType} deals/specials.\n 
      You can check all our deals and specials at ${dealsUrl}`);
      return; 
    } 
    
    channel.sendMessage(userId, `All our deals and specials are available at  ${dealsUrl}`);
    return;

  }, function (error) {
    channel.sendMessage(userId, `I am unable to get the information you are looking for. All our deals and specials are available at  ${dealsUrl}`);
    return;
  });
    
};


module.exports = {
  sendAnswer: sendAnswer
};