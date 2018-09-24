/**
 * @author Saravanakumar K
 * @date MAR'24 2017
 */
"use strict";
app.service('AjaxService', ['$http', 'RestURL', '$log', '$window', function ($http, RestURL, $log, $window) {

    var wine2Home = 'https://wineagent.com/';
    var tokenBearer = 'Bearer 1201LPM1019ASA78DEFG479AFTR37034';

    this.getVenues = function (id, city, venueType, lat, long) {

        var url = RestURL.baseURL + '/venues?from=0&lat=' + lat + '&lng=' + long;

        if (city) {
            url = url + '&city=' + city;
        }
        if (id) {
            url = RestURL.baseURL + '/venues/' + id;
        }
        if (venueType) {
            url = url + '&type=' + venueType;
        }

        return $http({
            method: 'GET',
            url: url
        }).then(function (success) {
            return success.data;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getCity = function (cityName) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/venues/cities?name=' + cityName
        }).then(function (success) {
            return success.data.cities;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };


    this.gettingLocation = function (lat, long, country) {

        var url = null;
        if (lat && long) {
            url = RestURL.baseURL + '/venues/cities?lat=' + lat + '&lng=' + long;
        } else {
            url = RestURL.baseURL + '/venues/cities?size=50&country=' + country;
        }
        return $http({
            method: 'GET',
            url: url
        }).then(function (success) {
            return success.data.cities;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getVenuesByCity = function (lat, long, city) {
        var url = RestURL.baseURL + '/venues/cities?name=' + city + '&lat=' + lat + '&lng=' + long;
        return $http({
            method: 'GET',
            url: url
        }).then(function (success) {
            return success.data.cities;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getVenueBySearch = function (lat, long, venue) {
        var url = RestURL.baseURL + '/venues/q?lat=' + lat + '&lng=' + long + '&dist=20000&search=' + venue;
        return $http({
            method: 'GET',
            url: url
        }).then(function (success) {
            return success.data;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getVenuesByCountry = function (countryName, from) {

        var url = RestURL.baseURL + '/venues/cities?country=' + countryName + '&size=50';

        if (from !== 0) {
            url = url + '&from=' + from;
        }

        return $http({
            method: 'GET',
            url: url
        }).then(function (success) {
            return success.data.cities;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.searchBusiness = function (businessName, businessAddress) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/venues?name=' + businessName + '&search=' + businessAddress,
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getClaimBusiness = function (venueId) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/venues/' + venueId + '/claimBusiness'
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.claimBusiness = function (venueId, claimBusinessObject) {
        return $http({
            method: 'POST',
            url: RestURL.baseURL + '/venues/' + venueId + '/claimBusiness',
            data: claimBusinessObject
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.createGuestList = function (venueId, object, authBase64Str) {
        return $http({
            method: 'POST',
            url: RestURL.baseURL + 'venues/' + venueId + '/guests',
            data: object,
            headers: {
                "Authorization": "Anonymous " + authBase64Str
            }
        }).then(function (response) {
            return response;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getProductsByType = function (venueId, type) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + 'products/' + venueId + '/type/' + type
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.validationShippingAddress = function (shippingAddress) {
        return $http({
            method: 'POST',
            url: wine2Home + 'validateAddress.php',
            data: shippingAddress,
            headers: {
                Authorization: tokenBearer
            }
        }).then(function (response) {
            return response;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getWineToHome = function (venueName) {
        return $http({
            method: 'GET',
            url: wine2Home + 'inventory.php',
            params: {venueName: venueName},
            headers: {
                Authorization: tokenBearer
            }
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.placeServiceOrderWine2Home = function (orderData) {
        return $http({
            method: 'POST',
            url: wine2Home + 'order.php',
            data: orderData,
            headers: {
                Authorization: tokenBearer
            }
        }).then(function (response) {
            return response;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };
    this.validateOrder = function(venueId, payload) {
        return $http({
            method: 'POST',
            url: RestURL.baseURL + 'vas/' + venueId + '/orders/validate',
            data: payload
        }).then(function (response) {
            return response;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };
    this.placeServiceOrder = function (venueId, object, authBase64Str) {
        return $http({
            method: 'POST',
            url: RestURL.baseURL + 'vas/' + venueId + '/orders',
            data: object,
            headers: {
                "Authorization": "Anonymous " + authBase64Str
            }
        }).then(function (response) {
            return response;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getVenueMap = function (venueId, type) {
        var url = RestURL.baseURL + 'venuemap/' + venueId;
        if (!!type) {
            url += "?type=" + type;
        }
        return $http({
            method: 'GET',
            url: url
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getTime = function (venueId, date, time, guestCount) {

        if (guestCount === parseInt(guestCount, 10)) {
            guestCount = parseInt(guestCount, 10);
        } else {
            guestCount = 0;
        }
        return $http({
            method: 'GET',
            params: { time: time, type: 'Restaurant', capacity: guestCount },
            url: RestURL.baseURL + 'reservations/' + venueId + '/availableSlots/' + date
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getVenueMapForADate = function (venueId, date) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + 'reservations/' + venueId + '/date/' + date
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getTaxType = function (venueId, taxDate) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/vas/' + venueId + '/taxNfees/' + taxDate
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.createTransaction = function (venueId, orderId, object, authBase64Str) {
        return $http({
            method: 'POST',
            url: RestURL.baseURL + 'vas' + '/' + venueId + '/charge/' + orderId,
            data: object,
            headers: {
                "Authorization": "Anonymous " + authBase64Str
            }
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.cancelOrder = function (venueId, orderId, authBase64Str) {
        if (orderId && +orderId > 0) {
            return $http({
                method: 'DELETE',
                url: RestURL.baseURL + 'vas' + '/' + venueId + '/' + orderId,
                headers: {
                    "Authorization": "Anonymous " + authBase64Str
                }
            }).then(function (success) {
                return success;
            }, function (error) {
                $log.error('Error: ' + error);
                return error;
            });
        }
    }
    
    this.subscribe = function (object) {
        return $http({
            method: 'POST',
            url: RestURL.baseURL + 'venues/subscribeBusiness',
            data: object
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getTypeOfEvents = function (venueId, serviceType) {
       return this.getCategories(venueId, serviceType, 'EVENT');
    };

    this.getCategories = function (venueId, serviceType, type) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + 'vas/' + venueId + '/categories',
            params: {type: type, st:serviceType} 
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getInfo = function (venueId) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/venues/' + venueId + '/info'
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getEvents = function (venueId) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/venues/' + venueId + '/venueevents'
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getDeals = function (venueId) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/coupons/' + venueId + '/active'
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getServiceTime = function (venueId, serviceType) {
        var url = RestURL.baseURL + 'venues/' + venueId + '/servicehours?type=' + serviceType;
        return $http({
            method: 'GET',
            url: url
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getHosts = function (venueNumber) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + '/venues/' + venueNumber + '/hosts'
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.createBusinessUser = function (businessUser) {

        return $http({
            method: 'POST',
            url: RestURL.baseURL + 'users/business',
            data: businessUser
        });
    };

    this.completeBusinessClaim = function (venueId, verificationCode, emailHash) {
        var data = { vc: verificationCode, ce: emailHash };
        return $http({
            method: 'POST',
            url: RestURL.baseURL + 'venues/' + venueId + '/completeBusinessClaim',
            params: data,
            data: data
        });
    };

    this.sendBusinessPage = function (venueId) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + 'venues/' + venueId + '/sendBusinessPage'
        });
    };

    function randomString() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var stringLength = 16;
        var randomString = '';
        for (var i = 0; i < stringLength; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomString += chars.substring(rnum, rnum + 1);
        }

        return randomString;

    }

    this.recordUTM = function (payload) {
        return $http({
            method: 'POST',
            url: RestURL.baseURL + 'utmrequest',
            data: payload

        }).then(function (response) {
            return response;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.utmRequest = function (venueNumber, serviceType, utmSource, utmMedium, campaignName, rawreq) {
        var agent = '';
        if (typeof $window.navigator !== 'undefined') {
            agent = $window.navigator.userAgent;
        }
        if (typeof utmSource === 'undefined' || utmSource === '') {
            return;
        }
        var referenceId = null;
        if (typeof $window.localStorage !== 'undefined') {
            referenceId = $window.localStorage.getItem("utm:referenceId");
            if (referenceId === null || typeof referenceId === 'undefined') {
                referenceId = randomString();
                $window.localStorage.setItem("utm:referenceId", referenceId);
            }
        }
        var data = {
            type: serviceType, utmSource: utmSource, utmMedium: utmMedium || '',
            venueNumber: venueNumber, utmCampaign: campaignName || '', referenceId: referenceId,
            request: rawreq, agentInfo: agent
        };

        recordUTM(data);
    };

    this.getVenueServiceOpenDays = function (venueId, serviceType) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + 'venues/' + venueId + '/opendays/' + serviceType
        });
    };

    this.getGames = function (venueId) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + 'venues/' + venueId + '/games'
        });
    };

    this.getTournament = function (venueId) {
        return $http({
            method: 'GET',
            url: RestURL.baseURL + 'tournaments/' + venueId + '/active'
        });
    };

    this.sendContactMeMessage = function (name, email, subject, message) {
        var payload = {};
        payload.parameters = {};
        payload.parameters.name = name;
        payload.parameters.email = email;
        payload.subject = subject;
        payload.message = message;
        return $http({
            method: 'POST',
            data: payload,
            url: RestURL.baseURL + 'messanger/contact'
        });
    };

    this.getPaymentAuthorizationKeys = function (venueNumber) {
        return $http({
            method: 'GET',
            headers: {
                "Authorization": "Bearer dCZU-Fs7coA:APA91bHrcgo1fipja2ncMF1SettKyANMxewopu1IyyqfWLo1PDECdX7V3lWwf"
            },
            url: RestURL.baseURL + 'venues/' + venueNumber + "/paymentKeys"
        });
    };


    this.nearBy = function (venueId, type, filterValue) {
        var params = {type: type};

        if (typeof(filterValue) !== 'undefined' && filterValue > 0) {
            params.filter = filterValue;
        }
        return $http({
            method: 'GET',
            url: RestURL.baseURL + 'venues/' + venueId + '/nearby',
            params: params
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };

    this.getChannels = function (venueId) {
         return $http({
            method: 'GET',
            url: RestURL.baseURL + 'venues/' + venueId + '/channels',
        }).then(function (success) {
            return success;
        }, function (error) {
            $log.error('Error: ' + error);
            return error;
        });
    };
}]);
