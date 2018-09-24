/**=========================================================
* smangipudi
 * Module: stacked-bar-chart.js
*
 =========================================================*/
App.directive('stackedBarChart',   function() {
  'use strict';
 
  return {
    restrict: 'E',
    scope:{
      url: '@',
      id: '@',
      mode: '@',
      formatDataFx : '&',
      yPos: '@',
      chartData: '@',
      yAxisFormatter: '&' 
  	},
    link: function(scope, element, attrs) {
      scope.yFn = angular.isUndefined(attrs.yAxisFormatter) === false;

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
      $scope.chart = new FlotChart('#'+$scope.id, null);
      $scope.option = {
          series: {
              stack: true,
              bars: {
                  align: 'center',
                  lineWidth: 0,
                  show: true,
                  barWidth: 0.6,
                  fill: 0.9
              }
          },
          grid: {
              borderColor: '#eee',
              borderWidth: 1,
              hoverable: true,
              backgroundColor: '#fcfcfc',
              clickable: true
          },
          tooltip: true,
          tooltipOpts: {
              content: function(label, x, y){
                return x + " - %y";
              }
          },
          xaxis: {
              tickColor: '#fcfcfc',
              mode: 'categories'
          },
          yaxis: {
              position: $scope.yPos,
              tickColor: '#eee', 
              tickDecimals:0,
              tickFormatter: function(val, axis){
                if ($scope.yFn) {
                  return $scope.yAxisFormatter({val: val});
                } 
                return val;
              }

          },
          shadowSize: 0
      };

      $scope.drawChart = function() {
        $scope.option.xaxis.mode = $scope.mode;
        if ($scope.mode === 'time') {
          $scope.option.series.bars.lineWidth = 1;
        }

        /*if ($scope.yFn) {
          $scope.option.yaxis.tickFormatter = $scope.yAxisFormatter;
        }*/
        
        if (typeof $scope.url !== 'undefined' && $scope.url.length > 0) {
          $scope.chart.setDataUrl($scope.url);
          $scope.chart.requestData($scope.option, 'GET', null, $scope.formatDataFx);
        } else {
           $scope.chart.setData($scope.option, JSON.parse($scope.chartData));
        }

      };
      $scope.drawChart();
    }
  };

});