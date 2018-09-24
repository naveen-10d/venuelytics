"use strict";
app.controller('bachelorConfirmController', ['$log', '$scope',  '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService','TaxNFeesService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService, TaxNFeesService) {


    var self = $scope;
    self.availableAmount = 0;
    self.paymentData = {};
    self.serviceType = "PrivateEvent";
    self.init = function() {
        
        self.venueDetails = venueService.getVenue($routeParams.venueId);
        $rootScope.description = self.venueDetails.description;
        ngMeta.setTag('description', self.venueDetails.description + " Bachelor party Confirmation");
        $rootScope.title = self.venueDetails.venueName+ " Venuelytics - Bachelor party Confirmation & Payment";
        ngMeta.setTitle($rootScope.title);
        self.city = $self.venueDetails.city;
        self.venueId = self.venueDetails.id;
        self.bachelorData = DataShare.partyServiceData;
        self.venueName = self.venueDetails.venueName;
        self.availableAmount = $window.localStorage.getItem("bachelorAmount");
        if (!isNaN(self.availableAmount)  ) {
            self.availableAmount = 0;
        }
        var fullName = self.bachelorData.userFirstName + " " + self.bachelorData.userLastName;
        self.authBase64Str = window.btoa(fullName + ':' + self.bachelorData.email + ':' + self.bachelorData.mobile);
        if(DataShare.privateOrderItem !== ''){
            self.availableAmount = DataShare.privateOrderItem.price;
        }                    
        self.privateOrderItem = DataShare.privateOrderItem;
        self.taxDate = moment(self.bachelorData.orderDate).format('YYYYMMDD');
        self.payloadObject = DataShare.payloadObject;
        self.enabledPayment = DataShare.enablePayment;

        AjaxService.getTaxType(self.venueId, self.taxDate).then(function(response) {
            self.taxNFeeRates = response.data;
            self.paymentData = TaxNFeesService.calculateTotalAmount(self.taxNFeeRates, parseFloat(self.availableAmount), "PrivateEvent", '');
        });
        self.redirectUrl = self.city +"/bachelorSuccess/" + self.venueRefId(self.venueDetails);
        self.payAtVenueUrl = self.city +'/bachelor-success/'+ self.venueRefId(self.venueDetails);
        
    };

            

    self.editBachelorParty = function() {
        $location.url("/cities/" + self.city + "/" + self.venueRefId(self.venueDetails)+ '/bachelor-party');
    };

    self.paymentEnable = function() {
        $location.url('/' + self.city + '/bachelorPayment/' + self.venueRefId(self.venueDetails));
    };

    self.venueRefId = function(venue) {
        if (!venue.uniqueName ) {
            return venue.id;
        } else {
            return venue.uniqueName;
        }
    };
    self.backToBachelor = function() {
      $rootScope.serviceName = 'BachelorParty';
      DataShare.partyServiceData = '';
      $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/bachelor-party');
    };
 
    self.init();
}]);
