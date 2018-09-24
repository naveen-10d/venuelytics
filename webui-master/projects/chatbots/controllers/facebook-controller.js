/**
 * Modified: Jan 2018
 * @author Suryanarayana Mangipudi
 */
"use strict";

const sendApi = require('../apis/send');
const Users = require('../models/users');
const serviceApi = require('../apis/app-api');
const venueService = require('../services/venue-service');
const moment = require('moment');

/*
 * handleReceivePostback — Postback event handler triggered by a postback
 * action you, the developer, specify on a button in a template. Read more at:
 * developers.facebook.com/docs/messenger-platform/webhook-reference/postback
 */

const handleReceivePostback = (event) => {
  const type = event.postback.payload;
  const senderId = event.sender.id;
  venueService.processMessage(senderId, type, new FBChannel("0"));
};

class FBChannel {
  
  constructor(channelId) {
    this.channelId = channelId;
  }

  getName () {
    return "facebook";
  }
  sendMessage(senderId, message) {
    sendApi.sendMessage(senderId, message);
  }
  
  sendVenueList (senderId, venues) {
    sendVenueListData(senderId, venues);
  } 
  sendTableList(senderId, tables) {
    sendTableListImpl(senderId, tables);
  } 
  
  sendGenericViewList(senderId, basicList, infoUrl) {
    var list = [];
    for (var i = 0; i < basicList.length; i++) {
    
      var object = {
        "title": basicList[i].text,
        "subtitle": basicList[i].subText,
        "buttons": [
          {
            "type": "web_url",
            "title": "View Website",
            "url": infoUrl
          }
        ]
      };
      list.push(object);

    }
  
    var messageData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": list.slice(0, 9),
        }
      }
    };
    sendApi.sendMessage(senderId, messageData); 
  }

  sendReservationConfirmation(senderId, user, type) {
    sendReservationConfirmationImpl(senderId, user, type);
  } 
  
  login(userId, type, loginCallback) {
    fbLogin(userId, type, loginCallback, this);
  } 
}

function sendReservationConfirmationImpl(senderId, user, type) {
  var text ="Please verify the reservation information and say YES to confirm the information is correct or say NO if you want to change it.\n";
  text += "\nDate: " + formatToDisplayDate(user.state.get("reservationDate")) +
  "\nNumber of Guests: " + user.state.get("noOfGuests") + 
  "\nTable Name: " + user.state.get("selectedTable").name;
  sendApi.sendMessage(senderId, text);
}

function formatToDisplayDate(Y_M_D) {
  return moment(Y_M_D, "YYYY-MM-DD").format('MMMM Do YYYY');
}


function sendTableListImpl(senderId, tables) {
  var reservationTables = [];
  for (var i = 0; i < tables.length; i++) {
    var title = tables[i].name;
    if (tables[i].price > 0) {
      title = `${title} - $${tables[i].price}`;
    }

    var object = {
      "title": title,
      "subtitle": `Can sit max of ${tables[i].servingSize} guests`,
      "image_url": tables[i].imageUrls[0].smallUrl,
      "buttons": [
        {
          "type": "postback",
          "title": "Reserve Table",
          "payload": tables[i].searchIndex
        }
      ]
    };
    reservationTables.push(object);

  }
  
  var messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "list",
        "elements": reservationTables.slice(0, 4),
      }
    }
  };
  sendApi.sendMessage(senderId, messageData);
}
function sendVenueListData (senderId, venues) {
  var listOfVenues = [];
  for (var i = 0; i < venues.length && i < 10; i++) {
    var object = {
      "title": venues[i].venueName,
      "subtitle": venues[i].address,
      "image_url": venues[i].imageUrls[0].smallUrl,
      "buttons": [
        {
          "type": "postback",
          "title": "Select Venue",
          "payload": venues[i].searchIndex,
        }
      ]
    };

    listOfVenues.push(object);
  }
  
  let messageData = null;
  if (listOfVenues.length > 1) {
    messageData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "list",
          "top_element_style": "compact",
          "elements": listOfVenues.slice(0, 9),
        }
      }
    };
  } else {
    messageData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": listOfVenues,
        }
      }
    };
  }
  sendApi.sendMessage(senderId, messageData);
}


