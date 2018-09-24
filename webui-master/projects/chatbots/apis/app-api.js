'use strict';
var config = require('../config');
const requestBase = require('request');
const PAGE_ACCESS_TOKEN = config.PAGE_ACCESS_TOKEN;

const request = config.enableProxy ?  requestBase.defaults(config.proxy) : requestBase;

const getDetailsFromFacebook = (userId, callback) => {
    request(
      {
        method: 'GET',
        url: `https://graph.facebook.com/v2.6/${userId}`,
        json: true,
        qs: {
          access_token: PAGE_ACCESS_TOKEN,
          // facebook requires the qs in the format
          // fields=a,b,c not fields=[a,b,c]
          fields: 'first_name,last_name,profile_pic,email,gender',
        },
      },
      callback
    );
  };

const searchVenue = function( name, search, typeCode, lat, lng, distance, count, callback){
    
    
    let parameters = {};
    parameters.dist = distance;
    parameters.count = count;
    
    if (name && name.trim().length > 0) {
        parameters.name = name;
    }

    if (search && search.trim().length > 0){
        parameters.search = search;
    }
    
    if (lat && lng) {
        parameters.lat = lat;
        parameters.lng = lng;
    }

    if (typeCode && typeCode > 0) {
        parameters.typeCode = typeCode;
    }
    
    let url = `${config.getAppUrl()}/venues/q`;
    let options = {
        url: url,
        qs: parameters
    };

    
    
    request.get(options, function (error, response, body) {
        retOBJ(body, response, function(result){
            if (result !== null) {
                callback(result.venues);
            } else {
                callback([]);
            }
        });
    });
};
const queryUsingGooglePlaces = function(queryText, lat, lng, callback) {
    let url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json`;
   
    let parameters = {};
    parameters.input = queryText;
    parameters.inputtype="textquery";
    parameters.fields = "name,geometry";
    parameters.locationbias= `circle:80000@${lat},${lng}`;
    parameters.key = config.getPlacesAPiKey();
    let options = {
        url: url,
        qs: parameters
    };

    
    
    request.get(options, function (error, response, body) {
        retOBJ(body, response, function(result){
            if (result !== null) {
                callback(result);
            } else {
                callback({ candidates:[]});
            }
        });
    });
};

const getDrivingDistance = function (lat1, lng1, lat2, lng2, callback) {
    let url = `http://maps.googleapis.com/maps/api/distancematrix/json`;
   
    let parameters = {};
 
    parameters.origins=`${lat1},${lng1}`;
    parameters.destinations = `${lat2},${lng2}`;
    parameters.mode= `driving`;
    parameters.sensor= `false`;
    //parameters.key = config.getPlacesAPiKey();
    let options = {
        url: url,
        qs: parameters
    };

    
    request.get(options, function (error, response, body) {
        retOBJ(body, response, function(result){
            if (result !== null && result.rows && result.rows.length > 0 && result.rows[0].elements.length > 0) {
                callback( result.rows[0].elements[0]);
            } else {
                callback({ candidates:[]});
            }
        });
    });
};

const searchVenueByName = function(venuename,address, callback) {
    return searchVenue(venuename, address, 0, 0,0, 50, 5, callback);
};

const searchVenueById = function(venueNumber, callback) {
    var url = `${config.getAppUrl()}/venues/${venueNumber}`;

    var options = {
        url: url
    };
    
    request.get(options, function (error, response, body) {
        retOBJ(body, response, function(result){
            if (result !== null) {
                callback(result);
            } else {
                callback(null);
            }
        });
    });
};


const getAvailableBottleReservations = function(venueId, YYYYMMDD, callback) {
    
    var options = {
        url: `${config.getAppUrl()}/venuemap/${venueId}/available/${YYYYMMDD}`
    };
    
    request.get(options, function (error, response, body) {
        retOBJ(body, response, callback);
    });
};

