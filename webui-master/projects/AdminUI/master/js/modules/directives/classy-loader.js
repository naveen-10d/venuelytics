/**=========================================================
 * Module: classy-loader.js
 * Enable use of classyloader directly from data attributes
 =========================================================*/

App.directive('classyloader', function($timeout) {
  'use strict';

  var $scroller       = $(window),
      inViewFlagClass = 'js-is-in-view'; // a classname to detect when a chart has been triggered after scroll

  return {
    restrict: 'A',
    scope : {
      trigger: '@',
      percentage: '@'
    },
    link: function(scope, element, attrs) {
      scope.$watch('percentage', function (newValue, oldValue) {
          console.log('dataPercentage Changed: ' + scope.percentage);
          if (!newValue || angular.equals(newValue, oldValue)) {
              return;
          }
           var $element = $(element),
            options  = $element.data();
          scope.options = options;
          scope.options.percentage = scope.percentage;
          scope.thisElement = $element;
          scope.thisElement.ClassyLoader(scope.options).draw();
      });
      // run after interpolation  
      $timeout(function(){
  
        var $element = $(element),
            options  = $element.data();
        scope.options = options;
        scope.thisElement = $element;
        // At lease we need a data-percentage attribute
        if(options) {
          if( options.triggerInView ) {

            $scroller.scroll(function() {
              checkLoaderInVIew($element, options);
            });
            // if the element starts already in view
            checkLoaderInVIew($element, options);
          }
          else
            startLoader($element, options);
        }

      }, 0);

      function checkLoaderInVIew(element, options) {
        var offset = -20;
        if( ! element.hasClass(inViewFlagClass) &&
            $.Utils.isInView(element, {topoffset: offset}) ) {
          startLoader(element, options);
        }
      }
      function startLoader(element, options) {
        element.ClassyLoader(options).addClass(inViewFlagClass);
      }
    }
  };
});
