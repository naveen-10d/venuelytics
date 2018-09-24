"use strict";
app.controller('BusinessSearchController', ['$log', '$translate','$scope', '$location', 'RestURL', 'DataShare', '$window', 'AjaxService', '$rootScope', '$routeParams', 'APP_LINK', '$templateCache', 'ngMeta',
    function ($log, translate, $scope, $location, RestURL, DataShare, $window, AjaxService, $rootScope, $routeParams, APP_LINK, $templateCache, ngMeta) {

        $log.log('Inside Business Search Controller');

        var self = $scope;

        $rootScope.showItzfun = false;
        $rootScope.selectedTab = 'business';
        $rootScope.blackTheme = "";
        self.successMessage = !!$location.search().successful;
        var utmPayload = {};
        utmPayload.utmSource = $location.search().utm_source;
        utmPayload.utmMedium = $location.search().utm_media;
        utmPayload.utmCampaign = $location.search().utm_campaign;
        utmPayload.utmContent = $location.search().utm_content;
        utmPayload.referenceId = $location.search().reference_id;
        utmPayload.utmTerm = "VenueLytics";

        function _UDF(o) {
            return typeof (o) === 'undefined' || o.length === 0;
        }

        self.init = function () {

            ngMeta.setTitle("Real Time Venue Management Platform");
            ngMeta.setTag('description', 'VenueLytics empowers businesses, in the entertainment, hospitality and service industries, to engage their customers in real-time and deliver Table & Bottle Service Reservations, Food & Drink Ordering, Private Event Bookings, Events Booking');

            // initial image index
            self._Index = 0;

            var urlPattern = $location.absUrl();
            self.searchAddress = "";
            self.searchName = "";

            if (!!$location.search().s) {
                self.searchAddress = $location.search().s;    
            }

            if (!!$location.search().name) {
                self.searchName = $location.search().name;

            }

            
            var data = urlPattern.split(".");
            if (data[1] === "itzfun") {
                $rootScope.facebook = APP_LINK.FACEBOOK_VENUELYTICS;
                $rootScope.twitter = APP_LINK.TWITTER_VENUELYTICS;
                $rootScope.instagram = APP_LINK.INSTAGRAM_VENUELYTICS;
                utmPayload.utmTerm = "ItzFun";
            }

            if (typeof utmPayload.utmSource !== 'undefined' && typeof utmPayload.utmSource !== 'undefined') {
                var userAgent = '';
                if (typeof $window.navigator !== 'undefined') {
                    userAgent = $window.navigator.userAgent;
                }
                var rawreq = $location.absUrl();
                utmPayload.agentInfo = userAgent;
                utmPayload.type = 'BusinessSearch';
                utmPayload.request = rawreq;
                AjaxService.recordUTM(utmPayload);
            }

            AjaxService.getVenues($routeParams.venueId, null, null).then(function (response) {
                self.venueId = response.id;
                self.selectedVenueName = response.venueName;
                self.selectedVenueAddress = response.address;
                self.selectedVenueWebsite = response.website;
                if (typeof response.imageUrls !== 'undefined') {
                    self.businessImage = response.imageUrls[0].largeUrl;
                }

                self.initMore();
            });
        }

        self.initMore = function () {
            self.deploymentServices = [];
            if (self.venueId) {
                AjaxService.getClaimBusiness(self.venueId).then(function (response) {
                    self.isBusinessClaimed = response.data.status === undefined ? true : false;
                    self.privateUrl = response.data["business.privateUrl"];
                    self.foodUrl = response.data["business.foodUrl"];
                    self.premiumUrl = response.data["business.premiumUrl"];
                    self.drinksUrl = response.data["business.drinksUrl"];
                    self.guestList = response.data["business.guestList"];
                    self.bottleUrl = response.data["business.bottleUrl"];

                    addDeployment("business.PREMIUM_URL", self.premiumUrl);
                    addDeployment("business.BOTTLE_URL", self.bottleUrl);
                    addDeployment("business.PRIVATE_URL", self.privateUrl);
                    addDeployment("business.FOOD_URL", self.foodUrl);
                    addDeployment("business.DRINKS_URL", self.drinksUrl);
                    addDeployment("business.GUEST_URL", self.guestList);

                    setupEmbedScript();
                });
            }



            if (typeof (self.searchName) !== 'undefined' && self.searchName.length > 0) {
                self.search(self.searchName, self.searchAddress);
            }
        };

        self.search = function (name, address) {
            
            $window.scrollTo(0, 0);
            AjaxService.searchBusiness(name, address).then(function (response) {
                self.businessDetails = response.data.venues;
                self.businessDetailLength = self.businessDetails.length;
                angular.forEach(self.businessDetails, function (value, key) {
                    var dataInfo = value.info;
                    var businessClaimed = "Y" === dataInfo["business.claimed"];
                    if (businessClaimed === true) {
                        value.flag = true;
                    } else {
                        value.flag = false;
                    }
                });
                if (self.businessDetailLength !== 0) {
                    self.businessImage = self.businessDetails[0].imageUrls[0].originalUrl;
                    self.venueName = self.businessDetails[0].venueName;
                    self.venueAddress = self.businessDetails[0].address;
                }
            });
        };

        self.claim = function (selectedVenue) {
            $window.scrollTo(0, 0);

            self.selectedVenueName = selectedVenue.venueName;
            self.selectedVenueId = selectedVenue.id;
            self.selectedVenueWebsite = selectedVenue.website;
            self.selectedVenueAddress = selectedVenue.address;

            self.claimBusiness = true;
            $rootScope.title = 'Venuelytics Claim Your Business Page- ' + selectedVenue.venueName;
            ngMeta.setTitle($rootScope.title);

            self.businessSubmitWithCheck(selectedVenue, DataShare.claimBusiness);
        };

        self.cancel = function () {
            self.claimB = {};
        };

        
        self.sendViaEmail = function() {

            var text ='Share the following links on your social media.\n\n';

            for (var idx in $scope.deploymentServices) {
                text +=  translate.instant($scope.deploymentServices[idx].displayName) +'\n ';
                text += $scope.deploymentServices[idx].url +'\n\n ';

            }
            var mail = 'mailto:?subject=Re: Deployment Steps for venue: ' + self.selectedVenueName +
               '&body=' + encodeURIComponent(text) + '\n\n ' +encodeURIComponent($scope.embedServicesHTML);
               console.log(mail);
            $window.open(mail);
        };

    
        self.businessSubmitWithCheck = function (selectedVenue, businessClaim) {
            self.currentSelectedVenue = selectedVenue;
            if (_UDF(businessClaim.name) || _UDF(businessClaim.email) || _UDF(businessClaim.mobile) || _UDF(businessClaim.role)) {
                $('#subscribeModalSearch').modal('show');
                $('.modal-backdrop').remove();
                return;
            }
            self.businessSubmit(selectedVenue, businessClaim);
        };

        self.businessSubmit = function (selectedVenue, businessClaim) {
            var businessObject = {
                "business.contactName": businessClaim.NameOfPerson,
                "business.contactEmail": businessClaim.Email,
                "business.contactPhone": businessClaim.phoneNumber,
                "business.contactRole": businessClaim.businessRole.role
            };
            AjaxService.claimBusiness(selectedVenue.id, businessObject).then(function (response) {
                $log.info("Claim business response: " + angular.toJson(response));
                $location.path("/emailVerification/" + selectedVenue.id);
            }, function (error) {
                $log.info("Claim business response: " + angular.toJson(error.data));
            });
        };

        self.clickClaimBusiness = function (selectedVenue) {
            if (selectedVenue.flag === false) {
                self.claim(selectedVenue);
            } else {
                self.alreadyClaimed(selectedVenue);
            }
        };

        self.alreadyClaimed = function (selectedVenue) {
            $location.url('/businessAlreadyClaimed/' + selectedVenue.id);
            /*AjaxService.getClaimBusiness(selectedVenue.id).then(function(response) {
                // $location.path("/deployment/"+selectedVenue.id);
            }, function(error) {

            });*/
        };
        function setupEmbedScript() {
            var premiumUrl = RestURL.adminURL + '/reservation/' + self.venueId + '?i=Y';
            self.embedServicesHTML = $templateCache.get('business/iframe-integration.html');
            self.embedServicesHTML = self.embedServicesHTML.replace('premiumUrl', premiumUrl);
        }

        function addDeployment(displayName, url) {
            if (typeof url !== 'undefined' && url != null && url.length > 0) {
                self.deploymentServices.push({ displayName: displayName, url: url });
            }
        }

        self.noFunction = function () {
            $location.path("/home");
        };

        self.yesFunction = function () {
            AjaxService.sendBusinessPage(self.venueId).then(function (response) {
                $('#successEmail').modal('show');
            });
        };

        self.successEmailRegister = function () {
            $location.path("/home");
        };

        self.createBusinessMethod = function () {
            $location.path('/createBusiness');
        };

        self.showMessage = function (input) {
            var show = input.$invalid && (input.$dirty || input.$touched);
            return show;
        };

        // if a current image is the same as requested image
        self.isActive = function (index) {
            return self._Index === index;
        };

        // show prev image
        self.showPrev = function (slide) {
            self._Index = (self._Index > 0) ? --self._Index : slide.length - 1;
        };

        // show next image
        self.showNext = function (slide) {
            self._Index = (self._Index < slide.length - 1) ? ++self._Index : 0;
        };

        // show a certain image
        self.showPhoto = function (slide, index) {
            self._Index = index;
        };
        self.init();
    }]);