const fbLogin = function (fbPayload, callback) {
    var options = {
        url: `${config.getAppUrl()}/auth/fblogin`,
        method: 'POST',
        body: JSON.stringify(fbPayload),
        headers: {
            "Content-Type": "application/json",
        }
    };
    
    request.post(options, function (error, response, body) {
        retOBJ(body, response, callback);
    });
};
const getServiceTimes = function(venueId, callback) {

    var options = {
        method: 'GET',
        url: `${config.getAppUrl()}/venues/${venueId}/servicehours`,
    };

    request.get(options, function (error, response, body) {
        retOBJ(body, response, callback);
    });

};

const getBotAgents = function(callback) {
    var options = {
        method: 'GET',
        url: `${config.getAppUrl()}/bots`,
    };

    request.get(options, function (error, response, body) {
        retOBJ(body, response, callback);
    });
};

const getActiveTournaments = function(venueId, callback) {
    var options = {
        method: 'GET',
        url: `${config.getAppUrl()}/tournaments/${venueId}/active`,
    };

    request.get(options, function (error, response, body) {
        retOBJ(body, response, callback);
    });
};

const getTournamentsUrl = function(venueUniqueName, venueId) {
    if (!!venueUniqueName) {
        return  encodeURI(`${config.getWebUIUrl()}/games/${venueUniqueName}`);
    } else {
        return encodeURI(`${config.getWebUIUrl()}/games/${venueId}`);
    }
};

const getGamesUrl = function(venueUniqueName, venueId) {
    if (!!venueUniqueName) {
        return  encodeURI(`${config.getWebUIUrl()}/games/${venueUniqueName}`);
    } else {
        return encodeURI(`${config.getWebUIUrl()}/games/${venueId}`);
    }
};

const getGuestListUrl = function(venueUniqueName, venueId, city) {
     if (!!venueUniqueName) {
        return  encodeURI(`${config.getWebUIUrl()}/cities/${city}/${venueUniqueName}/guest-list`);
    } else {
        return encodeURI(`${config.getWebUIUrl()}/cities/${city}/${venueId}/guest-list`);
    }
};

const getDealsUrl = function(venueUniqueName, venueId, city) {
    if (!!venueUniqueName) {
       return  encodeURI(`${config.getWebUIUrl()}/cities/${city}/${venueUniqueName}/deals`);
   } else {
       return encodeURI(`${config.getWebUIUrl()}/cities/${city}/${venueId}/deals`);
   }
};
const getActiveGames = function(venueId, gameName, callback) {
    var url = `${config.getAppUrl()}/venues/${venueId}/games/active`;
    if (gameName !== null && gameName.trim() !== '') {
        url += `?name=${gameName}`;
    }
    var options = {
        method: 'GET',
        url: url
    };

    request.get(options, function (error, response, body) {
        retOBJ(body, response, callback);
    });
};
const getChannelLineupUrl = function(venueUniqueName) {
    return  encodeURI(`${config.getWebUIUrl()}/channel-lineup/${venueUniqueName}`);
};
const getGamesAvailableNow = function(venueId, callback) {
    var options = {
        method: 'GET',
        url: `${config.getAppUrl()}/venues/${venueId}/games/active?maxWaiting=5`,
    };

    request.get(options, function (error, response, body) {
        retOBJ(body, response, callback);
    });
};
const getDealInfo = function(venueId, parameters, callback) {
    var options = {
        method: 'GET',
        qs: parameters,
        url: `${config.getAppUrl()}/coupons/${venueId}/active/info`,
    };

    request.get(options, function (error, response, body) {
        retOBJ(body, response, callback);
    });
};
const searchGamesByName = function(venueId, gameName, callback) {

    var url = `${config.getAppUrl()}/venues/${venueId}/games`;
    if (gameName !== null && gameName.trim() !== '') {
        url += `?name=${gameName}`;
    }
    var options = {
        method: 'GET',
        url: url
    };

    request.get(options, function (error, response, body) {
        retOBJ(body, response, callback);
    });
};

