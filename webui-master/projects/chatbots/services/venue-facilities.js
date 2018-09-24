"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const pluralize = require('pluralize');
const aiUtil = require('../lib/aiutils');


const ANSWERS = [];
const ANSWERS_DEFAULT = { text: "VALUE", api_name: "service-time", value: "facility" };

ANSWERS["Q_CHECKOUT_TIME"] = {
  text: "Checkout time for VENUE_NAME is VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Hotel", value: "startTime"};
ANSWERS["Q_CHECKIN_TIME"] = {
  text: "Checkin time for VENUE_NAME is VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Hotel", value: "endTime"};
ANSWERS["Q_LASTCALL_TIME"] = {
  text: "Lastcall time for VENUE_NAME is VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Venue", value: "lastCallTime"};
ANSWERS["Q_RESTAURANT_OPEN"] = {
  text: "VENUE_NAME opens at VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Restaurtant", value: "startTime"};
ANSWERS["Q_RESTAURANT_CLOSE"] = {
  text: "VENUE_NAME closes at VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Restaurtant", value: "endTime"};
ANSWERS["Q_OPEN_TIME"] = {
  text: "VENUE_NAME opens at VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Venue", value: "startTime"};
ANSWERS["Q_CLOSE_TIME"] = {
  text: "VENUE_NAME closes at VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Venue", value: "endTime"};
ANSWERS["Q_FACILITY_OPEN_CLOSE_TIME"] = {
    text: "VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Venue", value: ""};
ANSWERS["Q_OPEN_CLOSE_TIME"] = {
      text: "VALUE", parameters: ["VENUE_NAME", "VALUE"], api_name: "service-time", type: "Venue", value: ""};
 

const FACILITY_TYPE = ['Q_FACILITY', 'Q_FREE_FACILITY'];

const sendAnswer = function(type, userId, response, channel) {
  const user = Users.getUser(userId);
  const venue = user.state.get("venue");
  let venueName = venue.venueName;
  const info = venue.info;
  // one off
  if (aiUtil.hasParam(response,'DressCode')) {
    if (info['Advance.dressCode'] && info['Advance.dressCode'].length > 0) {
      channel.sendMessage(userId, `Dress code: ${info['Advance.dressCode'] }` );
    } else {
      channel.sendMessage(userId, `We don't have a dress code at our venue.` );
    }
    return;
  }
  var answer = ANSWERS_DEFAULT;
  if (!!ANSWERS[type]) {
    answer = Object.assign({}, ANSWERS[type]); 
  } 
  if (aiUtil.hasParam(response,'facilities',"guest")) {
    if (venue.info['Advance.GuestList.enable'] && venue.info['Advance.GuestList.enable'].toLowerCase() === 'y' ) {
      let guestListUrl = serviceApi.getGuestListUrl(venue.uniqueName, venue.id, venue.city);
      channel.sendMessage(userId, `YES! we do have Guest List. You can access our guest list at ${guestListUrl}`);
    } else {
      channel.sendMessage(userId, `No, we don't have Guest List.`);
    }
    return;
  }
  
  if (user.hasParameter(answer.api_name)) {
    sendAnswerImpl(type, user, answer, response, channel);
  } else {
    fetchDataAndSendReply(type, user, answer, response, channel);
  }
};


function sendAnswerImpl(type, user, answer, response, channel) {
  if (FACILITY_TYPE.indexOf(type) >= 0 ) {
    sendAnswerFacilityImpl(type, user, response, channel);
  } else {
    sendAnswerFacilityTimes(type, user, answer, response, channel);
  }
}


