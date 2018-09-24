/**=========================================================
* smangipudi
 * Module: switch-panel.js
*
 =========================================================*/
App.directive('switchPanel', function() {
  "use strict";
  return {
    restrict: 'E',
    scope:{
      switches: '=',
      onUpdate: '&'
  	},
  	controller: [ '$scope', function ($scope) {
  		$scope.onSave = function() {
        $scope.onUpdate();
      };
  	}],
  	templateUrl: 'app/templates/switch-panel.html'
  };
});