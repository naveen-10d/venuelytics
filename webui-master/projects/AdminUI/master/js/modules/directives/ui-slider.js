/**=========================================================
 * Module: masked,js
 * Initializes the jQuery UI slider controls
 =========================================================*/

App.directive('uiSlider', function() {
  'use strict' ;
  return {
    restrict: 'A',
    controller: function($scope, $element) {
      var $elem = $($element);
      if($.fn.slider)
        $elem.slider();
    }
  };
});
