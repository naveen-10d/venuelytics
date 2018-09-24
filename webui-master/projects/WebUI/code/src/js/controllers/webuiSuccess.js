"use strict";
app.controller('WebuiSuccessController', ['$log', 'TaxNFeesService', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService',
    function ($log, TaxNFeesService, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService) {

        var self = $scope;
        self.paymentData = {};

        self.init = function () {
            $scope.paymentData = DataShare.paymentObject;
            self.venueDetails = venueService.getVenue($routeParams.venueId);
            $rootScope.description = self.venueDetails.description;
            ngMeta.setTag(DataShare.successDescription);
            $rootScope.title = self.venueDetails.venueName + " Venuelytics - Success page";
            ngMeta.setTitle($rootScope.title);
            self.city = self.venueDetails.city;
        };

        self.backToWebUISuccess = function () {
            DataShare.clearmethod();
            $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/' + $routeParams.tabName);
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