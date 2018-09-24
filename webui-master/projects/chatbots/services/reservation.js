"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require("../lib/aiutils");

const curry = require("lodash/curry");
const venueService = require("./venue-service");
const SERVICE_NAMES = ["Bottle", "PrivateParty", "GuestList", "Table"];

const SERVICE_TYPE_SPEC = [];
SERVICE_TYPE_SPEC["Bottle"] = ["venue", "noOfGuests", "reservationDate", "tableNumber", "email"];
SERVICE_TYPE_SPEC["PrivateParty"] = ["venue", "noOfGuests", "reservationDate", "hallName", "email"];
SERVICE_TYPE_SPEC["GuestList"] =  ["venue", "noOfGuests", "reservationDate", "males", "females","email"];
SERVICE_TYPE_SPEC["Table"] = ["venue", "noOfGuests", "reservationDate", "tableNumber", "email"];

const QUESTIONS = [];
QUESTIONS["noOfGuests"] = fxNumberOfGuests;
QUESTIONS["reservationDate"] = fxReservationDate;
QUESTIONS["tableNumber"] = fxTableNumber;
QUESTIONS["email"] = fxGetEmail;
QUESTIONS["Q_RESERVATION"] = fxReservation;

  
const reservationService = function(userId, response, channel) {
    let user = Users.getUser(userId);
    if (response && response.parameters) {
        if (aiUtil.isNotEmpty(response.parameters.serviceType)) {
            user.state.set("serviceType", response.parameters.serviceType);
        }

        if (aiUtil.isNotEmpty(response.parameters.reservationDate)) {
            user.state.set("reservationDate", response.parameters.reservationDate);
        }

        if (aiUtil.isNotEmpty(response.parameters.noOfGuests)) {
            user.state.set("noOfGuests", response.parameters.noOfGuests);
        }
    }


    if (!user.hasParameter("serviceType")) {
        channel.sendMessage(userId, "What kind of reservation you want to make? (Bottle, Table, GuestList)");
        user.setConversationContext("Q_RESERVATION", false, getServiceType);
        return;
    }

    const serviceType = user.state.get("serviceType");
    const requiredParameters = SERVICE_TYPE_SPEC[serviceType];

    for (var i = 0; i < requiredParameters.length; i++) {
        var parameter = requiredParameters[i];
        if (!user.hasParameter(parameter)) {
        QUESTIONS[parameter]("Q_RESERVATION", userId, response, channel);
        return;
        }
    }
};

function fxNumberOfGuests(type, userId, response, channel) {
  let user = Users.getUser(userId);
  channel.sendMessage(userId, "For how many guests you want to reserve tables?");
  user.setConversationContext(type, false, fxNumberOfGuestsResponse);
}

function fxNumberOfGuestsResponse(channel, userId, noOfGuests, type, response) {
  var guests = parseInt(noOfGuests);
  const user = Users.getUser(userId);
  if (isNaN(guests)) {
    channel.sendMessage(userId, "Please enter a number like 2 or say 2 guests.");
    user.setConversationContext(type, false, fxNumberOfGuestsResponse);
    return;
  }
  
  user.state.set("noOfGuests", guests);
  QUESTIONS[type](userId, response, channel);
}

function fxReservation(userId, response, channel) {
  let user = Users.getUser(userId);

  if (response && response.parameters && aiUtil.isNotEmpty(response.parameters.venue)) {
    if (user.hasParameter("venue") && user.state.get("venue").venueName !== response.parameters.venue) {
      user.state.delete("venue");
      user.state.delete("selectedVenueId");
      user.state.delete("venueImageUrl");
    }
  }

  if (!user.hasParameter("venue")) {
    venueService.getVenueName("Q_RESERVATION", user, channel, null);
    return;
  }
  reservationService(userId, response, channel);
}


function fxReservationDate(type, userId, response, channel) {
  const user = Users.getUser(userId);
  channel.sendMessage(userId, "For which date you want to reserve?");
  user.setConversationContext(type, false, fxReservationDateResponse);
}

