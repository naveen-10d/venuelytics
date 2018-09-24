/**=========================================================
 * Module: ratings.js
 =========================================================*/
App.directive('starRating',function() {
    return {
      //This template is used to display the star UX in repeted form.
      restrict: 'EA',
      template: '<ul class="starRating starBackground">  <li ng-repeat="star in stars"><i class="fa fa-star"/></li></ul><ul class="starRating starForeground"  style="width: {{pxWidth}}px">  <li ng-repeat="star in stars" ng-class="star"><i class="fa fa-star"/></li></ul>',
      scope: {
        ratingValue: '=',
        max: '=',
        onStarRating: '&',
        updatable: '@'
      },
      link: function(scope, elem, attrs) {
        //This method is used to update the rating run time.
        scope.firstRefresh = false;
        var updateRating = function() {
          //This is global level collection.
          scope.stars = [];
          scope.firstRefresh = true;
          //Loop called with the help of data-max directive input and push the stars count.
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
          // each * is 20px including the padding convert the rating into px width
          scope.pxWidth = scope.ratingValue*20;
        };

        //This is used to toggle the rating stars.
        scope.toggleFunck = function(index) {
          //This is used to count the default start rating and sum the number of imput index.
          if(scope.updatable === 'true') {
            scope.ratingValue = index + 1;
            scope.onStarRating({
              rating: index + 1
            });
          }
        };
        //This is used to watch activity on scope, if any changes on star rating is call autometically and update the stars.
        scope.$watch('ratingValue', function(oldV, newV) {
            if (newV || !scope.firstRefresh) {
              updateRating();
            }
          }
        );
      }
    };
  }
);