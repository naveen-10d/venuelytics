"use strict";
app.controller('GuestConfirmController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'ngMeta', 'VenueService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, $rootScope, ngMeta, venueService) {

        $log.log('Inside Guest Confirm Controller.');

        var self = $scope;
        self.serviceType = "GuestList";
        self.firstNameLabel = 'reservation.FIRST_NAME';
        self.init = function () {


            self.venueDetails = venueService.getVenue($routeParams.venueId);
            self.venueId = self.venueDetails.id;
            self.venueInfo();
            $rootScope.description = self.venueDetails.description;
            DataShare.successDescription = self.venueDetails.description + " Guest  Confirmation";
            ngMeta.setTag('description', self.venueDetails.description + " Guest Confirmation");
            $rootScope.title = self.venueDetails.venueName + " Venuelytics - Guest List Confirmation";
            ngMeta.setTitle($rootScope.title);
            self.city = self.venueDetails.city;

            self.guestListData = DataShare.guestListData;
            self.authBase64Str = DataShare.authBase64Str;
            self.payloadObject = DataShare.payloadObject;
        };
        self.venueInfo = function () {
            var fields = venueService.getVenueInfo(self.venueId, 'GuestList.ui.fields');
            if (typeof (fields) !== 'undefined') {
                self.guestListFields = JSON.parse(fields);
            }
            self.siLabel =  venueService.getVenueInfo(self.venueId, 'GuestList.siLabel') || self.siLabel;
            self.siRequired = venueService.getVenueInfo(self.venueId, 'GuestList.siRequired') === 'true';
            
            if (self.siRequired) {
                self.siLabel = self.siLabel + '*';
            }
            if (self.guestListFields && self.has('ORGANIZER_FIRST_NAME')) {
                self.firstNameLabel = self.guestListFields['ORGANIZER_FIRST_NAME'];
            }
        };

        self.has = function (elementName) {
            if (!self.guestListFields) {
                return true;
            }
            return self.guestListFields && self.guestListFields.hasOwnProperty(elementName);
        };

        self.editGuestPage = function () {
            $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/guest-list');
        };

        self.guestListSave = function () {
            AjaxService.createGuestList(self.venueId, self.payloadObject, self.authBase64Str).then(function (response) {
                $location.url(self.city + '/webui-success/' + self.venueRefId(self.venueDetails) + '/guest-list');
            });
        };

        self.backToGuest = function () {
            $rootScope.serviceName = 'GuestList';
            DataShare.guestListData = '';
            $location.url('/cities/' + self.city + '/' + self.venueRefId(self.venueDetails) + '/guest-list');
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
