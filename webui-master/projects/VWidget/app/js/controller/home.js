'use strict';
app.controller('homeController', ['$scope','$routeParams', '$rootScope','RestAPI',function($scope, $routeParams, $rootScope, RestAPI) {

  $scope.portal = {};
  $scope.init = function() {
    RestAPI.getPortalInfo($routeParams.portalName).then(function ok(response) {
      $scope.portal = angular.fromJson(response.data);
      $rootScope.siteBgColor = $scope.portal.theme.bgColorCode;
    }, function err(response) {

    });
  };
  $scope.init();
}]);