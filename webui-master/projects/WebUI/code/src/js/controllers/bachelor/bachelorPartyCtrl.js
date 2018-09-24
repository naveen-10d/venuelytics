/**
 * @author Navaneethan C
 * @date 14/11/2017
 */
"use strict";
app.controller('bachelorPartyController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', '$rootScope','ngMeta', 'VenueService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, $rootScope,ngMeta, venueService) {
            var self = $scope;
            
            self.init = function() {
                self.venueDetails = venueService.getVenue($routeParams.venueId);
                ngMeta.setTag('description', self.venueDetails.description + " Bachelor Party");
                $rootScope.title = self.venueDetails.venueName+ " Venuelytics - Bachelor Party Services";
                ngMeta.setTitle($rootScope.title);
                $rootScope.serviceTabClear = false;
                var date = new Date();
                var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                $( "#bachelorDate" ).datepicker({autoclose:true, orientation: 'bottom', todayHighlight: true, startDate: today, minDate: 0, format: 'yyyy-mm-dd'});
                self.venueId = self.venueDetails.id;
                if((Object.keys(DataShare.partyServiceData).length) !== 0) {
                    self.bachelor = DataShare.partyServiceData;
                } else {
                    self.tabClear();
                }
                if($rootScope.serviceName === 'BachelorParty') {
                    self.tabClear();
                }
                self.bachelor.authorize = false;
                self.bachelor.agree = false;
                self.totalGuest = DataShare.totalNoOfGuest;
                self.reservationTime = APP_ARRAYS.time;
                self.restoreTab = DataShare.tab;
                self.tabParam = $routeParams.tabParam;
                self.getMenus();
                self.getEventType();
                setTimeout(function() {
                    self.getSelectedTab();
                }, 600);
            };

            self.$watch('bachelor.orderDate', function() {
                if (self.bachelor.orderDate !== "") {
                    self.getBachelorPartyHall(self.venueId);
                }
            });
            self.getMenus = function() {
                AjaxService.getInfo(self.venueId).then(function(response) {
                    /* self.partyCateringMenu = response.data["PartyHall.cateringMenuUrl"];
                    self.partyMenu = response.data["PartyHall.Menu"];
                    self.partyInfoSheet = response.data["PartyHall.Details"];
                    self.partyVideo = response.data["PartyHall.Video"];
                    self.partyFloorPlan = response.data["PartyHall.FloorMap"]; */
                    self.enabledPayment = response.data["Advance.enabledPayment"];
                });
            };

            self.partyHallDescription = function(value) {
                $rootScope.BacheolorDescription = value;
            };

            self.tabClear = function() {
                DataShare.partyServiceData = {};

                self.bachelor = {};
                $rootScope.serviceName = '';
                self.bachelor.orderDate = moment().format('YYYY-MM-DD');
            };

            self.getSelectedTab = function() {
                $(".service-btn .card").removeClass("tabSelected");
                $("#bachelorParty > .card").addClass("tabSelected");
            };

            self.getEventType = function() {
                AjaxService.getTypeOfEvents(self.venueId, 'PartyHall').then(function(response) {
                    self.eventTypes = response.data;
                    
                  var selectedType;
                  angular.forEach(self.eventTypes, function(tmpType) {
                    if(tmpType.id === DataShare.partyServiceData.partyEventType.id) {
                      selectedType = tmpType;
                    }
                  });
                  if(selectedType) {
                    self.bachelor.partyEventType = selectedType;
                  }
                    
                });
            };

            self.menuUrlSelection = function(menu) {
                var data = menu.split(".");
                var splitLength = data.length;
                if(data[0] === "www") {
                    menu = 'http://' + menu;
                    $window.open(menu, '_blank');
                } else if(data[splitLength-1] === "jpg" || data[splitLength-1] === "png") {
                    self.menuImageUrl = menu;
                    $('#menuModal').modal('show');
                } else {
                    $window.open(menu, '_blank');
                }
            };

            self.getBachelorPartyHall = function(venueId) {
                AjaxService.getProductsByType(venueId, 'PartyHall').then(function(response) {
                    self.bachelorPartyHall = response.data;
                    self.BacheolorDescription = response.data[0].description;
                    self.reservationData = [];
                    var partyDate = moment(self.bachelor.orderDate).format('YYYYMMDD');
                    AjaxService.getVenueMapForADate(self.venueId,partyDate).then(function(response) {
                        self.reservations = response.data;
                        angular.forEach(self.bachelorPartyHall, function(value, key) {
                            value.reserve = false;
                        });
                        angular.forEach(self.bachelorPartyHall, function(value1, key1) {
                            angular.forEach(self.reservations, function(value2, key2) {
                                if(value1.id === value2.productId) {
                                    value1.reserve = true;
                                } 
                            });
                        });
                    });
                });
            };

            self.confirmPartyPackage = function(selectedBachelorParty) {
                $rootScope.serviceTabClear = true;
              
                var date = new Date(self.bachelor.orderDate);
                var newDate = date.toISOString();
                var parsedend = moment(newDate).format("MM-DD-YYYY");
                date = new Date(moment(parsedend,'MM-DD-YYYY').format());
                var dateValue = moment(date).format("YYYY-MM-DDTHH:mm:ss");
                var fullName = self.bachelor.userFirstName + " " + self.bachelor.userLastName;
                var authBase64Str = window.btoa(fullName + ':' + self.bachelor.email + ':' + self.bachelor.mobile);
                DataShare.partyServiceData = self.bachelor;
                DataShare.authBase64Str = authBase64Str;
                self.serviceJSON = {
                  "serviceType": 'BachelorPartyService',
                  "venueNumber": self.venueId,
                  "reason": self.bachelor.partyEventType.name,
                  "contactNumber": self.bachelor.mobile,
                  "contactEmail": self.bachelor.email,
                  "contactZipcode": "",
                  "noOfGuests": self.bachelor.totalGuest,
                  "noOfMaleGuests": 0,
                  "noOfFemaleGuests": 0,
                  "budget": 0,
                  "hostEmployeeId": -1,
                  
                  "serviceInstructions": self.bachelor.instructions,
                  "status": "REQUEST",
                  "serviceDetail": null,
                  "fulfillmentDate": dateValue,
                  "durationInMinutes": 0,
                  "deliveryType": "Pickup",
                  "order": {
                      "venueNumber": self.venueId,
                      "orderDate": dateValue,
                      "orderItems": []
                  }
                };

                var items = {
                            "venueNumber": self.venueId,
                            "productId": selectedBachelorParty.id,
                            "productType": selectedBachelorParty.productType,
                            "quantity": selectedBachelorParty.size,
                            "comments": selectedBachelorParty.comments,
                            "name": selectedBachelorParty.name
                        };
                self.serviceJSON.order.orderItems.push(items);
                DataShare.payloadObject = self.serviceJSON;
                DataShare.enablePayment = self.enabledPayment;
                DataShare.privateOrderItem = selectedBachelorParty;
                $location.url("/confirmBachelorParty/" + self.selectedCity + "/" + self.venueId);
             };
            self.init();
    }]);
