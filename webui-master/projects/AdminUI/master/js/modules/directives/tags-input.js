/**=========================================================
 * Module: tags-input.js
 * Initializes the tag inputs plugin
 =========================================================*/

App.directive('tagsinput', ["$timeout",function($timeout) {
	"use strict";
  return {
    restrict: 'A',
    controller: function($scope, $element) {
		$timeout(function(){
		      var $elem = $($element);
		      if($.fn.tagsinput)
		        $elem.tagsinput();
	    },1000);
    }
  };
}]);
