'use strict';
App.controller('VisitorDashBoardController', ['$log', '$scope', '$window', '$http', '$timeout', 'ContextService', 'APP_EVENTS', 'RestServiceFactory', '$translate', 'Session', '$state',
    function ($log, $scope, $window, $http, $timeout, contextService, APP_EVENTS, RestServiceFactory, $translate, session, $state) {

        'use strict';
        $scope.PERIODS = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];

        $scope.selectedPeriod = 'YEARLY';
        $scope.xAxisMode = 'categories';
        $scope.yPos = $scope.app.layout.isRTL ? 'right' : 'left';
        $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;


        $scope.init = function () {
            $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
            $scope.vistorStatsChart();

        };
        angular.element(document).ready(function () {
            // Bar chart
            (function () {
                var Selector = '.chart-bar';
                $(Selector).each(function () {
                    var source = $(this).data('source') || $.error('Bar: No source defined.');
                    console.log("on load", data);
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


        $scope.setPeriod = function (period) {
            if ($scope.selectedPeriod !== period) {
                $scope.selectedPeriod = period;
                $scope.vistorStatsChart();
            }
        };

        $scope.formatStackData = function (data) {
            return RestServiceFactory.formatStackData(data, 'name', $scope.selectedPeriod);
        };

        $scope.formatStackDataForSubName = function (data) {
            return RestServiceFactory.formatStackData(data, 'subName', $scope.selectedPeriod);
        };

        $scope.formatBarData = function (data) {
            return RestServiceFactory.formatBarData(data, 'name', $scope.selectedPeriod);
        };

        $scope.formatBarDataForSubName = function (data) {
            if(data[0].analyticsType === "VENUE_NEW_VISITOR_COUNT") {
                $scope.responseValue = data;
                console.log("Set value for chart:", data);   
            }
            console.log("Count");
            return RestServiceFactory.formatBarData(data, 'subName', $scope.selectedPeriod);
        };

        
        $scope.$on(APP_EVENTS.venueSelectionChange, function (event, data) {
            // register on venue change;
            $scope.init();
        });

        $scope.vistorStatsChart = function () {

            var temp = $scope.selectedPeriod.toLowerCase();
            var aggPeriodType = temp.charAt(0).toUpperCase() + temp.slice(1);

            $scope.visitorRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'NewVisitorCount', aggPeriodType, 'scodes=BPK');
            $scope.visitorRequestByServiceType = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'NewVisitorsByServiceType', aggPeriodType, 'scodes=BPK');
            $scope.visitorRequestByValue = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'NewVisitorsByValue', aggPeriodType, 'scodes=BPK');


            $scope.repeatVisitorRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorCount', aggPeriodType, 'scodes=BPK');
            $scope.repeatVisitorRequestByServiceType = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorsByServiceType', aggPeriodType, 'scodes=BPK');
            $scope.repeatVisitorRequestByValue = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorsByValue', aggPeriodType, 'scodes=BPK');

            $scope.percentVisitorRequestUrl = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorPercent', aggPeriodType, 'scodes=BPK');
            $scope.percentVisitorRequestByServiceType = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorsPercentByServiceType', aggPeriodType, 'scodes=BPK');
            $scope.percentVisitorRequestByValue = RestServiceFactory.getAnalyticsUrl($scope.effectiveVenueId, 'RepeatVisitorsPercentByValue', aggPeriodType, 'scodes=BPK');


            $scope.xAxisMode = 'categories';
            if ($scope.selectedPeriod === 'DAILY') {
                $scope.xAxisMode = 'time';
            } else {
                $scope.xAxisMode = 'categories';
            }
        };
        $scope.init();

    }]).factory('getChartData', ['$http', function ($http) {
        return {
            getAll: function (url) {
                console.log("factory:", url);
                return $http.get(url).then(function (result) {return result;});
            }
        }
    }]);    