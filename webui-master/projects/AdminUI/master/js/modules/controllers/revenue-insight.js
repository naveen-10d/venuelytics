'use strict';
App.controller('RevenueDashBoardController',['$log','$scope','$window', '$http', '$timeout','ContextService', 'APP_EVENTS', 'RestServiceFactory','$translate','Session','$state',
                                      function($log, $scope, $window, $http, $timeout, contextService, APP_EVENTS, RestServiceFactory, $translate, session, $state) {
	
    'use strict';
    $scope.PERIODS = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
    
    $scope.selectedPeriod = 'YEARLY';
    $scope.xAxisMode = 'categories';
    $scope.yPos = $scope.app.layout.isRTL ? 'right' : 'left';
    $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
    
    
    var colors = ["#51bff2", "#4a8ef1", "#3cb44b","#0082c8", "#911eb4", "#e6194b","#f0693a", "#f032e6 ", "#f58231","#d2f53c", "#ffe119","#a869f2", "#008080","#aaffc3", "#e6beff", "#aa6e28", "#fffac8","#800000","#808000 ","#ffd8b1","#808080","#808080"];
    
    $scope.init = function() {
        $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
        $scope.revenueChart();

    };

    
    angular.element(document).ready(function () {

    // Bar chart
    (function () {
        var Selector = '.chart-bar';
        $(Selector).each(function() {
            var source = $(this).data('source') || $.error('Bar: No source defined.');
            var chart = new FlotChart(this, source),
                //panel = $(Selector).parents('.panel'),
                option = {
                    series: {
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
                        backgroundColor: '#fcfcfc'
                    },
                    tooltip: true,
                    tooltipOpts: {
                        content: '%x : %y'
                    },
                    xaxis: {
                        tickColor: '#fcfcfc',
                        mode: 'categories'
                    },
                    yaxis: {
                        position: ($scope.app.layout.isRTL ? 'right' : 'left'),
                        tickColor: '#eee'
                    },
                    shadowSize: 0
                };
            // Send Request
            chart.requestData(option);
        });

    })();
});

    
    $scope.setPeriod = function(period) {
        if ($scope.selectedPeriod !== period){
            $scope.selectedPeriod = period;
            $scope.revenueChart();
        }
    };
    
    $scope.formatStackData = function(data) {
        return RestServiceFactory.formatStackData(data, 'name',$scope.selectedPeriod);
    };

    $scope.formatStackDataForSubName = function(data) {
        return RestServiceFactory.formatStackData(data, 'subName',$scope.selectedPeriod);
    };

    $scope.formatBarData = function(data) {
        return RestServiceFactory.formatBarData(data, 'name',$scope.selectedPeriod);
    };

    $scope.formatBarDataForSubName = function(data) {
        return RestServiceFactory.formatBarData(data, 'subName',$scope.selectedPeriod);
    };

    $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
        // register on venue change;
       $scope.init();
    });


    $scope.revenueChart = function() {
           
        var temp = $scope.selectedPeriod.toLowerCase();
        var aggPeriodType = temp.charAt(0).toUpperCase() + temp.slice(1);
        
        $scope.revenueRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'Revenue', aggPeriodType, 'scodes=BPK');
        $scope.revenueRequestByServiceType = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'RevenueVsCapacity', aggPeriodType, 'scodes=BPK');
        //$scope.revenueRequestByValue = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'NewVisitorsByValue', aggPeriodType, 'scodes=BPK');

        
        $scope.xAxisMode = 'categories'; 
        if ($scope.selectedPeriod === 'DAILY') {
            $scope.xAxisMode = 'time';
        } else {
            $scope.xAxisMode = 'categories';               
        }
    };
    
    $scope.revenueFormatter = function(y) {
        return y/1000 + "K";
    };

    $scope.init();

}]);