function fxReservationDateResponse(channel, userId, reservationDate, type, response) {
  venueService.aiServiceQuery("reservationDate", reservationDate, function(response) {
      resolvedReservationDate(type, channel, userId, response);
    },
    function(error) {
      failedResolvingReservationDate(type, channel, userId, response);
    }
  );
}

function resolvedReservationDate(type, channel, userId, response) {
  const reservationDate = response.parameters.reservationDate;
  const user = Users.getUser(userId);
  if (aiUtil.isNotEmpty(reservationDate)) {
    user.state.set("reservationDate", reservationDate);
    QUESTIONS[type](userId, response, channel);
    return;
  }
  failedResolvingReservationDate(type, channel, userId, response);
}

function failedResolvingReservationDate(type, channel, userId, response) {
  const user = Users.getUser(userId);
  channel.sendMessage(userId, "Opps, Didn't understand your date! Please enter again, you can enter like jan 29");
  user.setConversationContext( type, false, fxReservationDateResponse);
}

function fxTableNumber(type, userId, response, channel) {
  const user = Users.getUser(userId);
  const venueId = user.state.get("selectedVenueId");
  const formattedDate = getYYYMMDDDate(user.state.get("reservationDate"));
  serviceApi.getAvailableBottleReservations(venueId, formattedDate, function(venueMap) {
    if (typeof venueMap === "undefined") {
      channel.sendMessage(userId, "Reservation not available for this date. Try another date (MM/DD/YY) format");
      return;
    }
    var bottleTables = [];
    var noOfguests = user.state.get("noOfGuests");
    for (var i = 0; i < venueMap.elements.length; i++) {
      var table = venueMap.elements[i];
      table.searchIndex = i + 1;
      if (noOfguests === table.servingSize) {
        bottleTables.push(table);
      }
    }
    if (venueMap.elements.length > 0 && bottleTables.length === 0) {
      for (var j = 0; j < venueMap.elements.length; j++) {
        var table1 = venueMap.elements[j];
        if (table1.servingSize <= noOfguests + 2) {
          bottleTables.push(table1);
        }
      }
    }
    if (bottleTables.length === 0) {
      channel.sendMessage( userId,  "I am sorry, there are no tables available on that day.");
      return;
    } else {
      user.state.set("bottleTables", bottleTables);
      channel.sendTableList(userId, bottleTables);
      user.setConversationContext(type, true, fxSelectTableResponse);
    }
  });
}

function fxSelectTableResponse(channel, userId, tableIndex, type, response) {
  const user = Users.getUser(userId);
  tableIndex = parseInt(tableIndex);
  if (isNaN(tableIndex)) {
    channel.sendMessage(userId, "Not a valid selection. Plese select again.");
    user.setConversationContext(type, true, fxSelectTableResponse );
    return;
  }
  var bottleTables = user.state.get("bottleTables");
  for (var i = 0; i < bottleTables.length; i++) {
    if (bottleTables[i].searchIndex === tableIndex) {
      user.state.set("selectedTable", bottleTables[i]);
      break;
    }
  }
  user.state.set("tableNumber", tableIndex);

  QUESTIONS[type](userId, response, channel);
}

function fxGetEmail(type, userId, response, channel) {
  const user = Users.getUser(userId);
  channel.sendMessage(userId, "Please enter your email address to confirm and manage your order status.");
  user.setConversationContext(type, true, fxGetEmailResponse);
}

function fxGetEmailResponse(channel, userId, email, type, response) {
  let user = Users.getUser(userId);
  if (!validateEmail(email)) {
    channel.sendMessage(userId, "You have entered invalid email address. Please enter a valid email.");
    user.setConversationContext(type, true, fxGetEmailResponse);
  } else {
    channel.sendMessage(userId,`You have entered your email as ${email}. Type YES to continue, NO to correct your email.` );
    user.state.set("email", email);
    user.setConversationContext(type, false, fxConfirmEmail);
  }
}

function fxConfirmEmail(channel, userId, yesno, type, response) {
  let user = Users.getUser(userId);
  if (response.action === "smalltalk.confirmation.yes") {
    channel.sendReservationConfirmation(userId, user, type);
    user.setConversationContext(type, false, fxConfirmReservationResponse);
  } else {
    fxGetEmail(type, userId, response, channel);
  }
}

