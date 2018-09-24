"use strict";
app.controller('foodServiceController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService) {

        $log.log('Inside Food Service Controller.');

        var self = $scope;
        self.selectedFoodItems = [];
        self.selectedFoodList = [];
        self.foodType = 'Delivery';
        self.foodCategories = {};
        
        self.init = function () {

            self.venueDetails = venueService.getVenue($routeParams.venueId);
            self.venueId = self.venueDetails.id;
            ngMeta.setTag('description', self.venueDetails.description + " Food Services");
            $rootScope.title = self.venueDetails.venueName + " Venuelytics - Food Services";
            ngMeta.setTitle($rootScope.title);

            self.selectedCity = self.venueDetails.city;
            $rootScope.serviceTabClear = false;
            if (($rootScope.serviceName === 'FoodService') || (DataShare.amount !== '')) {
                self.tabClear();
            }
            if ((Object.keys(DataShare.foodServiceData).length) !== 0) {
                self.food = DataShare.foodServiceData;
                self.foodType = DataShare.serviceTypes;
                self.selectedFoodList = DataShare.foodService;
            } else {
                self.tabClear();
            }
            self.getMenus();
            self.getFood();
            self.getVenueType();
            setTimeout(function () {
                self.getSelectedTab();
            }, 600);
        };

        self.tabClear = function () {
            DataShare.foodServiceData = {};
            self.isFoodFocused = '';
            self.food = {};
            DataShare.serviceTypes = '';
            DataShare.foodService = '';
            self.foodType = 'Delivery';
            DataShare.selectedFoods = '';
        };

        self.getSelectedTab = function () {
            $(".service-btn .card").removeClass("tabSelected");
            $("#foodServices > .card").addClass("tabSelected");
        };

        self.getMenus = function () {
            AjaxService.getInfo(self.venueId).then(function (response) {
                self.foodBreakFastUrl = response.data["Food.breakFastUrl"];
                self.foodBranchUrl = response.data["Food.brunchUrl"];
                self.foodStartersUrl = response.data["Food.startersUrl"];
                self.foodMenuUrl = response.data["Food.menuUrl"];
                self.foodHappyHourUrl = response.data["Food.happyHourUrl"];
                self.foodDinnerUrl = response.data["Food.dinnerUrl"];
                self.foodLunchUrl = response.data["Food.lunchUrl"];
                self.foodDessertsUrl = response.data["Food.dessertsUrl"];
                self.foodAppetizsersUrl = response.data["Food.appetizsersUrl"];
                self.foodGlutenfree = response.data["Food.glutenfree"];
                self.enabledPayment = response.data["Advance.enabledPayment"];
                self.foodPickup = response.data["Food.FoodPickup.enable"];
                self.specificFood = response.data["Food.SpecificServiceFood.enable"];
                self.preOrder = response.data["Food.PreOrdering.enable"];
                if ((self.preOrder === 'N') || (self.preOrder === 'n')) {
                    self.orderDisable = true;
                }
            });
        };

        if (DataShare.foodFocused !== '') {
            self.isFoodFocused = DataShare.foodFocused;
        }

        self.menuUrlSelection = function (menu) {
            var data = menu.split(".");
            var splitLength = data.length;
            if (data[0] === "www") {
                menu = 'http://' + menu;
                $window.open(menu, '_blank');
                console.log("menu" + menu);
            } else if (data[splitLength - 1] === "jpg" || data[splitLength - 1] === "png") {
                $rootScope.menuImageUrl = menu;
                $('#foodMenuModal').modal('show');
            } else {
                $window.open(menu, '_blank');
            }
        };

        self.showPopUp = function (value) {
            $rootScope.description = value;
        };
       
        self.getFood = function () {
            AjaxService.getProductsByType(self.venueId, 'Food').then(function (response) {
                self.foodDetails = response.data;
            
                if ((Object.keys(DataShare.selectedFoods).length) !== 0) {
                    self.editFoodItems = DataShare.selectedFoods;
                    angular.forEach(self.editFoodItems, function (value, key) {
                        angular.forEach(self.foodDetails, function (value1, key1) {
                            if (value.id === value1.id) {
                                self.foodDetails.splice(key1, 1);
                            }
                        });
                    });
                    angular.forEach(self.foodDetails, function (value2) {
                        self.editFoodItems.push(value2);
                    });
                    self.foodDetails = self.editFoodItems;
                }
            });
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

        self.foodSave = function () {
            $rootScope.serviceTabClear = true;
            var parsedend = moment().format("MM-DD-YYYY");
            var date = new Date(moment(parsedend, 'MM-DD-YYYY').format());
            var dateValue = moment(date).format("YYYY-MM-DDTHH:mm:ss");
            var fullName = self.food.firstName + " " + self.food.lastName;
            var authBase64Str = window.btoa(fullName + ':' + self.food.emailId + ':' + self.food.mobileNumber);
            DataShare.authBase64Str = authBase64Str;
            DataShare.foodServiceData = self.food;
            DataShare.foodService = self.selectedFoodList;
            var tableNumber;
            if ((self.food.tableNumber) && (self.food.seatNumber)) {
                tableNumber = self.food.tableNumber + "-" + self.food.seatNumber;
            } else if (self.food.tableNumber) {
                tableNumber = self.food.tableNumber;
            } else {
                tableNumber = self.food.laneNumber;
            }
            self.serviceJSON = {
                "serviceType": 'Food',
                "venueNumber": self.venueId,
                "reason": "",
                "contactNumber": self.food.mobileNumber,
                "contactEmail": self.food.emailId,
                "contactZipcode": "",
                "noOfGuests": 0,
                "noOfMaleGuests": 0,
                "noOfFemaleGuests": 0,
                "budget": 0,
                "hostEmployeeId": -1,
                "hasBid": "N",
                "bidStatus": null,
                "serviceInstructions": self.food.instructions,
                "status": "REQUEST",
                "serviceDetail": null,
                "fulfillmentDate": dateValue,
                "durationInMinutes": 0,
                "deliveryType": self.foodType,
                "deliveryAddress": tableNumber,
                "deliveryInstructions": null,
                "rating": -1,
                "ratingComment": null,
                "ratingDateTime": null,
                "order": {
                    "venueNumber": self.venueId,
                    "orderDate": dateValue,
                    "orderItems": []
                },
                "prebooking": false,
                "employeeName": "",
                "visitorName": fullName
            };
            angular.forEach(self.foodDetails, function (value, key) {
                if (value.quantity) {
                    var items = {
                        "venueNumber": self.venueId,
                        "productId": value.id,
                        "productType": value.productType,
                        "quantity": value.quantity,
                        "name": value.name
                    };
                    self.selectedFoodItems.push(value);
                    self.serviceJSON.order.orderItems.push(items);
                }
            });
            DataShare.serviceTypes = self.foodType;
            DataShare.payloadObject = self.serviceJSON;
            DataShare.enablePayment = self.enabledPayment;
            DataShare.selectedFoods = self.selectedFoodItems;
            $location.url(self.selectedCity + "/" + self.venueRefId(self.venueDetails) + "/confirmFoodService");
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
