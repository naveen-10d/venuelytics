/**=========================================================
* smangipudi
 * Module: tab-button.js
*
 =========================================================*/
App.directive('tabButtons', function() {
  "use strict";
  return {
    restrict: 'E',
    scope:{
      tabIds: '=',
      tabLabels: '=',
	  name: '=',
	  onselect: "&",
	  selectedBtnStyle:'@',
	  selectedTabStyle: '@'
  	},
  	controller: [ '$scope', function ($scope) {
  		$scope.onClick = function(id) {
  			if (typeof $scope.onselect === 'function'){
  				$scope.onselect()(id);
  			}
  			
  		};
  		
  	}],
  	templateUrl: 'app/templates/tabbuttons-template.html'
  };
});