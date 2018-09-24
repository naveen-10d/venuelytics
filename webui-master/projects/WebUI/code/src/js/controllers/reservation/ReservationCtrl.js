/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('ReservationController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', '$rootScope','ngMeta', 'VenueService','DialogService',
    function ($log, $scope, $location,DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, $rootScope,ngMeta, venueService, DialogService) {


        var self = $scope;
        self.selectedPackage = null;
        self.reservation ={};
        self.serviceType = "Reservation";
        self.floorMapImage = "";
        self.venueMaps = null;
        self.productList = [];
       
        self.reservation.orderDate = moment().format('YYYY-MM-DD');
        self.init = function() {
            
            self.venueDetails = venueService.getVenue($routeParams.venueId);
            self.venueId = self.venueDetails.id;
            $rootScope.blackTheme = venueService.getVenueInfo(self.venueId , 'ui.service.theme') || '';
            ngMeta.setTag('description', self.venueDetails.description + " Reservation");
            $rootScope.title = self.venueDetails.venueName + " Venuelytics - Reservation Service";
            ngMeta.setTitle($rootScope.title);
            $rootScope.serviceTabClear = false;
            var date = new Date();
            var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            $( "#reservationDate" )
            .datepicker({autoclose:true, orientation: 'bottom', todayHighlight: true, startDate: today, minDate: 0, format: 'yyyy-mm-dd'})
            .on('changeDate', function(ev){
                console.log("changeDate event");
                self.reservation.orderDate = $("#reservationDate").val();
                 self.selectedItems = [];
                self.selectVenueMap();
            });
             self.selectedItems = [];
            if((Object.keys(DataShare.reservationData).length) !== 0) {
                self.reservation = DataShare.reservationData;
                self.selectedItems = DataShare.selectedItems;
            } else {
                self.tabClear();
            }
            if($rootScope.serviceName === self.serviceType) {
                self.tabClear();
            } 
            self.reservation.authorize = false;
            self.reservation.agree = false;
            self.totalGuest = DataShare.totalNoOfGuest;
            self.reservationTime = APP_ARRAYS.time;
            self.restoreTab = DataShare.tab;
            self.tabParam = $routeParams.tabParam;
            self.getSettings();
            self.getEventType();
            self.getVenueMap(self.venueId);
            setTimeout(function() {
                self.getSelectedTab();
            }, 200);
        };

        
        self.getSettings = function() {
            AjaxService.getInfo(self.venueId).then(function(response) {
                self.enabledPayment = response.data["Advance.enabledPayment"];
                self.reservationPolicy = response.data["Reservation.ReservationPolicy"];
            });
        };

        self.tabClear = function() {
            DataShare.reservation = {};
            DataShare.selectedItems ={};
            self.reservation = {};
            $rootScope.serviceName = '';
            self.reservation.orderDate = moment().format('YYYY-MM-DD');
        };

        self.getSelectedTab = function() {
            $(".service-btn .card").removeClass("tabSelected");
            $("#reservation > .card").addClass("tabSelected");
        };

        self.getEventType = function() {
            AjaxService.getTypeOfEvents(self.venueId, 'Party').then(function(response) {
                self.eventTypes = response.data;
                
              var selectedType;
              angular.forEach(self.eventTypes, function(tmpType) {

                if(DataShare.reservationData && DataShare.partyEventType && (tmpType.id === DataShare.reservationData.partyEventType.id)) {
                  selectedType = tmpType;
                }
              });
              if(selectedType) {
                self.reservation.partyEventType = selectedType;
              }
                
            });
        };

        self.getVenueMap = function(venueId) {
                AjaxService.getVenueMap(venueId, 'Reservation').then(function(response) {
                self.venueMaps = response.data;
                self.selectVenueMap();
            });
        };

        self.selectVenueMap = function() {
            self.productList = [];
            self.floorMapImage = "";
            self.selectedPackage = {};
            self.venueMap  ={};
            if (!self.venueMaps) {
                return;
            }
            var selectedDay = moment(self.reservation.orderDate).format("ddd").toUpperCase();
           
            for (var index = 0; index < self.venueMaps.length; index++) {
                  var venueMap = self.venueMaps[index];
                  if(venueMap.days === '*' || venueMap.days.indexOf(selectedDay) !== -1) {
                    setTimeout(function() {
                        self.syncUI(venueMap);
                    }, 500);
                    return;
                }
            }
        };
       

        self.syncUI = function(venueMap) {
            self.$apply(function() {
                self.venueMap = venueMap;
                if (self.venueMap && self.venueMap.imageUrls && self.venueMap.imageUrls.length > 0) {
                    self.floorMapImage = self.venueMap.imageUrls[0].originalUrl;
                }

                if (self.venueMap.associatedProducts && self.venueMap.associatedProducts.PartyPackage) {
                    self.partyPackages = self.venueMap.associatedProducts.PartyPackage;
                    if (self.selectedPackage == null && self.partyPackages && self.partyPackages.length > 0) {
                        self.selectedPackage = self.partyPackages[0];
                    }
                }

                if (self.venueMap.associatedProducts) {
                    var newProductList = [];
                    angular.forEach(self.venueMap.associatedProducts, function(value, key) {
                        console.log("Product Name" + key);
                        if (key !== 'PartyPackage') {
                            newProductList.push.apply(newProductList, value);
                        }
                    });
                    self.productList = newProductList;
                }
            });
        };
        self.saveReservation = function(selectedPackage) {
            self.selectedPackage = selectedPackage;
            $rootScope.serviceTabClear = true;
           
            
            var dateValue = moment(self.reservation.orderDate, 'YYYY-MM-DD').format("YYYY-MM-DDTHH:mm:ss");
            var fullName = self.reservation.userFirstName + " " + self.reservation.userLastName;
            var authBase64Str = window.btoa(fullName + ':' + self.reservation.email + ':' + self.reservation.mobile);
            DataShare.reservationData = self.reservation;
            DataShare.authBase64Str = authBase64Str;
            self.serviceJSON = {
                "serviceType": self.serviceType,
                "venueNumber": self.venueId,
                "reason": self.reservation.partyEventType.name,
                "contactNumber": self.reservation.mobile,
                "contactEmail": self.reservation.email,
                "contactZipcode": "",
                "noOfGuests": self.reservation.totalGuest,
                "noOfMaleGuests": 0,
                "noOfFemaleGuests": 0,
                "budget": 0,

                "serviceInstructions": self.reservation.instructions,
                "status": "REQUEST",
                "fulfillmentDate": dateValue,
                "durationInMinutes": 0,
                "order": {
                  "venueNumber": self.venueId,
                  "orderDate": dateValue,
                  "orderItems": []
                }
            };

            
            var packageQuantity = 1;

            if (self.selectedPackage.itemCategory === 'Seat') {
                packageQuantity = self.reservation.totalGuest;
            }

            var items = {
                "venueNumber": self.venueId,
                "productId": self.selectedPackage.id,
                "productType": self.selectedPackage.productType,
                "quantity": self.reservation.totalGuest,
                "comments": '',
                "name": self.selectedPackage.name,
                "finalItemPrice": self.selectedPackage.price,
                "totalPrice": self.selectedPackage.price*packageQuantity
            };
            self.serviceJSON.order.orderItems.push(items);
            
            if (self.selectedItems) {
                for(var z=0; z < self.selectedItems.length; z++) {
                    var item = {
                        "venueNumber": self.venueId,
                        "productId": self.selectedItems[z].id,
                        "productType": self.selectedItems[z].productType,
                        "quantity": self.selectedItems[z].quantity,
                        "comments": self.party.instructions,
                        "name": self.selectedItems[z].name,
                        "finalItemPrice": self.selectedItems[z].price,
                        "totalPrice": self.selectedItems[z].price*self.selectedItems[z].quantity
                    };
                    self.serviceJSON.order.orderItems.push(item);
                }
            }
            

            DataShare.payloadObject = self.serviceJSON;
            DataShare.enablePayment = self.enabledPayment;
            DataShare.selectedItems = self.selectedItems;

            $location.url(self.selectedCity  + "/"+ self.venueRefId(self.venueDetails) + "/reservation-confirm");
        };
        self.closeModal = function() {
          $('#partyDescriptionModal').modal('hide');
        };

        self.venueRefId = function (venue) {
            if (!venue.uniqueName) {
                return venue.id;
            } else {
                return venue.uniqueName;
            }
        };
        self.init();
    }
]);
