"use strict";
app.controller('WineConfirmController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService', 'DialogService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService, DialogService) {

    var self = $scope;
   
   
    self.paymentData = {};

    self.billingAddress ={country:"USA", address2: ""};
    self.creditDetails= {};
    self.serviceType = "Wine2Home";
    self.shippingAddress = {country:"USA", address2: ""};
     self.visaSelected = '';
    self.amexSelected = '';
    self.discoverSelected = '';
    self.masterSelected = '';
    self.sameAsShipping  = false;
   
    self.init = function () {
      
        self.venueDetails = venueService.getVenue($routeParams.venueId);
        self.venueId = self.venueDetails.id;
        $rootScope.blackTheme = venueService.getVenueInfo(self.venueId, 'ui.service.theme') || '';
        $rootScope.description = self.venueDetails.description;
        ngMeta.setTag('description', self.venueDetails.description + " Wine to Home Confirmation");
        $rootScope.title = self.venueDetails.venueName + " Venuelytics - Wine to home Services Confirmation & Payment";
        ngMeta.setTitle($rootScope.title);
        self.city = self.venueDetails.city;
        if (DataShare.payloadObject) {
            self.authBase64Str = DataShare.authBase64Str;
            self.payloadObject = DataShare.payloadObject;
            self.guest = DataShare.guest;
        } else {
            self.authBase64Str ='';
             self.payloadObject = {};
             self.guest = {};
        }
        self.creditDetails.nameOnCard = (self.guest.firstName || "") + " " + (self.guest.lastName || "").trim();
        self.userSelectedDrinks = DataShare.userSelectedDrinks;
        self.venueName = self.venueDetails.venueName;
        self.venueName = "demo";
        DataShare.paymentObject = self.paymentData;
        self.subTotal = 0;
        self.taxes = 0;
        self.shippingHandling = 0;
        
        if (self.userSelectedDrinks) {
            for (var i = 0; i < self.userSelectedDrinks.length; i++) {
                self.subTotal += +self.userSelectedDrinks[i].total;
                self.taxes += self.userSelectedDrinks[i].tax * self.userSelectedDrinks[i].quantity;
                self.shippingHandling += self.userSelectedDrinks[i].shippingHandling * self.userSelectedDrinks[i].quantity;

            }
        }
      $('#ccnumber input').focusout(function() {
        console.log("got event");
       
        self.visaSelected = '';
        self.amexSelected = '';
        self.discoverSelected = '';
        self.masterSelected = '';
         if($('#ccnumber').hasClass( 'visa' )) {
            self.visaSelected = 'active';
        }
        if($('#ccnumber').hasClass( 'amex' )) {
           self.amexSelected = 'active';
        }
        if($('#ccnumber').hasClass( 'discover' )) {
           self.discoverSelected = 'active';
        }
        if($('#ccnumber').hasClass( 'master' )) {
           self.masterSelected = 'active';
        }
       
      });
    };

    self.copyShipping = function() {
        if(!!self.sameAsShipping) {
            self.billingAddress.address1 = self.shippingAddress.address1;
            self.billingAddress.address2 = self.shippingAddress.address2;
            self.billingAddress.city = self.shippingAddress.city;
            self.billingAddress.state = self.shippingAddress.state;
            self.billingAddress.zip = self.shippingAddress.zip;


        }
    };

    self.doPayment = function(form) {
        if (form.$invalid) {
            DialogService.showError("Payment", "There is missing data on the screen. Please complete the form. ");
            return;
        }
        var mmyy = $("#cc-exp").val();
        mmyy = mmyy.split("/");
        self.creditDetails.expMonth = mmyy[0];
        self.creditDetails.expYear = mmyy[1];
      
        self.shippingAddress.venueName = 'demo';//self.venueName;
        self.payloadObject.shippingAddress = self.shippingAddress;
        self.payloadObject.subTotal = self.subTotal;
        self.payloadObject.tax = self.taxes;
        self.payloadObject.shippingHandling = self.shippingHandling;
        self.payloadObject.shippingAddress.firstName = self.guest.firstName;
        self.payloadObject.shippingAddress.lastName = self.guest.lastName;
        self.payloadObject.shippingAddress.phone = self.guest.mobileNumber;
        self.payloadObject.total = self.subTotal + self.taxes + self.shippingHandling;
        self.payloadObject.paymentInfo = self.creditDetails;
       
        
        self.payloadObject.email = self.guest.email;
        if (!!self.sameAsShipping) {
            self.payloadObject.billingAddress = $.extend({}, self.shippingAddress);
        } else {
            self.payloadObject.billingAddress = $.extend({}, self.billingAddress);
        }
        self.payloadObject.billingAddress.firstName = self.guest.firstName;
        self.payloadObject.billingAddress.lastName = self.guest.lastName;
        self.payloadObject.billingAddress.phone = self.guest.mobileNumber;
      

       AjaxService.validationShippingAddress(self.shippingAddress).then(function (response) {
            if (response.status != 200) {
                DialogService.showError("Address Validation Failed", "We don't ship to the address given.");
            } else {
              // DialogService.showSuccess("Address Validation Successful", "We ship to the address given.");
              self.placeWine2HomeOrder();
            }
        }, function(error) {
            DialogService.showSuccess("Address Validation Failed", "We don't ship to the address given.");
        });
       
    };

    self.placeWine2HomeOrder = function() {
         if (!self.payloadObject.orderNumber) {
            AjaxService.placeServiceOrderWine2Home(self.payloadObject).then(function (response) {
                 if (response.status != 200) {
                    DialogService.showError("Wine Ordering", "Wine Ordering failed." + response.data.result);
                 } else {
                    self.payloadObject.orderNumber = response.data.orderNumber;
                    self.createVASOrder(self.payloadObject, response.data.displayMessage);
                 }
            }, function(error) {
                  DialogService.showError("Wine Ordering", "Wine Ordering failed.");
            });
        } else {
              self.createVASOrder(self.payloadObject, response.data.displayMessage);
        }
    };
    self.createVASOrder = function(payloadObject, deliveryInstructions) {
        var orderDate =  new Date();
        var vasPayload = {
            "serviceType" : "Wine2Home",
            "venueNumber" : self.venueId,
            "visitorName" : self.guest.firstName + " " + self.guest.lastName,
            "contactNumber" : self.guest.mobileNumber,
            "contactEmail" : self.guest.email,
            "status" : "REQUEST",
            "deliveryType" : "Delivery",
            "deliveryAddress" : JSON.stringify(self.shippingAddress),
            "deliveryInstructions": deliveryInstructions,
            "fulfillmentDate": orderDate,
            "order" : {
                "venueNumber" : self.venueId,
                "orderNumber" :payloadObject.orderNumber,
                "orderDate" : orderDate,
                "totalItems" : payloadObject.orderDetail.length,
                "originalPrice" : self.payloadObject.subTotal,
                "totalCost" : self.payloadObject.subTotal,
                "totalTaxes" : self.payloadObject.tax,
                "totalFees" : self.payloadObject.shippingHandling,
                "finalTransactionAmount" : self.payloadObject.total,
                "orderItems" : [], 

            }
        };
        var userSelectedDrinks = DataShare.userSelectedDrinks;
        for(var oi = 0; oi < userSelectedDrinks.length; oi++) {
            var orderItem =    {
              "venueNumber" : self.venueId,
              "productType" : "Wine2Home",
              "sku" : userSelectedDrinks[oi].id,
              "quantity" : userSelectedDrinks[oi].quantity,
              "originalItemPrice" : userSelectedDrinks[oi].price,
              "finalItemPrice" : userSelectedDrinks[oi].price,
              "totalPrice" : userSelectedDrinks[oi].price + userSelectedDrinks[oi].tax + userSelectedDrinks[oi].shippingHandling,
              "status" : "COMPLETED",
              "name" : userSelectedDrinks[oi].name,
              "category" : userSelectedDrinks[oi].type,
              "subCategory" : userSelectedDrinks[oi].originalCategory,
              "itemCategory" : userSelectedDrinks[oi].category,
              "brand" : userSelectedDrinks[oi].brand,
              "description" : userSelectedDrinks[oi].description
            };
            vasPayload.order.orderItems.push(orderItem); 
        }

        AjaxService.placeServiceOrder(self.venueId, vasPayload, self.authBase64Str).then(function(response) {
            if (response.status == 200 || response.status == 201) {
                self.orderId = response.data.id;
                $location.url(self.selectedCity + '/webui-success/' + self.venueRefId(self.venueDetails) + '/wineToHome');
            } else {
                if (response.data && response.data.message) {
                    alert("Order placed successfully. Tracking system failed with message: " + response.data.message);
                    DialogService.closeModals();
                    $location.url(self.selectedCity + '/webui-success/' + self.venueRefId(self.venueDetails) + '/wineToHome');
                }
            }

        });

    }
    self.continueToPayment = function() {
        $location.url(self.city + "/winePayment/" + self.venueRefId(self.venueDetails));
    };

    self.editWinePage = function () {
        $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/wineToHome');
    };

    self.backToDrink = function () {
        $rootScope.serviceName = 'WineToHome';
        DataShare.guest = {};
        $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/wineToHome');
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
