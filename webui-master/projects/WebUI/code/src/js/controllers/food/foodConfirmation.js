"use strict";
app.controller('FoodConfirmController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService', 'TaxNFeesService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService, TaxNFeesService) {


        var self = $scope;
        self.availableAmount = 0;
        self.paymentData = {};
        self.serviceType = "Food";
        self.init = function () {


            self.venueDetails = venueService.getVenue($routeParams.venueId);
            self.venueId = self.venueDetails.id;
            $rootScope.blackTheme = venueService.getVenueInfo(self.venueId, 'ui.service.theme') || '';

            $rootScope.description = self.venueDetails.description;
            DataShare.successDescription = 'description', self.venueDetails.description + " Food Confirmation";
            ngMeta.setTag('description', self.venueDetails.description + " Food Confirmation");
            $rootScope.title = self.venueDetails.venueName + " Venuelytics - Food Services Confirmation & Payment";
            ngMeta.setTitle($rootScope.title);
            self.city = self.venueDetails.city;

            self.payAmounts = $window.localStorage.getItem("amount");
            self.payloadObject = DataShare.payloadObject;
            self.foodServiceDetails = DataShare.foodServiceData;
            self.selectedFoodItems = DataShare.selectedFoods;
            self.enabledPayment = DataShare.enablePayment;
            self.venueName = self.venueDetails.venueName;
            self.taxDate = moment().format('YYYYMMDD');

            var fullName = self.foodServiceDetails.firstName + " " + self.foodServiceDetails.lastName;
            self.authBase64Str = window.btoa(fullName + ':' + self.foodServiceDetails.emailId + ':' + self.foodServiceDetails.mobileNumber);


            angular.forEach(self.selectedFoodItems, function (value1, key1) {
                var total = parseFloat(value1.total);
                self.availableAmount += total;
            });

            AjaxService.getTaxType(self.venueId, self.taxDate).then(function (response) {
                self.taxNFeeRates = response.data;
                self.paymentData = TaxNFeesService.calculateTotalAmount(self.taxNFeeRates, parseFloat(self.availableAmount), "Food", '');
                DataShare.paymentObject = self.paymentData;
                DataShare.paymentObject.paid = true;
            });
            self.redirectUrl = self.city + "/webui-success/" + self.venueRefId(self.venueDetails) + '/food-services';
            self.payAtVenueUrl = self.city + '/food-success/' + self.venueRefId(self.venueDetails);
        };

        self.foodServiceSave = function () {

            AjaxService.placeServiceOrder(self.venueId, self.payloadObject, self.authBase64Str).then(function (response) {
                DataShare.paymentObject.paid = false;
                self.orderId = response.data.id;
                $location.url(self.city + '/webui-success/' + self.venueRefId(self.venueDetails) + '/food-services');
            });

        };

        self.editFoodPage = function () {
            $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/food-services');
        };

        self.paymentEnabled = function () {
            $location.url(self.city + "/foodPayment/" + self.venueRefId(self.venueDetails));
        };

        self.backToFood = function () {
            $rootScope.serviceName = 'FoodService';
            DataShare.foodServiceData = '';
            $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/food-services');
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
