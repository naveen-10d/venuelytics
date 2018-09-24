"use strict";
app.controller('BusinessCreateController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', 'AjaxService', 'APP_ARRAYS', '$rootScope', '$routeParams', 'APP_LINK', '$templateCache', 'ngMeta',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, AjaxService, APP_ARRAYS, $rootScope, $routeParams, APP_LINK, $templateCache, ngMeta) {

        $log.log('Inside Business Create Controller');

        var self = $scope;

        $rootScope.blackTheme = "";
        self.init = function () {

            ngMeta.setTitle("Create Business Listing Page - Real Time Venue Management Platform");
            ngMeta.setTag('description', 'VenueLytics empowers businesses, in the entertainment, hospitality and service industries, to engage their customers in real-time and deliver Table & Bottle Service Reservations, Food & Drink Ordering, Private Event Bookings, Events Booking');
            self.listOfCategory = APP_ARRAYS.categories;
            self.states = APP_ARRAYS.cityName;
            self.listOfRoles = APP_ARRAYS.roles;
        };

        self.createBusinessUser = function (newAccount) {
            AjaxService.createBusinessUser(newAccount).then(function (response) {
                $('#successView').modal('show');
            });
        };

        self.successDialogCLose = function () {
            $location.path("/home");
        };

        self.init();
    }]);
