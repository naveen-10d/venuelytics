"use strict";
app.controller('drinkServiceController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', '$rootScope', 'ngMeta', 'VenueService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, $rootScope, ngMeta, venueService) {

        var self = $scope;
        self.selectedDrinkItems = [];
        self.drinkType = 'Delivery';
        self.drinkCategories = {};
        self.init = function () {

            self.venueDetails = venueService.getVenue($routeParams.venueId);
            self.venueId = self.venueDetails.id;
            ngMeta.setTag('description', self.venueDetails.description + " Drink Services");
            $rootScope.title = self.venueDetails.venueName + " Venuelytics - Drink Services";
            ngMeta.setTitle($rootScope.title);

            self.selectedCity = self.venueDetails.city;
            $rootScope.serviceTabClear = false;

            if (($rootScope.serviceName === 'DrinkService') || (DataShare.amount !== '')) {
                self.tabClear();
            }

            if ((Object.keys(DataShare.drinkServiceData).length) !== 0) {
                self.drink = DataShare.drinkServiceData;
                self.drinkType = DataShare.serviceTypes;
                self.userSelectedDrinks = DataShare.drinks;
            } else {
                self.tabClear();
            }
            self.getMenus();
            self.getDrink();
            self.getVenueType();
            setTimeout(function () {
                self.getSelectedTab();
            }, 600);
        };

        self.getMenus = function () {
            AjaxService.getInfo(self.venueId).then(function (response) {
                self.drinksWineListuUrl = response.data["Drinks.wineListuUrl"];
                self.drinksHappyHourDrinkUrl = response.data["Drinks.happyHourDrinkUrl"];
                self.drinksBeerMenuUrl = response.data["Drinks.beerMenuUrl"];
                self.drinksMenuUrl = response.data["Drinks.menuUrl"];
                self.drinksCocktailsUrl = response.data["Drinks.cocktailsUrl"];
                self.enabledPayment = response.data["Advance.enabledPayment"];
                self.drinkPickup = response.data["Drinks.DrinksPickup.enable"];
                self.specificDrink = response.data["Drinks.SpecificServiceDrink.enable"];
                self.preOrder = response.data["Drinks.PreOrdering.enable"];
                if ((self.preOrder === 'N') || (self.preOrder === 'n')) {
                    self.orderDisable = true;
                }
            });
        };

        self.getSelectedTab = function () {
            $(".service-btn .card").removeClass("tabSelected");
            $("#drinkServices > .card").addClass("tabSelected");
        };


        self.tabClear = function () {
            DataShare.drinkServiceData = {};
            self.isDrinkFocused = '';
            self.drink = {};
            DataShare.serviceTypes = '';
            DataShare.foodService = [];
            DataShare.drinks = '';
            self.drinkType = 'Delivery';
            DataShare.selectedDrinks = '';
        };

        self.menuUrlSelection = function (menu) {
            var data = menu.split(".");
            var splitLength = data.length;
            if (data[0] === "www") {
                menu = 'http://' + menu;
                $window.open(menu, '_blank');
            } else if (data[splitLength - 1] === "jpg" || data[splitLength - 1] === "png") {
                self.menuImageUrl = menu;
                $('#drinkMenuModal').modal('show');
            } else {
                $window.open(menu, '_blank');
            }
        };

        self.userSelectedDrinks = [];

        self.getDrink = function () {
            AjaxService.getProductsByType(self.venueId, 'Drinks').then(function (response) {
                self.drinkDetails = response.data;
                
                if ((Object.keys(DataShare.selectedDrinks).length) !== 0) {
                    self.editDrinkItems = DataShare.selectedDrinks;
                    angular.forEach(self.editDrinkItems, function (value, key) {
                        angular.forEach(self.drinkDetails, function (value1, key1) {
                            if (value.id === value1.id) {
                                self.drinkDetails.splice(key1, 1);
                            }
                        });
                    });
                    angular.forEach(self.drinkDetails, function (value2) {
                        self.editDrinkItems.push(value2);
                    });
                    self.drinkDetails = self.editDrinkItems;
                }
            });
        };

        self.showPopUp = function (value) {
            $rootScope.description = value;
        };

        self.getVenueType = function () {
            AjaxService.getVenues(self.venueId, null, null).then(function (response) {
                self.venueType = response.venueType;
                var venueTypeSplit = self.venueType.split(',');
                angular.forEach(venueTypeSplit, function (value1) {
                    var value = value1.trim();
                    if (value === 'CLUB') {
                        self.venueTypesClub = value;
                    } else if (value === 'BAR') {
                        self.venueTypesBar = value;
                    } else if (value === 'LOUNGE') {
                        self.venueTypesLounge = value;
                    } else if (value === 'BOWLING') {
                        self.venueTypeBowling = value;
                    } else if (value === 'CASINO') {
                        self.venueTypeCasino = value;
                    } else if (value === 'RESTAURANT') {
                        self.venueTypeRestaurant = value;
                    }
                });
            });
        };

        self.drinkSave = function () {

            $rootScope.serviceTabClear = true;
            var parsedend = moment().format("MM-DD-YYYY");
            var date = new Date(moment(parsedend, 'MM-DD-YYYY').format());
            var dateValue = moment(date).format("YYYY-MM-DDTHH:mm:ss");
            var fullName = self.drink.firstName + " " + self.drink.lastName;
            var authBase64Str = window.btoa(fullName + ':' + self.drink.emailId + ':' + self.drink.mobileNumber);
            DataShare.authBase64Str = authBase64Str;
            DataShare.drinkServiceData = self.drink;
            DataShare.drinks = self.userSelectedDrinks;
            var tableNumber;
            if ((self.drink.tableNumber) && (self.drink.seatNumber)) {
                tableNumber = self.drink.tableNumber + "-" + self.drink.seatNumber;
            } else if (self.drink.tableNumber) {
                tableNumber = self.drink.tableNumber;
            } else {
                tableNumber = self.drink.laneNumber;
            }
            self.serviceJSON = {
                "serviceType": 'Drinks',
                "venueNumber": self.venueId,
                "reason": "",
                "contactNumber": self.drink.mobileNumber,
                "contactEmail": self.drink.emailId,
                "contactZipcode": "",
                "noOfGuests": 0,
                "noOfMaleGuests": 0,
                "noOfFemaleGuests": 0,
                "budget": 0,
                "serviceInstructions": self.drink.instructions,
                "status": "REQUEST",
                "serviceDetail": null,
                "fulfillmentDate": dateValue,
                "durationInMinutes": 0,
                "deliveryType": self.drinkType,
                "deliveryAddress": tableNumber,
                "deliveryInstructions": null,
                "order": {
                    "venueNumber": self.venueId,
                    "orderDate": dateValue,
                    "orderItems": []
                },
                "prebooking": false,
                "employeeName": "",
                "visitorName": fullName
            };
            angular.forEach(self.drinkDetails, function (value, key) {
                if (value.quantity) {
                    var items = {
                        "venueNumber": self.venueId,
                        "productId": value.id,
                        "productType": value.productType,
                        "quantity": value.quantity,
                        "name": value.name
                    };
                    self.selectedDrinkItems.push(value);
                    self.serviceJSON.order.orderItems.push(items);
                }
            });
            DataShare.serviceTypes = self.drinkType;
            DataShare.payloadObject = self.serviceJSON;
            DataShare.enablePayment = self.enabledPayment;
            DataShare.selectedDrinks = self.selectedDrinkItems;
            $location.url(self.selectedCity + "/" + self.venueRefId(self.venueDetails) + "/confirmDrinkService");
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