function sendAnswerFacilityTimes(type, user, answer, response, channel) {

  const venue = user.state.get("venue");
  let venueName = venue.venueName;  

  let data = user.state.get(answer.api_name);
  let venueTimes = null;
  let timeType = response.parameters.openClosingTimes;
  
  let openText = response.parameters.openText;
  if (aiUtil.hasParam(response, 'actions', 'checkin')) {
    answer = ANSWERS["Q_CHECKIN_TIME"];
  } else if (aiUtil.hasParam(response, 'actions', 'checkout')) {
    answer = ANSWERS["Q_CHECKOUT_TIME"];
  }
  if (type === 'Q_FACILITY_OPEN_CLOSE_TIME' && response.parameters && response.parameters.openClosingTimes) {
    
    if (aiUtil.equalsIgnoreCase(timeType,'Open')) {
      answer.value = 'startTime';
    } else if ( aiUtil.equalsIgnoreCase(timeType,'Close')) {
      answer.value = 'endTime';
    } else if (aiUtil.equalsIgnoreCase(timeType,'Lastcall')) {
      answer.value = 'lastCallTime';
    } else if (aiUtil.equalsIgnoreCase(timeType, 'Checkin time')) {
      answer = ANSWERS["Q_CHECKIN_TIME"];
    } else if (aiUtil.equalsIgnoreCase(timeType, 'Checkout time')) {
      answer = ANSWERS["Q_CHECKOUT_TIME"];
    }

    if (aiUtil.hasParam(response, 'actions', 'checkin')) {
      answer = ANSWERS["Q_CHECKIN_TIME"];
    } else if (aiUtil.hasParam(response, 'actions', 'checkout')) {
      answer = ANSWERS["Q_CHECKOUT_TIME"];
    }
   
  }

  if (!aiUtil.hasParam(response, 'facilityOriginal') && aiUtil.hasParam(response, 'meal')) {
    response.parameters.facilityOriginal = response.parameters.meal;
    response.parameters.facilities = response.parameters.meal;
  }
  if (response.parameters.facilityOriginal) {
    answer.type = response.parameters.facilityOriginal;
    answer.type = answer.type.replace("?", "");
    answer.type = pluralize.singular(answer.type);
  }
  let dateObj = {hasDateTime : false, hasDate: false};
  if (aiUtil.hasParam(response, 'date-time')) {
    dateObj.hasDateTime = true;
    dateObj.dateTime = response.parameters['date-time'];
  }
  
  if (aiUtil.hasParam(response, 'date')) {
    dateObj.hasDate = true;
    dateObj.dateTime = response.parameters['date'];
  }

  let success = findAndReply(answer, openText, data, channel, user, venueName, false, dateObj);
  if (success) {
    return;
  }
  answer.type = response.parameters.facilities;
  success = findAndReply(answer, openText, data, channel, user, venueName, true, dateObj);
  
  if (success) {
    return;
  }
  
  for (let j = 0; j < data.length; j++) {
    if (data[j].type.toLowerCase() === 'venue') {
      venueTimes = data[j];
    }
  }

  if (!!venueTimes) {
    let openTime = aiUtil.formatTime(venueTimes.startTime);
    let closeTime = aiUtil.formatTime(venueTimes.endTime);
    let reply = `Hmm, not sure what you asked. We open at ${openTime} and close at ${closeTime}.` ;
    if (openTime === closeTime) {
      reply = "Hmm, not sure what you asked. We are open 24 hours!";
    }
    
    channel.sendMessage(user.id, reply);
    return;
  }
  channel.sendMessage(user.id, `Sorry, we don't have a ${response.parameters.facilityOriginal || response.parameters.facilities}.`);

}

function findAndReply(answer, openText, data, channel, user, venueName, generic, dateTime) {
  if (answer.type && answer.type.toLowerCase() === 'kitchen' ) {
    answer.type = 'Restaurant';
  }
  if (!answer.type) {
    answer.type = "";
  }
  if (!openText) {
    openText ="";
  }
  for (var j = 0; j < data.length; j++) {
    
    if ((data[j].type.toLowerCase() === answer.type.toLowerCase() && !generic) || (data[j].type.toLowerCase().indexOf(answer.type.toLowerCase())> -1 && generic)) {
      var startTime = aiUtil.formatTime(data[j]['startTime']);
      var endTime = aiUtil.formatTime(data[j]['endTime']);
      if (answer.value && answer.value !== ''){
        if (answer.value === 'startTime' && (openText.toLowerCase().indexOf("24") >= 0 || dateTime.hasDate || dateTime.hasDateTime)) {
          if (startTime === endTime) {
            if (dateTime.hasDate || dateTime.hasDateTime) {
              channel.sendMessage(user.id, `YES, ${answer.type} is Open.` );
            } else {
              channel.sendMessage(user.id, `we are open 24 hours.` );
            }
          } else {
            if (dateTime.hasDate || dateTime.hasDateTime) {
              // ignore date for now
              let open = aiUtil.isBetween(dateTime.dateTime, startTime, endTime);
              if (open) {
                channel.sendMessage(user.id, `YES, ${answer.type} is open.` );
              } else {
                channel.sendMessage(user.id, `NO, ${answer.type} is not open.` );
              }
              
            } else {
              channel.sendMessage(user.id, `We are open from: ${startTime}, till: ${endTime}.` );
            } 
          }
        } else {
          if (startTime === endTime) {
            channel.sendMessage(user.id, `we are open 24 hours.` );
          } else {
            channel.sendMessage(user.id, formatText(answer, venueName, aiUtil.formatTime(data[j][answer.value])));
          }
          return true;
        }
      } else {
        
        if (startTime === endTime) {
          channel.sendMessage(user.id, `we are open 24 hours.` );
        } else {
          channel.sendMessage(user.id, `Opening time: ${startTime}, Closing time: ${endTime}.` );
        }
      }
      return true;
    }
  }
  return false;
}


