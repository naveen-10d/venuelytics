
"use strict";
app.controller('TableServiceController', ['$log', '$scope', '$location',  'DataShare', '$routeParams', 'AjaxService', 'APP_ARRAYS',  '$rootScope','ngMeta', '$translate', 'VenueService',
    function ($log, $scope,$location, DataShare, $routeParams, AjaxService, APP_ARRAYS,  $rootScope, ngMeta, $translate, venueService) {

            $log.debug('Inside Table Service Controller.');

            var self = $scope;
            self.reservedTimeSlot = '';
            self.timeSlot = false;
            self.table = {};
            self.init = function() {
               
                self.venueDetails = venueService.getVenue($routeParams.venueId);
                self.venueId = self.venueDetails.id;
                self.selectedVenue = self.venueDetails.venueName;
                angular.forEach(self.venueDetails.imageUrls, function(value,key){
                    self.venueImage = value.originalUrl;
                });
                $rootScope.description = self.venueDetails.description;
                ngMeta.setTag('description', self.venueDetails.description + " Table Services");
                $rootScope.title = self.venueDetails.venueName+  " Venuelytics - Table Services";
                ngMeta.setTitle($rootScope.title);
                
                $rootScope.embeddedFlag = $routeParams.embed === 'embed' || $location.search().embeded === 'Y';
                
                var date = new Date();
                $rootScope.serviceTabClear = false;
                var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                $( "#tableServiceDate" ).datepicker({autoclose:true,  orientation: 'bottom', todayHighlight: true, startDate: today, minDate: 0, format: 'yyyy-mm-dd'}).on('changeDate', function(ev){
                    console.log("changeDate event");
                    self.table.tableDate = $("#tableServiceDate").val();
                });
                
                self.getServiceTime();
                self.venueInfo();
                setTimeout(function() {
                    self.getSelectedTab();
                }, 600);
                
                self.selectedCity = $routeParams.cityName;
                self.reservationTime = APP_ARRAYS.time;
                self.table.tableDate  = moment().format('YYYY-MM-DD');
                
                
                if((Object.keys(DataShare.tableService).length) !== 0) {
                    self.table = DataShare.tableService;
                    self.findTable();
                }
            };

            self.editTableService = function() {
                $location.url('/cities/' + self.selectedCity + '/' + self.venueId + '/table-services');
            };

            self.venueInfo = function() {
                self.heading = venueService.getVenueInfo(self.venueId, 'table.ui.reservation.heading') /*|| $translate.instant('TABLE_SERVICE_TIMEOUT')*/;    
                self.description = venueService.getVenueInfo(self.venueId, 'table.ui.reservation.description') ;
                //self.description =
            };
            
            self.findTable = function() {
                self.productItem = [];
                DataShare.tableGuests = self.table.guest;
                DataShare.guestFocus = self.table.tableDate +"T"+ self.table.reserveTime;
                var date= moment(self.table.tableDate ).format('YYYYMMDD');
                
                AjaxService.getTime(self.venueId, date, self.table.reserveTime, self.table.guest).then(function(response) {
                    var obj = response.data;
                    self.reservedTimeSlot = '';
                    self.timeSlot = true;
                    Object.keys(obj).forEach(function(key){
                      var value = obj[key];
                      self.productItem.push(value);
                    });

                    angular.forEach(self.productItem, function(value1,key1) {
                          var size = value1.product.servingSize;
                          if(parseInt(self.table.guest) === size) {
                              self.reservedTimeSlot = value1.availableTimes;
                          }
                    });

                    angular.forEach(self.reservedTimeSlot, function(value,key) {
                        if(value.minutes === 0) {
                          value.minutes = '00';
                        }
                        if(value.hours !== 12) {
                          value.hours = value.hours % 12;
                        }
                        value.time = value.hours +':'+ value.minutes + (value.am === true ? ' AM' : ' PM');  
                    });
                });
            };


            self.getSelectedTab = function() {
                $(".service-btn .card").removeClass("tabSelected");
                $("#tableServices > .card").addClass("tabSelected");
            };

            self.getServiceTime = function() {
                self.reserveTimes = [];
                var date = new Date();
                $scope.startDate = moment(date).format("MM-DD-YYYY");
                AjaxService.getServiceTime(self.venueId, 'venue').then(function(response) {
                    self.reservationData = response.data;
                    angular.forEach(self.reservationData, function(value1, key1) {
                        $scope.venueOpenTime = new Date(moment($scope.startDate + ' ' + value1.startTime,'MM-DD-YYYY h:mm').format());
                        value1.startTime = moment($scope.venueOpenTime).format("HH:mm");
                        angular.forEach(self.reservationTime, function(value, key) {
                            if(value.key >= value1.startTime && value.key <= value1.lastCallTime){
                                self.reserveTimes.push(value);
                            }
                            if(value1.lastCallTime === '' || value1.lastCallTime === null) {
                                if(value.key >= value1.startTime && value.key < value1.endTime){
                                    self.reserveTimes.push(value);
                                }
                            }
                        });
                    });
                });
            };

            self.confirmTableReserve = function(time) {
                DataShare.editBottle = time;
                DataShare.tableService = self.table;
                $location.url("/confirmTableService/" + self.selectedCity + "/" + self.venueId);
            };

            self.backToTable = function() {
                DataShare.tableService = '';
                $location.url('/cities/' + self.selectedCity + '/' + self.venueId + '/table-services');
            };
            self.tableGuests = DataShare.tableGuests;
            self.selectedDate= moment(DataShare.guestFocus).format('YYYY-MM-DD');
            self.selectedTime = DataShare.editBottle;
            self.confirmReservation = function() {                
                var fullName = self.tableService.firstName + " " + self.tableService.lastName;
                var authBase64Str = window.btoa(fullName + ':' + self.tableService.emailId + ':' + self.tableService.mobileNumber);
                var selectedDate= moment(DataShare.guestFocus).format('YYYY-MM-DD');
                DataShare.guestFocus = selectedDate +'T' + DataShare.editBottle;
                var dateValue = moment(DataShare.guestFocus, 'YYYY-MM-DDThh:mm a').format("YYYY-MM-DDTHH:mm:ss");
                self.serviceJSON = {
                  "serviceType": 'Restaurant',
                  "venueNumber": self.venueId,
                  "contactNumber": self.tableService.mobileNumber,
                  "contactEmail": self.tableService.emailId,
                  "noOfGuests": self.tableGuests,
                  "status": "REQUEST",
                  "serviceDetail": null,
                  "fulfillmentDate": dateValue,
                  "deliveryType": "Pickup",
                  "deliveryInstructions": null,
                  "order": {
                      "venueNumber": self.venueId,
                      "orderDate": dateValue,
                      "orderItems": []
                  },
                  "prebooking": false,
                  "visitorName": fullName
                };

                AjaxService.placeServiceOrder(self.venueId, self.serviceJSON, authBase64Str).then(function(response) {
                    if (response.status == 200 ||  response.status == 201) {
                        $location.url(self.selectedCity +'/table-success/'+ self.venueId);
                    } else {
                        if (response.data && response.data.message) {
                            alert("Saving order failed with message: " + response.data.message );
                        }
                    }
                });
            };
            self.init();
    }]);
