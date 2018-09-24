"use strict";
app.controller('WineToHomeCtrl', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService', 'DialogService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService, DialogService) {


        var self = $scope;
        self.selectedDrinkItems = [];
      
        self.wineList = [];
        self.userSelectedDrinks = [];
        self.guest = {};
        self.init = function () {

            self.venueDetails = venueService.getVenue($routeParams.venueId);
            self.venueId = self.venueDetails.id;
            ngMeta.setTag('description', self.venueDetails.description + " Wine To Home Services");
            $rootScope.title = self.venueDetails.venueName + " Venuelytics - Wine To Home Services";
            ngMeta.setTitle($rootScope.title);

            self.selectedCity = self.venueDetails.city;
            $rootScope.serviceTabClear = false;

            self.venueName = "demo";

            if ((Object.keys(DataShare.guest).length) !== 0) {
                self.guest = DataShare.guest;
                self.drinkType = DataShare.serviceTypes;
                self.userSelectedDrinks = DataShare.userSelectedDrinks;
            } else {
                self.tabClear();
            }
           
            self.getWines();
            setTimeout(function () {
                self.getSelectedTab();
            }, 600);
        };


        self.getSelectedTab = function () {
            $(".service-btn .card").removeClass("tabSelected");
            $("#wineToHome > .card").addClass("tabSelected");
        };

        self.tabClear = function () {
            DataShare.guest = {};
            DataShare.serviceTypes = '';  
            DataShare.userSelectedDrinks = [];
            self.drinkType = 'Delivery';
        };

        self.getWines = function () {
            AjaxService.getWineToHome(self.venueName).then(function (response) {
                var wineList = response.data.products;
                var wineProducts = [];
                for (var j = 0; j < wineList.length; j++) {
                    for (var i = 0; i < wineList[j].quantity.length; i++) {
                        var cloneObj = $.extend({}, wineList[j]);
                        cloneObj.price = wineList[j].price[i];
                        cloneObj.packageQuantity = wineList[j].quantity[i];
                        cloneObj.shippingHandling = wineList[j].shippingHandling[i];
                        cloneObj.tax = wineList[j].tax[i];
                        cloneObj.id = wineList[j].id + '_'+cloneObj.packageQuantity;
                        cloneObj.refId = wineList[j].id;
                        cloneObj.smallUrl =wineList[j].smallUrl;
                        cloneObj.originalCategory =cloneObj.category;
                        cloneObj.category =   cloneObj.category +' (' +cloneObj.packageQuantity +' Pack)';
                        wineProducts.push(cloneObj);
                    }
                }   
                  self.wineList = wineProducts;
            });
            

            if ((Object.keys(DataShare.userSelectedDrinks).length) !== 0) {
                var editDrinkItems = DataShare.userSelectedDrinks;
                angular.forEach(editDrinkItems, function (value, key) {
                    angular.forEach(self.wineList, function (value1, key1) {
                        if (value.id === value1.id) {
                            self.wineList.splice(key1, 1);
                        }
                    });
                });
               
            }
        };

        self.showPopUp = function (value) {
            $rootScope.description = value;
        };
        self.wineSave = function() {
            $rootScope.serviceTabClear = true;
            var fullName = self.guest.firstName + " " + self.guest.lastName;
            var authBase64Str = window.btoa(fullName + ':' + self.guest.email + ':' + self.guest.mobileNumber);
            DataShare.authBase64Str = authBase64Str;
            DataShare.guest = self.guest;
           
            if (self.userSelectedDrinks) {
                for (var i = 0; i < self.userSelectedDrinks.length; i++) {
                    self.subTotal += +self.userSelectedDrinks[i].total;
                    self.taxes += self.userSelectedDrinks[i].tax * self.userSelectedDrinks[i].quantity;
                    self.shippingHandling += self.userSelectedDrinks[i].shippingHandling * self.userSelectedDrinks[i].quantity;

                }
            }
            self.serviceJSON = {
                "venueName": self.venueName,
                "orderDetail": [],
                "subTotal": 0,
                "shippingHandling": 0.0,
                "tax": 0.0,
                "total": 0.0,
                "shippingAddress": {},
                "billingAddress": {},
                "paymentInfo": {},
            };
            angular.forEach(self.userSelectedDrinks, function (value, key) {
                if (value.quantity) {
                    var items = {
                        "id": value.refId,
                        "bottles": value.packageQuantity,
                        "quantity": value.quantity,
                        "name": value.name
                    };
                    
                    self.serviceJSON.orderDetail.push(items);
                }
            });
            DataShare.serviceTypes = self.drinkType;
            DataShare.payloadObject = self.serviceJSON;
           
            DataShare.userSelectedDrinks = self.userSelectedDrinks;
            $location.url(self.selectedCity + "/" + self.venueRefId(self.venueDetails) + "/confirmWineService");
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
