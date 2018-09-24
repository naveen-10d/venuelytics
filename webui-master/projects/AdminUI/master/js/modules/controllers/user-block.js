App.controller('UserBlockController', ['$scope', function($scope) {
  'use strict';
  $scope.userBlockVisible = true;
  
  $scope.$on('toggleUserBlock', function(event, args) {

    $scope.userBlockVisible = ! $scope.userBlockVisible;
    
  });

}]);