function selectTable(userId, tableId) {
  let user = Users.getUser(userId);
  user.state.set("tableSelected", tableId);

  var selectionTemplate = user.state.get("selectionTemplate");
  var selectedTemplate = user.state.get("tableTemplateObjects")[tableId];
  selectedTemplate.buttons[0].payload = "changeTable";
  selectedTemplate.buttons[0].title = "Change Table";
  selectedTemplate.buttons.push({
      "type": "postback",
      "title": "Confirm Reservation",
      "payload": 'confirmReservation',
  });
  selectionTemplate.push(selectedTemplate);
  user.state.set("selectionTemplate", selectionTemplate);

  let ctx = user.getOrCreateContext();
  ctx.set(/.*/, (userId, guestCount) => selectNoOfGuests(userId, guestCount));
  sendApi.sendMessage(userId, "Enter No of Guests");
}


function selectNoOfGuests(userId, guestCount) {
  let user = Users.getUser(userId);
  user.state.set("noOfGuests", guestCount);

  var object = {
    "title": `Total Guests: ${guestCount}`,
    "subtitle": "Number of guests",
    "buttons": [
      {
        "type": "postback",
        "title": "Change Guest Count",
        "payload": 'changeGuest',
      },
      {
        "type": "postback",
        "title": "Confirm Reservation",
        "payload": 'confirmReservation',
      }
    ]
  };
  var selectionTemplate = user.state.get("selectionTemplate");
  selectionTemplate.push(object);
  let ctx = user.getOrCreateContext();
  //ctx.set(/.*/, (userId, email) => emailAddress(userId, email));
  sendApi.sendMessage(userId, "What is your mail address, we need it to track and manage your orders");

}


function confirmEmailAddress(userId, YESNO, email) {
  let user = Users.getUser(userId);
  let ctx = user.getOrCreateContext();
  if (YESNO.toLowerCase() === 'yes') {
    let user = Users.getUser(userId);
    user.state.set("contactEmail", email);
    sendApi.sendMessage(userId, "Please Verify and Confirm your Reservation");
    var selectionTemplate = user.state.get("selectionTemplate");
    var messageData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": selectionTemplate
        }
      }
    };
    sendApi.sendMessage(userId, messageData);
  } else {
    //ctx.set(/.*/, (userId, email) => emailAddress(userId, email));
    sendApi.sendMessage(userId, "What is your mail address, we need it to track and manage your orders");
  }
}

function fbLogin(userId, type, loginCallback, channel) {
  let user = Users.getUser(userId);
  serviceApi.getUserFBDetails(userId, (err, { statusCode }, body) => {
    if (err || statusCode !== 200) {
      sendApi.sendMessage(userId, "Unable to get your account details to create reservation under your name.");
      loginCallback(userId, type, null, channel);
      return;
    }
    user.state.set("firstName", body.first_name);
    user.state.set("lastName", body.last_name);
    serviceApi.fbLogin(body, (result) => {
      loginCallback(userId, type, result.sessionId, channel);
    });
  });
}

/*
 * handleReceiveMessage - Message Event called when a message is sent to
 * your page. The 'message' object format can vary depending on the kind
 * of message that was received. Read more at: https://developers.facebook.com/
 * docs/messenger-platform/webhook-reference/message-received
 */
const handleReceiveMessage = (event) => {
  const message = event.message;
  const senderId = event.sender.id;

  // It's good practice to send the user a read receipt so they know
  // the bot has seen the message. This can prevent a user
  // spamming the bot if the requests take some time to return.
  sendApi.sendReadReceipt(senderId);
  //botContext.getOrCreate(senderId);
  venueService.processMessage(senderId, message.text, new FBChannel("0"));
};


module.exports = {
  handleReceivePostback: handleReceivePostback,
  handleReceiveMessage: handleReceiveMessage,
};