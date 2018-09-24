
'use strict';
App.controller('RequestsDetailController',['$log','$scope','$window', '$http', '$timeout','ContextService', 'APP_EVENTS', 'RestServiceFactory','$translate','Session','$state',
                                      function($log, $scope, $window, $http, $timeout, contextService, APP_EVENTS, RestServiceFactory, $translate, session, $state) {
    
    'use strict';
    $scope.PERIODS = ['WEEKLY', 'MONTHLY', 'YEARLY'];
    $scope.selectedPeriod = 'YEARLY';
    $scope.xAxisMode = 'categories';
    $scope.yPos = $scope.app.layout.isRTL ? 'right' : 'left';
    
    
    $scope.init = function() {
        $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
        
        $scope.bookingRequestChart();
    };
    
    $scope.setPeriod = function(period) {
        if ($scope.selectedPeriod !== period) {
            $scope.selectedPeriod = period;
            $scope.init();
        }
    };
    
    
    
    $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
        // register on venue change;
       $scope.init();
    });

/*

         1. Bottle  1.3
         2. Private Events 1.12 
         3. Guest List 1.15
         4. Food  1.13
         5. Drink 1.10
         6. Lost & Found 1.05
         7. Game Wait Time Requests 1.06
         8. Deals Redeemed 1.09
 */
    $scope.formatBarData = function(data, names) {
        
        if (data.length > 0){
            for (var index in data[0].series) {
                var d = data[0].series[index];
                d.subName = names[index % names.length][0];
                var f = names[index % names.length][1];
                d.data = d.data.reverse();
                for (var j = 0; j < d.data.length; j++) {
                  d.data[j][1] = Math.floor(d.data[j][1] *f);
                }
            }
        }
        data[0].series = data[0].series.slice(0,names.length);
        return RestServiceFactory.formatBarData(data, 'subName',$scope.selectedPeriod);
    };

    $scope.formatForServiceType = function(data) {
        var names = [["Bottle", 1.3], ["Private Events",1.12], ["Guest List", 1.15], ["Food", 1.13], ["Drinks", 1.10], ["Wait Time", 1.05], ["Deals", 1.09]];
        
        return $scope.formatBarData(data, names);
    };

    $scope.formatForChannelType = function(data) {
         var names = [["SMS", 0,5], ["EMail", 2], ["InApp", 3], ["Push", 3]];
        
        return $scope.formatBarData(data, names);
    };

    
    $scope.bookingRequestChart = function() {
           
        var temp = $scope.selectedPeriod.toLowerCase();
        var aggPeriodType = temp.charAt(0).toUpperCase() + temp.slice(1);
        $scope.bookingRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId,  'ServiceTypeByModeBy2', aggPeriodType, 'scodes=BPK');
        $scope.yPos = $scope.app.layout.isRTL ? 'right' : 'left';
         $scope.xAxisMode = 'categories'; 
        if ($scope.selectedPeriod === 'DAILY') {
            $scope.xAxisMode = 'time';
        } else {
            $scope.xAxisMode = 'categories';               
        }

    };
     
    $scope.init();

}]);