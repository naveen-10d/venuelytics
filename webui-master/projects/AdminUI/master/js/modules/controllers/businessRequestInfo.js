
App.controller('BusinessRequestEditController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'FORMATS', 'Session', 'UserRoleService', 'ngDialog',
    function ($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS, Session, UserRoleService, ngDialog) {

        'use strict';
        $scope.data = {};

        if ($stateParams.id !== 'new') {
            var promise = RestServiceFactory.BusinessService().getBusiness({ id: $stateParams.venueNumber, businessId: $stateParams.id });
            promise.$promise.then(function (data) {

                $scope.data = data;

            });
        } else {
            var data = {};
            //data.unRead = "N";
            $scope.data = data;
        }

        $scope.update = function (isValid, data) {

            if (!isValid || !$("#businessInfo").parsley().isValid()) {
                return;
            }

            /*var payload = RestServiceFactory.cleansePayload('BusinessService', data);
            var target = {id: data.id};
            if ($stateParams.id === 'new'){
                target = {};
            }*/

            $scope.venueNumber = $stateParams.venueNumber;
            var target = { id: $stateParams.venueNumber };

            if ($stateParams.id !== 'new') {
                target.businessId = $stateParams.id;
            }

            //payload.phone = $('#phoneNumberId').val();
            RestServiceFactory.BusinessService().updateBusiness(target, data, function (success) {
                ngDialog.openConfirm({
                    template: '<p>Business Request information successfully saved</p>',
                    plain: true,
                    className: 'ngdialog-theme-default'
                });
            }, function (error) {
                if (typeof error.data !== 'undefined') {
                    toaster.pop('error', "Server Error", error.data.developerMessage);
                }
            });
        };

    }]);