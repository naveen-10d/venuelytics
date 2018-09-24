'use strict';
App.controller('ProductDashBoardController',['$log','$scope','$window', '$http', '$timeout','ContextService', 'APP_EVENTS', 'RestServiceFactory','$translate','Session','$state',
                                      function($log, $scope, $window, $http, $timeout, contextService, APP_EVENTS, RestServiceFactory, $translate, session, $state) {
	
    'use strict';
    $scope.PERIODS = ['MONTHLY', 'YEARLY'];
    
    $scope.selectedPeriod = 'YEARLY';
    $scope.xAxisMode = 'categories';
    $scope.yPos = $scope.app.layout.isRTL ? 'right' : 'left';
    $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
    
    var colors = ["#51bff2", "#4a8ef1", "#3cb44b","#0082c8", "#911eb4", "#e6194b","#f0693a", "#f032e6 ", "#f58231","#d2f53c", "#ffe119","#a869f2", "#008080","#aaffc3", "#e6beff", "#aa6e28", "#fffac8","#800000","#808000 ","#ffd8b1","#808080","#808080"];
    
    $scope.init = function() {
        $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
        $scope.productChart();

    };

    

    
    $scope.setPeriod = function(period) {
        if ($scope.selectedPeriod !== period){
            $scope.selectedPeriod = period;
            $scope.productChart();
        }
    };
    
    $scope.formatStackData = function(data) {
        return RestServiceFactory.formatStackData(data, 'name', $scope.selectedPeriod);
    };

    $scope.formatStackDataForSubName = function(data) {
        return RestServiceFactory.formatStackData(data, 'subName', $scope.selectedPeriod);
    };

    $scope.formatBarData = function(data) {
        return RestServiceFactory.formatBarData(data, 'name', $scope.selectedPeriod);
    };

    $scope.formatBarDataForSubName = function(data) {
        return RestServiceFactory.formatBarData(data, 'subName', $scope.selectedPeriod);
    };

    $scope.formatAggStackDataBySubName = function(data) {
       return formatDataAggBySubNameImpl(data, 'subName');
    };

    function formatDataAggBySubNameImpl(data, propertyName) {

        var retData = [];
        
        var colorIndex = 0;
        var elem = {};
        elem.data = [];
        elem.label = "";
        elem.color = colors[colorIndex % colors.length];
        colorIndex++;
        
        if (data.length > 0){
            for (var index in data[0].series) {
                var series = data[0].series[index];

                var total = 0;
                for (var i =0; i < series.data.length; i++){
                    total += series.data[i][1];
                    
                }
                
                elem.data.push([series[propertyName], total]);
            }
            elem.data.sort(compare);
            retData.push(elem);
        }
        
        return retData;

    }
    function compare(a, b) {
        return b[1] - a[1];
    }

    
    
    $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
        // register on venue change;
       $scope.init();
    });


    $scope.productChart = function() {
           
        var temp = $scope.selectedPeriod.toLowerCase();
        var aggPeriodType = temp.charAt(0).toUpperCase() + temp.slice(1);
        
        $scope.productRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'ProductUsage', aggPeriodType, 'scodes=BPK');
        
        
        $scope.xAxisMode = 'categories'; 
        if ($scope.selectedPeriod === 'DAILY') {
            $scope.xAxisMode = 'time';
        } else {
            $scope.xAxisMode = 'categories';               
        }
    };

    $scope.init();

}]);