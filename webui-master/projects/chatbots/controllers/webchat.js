/**
 * Modified: Jan 2018
 * @author Suryanarayana Mangipudi
 */
"use strict";

const Users = require('../models/users');
const serviceApi = require('../apis/app-api');
const venueService = require('../services/venue-service');
const moment = require('moment');

class WebChannel {
  
  constructor(socket) {
    this.socket = socket;
  }

  getName () {
    return "web";
  }
  sendMessage(senderId, message) {
    this.socket.emit('message',{ status: 200, message: message });
  }
  
  sendVenueList (senderId, venues) {
    sendVenueListData(senderId, venues, this);
  } 
  sendTableList(senderId, tables) {
    sendTableListImpl(senderId, tables, this);
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
    this.sendMessage(senderId, messageData); 
  }

  sendReservationConfirmation(senderId, user, type) {
    sendReservationConfirmationImpl(senderId, user, type, this);
  } 
  
  login(userId, type, loginCallback) {
    
  } 
}

function sendReservationConfirmationImpl(senderId, user, type, sendApi) {
  var text ="Please verify the reservation information and say YES to confirm the information is correct or say NO if you want to change it.\n";
  text += "\nDate: " + formatToDisplayDate(user.state.get("reservationDate")) +
  "\nNumber of Guests: " + user.state.get("noOfGuests") + 
  "\nTable Name: " + user.state.get("selectedTable").name;
  sendApi.sendMessage(senderId, text);
}

function formatToDisplayDate(Y_M_D) {
  return moment(Y_M_D, "YYYY-MM-DD").format('MMMM Do YYYY');
}


function sendTableListImpl(senderId, tables, sendApi) {
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
function sendVenueListData (senderId, venues, sendApi) {
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


function selectTable(userId, tableId, sendApi) {
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
  ctx.set(/.*/, (userId, guestCount) => selectNoOfGuests(userId, guestCount, sendApi));
  sendApi.sendMessage(userId, "Enter No of Guests");
}


function selectNoOfGuests(userId, guestCount, sendApi) {
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


function confirmEmailAddress(userId, YESNO, email, sendApi) {
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

const handleReceiveMessage = (body, socket) => {
  const senderId = socket.handshake.session.id;
  let user = Users.getUser(senderId);
  if (!user.hasParameter("selectedVenueId")) {
    venueService.initializeSender(senderId, body.venueId, new WebChannel(socket), function() {
      venueService.processMessage(senderId, body.message,new WebChannel(socket));
    });
  } else {
    venueService.processMessage(senderId, body.message,new WebChannel(socket));
  }
};

const handleInitMessage = (body, socket) => {
  const senderId = socket.handshake.session.id;
  venueService.initializeSender(senderId, body.venueId, new WebChannel(socket));

};

module.exports = {
  handleReceiveMessage: handleReceiveMessage,
  handleInitMessage: handleInitMessage
};