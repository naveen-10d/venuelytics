/**
 * ===========================
 * 		Instore insight widget
 * ===========================
 */

App.directive('instoreAchievementWidget', function() {
  return {
    restrict: 'E',
    scope:{
    	instoreachievement: '='
  	},
    templateUrl: 'app/templates/instore-achievement-widget.html'
  };
});