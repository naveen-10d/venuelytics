/**=========================================================
* smangipudi
 * Module: stacked-bar-chart.js
*
 =========================================================*/
App.directive('timelineItem',   function() {
  'use strict';
 
    return {
      restrict: 'A',
      scope:{
       currentItem: '=',
       icon: '@',
       inverted: '@',
       bgClass: '@',
       timeSeparator: '@'
    	},
    	controller: function ($scope) {
        //title="{{item.serviceType}}" no-of-guests="{{item.noOfGuest}}" comment="BirthDay"
      
        
      },
      templateUrl: 'app/templates/time-line.html'

    };

});