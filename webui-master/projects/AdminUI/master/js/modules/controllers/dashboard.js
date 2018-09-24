
App.controller('DashBoardController',['$log','$scope','$window', '$http', '$timeout','ContextService',
    'RestServiceFactory','$translate','colors', 'APP_EVENTS','Session','$state',
                                      function($log, $scope, $window, $http, $timeout, contextService,
                                       RestServiceFactory, $translate, colors, APP_EVENTS, session, $state) {
	'use strict';
    if (session.roleId >= 10 && session.roleId <= 12) {
        $state.go('app.ticketsCalendar'); 
        return;
    }
    $scope.PERIODS = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
    $scope.selectedPeriod = 'YEARLY';
    $scope.notificationCount = 0;
    $scope.reservedBookings = {};
    $scope.requestByStatus = {};
    $scope.bookingRequestUrl = '';
    $scope.xAxisMode = 'categories';
    $scope.requestByStatusZip =[];
    $scope.bookingRequestByZipcodeData = [];
    $scope.venueBookingRevenue = {};
    $scope.topProductsData = {};
    $scope.venueCheckinValue = 0;
    $scope.visitorCheckinValue = 0;
    $scope.venueCheckinBookingValue = 0;

    $scope.topProductsDay = {};
    $scope.topProductsWeek = {};
    $scope.topProductsMonth = {};
    $scope.topProductsYear = {};
    $scope.popularDay = {icon: 'fa-sun-o', bgColor: 'bg-purple', bgColorSecondary: 'bg-purple-dark', label: 'Popular Day', value: ' '};
    $scope.popularTime = {icon: 'fa-clock-o', bgColor: 'bg-info', bgColorSecondary: 'bg-info-dark', label: 'Popular Time', value: ' '};
    $scope.cancels = {icon: 'fa-times-circle-o',bgColor: 'bg-green', bgColorSecondary: 'bg-green-dark', label: 'Cancelations', value: 0};
    $scope.messages = {icon: 'fa-inbox',bgColor: 'bg-danger', bgColorSecondary: 'bg-danger-dark', label: 'Unread Messages', value: ''};
    $scope.guestsCard = {icon:'icon-users',bgColor: 'bg-warning', bgColorSecondary: 'bg-warning-dark', label: 'Today\'s Guests', value: 0};
    $scope.advBooking = {icon: 'fa-ticket',bgColor: 'bg-gray', bgColorSecondary: 'bg-gray-dark', label: 'Advance Bookings', value: 0};
    $scope.responseTime = {icon: 'fa-clock-o',bgColor: 'bg-primary', bgColorSecondary: 'bg-primary-dark', label: 'AVG Response Time', value: 'N/A'};

    $scope.currencyFormatter =  {
        format : function(num) {
                if (num >= 1000000000) {
                    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
                }
                if (num >= 1000000) {
                    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
                }
                if (num >= 1000) {
                    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
                }
                return num;
            }
    };


    /*new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      // the default value for minimumFractionDigits depends on the currency
      // and is usually already 2
    });*/


    $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
        // register on venue change;
       $scope.init();
    });
    
	$scope.init=function(){
	   
    	$log.log("Dash board controller has been initialized!");
		
        $scope.colorPalattes = ["rgb(45,137,239)", "rgb(153,180,51)", "rgb(227,162,26)",  "rgb(0,171,169)","#f05050", "rgb(135,206,250)", "rgb(255,196,13)"];
        $scope.top3Stats = [];

        $scope.top3Stats[0] = createPDO($scope.colorPalattes[0],{"label":"New Visitors", "value":0, "icon":"icon-users"}, "#/app/dashboard/visitor-insight");
        $scope.top3Stats[1] = createPDO($scope.colorPalattes[1],{"label":"Total Visitors", "value":0, "icon":"icon-users"}, "#/app/dashboard/vip-insight");
        $scope.top3Stats[2] = createPDO($scope.colorPalattes[2],{"label":"Total Bookings", "value":0, "icon":"fa fa-shopping-cart"}, "#/app/dashboard/reservation-insight");
        $scope.top3Stats[3] = createPDO($scope.colorPalattes[3],{"label":"Total Revenue", "value":0, "icon":"fa fa-dollar"}, "#/app/dashboard/revenue-insight");       
       

        //$scope.top3Stats[3] = createPDO($scope.colorPalattes[3],{"label":"CheckIns", "value":0, "icon":"icon-login"}, "#/app/dashboard/reservation-insight");
        
        $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;

        if (contextService.userVenues.selectedVenueNumber === 170706) {
            $scope.effectiveVenueId = 521;
        }

        RestServiceFactory.VenueService().getAnalytics({id: $scope.effectiveVenueId}, function(data){
            $scope.processAnalytics(data);
        },function(error){
            /*if (typeof error.data !== 'undefined') { 
                toaster.pop('error', "Server Error", error.data.developerMessage);
            }*/
        });
        RestServiceFactory.VenueService().getGuests({id: $scope.effectiveVenueId, date: moment().format('YYYYMMDD')}, function(data){
           $scope.guests = data;
           $scope.guestsCard.value = $scope.guests.length;
        },function(error){
            /*if (typeof error.data !== 'undefined') { 
                toaster.pop('error', "Server Error", error.data.developerMessage);
            }*/
        });
        $scope.top3FavItems();
        $scope.bookingRequestChart();
        $scope.reservedBookingChart();
		$scope.reload();
	};
    $scope.setDisplayData = function() {
        $scope.top3Stats[0].value =  addForType($scope.venueNewVisitors, $scope.selectedPeriod);
        $scope.top3Stats[1].value = addForType($scope.venueAllVisitors, $scope.selectedPeriod);
        $scope.top3Stats[2].value = addForType($scope.venueBookings, $scope.selectedPeriod);
        $scope.top3Stats[3].value = $scope.currencyFormatter.format(addForType($scope.venueBookingRevenue, $scope.selectedPeriod));
        
        

        $scope.venueCheckinValue = addForType($scope.venueCheckin, $scope.selectedPeriod);
        $scope.visitorCheckinValue = addForType($scope.visitorCheckin, $scope.selectedPeriod);
        $scope.venueCheckinBookingValue = addForType($scope.venueCheckinBooking, $scope.selectedPeriod);
        
        var stackedBarDataStage =  $scope.requestByStatusZip[$scope.selectedPeriod];
        $scope.bookingRequestByZipcodeData=  [];
        for (var key in stackedBarDataStage) {
            if (stackedBarDataStage.hasOwnProperty(key)){
                 $scope.bookingRequestByZipcodeData.push(stackedBarDataStage[key]);
            }
        }
        $scope.popularDay.value = findMaxForType($scope.popularDays, $scope.selectedPeriod);
        $scope.popularTime.value = findMaxForType($scope.popularTimes, $scope.selectedPeriod);
        $scope.advBooking.value = addForType($scope.advBookings, $scope.selectedPeriod);
        $scope.cancels.value = addForType($scope.cancelBookings, $scope.selectedPeriod);

        var responseTime = addForType($scope.responseTimes, $scope.selectedPeriod);
        if (responseTime === 0) {
            $scope.responseTime.value = 'N/A';    
        } else if (responseTime < 60) {
            $scope.responseTime.value = responseTime +' Sec';
        } else if (responseTime < 3600) {
            $scope.responseTime.value = Math.round(responseTime/60.0) +' Min';
        } else {
            $scope.responseTime.value = Math.round(responseTime/3600.0) + ' HRS';
        }
       
        console.log(JSON.stringify($scope.bookingRequestByZipcodeData));
        //$scope.top3FavItems(); 
        $scope.bookingRequestChart();
        $scope.reservedBookingChart();
        $scope.donutInit();

        if ($scope.selectedPeriod === 'YEARLY') {
            $scope.topProductsData = makeSeries($scope.topProductsYear);
        } else if ($scope.selectedPeriod === 'MONTHLY') {
            $scope.topProductsData = makeSeries($scope.topProductsMonth);
        } else if ($scope.selectedPeriod === 'WEEKLY') {
            $scope.topProductsData = makeSeries($scope.topProductsWeek);
        } else if ($scope.selectedPeriod === 'DAILY') {
            $scope.topProductsData = makeSeries($scope.topProductsDay);
        }
    };

    $scope.productInsight = function() {
        $state.go('app.productInsight');
    };
     $scope.popularInsight = function() {
        $state.go('app.popularInsight');
    };
    
    $scope.cancelInsights = function() {
      $state.go('app.cancelInsight');  
    };

    $scope.top3FavItems = function () {
       /* var temp = $scope.selectedPeriod.toLowerCase();
        var aggPeriodType = temp.charAt(0).toUpperCase() + temp.slice(1);
        var promise = RestServiceFactory.AnalyticsService().getTopNFavItems({id: $scope.effectiveVenueId, aggPeriodType: aggPeriodType, n: 3});   
        promise.$promise.then(function(data) {
            $scope.topItemsList = data;
        });*/
    };

    $scope.processAnalytics = function(data) {
        if (typeof data.VENUE_NEW_VISITOR_COUNT !== 'undefined' && data.VENUE_NEW_VISITOR_COUNT.length > 0) {
            $scope.venueNewVisitors = data.VENUE_NEW_VISITOR_COUNT;
        } else {
            $scope.venueNewVisitors = null;
        }

        if (typeof data.VENUE_ALL_VISITOR_COUNT !== 'undefined' && data.VENUE_ALL_VISITOR_COUNT.length > 0) {
            $scope.venueAllVisitors = data.VENUE_ALL_VISITOR_COUNT;
        } else {
            $scope.venueAllVisitors = null;

        }

        if (typeof data.VENUE_BOOKINGS_COUNT !== 'undefined' && data.VENUE_BOOKINGS_COUNT.length > 0) {
            $scope.venueBookings = data.VENUE_BOOKINGS_COUNT;
        } else {
            $scope.venueBookings = null;
        }

        if (typeof data.VENUE_CHECKIN !== 'undefined' && data.VENUE_CHECKIN.length > 0) {
            $scope.venueCheckin = data.VENUE_CHECKIN;
        } else {
            $scope.venueCheckin = null;
        }

        if (typeof data.VENUE_VISITOR_CHECKIN_BOOKING !== 'undefined' && data.VENUE_VISITOR_CHECKIN_BOOKING.length > 0) {
            $scope.venueCheckinBooking = data.VENUE_VISITOR_CHECKIN_BOOKING;
        } else {
            $scope.venueCheckinBooking = null;
        }

        if (typeof data.VENUE_VISITOR_CHECKIN !== 'undefined' && data.VENUE_VISITOR_CHECKIN.length > 0) {
            $scope.visitorCheckin = data.VENUE_VISITOR_CHECKIN;
        } else {
            $scope.visitorCheckin = null;
        }
        if (typeof data.VENUE_SERVICE_TYPE !== 'undefined' && data.VENUE_SERVICE_TYPE.length > 0) {
            $scope.requestByStatus = processRequestsByStatus(data.VENUE_SERVICE_TYPE);
        } else {
            $scope.requestByStatus = {};
        }
        if (typeof data.VENUE_BOOKINGS_CITY_COUNT   !== 'undefined' && data.VENUE_BOOKINGS_CITY_COUNT.length > 0) {
            processRequestsByZip(data.VENUE_BOOKINGS_CITY_COUNT);
        } else {
            $scope.requestByStatusZip = {};
        }
        if (typeof data.VENUE_BOOKINGS_REVENUE   !== 'undefined' && data.VENUE_BOOKINGS_REVENUE.length > 0) {
             $scope.venueBookingRevenue = data.VENUE_BOOKINGS_REVENUE;
        } else {
            $scope.venueBookingRevenue = null;
        }
        
        if (typeof data.TPQ_LAST_DAY   !== 'undefined' && data.TPQ_LAST_DAY[0].productTypes) {
             $scope.topProductsDay = data.TPQ_LAST_DAY[0].productTypes;
        } else {
            $scope.topProductsDay = {};
        }

        if (typeof data.TPQ_LAST_WEEK   !== 'undefined' && data.TPQ_LAST_WEEK[0].productTypes) {
             $scope.topProductsWeek = data.TPQ_LAST_WEEK[0].productTypes;
        } else {
            $scope.topProductsWeek = {};
        }

        if (typeof data.TPQ_LAST_MONTH   !== 'undefined' && data.TPQ_LAST_MONTH[0].productTypes) {
             $scope.topProductsMonth = data.TPQ_LAST_MONTH[0].productTypes;
        } else {
            $scope.topProductsMonth = {};
        }

        if (typeof data.TPQ_LAST_YEAR   !== 'undefined' && data.TPQ_LAST_YEAR[0].productTypes) {
             $scope.topProductsYear  = data.TPQ_LAST_YEAR[0].productTypes;
        } else {
            $scope.topProductsYear = {};
        }

        if (typeof data.POPULAR_DAY   !== 'undefined' && data.POPULAR_DAY.length > 0) {
             $scope.popularDays = data.POPULAR_DAY;
        } else {
            $scope.popularDays = [];
        }

        if (typeof data.POPULAR_TIME   !== 'undefined' && data.POPULAR_TIME.length > 0) {
             $scope.popularTimes = data.POPULAR_TIME;
        } else {
            $scope.popularTimes = [];
        }

        if (typeof data.VENUE_BOOKINGS_ADV   !== 'undefined' && data.VENUE_BOOKINGS_ADV.length > 0) {
             $scope.advBookings = data.VENUE_BOOKINGS_ADV;
        } else {
            $scope.advBookings = [];
        }

        if (typeof data.VENUE_BOOKINGS_CANCELED   !== 'undefined' && data.VENUE_BOOKINGS_CANCELED.length > 0) {
             $scope.cancelBookings = data.VENUE_BOOKINGS_CANCELED;
        } else {
            $scope.cancelBookings = [];
        }

        if (typeof data.RESPONSE_TIME   !== 'undefined' && data.RESPONSE_TIME.length > 0) {
             $scope.responseTimes = data.RESPONSE_TIME;
        } else {
            $scope.responseTimes = [];
        }

        $scope.setDisplayData();

    };
    
    function processRequestByZipPeriod(period, data, attrName) {
        var colors = ["#36af12", "#51bff2", "#4a8ef1", "#f0693a", "#a869f2", "#b8e902", "#c119f2","#bde902","#f149c8", "#bbccce"];

        var series = $scope.requestByStatusZip[period];
        var serie = series[data.analyticsLabel];
        if (serie == null) {
            serie = {label: data.analyticsLabel, color: colors[Object.keys(series).length % colors.length], data: []};
            series[data.analyticsLabel] = serie;
        }
        var val = data[attrName];
        if ( val > 0) {
            serie.data.push([data.valueText, val]);
        }
        
    }
    function processRequestsByZip(data) {
        $scope.requestByStatusZip = [];
        $scope.requestByStatusZip['DAILY'] = [];
        $scope.requestByStatusZip['WEEKLY'] = [];
        $scope.requestByStatusZip['MONTHLY'] = [];
        $scope.requestByStatusZip['YEARLY'] = [];

        for (var i =0; i < data.length; i++) {
            processRequestByZipPeriod('DAILY', data[i], 'lastDayValue');
            processRequestByZipPeriod('WEEKLY', data[i], 'lastWeekValue');
            processRequestByZipPeriod('MONTHLY', data[i], 'lastMonthValue');
            processRequestByZipPeriod('YEARLY', data[i], 'lastYearValue');
        }

        sortAndNormalizeData($scope.requestByStatusZip['DAILY']);
        sortAndNormalizeData($scope.requestByStatusZip['WEEKLY']);
        sortAndNormalizeData($scope.requestByStatusZip['MONTHLY']);
        sortAndNormalizeData($scope.requestByStatusZip['YEARLY']);

        console.log(JSON.stringify($scope.requestByStatusZip));
        
    }
    
    function sortAndNormalizeData(series) {

        var zips = [];
        var key, i, serie, zip = null;
        for (key in series) {
            if (series.hasOwnProperty(key)) {
                serie = series[key];

                for (i = 0; i < serie.data.length; i++) {
                    zip = serie.data[i][0];
                    var value = serie.data[i][1];

                    if (typeof zips[zip] === 'undefined') {
                        zips[zip] = 0;
                    }
                    zips[zip] = zips[zip] + value;
                }
            }
        }
        
        var tuples = [];
        for (key in zips) {
            if (zips.hasOwnProperty(key)) {
                tuples.push([key, zips[key]]);
            }
        }

        tuples.sort(function(b, a) {
            a = a[1];
            b = b[1];
            return a < b ? -1 : (a > b ? 1 : 0);
        });
        
        // keep only top 10.
        tuples = tuples.slice(0, 10);
        
        var top10Zip = [];
        for (var k = 0; k < tuples.length; k++) {
            var obj = tuples[k];
            top10Zip[obj[0]] = 1;
        }
        
        // populate normalized data
        for (key in series) {
            
            if (series.hasOwnProperty(key)) {
                serie = series[key];
                var others = 0;
                for (i = serie.data.length -1; i >=0; i--) {
                    zip = serie.data[i][0];
                    if (top10Zip[zip] !== 1) {
                        others += serie.data[i][1];
                        serie.data.splice(i, 1);
                    }
                }
                if(others > 0) {
                    serie.data.push(["Others", others]);
                }

                if (serie.data.length === 0) {
                    delete series[key];
                }
            }
        }
    }

    function processRequestsByStatus(data) {
        var requestByStatus = [];
        

        for (var i =0; i < data.length; i++) {
            var elem = requestByStatus[data[i].valueText];
            if (elem == null) {
                elem = {daily: 0, weekly: 0, monthly: 0, yearly: 0};
                requestByStatus[data[i].valueText] = elem;
            }
            elem.daily += data[i].lastDayValue;
            elem.weekly += data[i].lastWeekValue;
            elem.monthly += data[i].lastMonthValue;
            elem.yearly += data[i].lastYearValue;
               
        }
        var returnData = [];
        returnData['DAILY'] =[];
        returnData['WEEKLY'] =[];
        returnData['MONTHLY'] =[];
        returnData['YEARLY'] =[];
        var colorIndex = 0;
        for(var key in requestByStatus) {
            elem = requestByStatus[key];
            
            returnData['DAILY'].push(createPieElem($scope.colorPalattes[colorIndex % $scope.colorPalattes.length],key,elem.daily));
            returnData['WEEKLY'].push(createPieElem($scope.colorPalattes[colorIndex % $scope.colorPalattes.length],key,elem.weekly));
            returnData['MONTHLY'].push(createPieElem($scope.colorPalattes[colorIndex % $scope.colorPalattes.length],key,elem.monthly));
            returnData['YEARLY'].push(createPieElem($scope.colorPalattes[colorIndex % $scope.colorPalattes.length],key,elem.yearly));
            colorIndex++;
        }
        return returnData;
    }
    function createPieElem(color, label, value) {
        return {    "color" : color,
                    "data" : value,
                    "label" : label
                };
    }
    function addForType(dataArray, type) {
        var sum = 0;
        if (dataArray == null || typeof dataArray === 'undefined') {
            return sum;
        }
        for (var i = 0; i < dataArray.length; i++) {
            if (type === 'YEARLY') {
                sum += dataArray[i].lastYearValue;
            } else if (type === 'MONTHLY') {
                sum += dataArray[i].lastMonthValue;
            } else if (type === 'WEEKLY') {
                sum += dataArray[i].lastWeekValue;
            } else if (type === 'DAILY') {
                sum += dataArray[i].lastDayValue;
            }
        }
        return sum;
    }
    function findMaxForType(dataArray, type) {
        var popularDay = 'N/A';
        if (dataArray == null || typeof dataArray === 'undefined') {
            return popularDay;
        }
        var maxValue = -1;
        for (var i = 0; i < dataArray.length; i++) {
            if (type === 'YEARLY' && maxValue < dataArray[i].lastYearValue) {
                popularDay = dataArray[i].analyticsLabel;
                maxValue = dataArray[i].lastYearValue;
            } else if (type === 'MONTHLY' && maxValue < dataArray[i].lastMonthValue) {
                popularDay = dataArray[i].analyticsLabel;   
                 maxValue = dataArray[i].lastMonthValue;            
            } else if (type === 'WEEKLY' && maxValue < dataArray[i].lastWeekValue) {
                popularDay = dataArray[i].analyticsLabel;
                maxValue = dataArray[i].lastWeekValue;
            } else if (type === 'DAILY' && maxValue < dataArray[i].lastDayValue) {
                popularDay = dataArray[i].analyticsLabel;
                maxValue = dataArray[i].lastDayValue;
            }
        }
        return popularDay;

    }
    $scope.setPeriod = function(period) {
        if ($scope.selectedPeriod !== period){
            $scope.selectedPeriod = period;
            $scope.setDisplayData();
        }
    };

    
    
    /**
     * loading visitor states
     */
    $scope.reload = function() {

        var promise = RestServiceFactory.NotificationService().getActiveNotifications({id: $scope.effectiveVenueId});	
        promise.$promise.then(function(data) {
            $scope.notifications = data.notifications;
        });

        var promise2 = RestServiceFactory.NotificationService().getUnreadNotificationCount({id: $scope.effectiveVenueId});   
        promise2.$promise.then(function(data) {
            $scope.notificationCount = data.count;
            $scope.messages.value = data.count;
        });
	};
	function createPDO( color, dataObject, link){
        
        var obj={
                id: dataObject.id,
                value: dataObject.value || 0,
                name: dataObject.label,
                icon: dataObject.icon,
                link: link,
                linkDescription: "View Details",
                contentColorCode : { "color": "#fff", "background-color": color, "border-color": "#cfdbe2"},
                linkColorCode :  { "background-color":"#3a3f51"}
            };
        return obj;
    }
	
	function labelFormatter(label, series) {
        return '<div class="pie-label">' + Math.round(series.percent) + "%</div>";
	}
	
  //
  // Start of Demo Script
  // 
  angular.element(document).ready(function () {

    
    // Spline chart
    (function () {
        var Selector = '.chart-spline';
        $(Selector).each(function() {
            var source = $(this).data('source') || $.error('Spline: No source defined.');
            var chart = new FlotChart(this, source),
                option = {
                    series: {
                        lines: {
                            show: false
                        },
                        points: {
                            show: true,
                            radius: 4
                        },
                        splines: {
                            show: true,
                            tension: 0.4,
                            lineWidth: 1,
                            fill: 0.5
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
                        min: 0,
                        tickColor: '#eee',
                        position: ($scope.app.layout.isRTL ? 'right' : 'left')
                    },
                    shadowSize: 0
                };
            
            // Send Request and Listen for refresh events
            chart.requestData(option).listen();

        });
    })();
    // Line chart
    (function () {
        var Selector = '.chart-line';
        $(Selector).each(function() {
            var source = $(this).data('source') || $.error('Line: No source defined.');
            var chart = new FlotChart(this, source),
                option = {
                    series: {
                        lines: {
                            show: true,
                            fill: 0.01
                        },
                        points: {
                            show: true,
                            radius: 4
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
                        tickColor: '#eee',
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

        /*(function () {
        var Selector = '.chart-pie';
        $(Selector).each(function() {
            var chart = new FlotChart(this, null),
                option = {
                    series: {
                        pie: {
                            show: true,
                            innerRadius: 0,
                            label: {
                                show: true,
                                radius: 0.8,
                                formatter: function (label, series) {
                                    return '<div class="flot-pie-label">' +
                                    //label + ' : ' +
                                    Math.round(series.percent) +
                                    '%</div>';
                                },
                                background: {
                                    opacity: 0.8,
                                    color: '#222'
                                }
                            }
                        }
                    }
                };
            // Send Request
            chart.setData(option, $scope.requestByStatus[$scope.selectedPeriod]);
        });
    })();
    */
  });
    
  $scope.setVenue = function(venueName, venueNumber) {
        $scope.init();
   };
   $scope.formatBarData = function(data) {
        if (data.length > 0){
            for (var index in data[0].series) {
                var d = data[0].series[index];
                d.data = d.data.reverse();
            }
        }
        return RestServiceFactory.formatBarData(data, 'subName',$scope.selectedPeriod);
    };
   

    $scope.reservedBookingChart = function() {
        var temp = $scope.selectedPeriod.toLowerCase();
        var aggPeriodType = temp.charAt(0).toUpperCase() + temp.slice(1);
        $scope.reservedBookings  = {};
        RestServiceFactory.AnalyticsService().get({id: $scope.effectiveVenueId, 
                            anaType: 'ReservedBookings', aggPeriodType: aggPeriodType, filter: 'scodes=BPK'}, function(data){
            $scope.reservedBookings = data;
            $('#pie_rb').ClassyLoader({
               lineColor: "#23b7e5",
               remainingLineColor: "rgba(200,200,200,0.4)",
               lineWidth: 10,
               roundedLine : true
            }).draw(data.currentBookingPercentage);
            $('#bar_rb').sparkline(data.barData, {
                type: "bar",
                height: 50,
                barWidth: 7,
                barSpacing: 3,
                barColor: '#23b7e5'
            });
            
            //$('#bar_rb').attr("values", );
        },function(error){
            /*if (typeof error.data !== 'undefined') { 
                toaster.pop('error', "Server Error", error.data.developerMessage);
            }*/
        });
    };
    // Bar Stacked chart
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
    // Donut
    $scope.donutInit = function () {
        
        var chart = new FlotChart($('#reservationStatusId'), null);
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
                    defaultTheme: true
                }
            };
        // Send Request
        if ($scope.requestByStatus && $scope.requestByStatus[$scope.selectedPeriod] !== 'undefined') {
            chart.setData(option, $scope.requestByStatus[$scope.selectedPeriod]);
        }

    };
    
    $scope.inbox = function() {
        $state.go('app.mailbox.all');
    };

    $scope.reservationInsight =function() {
        $state.go('app.reservationInsight');
    };

    $scope.cityInsight = function() {
        $state.go('app.cityInsight');
    };

    $scope.requestsInsight = function() {
        $state.go('app.requestsDashboard');
    };
    $scope.donutInit();
    $scope.init();


    function makeSeries(data) {
        var series = [];
        var serie = {
            data: [],
             bars: {
                  show: true,
                  barWidth: 0.9,
                  align: 'center'
              }
        }; 
         series.push(serie);
        createSeries(data, 'VenueMap', 'Bottle Service',serie);
        createSeries(data, 'BanquetHall', 'Private Event',serie);
        createSeries(data, 'Bottle', 'Bottle', serie);
        return series;
    }
    
    function createSeries(data, name, seriesName, serie) {
        if (!!data[name]) {
            serie.data.push([serie.data.length, 0]);
            for (var i = 0; i < data[name].length && i < 3; i++) {
                serie.data.push([data[name][i].productName, data[name][i].value])
            } 
        }
    }
}]);
