/**=========================================================
* smangipudi
 * Module: sparklinePieChart.js
*
 =========================================================*/
App.directive('sparklinePieChart',   function() {
  'use strict';
 
  return {
    restrict: 'E',
    scope:{
      id: '@',
	    title:   '@',
      piedata: '@',
      barlabel: '@',
      bartotal: '@',
  	},
  	controller: function ($scope, colors) {
  		 $scope.colorByName = colors.byName;
  	},
    templateUrl: 'app/templates/chart/sparkline-progress.html'
  };
});