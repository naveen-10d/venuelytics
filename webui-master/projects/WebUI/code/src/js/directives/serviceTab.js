/**=========================================================
* smangipudi
 * Module: serviceTab.js
*
 =========================================================*/
app.directive('serviceTab', function() {
  'use strict';
  return {
    restrict: 'A',
    scope:{
      buttonId: '@',
      buttonImg: '@',
      name: '@',
      rgba: '@',
      serviceName: '@',
      clickCb:'&',
      disabled: '@',
      selected: '@'
  	},
  	controller: [ '$scope', function ($scope) {
  		$scope.onClick = function () {
        var enabled = $scope.disabled === 'false';
        $scope.clickCb({serviceName: $scope.serviceName, enabled: enabled});
      };

  	}],
  	templateUrl: 'venue/service-tab.html'
  };
});

