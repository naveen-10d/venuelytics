/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('PrivateEventController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', '$rootScope', 'ngMeta', 'VenueService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, $rootScope, ngMeta, venueService) {


        var self = $scope;
        self.private = {};
        self.init = function () {

            self.getReservationTime = APP_ARRAYS.time;

            self.venueDetails = venueService.getVenue($routeParams.venueId);
            self.venueId = self.venueDetails.id;
            ngMeta.setTag('description', self.venueDetails.description + " Private Event");
            $rootScope.title = self.venueDetails.venueName +  " Venuelytics - Private Event";
            ngMeta.setTitle($rootScope.title);
            $rootScope.serviceTabClear = false;

            self.getServiceTime();
            if ((Object.keys(DataShare.privateEventData).length) !== 0) {
                self.private = DataShare.privateEventData;
            } else {
                self.tabClear();
            }
            if ($rootScope.serviceName === 'PrivateEvent') {
                self.tabClear();
            }
            self.getMenus();
            self.getEventType();
            setTimeout(function () {
                self.getSelectedTab();
            }, 600);
            var date = new Date();
            var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            $("#privateDate").datepicker({
                autoclose: true,
                todayHighlight: true,
                orientation: 'bottom',
                startDate: today,
                minDate: 0,
                format: 'yyyy-mm-dd'
            }).on('changeDate' ,function(ev) {
                self.private.orderDate = $("#privateDate").val();
                if (self.private.orderDate !== "") {
                    self.getBanquetHall(self.venueId);
                }
            });
            self.private.authorize = false;
            self.private.agree = false;
        };

        self.$watch('private.orderDate', function () {
            if (self.private.orderDate !== "") {
                self.getBanquetHall(self.venueId);
                self.getServiceTime();
            }
        });
        self.getServiceTime = function () {
            self.reserveStartTimes = [];
            self.reserveEndTimes = [];
            AjaxService.getServiceTime(self.venueId, 'venue').then(function (response) {
                self.reservationTime = response.data;
                angular.forEach(self.reservationTime, function (value1, key1) {
                    $scope.venueOpenTime = new Date(moment($scope.startDate + ' ' + value1.startTime, 'MM-DD-YYYY h:mm').format());
                    value1.startTime = moment($scope.venueOpenTime).format("HH:mm");
                    angular.forEach(self.getReservationTime, function (value, key) {
                        var t = moment(value.key, "HH:mm");
                        var sTime = moment(value1.startTime, "HH:mm");
                        var lTime = moment(value1.lastCallTime || value1.endTime, "HH:mm");
                        var eTime = moment(value1.endTime, "HH:mm");
                        if (lTime.isBefore(sTime)) {
                            lTime.add(1,'d');
                        }

                        if (eTime.isBefore(sTime)) {
                            eTime.add(1,'d');
                        }

                       if (t.isBetween(sTime, lTime, null, "[)")) {
                         self.reserveStartTimes.push(value);
                       }

                       if (t.isBetween(sTime, lTime, null, "(]")) {
                        self.reserveEndTimes.push(value);
                       }
                        
                    });
                });
            });
        };

        self.tabClear = function () {
            DataShare.privateEventData = {};
            $rootScope.serviceName = '';
            self.private = {};
            self.private.orderDate = moment().format('YYYY-MM-DD');
        };

        self.getSelectedTab = function () {
            $(".service-btn .card").removeClass("tabSelected");
            $("#privateEvents > .card").addClass("tabSelected");
        };

        self.createPrivateEvent = function (value) {
            $rootScope.serviceTabClear = true;
            DataShare.tab = 'P';

            var selectedDateTime = moment(self.private.orderDate, 'YYYY-MM-DD').format("MM-DD-YYYY");

            self.selectDate = moment(selectedDateTime + ' ' + self.private.privateStartTime, 'MM-DD-YYYY h:mm a').format("YYYY-MM-DDTHH:mm:ss");
            var fullName = self.private.privateFirstName + " " + self.private.privateLastName;
            var authBase64Str = window.btoa(fullName + ':' + self.private.privateEmail + ':' + self.private.privateMobileNumber);
            DataShare.privateEventData = self.private;
            DataShare.authBase64Str = authBase64Str;

            //calculate duration

            var startTime = moment(self.private.privateStartTime, "HH:mm");
            var endTime = moment(self.private.privateEndTime, "HH:mm");
            self.duration = moment.duration(endTime.diff(startTime));

            self.serviceJSON = {
                "serviceType": 'BanquetHall',
                "venueNumber": self.venueId,
                "reason": self.occasion,
                "contactNumber": self.private.privateMobileNumber,
                "contactEmail": self.private.privateEmail,
                "contactZipcode": null,
                "noOfGuests": self.private.totalGuest,
                "noOfMaleGuests": 0,
                "noOfFemaleGuests": 0,
                "budget": self.private.budget,
                "serviceInstructions": self.private.privateComment,
                "status": "REQUEST",
                "fulfillmentDate": self.selectDate,
                "durationInMinutes": self.duration.asMinutes(),
                "deliveryType": "Pickup",

                "order": {
                    "venueNumber": self.venueId,
                    "orderDate": self.selectDate,
                    "orderItems": []
                }
            };

            var items = {
                "venueNumber": self.venueId,
                "productId": value.id,
                "productType": value.productType,
                "quantity": value.size,
                "comments": value.comments,
                "name": value.name
            };

            self.serviceJSON.order.orderItems.push(items);
            DataShare.payloadObject = self.serviceJSON;
            DataShare.privateOrderItem = value;
            $location.url(self.selectedCity + "/" + self.venueRefId(self.venueDetails) + "/confirmEvent");
        };

        self.privateEventDescription = function (value) {
            $rootScope.privateDescription = value;
        };

        self.getBanquetHall = function (venueId) {
            AjaxService.getProductsByType(venueId, 'BanquetHall').then(function (response) {
                self.privateEventValueArray = response.data;
                self.reservationData = [];
                var privateDate = moment(self.private.orderDate).format('YYYYMMDD');
                AjaxService.getVenueMapForADate(self.venueId, privateDate).then(function (response) {
                    self.reservations = response.data;
                    angular.forEach(self.privateEventValueArray, function (value, key) {
                        value.reserve = false;
                    });
                    angular.forEach(self.privateEventValueArray, function (value1, key1) {
                        angular.forEach(self.reservations, function (value2, key2) {
                            if (value1.id === value2.productId) {
                                value1.reserve = true;
                            }
                        });
                    });
                });
            });
        };

        self.getMenus = function () {
            AjaxService.getInfo(self.venueId).then(function (response) {
                self.privateMenu = response.data["BanquetHall.Menu"];
                self.privateInfoSheet = response.data["BanquetHall.Details"];
                self.privateVideo = response.data["BanqueHall.Video"];
                self.privateFloorPlan = response.data["BanquetHall.FloorMap"];
                self.enabledPayment = response.data["Advance.enabledPayment"];
            });
        };

        self.menuUrlSelection = function (privateMenu) {
            var data = privateMenu.split(".");
            var splitLength = data.length;
            if (data[0] === "www") {
                privateMenu = 'http://' + privateMenu;
                $window.open(privateMenu, '_blank');
            } else if (data[splitLength - 1] === "jpg" || data[splitLength - 1] === "png") {
                self.menuImageUrl = privateMenu;
                $('#menuModal').modal('show');
            } else {
                $window.open(privateMenu, '_blank');
            }
        };


        self.getEventType = function () {
            AjaxService.getTypeOfEvents(self.venueId, 'BanquetHall').then(function (response) {
                self.eventTypes = response.data;


                var selectedType;
                /*angular.forEach(self.eventTypes, function(tmpType) {
                    if(tmpType.id === DataShare.privateEventData.privateEvent.id) {
                        selectedType = tmpType;
                    }
                });*/
                if (selectedType) {
                    self.private.privateEvent = selectedType;
                    $log.info("Inside datashare", angular.toJson(self.private.privateEvent));
                }

            });
        };

        self.closeModal = function() {
          $('#privateDescriptionModal').modal('hide');
        };
        
        self.venueRefId = function (venue) {
            if (!venue.uniqueName) {
                return venue.id;
            } else {
                return venue.uniqueName;
            }
        };

        self.init();

    }]);
