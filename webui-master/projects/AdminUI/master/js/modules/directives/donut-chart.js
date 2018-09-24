/**=========================================================
* smangipudi
 * Module: donot-chart.js
*
 =========================================================*/
App.directive('donutChart', function () {
    'use strict';

    return {
        restrict: 'E',
        replace: true,
        scope: {
            id: '@',
            chartData: '@',
        },
        link: function (scope, element, attrs) {

            scope.$watch('chartData', function (newValue, oldValue) {
                if (!newValue || angular.equals(newValue, oldValue)) {
                    return;
                }
                scope.drawChart();
            });
        },
        controller: function ($scope) {
            // console.log("Location data-->:", $scope.url);
            $scope.chart = new FlotChart($('#' + $scope.id), null);
            var option = {
                series: {
                    pie: {
                        show: true,
                        innerRadius: 0.5 // This makes the donut shape,

                    }
                },
                grid: {
                    hoverable: true
                },
                tooltip: true,
                tooltipOpts: {
                    cssClass: "flotTip",
                    content: "%s: %p.0%",
                    defaultTheme: false
                }
            };

            $scope.drawChart = function () {
                if ( typeof($scope.chartData) != 'undefined' && $scope.chartData !== '') {
                    $scope.chart.setData(option, $scope.chartData);
                }
            };
            $scope.drawChart();
        }

    };

});