function sendAnswerFacilityImpl(type, user, response, channel) {
  let facilityType = "";
  if (aiUtil.hasParam(response, 'facilityOriginal')) {
    facilityType = response.parameters.facilityOriginal;
    facilityType = facilityType.replace("?", "");
    facilityType = facilityType.replace("-", " ");
    facilityType = pluralize.singular(facilityType);
  } else if (aiUtil.hasParam(response, 'room-amenities')){
    facilityType = response.parameters['room-amenities'];
  } else {
    channel.sendMessage(user.id, "Sorry, I don't have information about this. " );
    return;
  }
  
  let facilityTypeOriginal = facilityType;

  let data = user.state.get('facilityInfo');

  let dataObj = aiUtil.getFacilityObjectFromResponse(facilityType, data, response);
  let checkIfFree = type === 'Q_FREE_FACILITY';
  if (type === 'Q_FACILITY' || type === 'Q_FREE_FACILITY') {
    if (dataObj && dataObj.type === "TEXT") { 

      if ( dataObj && dataObj.text && dataObj.text  !== "") {
        let preText = "";
        if (checkIfFree) {
          if ( aiUtil.isNotEmpty(dataObj.costText)) {
            channel.sendMessage(user.id, dataObj.costText);
            return;
          }
          if (dataObj.text.search(/free/i) > -1 || dataObj.text.search(/complimentary/i) > -1 || dataObj.text.search(/complementary/i) > -1) {
            preText = "Yes, It is Free. ";
          } else if (dataObj.free === 'N') {
            preText = "No, It is not free. ";
          }
        } 
        channel.sendMessage(user.id, preText + dataObj.text );
          
      } else if (dataObj && dataObj.present === 'Y') {
        if (checkIfFree) {
          if ( aiUtil.isNotEmpty(dataObj.costText)) {
            channel.sendMessage(user.id, dataObj.costTest);
            return;
          }  else {
            channel.sendMessage(user.id, "No, It is not free."); 
          }
          
        } else {
          channel.sendMessage(user.id, "Yes, We do."); 
        }
      } else if (dataObj){
        channel.sendMessage(user.id, "Sorry, we don't have this facility." ); 
      } else {
        channel.sendMessage(user.id, "Sorry, I don't have information about this. " );
      }
      return;
    
    } else if (dataObj) { // if not test this is SERVICE_TIME TYPE
      
      if (user.hasParameter('service-time')) {
        sendReplyForServiceTimeTypeFacility(type, user, channel, dataObj, facilityTypeOriginal);
        return;
      } else {
        const venue = user.state.get("venue");
        serviceApi.getServiceTimes(venue.id, result => {
          user.state.set("service-time", result);
          sendReplyForServiceTimeTypeFacility(type, user, channel, dataObj, facilityTypeOriginal);
        });
        return;
      }
    }
  }
  channel.sendMessage(user.id, "Sorry, we don't have this facility." ); 
  return;
}

function sendReplyForServiceTimeTypeFacility(type, user, channel, dataObj, facilityTypeOriginal) {
  let serviceTimes = user.state.get('service-time');
  let names = [];
  let locations = [];
  let hasFacility = false;
  let facilityText = "";
  for (let i = 0; i < serviceTimes.length; i++) {
    if (serviceTimes[i].type.toLowerCase() === dataObj.commonName.toLowerCase()) {
    
      if (serviceTimes[i].valueText && serviceTimes[i].valueText.length > 0) {
        channel.sendMessage(user.id, serviceTimes[i].valueText);
      } else {
        channel.sendMessage(user.id, `We have ${facilityTypeOriginal} on the ` + serviceTimes[i].location );
      }
      return;
    } else if (serviceTimes[i].type.toLowerCase().indexOf(dataObj.commonName.toLowerCase())> -1) {
      names.push(serviceTimes[i].type);
      locations.push(serviceTimes[i].location);
      facilityText = serviceTimes[i].valueText;
      hasFacility = true;
    }
  }
  if (hasFacility) {
    if (names.length > 1) {
      let namesStr = names.slice(0, -1).join(', ') +', and '+ names.slice(-1);
      channel.sendMessage(user.id, `We have the following kind of ${dataObj.commonName}s - ${namesStr}`);
    } else {
      let namesStr  = names[0];
      channel.sendMessage(user.id, namesStr);
    }
  } else {
    channel.sendMessage(user.id, `Sorry, We don't have this facility.`);
  }
}


function fetchDataAndSendReply(type, user, answer, response, channel) {
  var venueId = user.state.get("selectedVenueId");
  if (answer.api_name === "service-time") {
    serviceApi.getServiceTimes(venueId, result => {
      user.state.set("service-time", result);
      sendAnswer(type, user.id, response, channel);
    });
  } else if (answer.api_name === "facilityInfo") {
    serviceApi.getFacilityInfo(venueId, result => {
      user.state.set("facilityInfo", result);
      sendAnswer(type, user.id, response, channel);
    });
  } else {
    channel.sendMessage(user.id, "Sorry! I can't answer this question. Do you want me to connect to a live agent?");
  }
}

function formatText(answer, venueName, value) {
  var text = answer.text;
  var newString = text.replace(/VENUE_NAME/, venueName);
  return newString.replace(/VALUE/, value);
}

module.exports = {
  sendAnswer: sendAnswer
};