App.directive('collapseWidth', ['$transition', function ($transition, $timeout) {

  return {
    link: function (scope, element, attrs) {

      var initialAnimSkip = true;
      var currentTransition;

      function doTransition(change) {
        var newTransition = $transition(element, change);
        if (currentTransition) {
          currentTransition.cancel();
        }
        currentTransition = newTransition;
        newTransition.then(newTransitionDone, newTransitionDone);
        return newTransition;

        function newTransitionDone() {
          // Make sure it's this transition, otherwise, leave it alone.
          if (currentTransition === newTransition) {
            currentTransition = undefined;
          }
        }
      }

      function expand() {
        
        element.removeClass('collapse').addClass('collapse in');
        element.removeClass('col-md-0').addClass('col-md-6');
       $('#expandDiv').removeClass('col-md-12').addClass('col-md-6');
        
      }

     
      function collapse() {
          element.removeClass('collapse in').addClass('collapse');
          element.removeClass('col-md-6').addClass('col-md-0');
         $('#expandDiv').removeClass('col-md-6').addClass('col-md-12');
          
      }

     

      scope.$watch(attrs.collapseWidth, function (shouldCollapse) {
        if (shouldCollapse) {
          collapse();
        } else {
          expand();
        }
      });
    }
  };
}]);