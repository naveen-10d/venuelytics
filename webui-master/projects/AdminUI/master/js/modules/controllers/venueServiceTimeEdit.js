
App.controller('VenueServiceTimeEditController', ['$scope', '$state', '$stateParams',
    'RestServiceFactory', 'toaster', 'FORMATS', '$timeout', '$compile', 'ngDialog',
    function ($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS, $timeout, $compile, ngDialog) {

        'use strict';
        $scope.startServiceTime = new Date();
        $scope.startServiceTime.setHours(0);
        $scope.startServiceTime.setMinutes(0);
        console.log($scope.startServiceTime);

        $scope.endServiceTime = new Date();
        $scope.endServiceTime.setHours(0);
        $scope.endServiceTime.setMinutes(0);
        console.log($scope.endServiceTime);

        $scope.lastServiceTime = new Date();
        $scope.lastServiceTime.setHours(0);
        $scope.lastServiceTime.setMinutes(0);
        console.log($scope.lastServiceTime);

        $scope.serviceTypes = [{name: 'Venue', label: "Venue"},
            {name: 'SPA', label: "SPA"},
            {name: 'Sauna', label: "Sauna"},
            {name: 'Bar', label: "Bar"},
            {name: 'Hotel', label: "Hotel"},
            {name: 'Restaurant', label: "Restaurant"},
            {name: 'Pool', label: "Pool"},
            {name: 'Indoor pool', label: "Indoor pool"},
            {name: 'Heated Pool', label: "Heated Pool"},
            {name: 'Jacuzzi', label: "Jacuzzi"},
            {name: 'Business Center', label: "Business Center"},
            {name: 'Steam Room', label: "Steam Room"},
            {name: 'GYM', label: "GYM"},
            {name: 'Breakfast', label: "Breakfast"},
            {name: 'Lunch', label: "Lunch"},
            {name: 'Dinner', label: "Dinner"},
            {name: 'FastPass', label: "FastPass"},
            {name: 'CoverCharges', label: "CoverCharges"},
            {name: 'DayCare', label: "Day Care"},
            {name: 'Club', label: "Club"},
            {name: 'Night Club', label: "Night Club"},
            {name: 'Meeting Room', label: "Meeting Room"},
            {name: 'Event Room', label: "Event Room"},
             {name: 'Ordering Service', label: "Food/Drink Ordering Service"},

            /*{name: 'Parking', label: "Parking"},
            {name: 'Valet Parking', label: "Valet Parking"},
            {name: 'Additional Parking', label: "Additional Parking"},*/
        ];



        $scope.data = {};
        if ($stateParams.id !== 'new') {
            var promise = RestServiceFactory.VenueService().getServiceTimingById({ id: $stateParams.venueNumber, objId: $stateParams.id });
            promise.$promise.then(function (data) {
                $scope.data = data;

                var st = data.startTime.split(":");
                var sh = parseInt(st[0]);
                var sm = parseInt(st[1]);
                var sd = new Date();
                sd.setHours(sh);
                sd.setMinutes(sm);
                $scope.startServiceTime = sd;

                var et = data.endTime.split(":");
                var eh = parseInt(et[0]);
                var em = parseInt(et[1]);
                var ed = new Date();
                ed.setHours(eh);
                ed.setMinutes(em);
                $scope.endServiceTime = ed;

                var lt = data.lastCallTime.split(":");
                var lh = parseInt(lt[0]);
                var lm = parseInt(lt[1]);
                var ld = new Date();
                ld.setHours(lh);
                ld.setMinutes(lm);
                $scope.lastServiceTime = ld;

            });
        } else {
            var data = {};
            data.venueNumber = $stateParams.venueNumber;
            //data.enabled = 'N';
            $scope.data = data;
            $scope.data.type = "Venue";
        }

        $scope.onServiceChange = function(type) {
            console.log('>>>>>>>>>>>>>>>>>>>>',angular.toJson($scope.data.type));
        };

        $scope.update = function (isValid, form, data) {

            if (!isValid || !$("#serviceInfo").parsley().isValid()) {
                return;
            }

            $scope.venueNumber = $stateParams.venueNumber;
            var p = $scope.startServiceTime;
            var q = $scope.endServiceTime;
            var r = $scope.lastServiceTime;

            data.startTime = p.getHours() + ":" + p.getMinutes();
            data.endTime = q.getHours() + ":" + q.getMinutes();
            data.lastCallTime = r.getHours() + ":" + r.getMinutes();

            var target = { id: data.venueNumber };
            if ( $stateParams.id !== 'new') {
                target.objId = $stateParams.id;
            }
           
            RestServiceFactory.VenueService().saveServiceTimings(target, data, function (success) {
                ngDialog.openConfirm({
                    template: '<p>Service Hours information  successfully saved</p>',
                    plain: true,
                    className: 'ngdialog-theme-default'
                });

            }, function (error) {
                if (typeof error.data !== 'undefined') {
                    toaster.pop('error', "Server Error", error.data.developerMessage);
                }
            });
            $timeout(function () {
                $state.go('app.venueedit', { id: $stateParams.venueNumber});
            });
        };
        
    }]);
