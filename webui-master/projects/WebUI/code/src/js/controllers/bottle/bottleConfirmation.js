/**
 * @author Saravanakumar
 * @date 07-JULY-2017
 */
"use strict";
app.controller('ConfirmReservationController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService', 'TaxNFeesService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService, TaxNFeesService) {

        $log.log('Inside Confirm Reservation Controller.');

        var self = $scope;
        self.selectTables = [];
        self.selectBottleOrders = [];
        self.availableAmount = 0;
        self.paymentData = {};
        self.serviceType = "Bottle";
        self.init = function () {
            $rootScope.embeddedFlag = venueService.getProperty($routeParams.venueId, 'embed');
            self.venueDetails = venueService.getVenue($routeParams.venueId);
            $rootScope.blackTheme = venueService.getVenueInfo(self.venueDetails.id, 'ui.service.theme') || '';
            $rootScope.description = self.venueDetails.description;
            DataShare.venueDetails = self.venueDetails;
            self.selectedCity = DataShare.venueDetails.city;
            DataShare.successDescription = 'description', self.venueDetails.description + " Bottle Confirmation";
            ngMeta.setTag('description', self.venueDetails.description + " Bottle Confirmation");
            $rootScope.title = self.venueDetails.venueName + " Venuelytics - Bottle Services Confirmation & Payment";
            ngMeta.setTitle($rootScope.title);
            self.orderId = -1;
            self.venueId = self.venueDetails.id;
            self.userData = DataShare.bottleServiceData;


            self.payloadObject = DataShare.payloadObject;


            self.availableAmount = $window.localStorage.getItem("bottleAmount");
            if (!isNaN(self.availableAmount)) {
                self.availableAmount = 0;
            }
            self.taxDate = moment(self.userData.requestedDate).format('YYYYMMDD');
            self.selectBottleOrders = DataShare.selectBottle;
            self.enablePayment = DataShare.enablePayment;
            self.venueName = DataShare.venueDetails.venueName;

            var fullName = self.userData.userFirstName + " " + self.userData.userLastName;
            self.authBase64Str = window.btoa(fullName + ':' + self.userData.email + ':' + self.userData.mobile);

            self.redirectUrl = self.selectedCity + "/webui-success/" + self.venueRefId(self.venueDetails) + '/bottle-service';
            self.payAtVenueUrl = self.selectedCity + '/' + self.venueRefId(self.venueDetails) + '/orderConfirm';

            angular.forEach(self.selectBottleOrders, function (value1, key1) {
                self.availableAmount += +value1.total;
            });

            if (self.payloadObject !== '') {
                angular.forEach(self.payloadObject.order.orderItems, function (value, key) {
                    if (value.productType === 'VenueMap') {
                        var items = {
                            "venueNumber": value.venueNumber,
                            "productId": value.productId,
                            "productType": value.productType,
                            "quantity": value.quantity,
                            "name": value.name,
                            "totalPrice": value.totalPrice
                        };
                        if (!isNaN(value.totalPrice)) {
                            self.availableAmount += value.totalPrice;
                        }
                        self.selectTables.push(items);
                    }
                });
            }

            AjaxService.getTaxType(self.venueId, self.taxDate).then(function (response) {
                self.taxNFeeRates = response.data;
                self.paymentData = TaxNFeesService.calculateTotalAmount(self.taxNFeeRates, parseFloat(self.availableAmount), "Bottle", '');
                DataShare.paymentObject = self.paymentData;
                DataShare.paymentObject.paid = true;
            });
        };

        //Get Tax

        self.createBottleSave = function () {
            AjaxService.placeServiceOrder(self.venueId, self.payloadObject, self.authBase64Str).then(function (response) {
                if (response.status == 200 || response.status == 201) {
                    self.orderId = response.data.id;
                    DataShare.paymentObject.paid = false;
                    $location.url(self.selectedCity + '/webui-success/' + self.venueRefId(self.venueDetails) + '/bottle-service');
                } else {
                    if (response.data && response.data.message) {
                        alert("Saving order failed with message: " + response.data.message );
                    }
                }
                
            });


        };

        self.editConfirmPage = function () {
            $location.url("/cities/" + self.selectedCity + "/" + self.venueRefId(self.venueDetails) + '/bottle-service');
        };

        self.paymentEnable = function () {
            $location.url(self.selectedCity + "/bottlePayment/" + self.venueRefId(self.venueDetails));
        };

        self.backToReservation = function () {
            $rootScope.serviceName = 'BottleService';
            DataShare.editBottle = 'false';
            DataShare.bottleServiceData = '';
            if (self.enablePayment && self.payloadObject.id && self.payloadObject.status === 'PENDING_PAYMENT' ) {
                 AjaxService.cancelOrder(self.venueId, self.payloadObject.id, self.authBase64Str);
            }
            $location.url('/cities/' + self.selectedCity + '/' + self.venueRefId(self.venueDetails) + '/bottle-service');
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