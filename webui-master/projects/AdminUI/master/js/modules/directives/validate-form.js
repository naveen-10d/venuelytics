/**=========================================================
 * Module: validate-form.js
 * Initializes the validation plugin Parsley
 =========================================================*/

App.directive('validateForm', function() {
 'use strict' ;
  return {
    restrict: 'A',
    controller: function($scope, $element) {
      var $elem = $($element);
      if($.fn.parsley)
        $elem.parsley();
    }
  };
});
