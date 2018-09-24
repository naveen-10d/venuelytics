/**
 * ===========================
 * 		Instore insight widget
 * ===========================
 */

App.directive('cardWidget', function() {
  "use strict";
  return {
    restrict: 'E',
    scope:{
	  card: '='
  	},
    templateUrl: 'app/templates/card-widget.html'
  };
});