App.directive('plainCardWidget', function() {
  "use strict";
  return {
    restrict: 'E',
    scope:{
	  card: '='
  	},
    templateUrl: 'app/templates/plain-card-widget.html'
  };
});