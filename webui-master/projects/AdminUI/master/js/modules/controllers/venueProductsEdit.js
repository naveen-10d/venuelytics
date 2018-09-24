
App.controller('ProductsEditController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'FORMATS', '$timeout', '$compile', 'ngDialog',
    function ($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS, $timeout, $compile, ngDialog) {
    'use strict';
        $scope.data = {};
        if ($stateParams.id !== 'new') {
            var promise = RestServiceFactory.ProductService().getProduct({ id: $stateParams.venueNumber, productId: $stateParams.id });
            promise.$promise.then(function (data) {
                console.log('data', data);
                $scope.data = data;

            });
        } else {
            var data = {};
            $scope.data = data;
        }

        $scope.update = function (isValid, form, data) {

            if (!isValid || !$("#productInfo").parsley().isValid()) {
                return;
            }

            $scope.venueNumber = $stateParams.venueNumber;
            var target = { id: $stateParams.venueNumber };

            if ($stateParams.id !== 'new') {
                target.productId = $stateParams.id;
            }

            RestServiceFactory.ProductService().updateProduct(target, data, function (success) {
                if (target.productId == success.id) {
                    ngDialog.openConfirm({
                        template: '<p>Your information update successfull</p>',
                        plain: true,
                        className: 'ngdialog-theme-default'
                    });
                } else {
                    ngDialog.openConfirm({
                        template: '<p>Your information saved successfull</p>',
                        plain: true,
                        className: 'ngdialog-theme-default'
                    });
                }
            }, function (error) {
                if (typeof error.data !== 'undefined') {
                    toaster.pop('error', "Server Error", error.data.developerMessage);
                }
            });

            $timeout(function () {
                $state.go('app.venueedit', { id: $stateParams.venueNumber });
            });
        };

    }]);