const createOrder = function (firstName, lastName, venueId, tableNumber, orderDate, noOfGuests, email, accessToken, mobile, callback) {
    var venueNumber = parseInt(venueId);
    var headers = {
        "Content-Type": "application/json",
    };
    if (!!accessToken && accessToken !== "") {
        headers["X-XSRF-TOKEN"] = accessToken;
    } else {
        var fullName = firstName + " " + lastName;
        var s = fullName + ':' + email + ':' + mobile;
        var authBase64Str  = new Buffer(s).toString('base64');
        headers["Authorization"] = "Anonymous " + authBase64Str;
    }
    

    var options = {
      method: 'POST',
      url: `${config.getAppUrl()}/vas/${venueId}/orders`,
      body: JSON.stringify({
        "serviceType": "Bottle",
        "venueNumber": venueNumber,
        "noOfGuests": parseInt(noOfGuests),
        "serviceInstructions": "none",
        "fulfillmentDate": orderDate,
        "visitorName": `${firstName} ${lastName}`,
        "contactEmail": `${email}`,
        "contactNumber": `${mobile}`,
        "order": {
          "venueNumber": venueNumber,
          "orderDate": orderDate,
          "orderItems": [
            {
              "productId": parseInt(tableNumber),
              "productType": "VenueMap"
            }
          ]
        },
      }),
      headers: headers
    };
    request.post(options, function (error, response, body) {
        retOBJ(body, response, callback);
    });
};

function getFacilityInfo(venueId, callback) {
    var options = {
        method: 'GET',
        url: `${config.getAppUrl()}/venues/${venueId}/facilities`,
    };

    request.get(options, function (error, response, body) {
        retOBJ(body, response, callback);
    });
}

function getTVChannelInfo(venueId, genre, callback) {
    var options = {
        method: 'GET',
        url: `${config.getAppUrl()}/venues/${venueId}/channels`,
    };
    if (genre) {
        var qs = {genre: genre};
        options.qs = qs;
    }
    request.get(options, function (error, response, body) {
        retOBJ(body, response, callback);
    });
}
function setServiceRating(venueId, serviceId, serviceType, customerName, customerEmail, customerPhone, rating, callback) {
    var venueNumber = parseInt(venueId);
    var headers = {
        "Content-Type": "application/json",
    };
    
    headers["Authorization"] = "Bearer dCZU-Fs7coA:APA91bHrcgo1fipja2ncMF1SettKyANMxewopu1IyyqfWLo1PDECdX7V3lWwf";
   
    var options = {
      method: 'POST',
      url: `${config.getAppUrl()}/venues/${venueId}/rate/${serviceId}`,
      body: JSON.stringify({
        rating: rating,
        comment: "",
        serviceType: serviceType,
        visitorId : -1,
        contactNumber: customerPhone,
        contactName: customerName,
        contactEmail: customerEmail
      }),
      headers: headers
    };

    request.post(options, function (error, response, body) {
        retOBJ(body, response, callback);
    });
}
function retOBJ(body, response, callback) {
    if (body) {
        var result = JSON.parse(body);
        if (result && response.statusCode >=200 && response.statusCode < 300) {
          callback(result);
        } else {
            console.error(body);
            callback({});
        }
    }
}


module.exports= {
    searchVenue: searchVenue,
    searchVenueByName : searchVenueByName,
    searchVenueById : searchVenueById,
    getAvailableBottleReservations: getAvailableBottleReservations,
    getUserFBDetails: getDetailsFromFacebook,
    fbLogin : fbLogin,
    createOrder: createOrder,
    getServiceTimes: getServiceTimes,
    getBotAgents:getBotAgents,
    getGamesAvailableNow: getGamesAvailableNow,
    getActiveTournaments: getActiveTournaments,
    getActiveGames: getActiveGames,
    searchGamesByName: searchGamesByName,
    getGamesUrl: getGamesUrl,
    getTournamentsUrl : getTournamentsUrl,
    getGuestListUrl: getGuestListUrl,
    getDealInfo : getDealInfo,
    getDealsUrl : getDealsUrl,
    getFacilityInfo : getFacilityInfo,
    setServiceRating: setServiceRating,
    getTVChannelInfo : getTVChannelInfo,
    getChannelLineupUrl: getChannelLineupUrl,
    queryUsingGooglePlaces: queryUsingGooglePlaces,
    getDrivingDistance: getDrivingDistance
};