/**=========================================================
 * Module: id.js
 *smangipudi
 =========================================================*/

App.controller('IdController', ['$scope', '$state', '$stateParams',function($scope, $state, $stateParams) {
  'use strict';
  
  $scope.data = {};
  $scope.data.id = $stateParams.id;
}]);