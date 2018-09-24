/**=========================================================
 * Module: validate-form.js
 * Initializes the validation plugin Parsley
 =========================================================*/

app.directive('validateForm', function() {
 'use strict' ;
  return {
    restrict: 'A',
    controller: ['$scope', '$element', function($scope, $element) {
      var $elem = $($element);
      if($.fn.parsley) {
        $elem.parsley();
     }
    }]
  };
});

