"use strict";
app.controller('ReservationConfirmController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope','ngMeta', 'VenueService','TaxNFeesService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService, TaxNFeesService ) {

	$log.log('Inside Reservation Controller.');

	var self = $scope;
    self.availableAmount = 0;
    self.paymentData = {};
    self.serviceType ="Reservation";
    self.init = function() {
       
        self.venueDetails = venueService.getVenue($routeParams.venueId);
        self.venueId = self.venueDetails.id;
       
        $rootScope.description = self.venueDetails.description;
        ngMeta.setTag('description', self.venueDetails.description + " Reservation Confirmation");
        $rootScope.title = self.venueDetails.venueName + " Venuelytics - Reservation Confirmation & Payment";
        ngMeta.setTitle($rootScope.title);
        self.city = self.venueDetails.city;
        
        self.reservationData = DataShare.reservationData;
        self.venueName = self.venueDetails.venueName;
        $rootScope.blackTheme = venueService.getVenueInfo(self.venueId, 'ui.service.theme') || '';
       
        var fullName = self.reservationData.userFirstName + " " + self.reservationData.userLastName;
        self.authBase64Str = window.btoa(fullName + ':' + self.reservationData.email + ':' + self.reservationData.mobile);

        self.taxDate = moment(self.reservationData.orderDate).format('YYYYMMDD');
        self.payloadObject = DataShare.payloadObject;
        self.selectedPackage = {name: "ReservationPackage"};
        self.tickets = {quantity: 0};

        if (self.payloadObject && self.payloadObject.order && self.payloadObject.order.orderItems) {
            angular.forEach(self.payloadObject.order.orderItems, function (item, key) {
                var total = parseFloat(item.totalPrice);
                if (item.productType === "DrinkTicket") {
                    self.tickets = item;
                } else if (item.productType === "ReservationPackage") {
                    self.selectedPackage = item;
                }
                self.availableAmount += total;
            });
        }

        self.enabledPayment = DataShare.enablePayment;
       
        AjaxService.getTaxType(self.venueId, self.taxDate).then(function(response) {
            self.taxNFeeRates = response.data;
            self.paymentData = TaxNFeesService.calculateTotalAmount(self.taxNFeeRates, parseFloat(self.availableAmount), "Reservation", '');
        });
        self.redirectUrl = self.city +"/" + self.venueRefId(self.venueDetails) +"/reservation-payment-success";
        self.payAtVenueUrl = self.city +"/" + self.venueRefId(self.venueDetails) +'/reservation-success';
    };

            

    self.editReservation = function() {
        $location.url("/cities/" + self.city + "/" + self.venueRefId(self.venueDetails) + '/reservation');
    };

     self.saveReservation = function() {
        
        AjaxService.placeServiceOrder(self.venueId, self.payloadObject, self.authBase64Str).then(function(response) {
            if (response.status == 200 || response.status == 201) {
                self.orderId = response.data.id;
                $location.url("/"+self.city + "/"+ self.venueRefId(self.venueDetails) +'/reservation-success');
            } else {
                if (response.data && response.data.message) {
                    alert("Saving order failed with message: " + response.data.message );
                }
            }
        });
    };

    self.paymentEnable = function() {
        $location.url('/' + self.city + "/" +self.venueRefId(self.venueDetails) +'/reservation-payment');
    };

    
    self.backToReservation = function() {
      $rootScope.serviceName = 'Reservation';
      DataShare.reservationData = '';
      $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/reservation');
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
