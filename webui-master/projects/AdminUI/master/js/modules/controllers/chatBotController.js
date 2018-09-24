
App.controller('ChatbotController', [ '$scope', '$state', '$stateParams','RestServiceFactory', 'toaster', 
    'FORMATS',  'ngDialog', 'ContextService', '$log', 'APP_EVENTS', '$timeout',
    function ( $scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS, ngDialog, contextService, $log, APP_EVENTS, $timeout) {
        'use strict';
        
        

        $scope.venueNumber = contextService.userVenues.selectedVenueNumber;
        $scope.selectedTabSettings = [];

        $scope.reasons = [{value: "Welcome", name:"Welcome Message"},{value:"CheckinRating", name:"Checkin Rating"}, 
        {value:"CheckoutRating", name: "Checkout Rating"}, {value: "ServiceMessage", name: "Service Message"}, {value:"Other", name: "Other"}];

        $scope.data = {};
        $scope.customerData = {};
        $scope.customerData.contact = {};
        $scope.sms = {};
        $scope.facebook = {};
        var self = $scope;
        self.settings = [];
        
        $scope.customerMessage = "";
        self.hotels = [];
        self.general = [];

        self.adminSettings = [
        	{ "displayName": "Enable Web Bot", "name": "WebBot.enable", "type": "text", "help":"only Y or N","value": "" },
            { "displayName": "SMS Bot Number", "name": "sms.bot.number", "type": "text", "value": "" },
            { "displayName": "Front Desk Number", "name": "hotel.frontdesk.number", "type": "text", "value": "" },
            { "displayName": "Service Rating Maximum", "name": "service.rating.max", "type": "text", "value": "" },
            { "displayName": "Service Rating Alert value", "name": "service.rating.alert", "type": "text", "value": "" },
        ];
        self.adminSettings = $.Apputil.makeMap(self.adminSettings);
        self.settings.push(self.adminSettings);
       
        $scope.init = function () {
           
            RestServiceFactory.VenueService().getInfo({ id: $scope.venueNumber} ,function (data) {
                $scope.data = data;
                $scope.sms = {};
                $scope.sms.liveAgentNumber = data['sms.liveAgentNumber'];
                $scope.sms.defaultWelcomeMessage = data['sms.defaultWelcomeMessage'];
                
                //$scope.customerMessage = $scope.sms.defaultWelcomeMessage;

                $scope.sms.checkInMessage = data['sms.checkInMessage'];
                $scope.sms.checkOutMessage = data['sms.checkOutMessage'];
                $scope.sms.venueVisitMessage = data['sms.venueVisitMessage'];

                $scope.sms.enableWelcomeMessage = data['sms.enableWelcomeMessage'];
                $scope.sms.enableCheckoutRating = data['sms.enableCheckoutRating'];
                $scope.sms.enableCheckinRating = data['sms.enableCheckinRating'];
                $scope.sms.enableVenueVisitRating = data['sms.enableVenueVisitRating'];

                $scope.sms.welcomeMessageDelayMinutes = data['sms.welcomeMessageDelayMinutes'] || 1;
                $scope.sms.checkinRatingDelayMinutes = data['sms.checkinRatingDelayMinutes'] || 1;
                $scope.sms.checkoutRatingDelayMinutes = data['sms.checkoutRatingDelayMinutes'] || 1;
                $scope.sms.venueVisitRatingDelayMinutes = data['sms.venueVisitRatingDelayMinutes'] || 1;

                $scope.facebook = {};
                $scope.facebook.liveAgentNumber = data['facebook.liveAgentNumber'];
                $scope.facebook.defaultWelcomeMessage = data['facebook.defaultWelcomeMessage'];

                
                for (var x = 0; x< self.settings.length; x++) {
                	var settingArray = self.settings[x];
                	for (var itemKey in settingArray) {
	                    if (settingArray.hasOwnProperty(itemKey)) {
	                    	if (!!data[itemKey]) {
	                    		var value = data[itemKey]; 
	                    		settingArray[itemKey].value = value;
	                    	}
	                    }
	                }
	            }
          
            });

            RestServiceFactory.VenueService().getFacilities({ id: $scope.venueNumber}, function(data) {
                self.general = [];
                self.hotels = [];
               for (var x = 0; x < data.length; x++) {
                if (data[x].category === 'G' && data[x].type === 'TEXT') {
                    self.general.push(data[x]);
                } else if (data[x].category === 'H' && data[x].type === 'TEXT') {
                    self.hotels.push(data[x]);
                }
               }

            });            
        };
       
        $scope.update = function (isValid, form, data) {

	        if (!isValid) {
	            return;
	        }

	        var target = { id: $scope.venueNumber };
	        RestServiceFactory.VenueService().updateFacilities(target, data, function (success) {

	            ngDialog.openConfirm({
                    template: '<p>Information  successfully saved</p>',
                    plain: true,
                    className: 'ngdialog-theme-default'
                });

	        }, function (error) {
	            if (typeof error.data !== 'undefined') {
	                toaster.pop('error', "Server Error", error.data.developerMessage);
	            }
	        });
	    };

        $scope.updateAdmin = function (isValid, form, adminData) {
            if (!isValid || !$("#admin").parsley().isValid()) {
                return;
            }

            var target = { id: $scope.venueNumber };
             var obj = {};
            
            obj['WebBot.enable'] = adminData['WebBot.enable'].value;
            obj['sms.bot.number'] = adminData['sms.bot.number'].value;
            obj['hotel.frontdesk.number'] = adminData['hotel.frontdesk.number'].value;
            obj['service.rating.max'] = adminData['service.rating.max'].value;
            obj['service.rating.alert'] = adminData['service.rating.alert'].value;
            
            RestServiceFactory.VenueService().updateAttribute(target, obj, function (success) {
                ngDialog.openConfirm({
                    template: '<p>Admin information  successfully saved</p>',
                    plain: true,
                    className: 'ngdialog-theme-default'
                });
            }, function (error) {
                if (typeof error.data !== 'undefined') {
                    toaster.pop('error', "Server Error", error.data.developerMessage);
                }
            });

            
        };

        $scope.updateSmsChat = function (isValid, form, sms) {

            if (!isValid || !$("#smsChatInfo").parsley().isValid()) {
                return;
            }

            var target = { id: $scope.venueNumber };
            var obj = {};
            
            obj['sms.liveAgentNumber'] = sms.liveAgentNumber;
            obj['sms.defaultWelcomeMessage'] = sms.defaultWelcomeMessage;
            obj['sms.checkInMessage'] = sms.checkInMessage;
            obj['sms.checkOutMessage'] = sms.checkOutMessage;
            obj['sms.venueVisitMessage'] = sms.venueVisitMessage;

            obj['sms.enableWelcomeMessage'] = sms.enableWelcomeMessage;
            obj['sms.enableCheckoutRating'] = sms.enableCheckoutRating;
            obj['sms.enableCheckinRating'] = sms.enableCheckinRating;
            obj['sms.enableVenueVisitRating'] = sms.enableVenueVisitRating;

            
            obj['sms.welcomeMessageDelayMinutes'] = sms.welcomeMessageDelayMinutes;
            obj['sms.checkinRatingDelayMinutes'] = sms.checkinRatingDelayMinutes;
            obj['sms.checkoutRatingDelayMinutes'] = sms.checkoutRatingDelayMinutes;
            obj['sms.venueVisitRatingDelayMinutes'] = sms.venueVisitRatingDelayMinutes;

            RestServiceFactory.VenueService().updateAttribute(target, obj, function (success) {
                ngDialog.openConfirm({
                    template: '<p>Sms Chat information  successfully saved</p>',
                    plain: true,
                    className: 'ngdialog-theme-default'
                });
            }, function (error) {
                if (typeof error.data !== 'undefined') {
                    toaster.pop('error', "Server Error", error.data.developerMessage);
                }
            });

            
        };

        $scope.updateFacebookChat = function (isValid, form, facebook) {

            if (!isValid || !$("#facebookChatInfo").parsley().isValid()) {
                return;
            }

            var facebookChat = {
                "facebook.liveAgentNumber": facebook.liveAgentNumber,
                "facebook.defaultWelcomeMessage": facebook.defaultWelcomeMessage,
            };

            var target = { id: $scope.venueNumber };

            RestServiceFactory.VenueService().updateAttribute(target, facebookChat, function (success) {
                ngDialog.openConfirm({
                    template: '<p>Facebook chat information  successfully saved</p>',
                    plain: true,
                    className: 'ngdialog-theme-default'
                });
            }, function (error) {
                if (typeof error.data !== 'undefined') {
                    toaster.pop('error', "Server Error", error.data.developerMessage);
                }
            });

            
        };
        
        $scope.tabSelect = function (tabs) {
        
           
            $scope.cs.reason = "Welcome";
            //$scope.customerMessage = $scope.sms.defaultWelcomeMessage;
            $('#checkInCalendarId').on('click', function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $timeout(function() {
                    $scope.config.startOpened = !$scope.config.startOpened;
                }, 200);
            
            }); 

            $('#checkOutCalendarId').on('click', function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $timeout(function() {
                    $scope.config.endOpened = !$scope.config.endOpened;
                }, 200);
            
            }); 

          
        };

        $scope.onReasonSectionChange = function() {
            if ($scope.cs.reason === "Welcome Message") {
                $scope.cs.message = $scope.sms.defaultWelcomeMessage || "";
            }  else if ($scope.cs.reason === "Checkin Rating") {
                $scope.cs.message = $scope.sms.checkInMessage || "";
            } else if ($scope.cs.reason === "Checkout Rating") {
                $scope.cs.message = $scope.sms.checkOutMessage || "";
            } else {
                $scope.cs.message = "";
            }
        };

        $scope.init();


        $scope.$on(APP_EVENTS.venueSelectionChange, function (event, data) {

            $scope.venueNumber = contextService.userVenues.selectedVenueNumber;
            $scope.init();

        });


        $scope.disabled = function(date, mode) {
            return false;
        };
    }]);