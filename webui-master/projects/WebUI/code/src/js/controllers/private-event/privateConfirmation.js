/**
 * @author Saravanakumar
 * @date 07-JULY-2017
 */
"use strict";
app.controller('PrivateConfirmController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService) {

        $log.log('Inside Private Confirm Controller.');

        var self = $scope;
        self.serviceType = "PrivateEvent";
        self.init = function () {

            self.venueDetails = venueService.getVenue($routeParams.venueId);
            self.venueId = self.venueDetails.id;
            $rootScope.description = self.venueDetails.description;
            $rootScope.blackTheme = venueService.getVenueInfo(self.venueId, 'ui.service.theme') || '';
            DataShare.successDescription = 'description', self.venueDetails.description + " Private Confirmation";
            ngMeta.setTag('description', self.venueDetails.description + " Private Confirmation");
            $rootScope.title = self.venueDetails.venueName +  " Venuelytics - Private Event Confirmation";
            ngMeta.setTitle($rootScope.title);
            self.selectedCity = self.venueDetails.city;

            self.privateEventData = DataShare.privateEventData;
            self.authBase64Str = DataShare.authBase64Str;
            self.payloadObject = DataShare.payloadObject;
            self.privateOrderItem = DataShare.privateOrderItem;
        };

        self.editPrivatePage = function () {
            $location.url('/cities/' + self.selectedCity + '/' + self.venueRefId(self.venueDetails) + '/private-events');
        };

        self.privateEventSave = function () {
            AjaxService.placeServiceOrder(self.venueId, self.payloadObject, self.authBase64Str).then(function (response) {
                if (response.status == 200 ||  response.status == 201) {
                 $location.url(self.selectedCity + '/webui-success/' + self.venueRefId(self.venueDetails)+ '/private-events');
                } else {
                    if (response.data && response.data.message) {
                        alert("Saving order failed with message: " + response.data.message );
                    }
                }
            });
        };

        self.backToPrivate = function () {
            $rootScope.serviceName = 'PrivateEvent';
            DataShare.privateEventData = '';
            $location.url('/cities/' + self.selectedCity + '/' + self.venueRefId(self.venueDetails) + '/private-events');
        };

        self.time24to12 = function (timeString) {
            var H = +timeString.substr(0, 2);
            var h = (H % 12) || 12;
            var ampm = H < 12 ? " AM" : " PM";
            timeString = h + timeString.substr(2, 3) + ampm;
            return timeString;
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
