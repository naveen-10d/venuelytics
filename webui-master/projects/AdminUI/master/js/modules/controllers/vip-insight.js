
'use strict';
App.controller('VIPDashBoardController',['$log','$scope','$window', '$http', '$timeout','ContextService', 'APP_EVENTS', 'RestServiceFactory','$translate','Session','$state',
                                      function($log, $scope, $window, $http, $timeout, contextService, APP_EVENTS, RestServiceFactory, $translate, session, $state) {
	
    'use strict';
    $scope.PERIODS = ['WEEKLY', 'MONTHLY', 'YEARLY'];
    $scope.USERCOUNT = [20, 50, 75];
    $scope.selectedPeriod = 'YEARLY';
    $scope.xAxisMode = 'categories';
    $scope.yPos = $scope.app.layout.isRTL ? 'right' : 'left';
    $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
    $scope.selectedTopVisitCount = 20;
    $scope.selectedTopRevenueCount = 20;
    
    var colors = ["#51bff2", "#4a8ef1", "#3cb44b","#0082c8", "#911eb4", "#e6194b","#f0693a", "#f032e6 ", "#f58231","#d2f53c", "#ffe119","#a869f2", "#008080","#aaffc3", "#e6beff", "#aa6e28", "#fffac8","#800000","#808000 ","#ffd8b1","#808080","#808080"];
    
    $scope.init = function() {
        $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
        $scope.vipChart();
        $("#vipBarChartComponent").bind("plotclick", function (event, pos, item) {
            if (typeof (item) !== 'undefined') {
                var label = item.series.data[item.dataIndex][0];
                console.log( label + " - " +item.series.data[item.dataIndex][1]);
                $state.go('app.profile', {visitorId: item.series.altData[label]});
            }
            
        });

         $("#vipBarChartComponent1").bind("plotclick", function (event, pos, item) {
            if (typeof (item) !== 'undefined') {
                var label = item.series.data[item.dataIndex][0];
                
                console.log( label + " - " +item.series.data[item.dataIndex][1]);
               $state.go('app.profile', {visitorId: item.series.altData[label]});
            }
            
        });

    };
    
   
    $scope.setTopRevenueCount = function(count) {
        $scope.selectedTopRevenueCount = count;
        $scope.vipRequestRevenueUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'VipCustomersByRevenue', 'Weekly', 'scodes=BPK') +'&c='+count;
     
    }

    $scope.setTopVisitorCount = function(count) {
        $scope.selectedTopVisitCount = count;
         $scope.vipRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'VipCustomersByVisits', 'Weekly', 'scodes=BPK') +'&c='+count;
    }


    $scope.setPeriod = function(period) {
        if ($scope.selectedPeriod !== period) {
            $scope.selectedPeriod = period;
            $scope.vipChart();
        }
    };
    
    $scope.formatDataAggByNameByTotalVisit = function(data){
        var resultData = $scope.formatDataAggByName(data);
        
        return sortAndAggregareFor(resultData, $scope.selectedTopVisitCount);

    };

     $scope.formatDataAggByNameByTotalRevenue = function(data){
        var resultData = $scope.formatDataAggByName(data);
        
        return sortAndAggregareFor(resultData, $scope.selectedTopRevenueCount);

    };
    
    $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
        // register on venue change;
       $scope.init();
    });


     function sortAndAggregareFor(resultData, N) {


        for (var tIdx = 0; tIdx < resultData.length; tIdx++){
             resultData[tIdx].data.sort(compare);
        
            // add first 75 and remaining as others
            
            if (resultData[tIdx].data.length > N) {
                var firstOne = resultData[tIdx].data.slice(0,N-1);
               /* var second = resultData[tIdx].data.slice(N);

                var remainingTotal = 0;
                for (var idx = 0; idx < second.length; idx++) {
                    remainingTotal += second[idx][1];
                }

                firstOne.push(["Other " +  second.length +" cities", remainingTotal]);*/
                resultData[tIdx].data = firstOne;
            }
        }
       return resultData;
    }

    function compare(a, b) {
        return b[1] - a[1];
    }

    $scope.formatDataAggByName = function(data) {
         return formatDataAggByImpl(data, 'name', 'subName');
    };

    function formatDataAggByImpl(data, propertyName, altName) {

        var retData = [];
        
        var colorIndex = 0;
        var elem = {};
        elem.data = [];
        elem.altData= [];
        elem.label = "";
        elem.color = colors[colorIndex % colors.length];
        colorIndex++;
        
        if (data.length > 0){
            for (var index in data[0].series) {
                var series = data[0].series[index];
                var label = series[propertyName];
                if (label === null) {
                    continue;
                }
                var total = 0;
                for (var i =0; i < series.data.length; i++){
                    total += series.data[i][1];
                    
                }
                
                var id = series[altName];
                if (!!elem.altData[label]) {
                    label = label +"-" + elem.data.length;
                }
                elem.data.push([label, total]);
                elem.altData[label] = series[altName];
            }
            retData.push(elem);
        }
        
        return retData;

    }

    $scope.vipChart = function() {
           
        var temp = $scope.selectedPeriod.toLowerCase();
        var aggPeriodType = temp.charAt(0).toUpperCase() + temp.slice(1);
        
        $scope.vipRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'VipCustomersByVisits', aggPeriodType, 'scodes=BPK');
      	$scope.vipRequestRevenueUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'VipCustomersByRevenue', aggPeriodType, 'scodes=BPK');

        $scope.xAxisMode = 'categories'; 
        if ($scope.selectedPeriod === 'DAILY') {
            $scope.xAxisMode = 'time';
        } else {
            $scope.xAxisMode = 'categories';               
        }
    };
    $scope.init();

}]);