function fxConfirmReservationResponse(channel, userId, email, type, response) {
  let user = Users.getUser(userId);
  if (response.action === "smalltalk.confirmation.yes") {
    channel.login(userId, type, loginSuccess); // try to see if
  } else {
    channel.sendMessage(userId, "OK, lets start again.");
    user.state.delete("reservationDate");
    user.state.delete("noOfGuests");
    user.state.delete("tableNumber");
    user.state.delete("email");
    user.state.delete("selectedTable");
    fxReservation(userId, null, channel);
  }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
  
function getServiceType(channel, userId, serviceType, type, response) {
    venueService.aiServiceQuery("serviceType", serviceType, function(response) {
        resolvedServiceType(type, channel, userId, response);
      },
      function(error) {
        failedResolvingServiceType(type, channel, userId, response);
      }
    );
}
  
const resolvedServiceType = function(type, channel, userId, response) {
    const user = Users.getUser(userId);
    const serviceType = response.parameters.serviceType;
  
    var index = SERVICE_NAMES.indexOf(serviceType);
    if (index === -1) {
      failedResolvingServiceType(type, channel, userId, response);
      return;
    } else {
      user.state.set("serviceType", serviceType);
      QUESTIONS[type](userId, response, channel);
    }
};
  
const failedResolvingServiceType = function(type, channel, userId, error) {
    const user = Users.getUser(userId);
    channel.sendMessage(userId, "Opps, try again? (Bottle, Table, GuestList)");
    user.setConversationContext(type, false, getServiceType);
};
function parseDate(str) {
    var m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
    return m ? new Date(2000 + m[3], m[2] - 1, m[1]) : null;
}
function toDate(YYYY_MM_DD) {
    var m = YYYY_MM_DD.split("-");
    return new Date(parseInt(m[0]), parseInt(m[1])-1 , parseInt(m[2]));
}
function getYYYMMDDDate(dashFormat) {
    return dashFormat.replace(new RegExp("-", "g"), "");
}


function loginSuccess(userId, type, loginToken, channel) {
    let user = Users.getUser(userId);
  
    if (loginToken === null) {
      console.log("Logging is not supported");
    } else {
      user.state.set("loginToken", loginToken);
    }
  
    if (!user.hasParameter("firstName")) {
      channel.sendMessage(userId,"Please enter guest name for this reservation.");
      user.setConversationContext(type, true, createOrder);
    } else {
      createOrder(channel, userId, null, null, null);
    }
}

function createOrder(channel, userId, name, type, response) {
    let user = Users.getUser(userId);
    if (name !== null) {
      var names = name.split(" ", 2);
      user.state.set("firstName", names[0]);
      if (names.length > 1) {
        user.state.set("lastName", names[1]);
      }
    }
    var venueId = user.state.get("selectedVenueId");
    var table = user.state.get("selectedTable");
    var noOfGuests = user.state.get("noOfGuests");
    var selectedDate = toDate(user.state.get("reservationDate"));
    var email = user.state.get("email");
    var loginToken = user.state.get("loginToken");
    var moblieNumber = user.state.get("mobileNumber");
    var venue = user.state.get("venue");
  
    serviceApi.createOrder(user.state.get("firstName"), user.state.get("lastName"),venueId, table.id, 
    selectedDate, noOfGuests, email, loginToken, userId, result => {
        if (typeof result.code !== "undefined") {
          channel.sendMessage(userId,`Unable to process your Bottle Service reservation request. ${result.message}`);
        } else {
          channel.sendMessage(userId,`Thank you for your Bottle Service request. ${venue.venueName} has received it. Here is your Bottle Service Request.\n\nOrder Number: ${result.order.orderNumber}.\n\nYou will be contacted by the venue to discuss the price details for the final confirmation.`);
          //restartTheFlow();
        }
      }
    );
}
  

  
module.exports = {
    reservationService: reservationService,
    fxReservation:fxReservation
};