/**=========================================================
* smangipudi
 * Module: stacked-bar-chart.js
*
 =========================================================*/
App.directive('seriesLineChart',   function() {
  'use strict';
 
  return {
    restrict: 'E',
    scope:{
      url: '@',
      id: '@',
      mode: '@',
      formatDataFx : '&',
      chartData: '@'
  	},
    link: function(scope, element, attrs) {
      if (typeof scope.url !== 'undefined' && scope.url.length > 0) {
        scope.$watch('url',function(newValue,oldValue) {
          if (!newValue || angular.equals(newValue, oldValue)) {
            return;
          }

          scope.drawChart();
        });
      } else {
        scope.$watch('chartData',function(newValue,oldValue) {
          if (!newValue || angular.equals(newValue, oldValue)) {
            return;
          }
          scope.drawChart();
        });
      }
    },
  	controller: function ($scope) {
      $scope.chart = new FlotChart($('#'+$scope.id), null);
      $scope.option = {
          series: {
              lines: {
                  show: true
              }
          },
          grid: {
              borderColor: '#eee',
              borderWidth: 1,
              hoverable: true,
              backgroundColor: '#fcfcfc'
          },
          tooltip: true,
          tooltipOpts: {
              content: '%y'
          },
          xaxis: {
              tickColor: '#fcfcfc',
              mode: 'categories'              
          },
           yaxis: {
              position: $scope.yPos,
              tickColor: '#eee',

          },
          shadowSize: 0
      };

      $scope.drawChart = function() {
        $scope.option.xaxis.mode = $scope.mode;
        if ($scope.mode !== 'time') {
           $scope.option.xaxis.mode = 'categories';
        }
        
        if (typeof $scope.url !== 'undefined' && $scope.url.length > 0) {
          $scope.chart.setDataUrl($scope.url);
          $scope.chart.requestData($scope.option, 'GET', null, $scope.formatDataFx, true);
        } else {
           $scope.chart.setData($scope.option, JSON.parse($scope.chartData));
        }

      };
      $scope.drawChart();
    }
  };

});