
App.controller('EventDashBoardController',['$log','$scope','$window', '$http', '$timeout','ContextService',
    'RestServiceFactory','$translate','colors', 'APP_EVENTS','Session','$state', '$stateParams',
    function($log, $scope, $window, $http, $timeout, contextService, RestServiceFactory, $translate, colors, APP_EVENTS, session, $state, $stateParams) {
	'use strict';
    if (session.roleId >= 10 && session.roleId <= 12) {
        $state.go('app.ticketsCalendar'); 
        return;
    }
    $scope.TYPES = ['ACTIVE', 'HISTORY', 'ALL'];

    $scope.colors = ["#0094cb", "#ff3366", "#ff3366", "#51bff2", "#4a8ef1", "#3cb44b", "#0082c8", "#911eb4", "#e6194b", "#f0693a", "#f032e6 ", "#f58231", "#d2f53c", "#ffe119", "#a869f2", "#008080", "#aaffc3", "#e6beff", "#aa6e28", "#fffac8", "#800000", "#808000 ", "#ffd8b1", "#808080", "#808080"];

    $scope.selectedType = 'ACTIVE';
    
    $scope.totalDays = {icon: 'fa-sun-o', bgColor: 'bg-purple', bgColorSecondary: 'bg-purple-dark', label: 'Total Days', value: ' '};
    $scope.totalTickets = {icon: 'fa-ticket', bgColor: 'bg-info', bgColorSecondary: 'bg-info-dark', label: 'Total Tickets', value: ' '};
    $scope.canceledTickets = {icon: 'fa-ticket', bgColor: 'bg-green', bgColorSecondary: 'bg-green-dark', label: 'Canceled Tickets', value: ' '};
    $scope.numberOfStores = {icon: 'fa-building', bgColor: 'bg-danger', bgColorSecondary: 'bg-danger-dark', label: 'Number of Stores', value: ' '};
    $scope.statsPerStore = [];
    $scope.eventId = $stateParams.eventId;
    $scope.eventName = '';
    $scope.statusPerTicketype = [];
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

    $scope.trigger  = 1;
    $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
        // register on venue change;
       $scope.init();
    });
    
	$scope.init=function(){
	   
    	$log.log("Dashboard controller has been initialized!");
		
        $scope.colorPalattes = ["rgb(45,137,239)", "rgb(153,180,51)", "rgb(227,162,26)",  "rgb(0,171,169)","#f05050", "rgb(135,206,250)", "rgb(255,196,13)"];
        $scope.top3Stats = [];

        $scope.top3Stats[0] = createPDO($scope.colorPalattes[0],{"label":"Total Revenue", "value":0, "icon":"fa fa-dollar"}, "#");
        $scope.top3Stats[1] = createPDO($scope.colorPalattes[1],{"label":"Tickets Solds", "value":0, "icon":"fa fa-ticket"}, "#");
        $scope.top3Stats[2] = createPDO($scope.colorPalattes[2],{"label":"Number of Shows", "value":0, "icon":"fa fa-shopping-cart"}, "#");
        $scope.top3Stats[3] = createPDO($scope.colorPalattes[3],{"label":"Number of Events", "value":0, "icon":"fa fa-diamond"}, "#");       
       
        //$scope.top3Stats[3] = createPDO($scope.colorPalattes[3],{"label":"CheckIns", "value":0, "icon":"icon-login"}, "#/app/dashboard/reservation-insight");
        
        $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;

      

       $scope.setDisplayData();
    
	};
    $scope.setDisplayData = function() {
        RestServiceFactory.AnalyticsService().getTicketingAnalytics({id: $scope.effectiveVenueId, type: $scope.selectedType, eventId: $scope.eventId}, function(data){
            $scope.processAnalytics(data);
        },function(error){
            /*if (typeof error.data !== 'undefined') { 
                toaster.pop('error', "Server Error", error.data.developerMessage);
            }*/
        });   
    };

    $scope.P = function(a,b) {
        if (b <= 0) {
            return 0;
        }
        return Math.round(a*1000/b)/10;
    };

    $scope.processAnalytics = function(data) {
        if (data.ticketAnalyticItems && data.ticketAnalyticItems.length > 0) {
            $scope.eventName = data.ticketAnalyticItems[0].eventName;
        }
        $scope.top3Stats[0].value = $scope.currencyFormatter.format(data.totalSales);
        $scope.top3Stats[1].value = $scope.currencyFormatter.format(data.soldTickets);
        $scope.top3Stats[2].value = $scope.currencyFormatter.format(data.totalShows);
        $scope.top3Stats[3].value = $scope.currencyFormatter.format(data.totalEvents);
        $scope.totalDays.value =  $scope.currencyFormatter.format(data.totalDays);
        $scope.totalTickets.value =  $scope.currencyFormatter.format(data.totalTickets);
        $scope.canceledTickets.value =  $scope.currencyFormatter.format(data.canceledTickets);
        $scope.numberOfStores.value =  $scope.currencyFormatter.format(data.noOfStores);

        if (data.totalTickets > 0) {
            
            $scope.soldPercent = $scope.P(data.soldTickets, data.totalTickets);
            $scope.cancelPercent = $scope.P(data.canceledTickets, data.totalTickets);
            $scope.checkedInPercent = $scope.P(data.checkedIn, data.soldTickets);
            $scope.soldPercentText = ''+data.soldTickets + ' of ' + data.totalTickets;
            $scope.checkedInPercentText = ''+data.checkedIn + ' of ' + data.soldTickets;
            $scope.cancelPercentText =  ''+data.canceledTickets + ' of ' + data.totalTickets;

        } else {
            $scope.soldPercent = 0;
            $scope.cancelPercent = 0;
            $scope.soldPercentText = '0 of ' + data.totalTickets;
            $scope.cancelPercentText = '0 of ' + data.totalTickets;
            $scope.checkedInPercentText = '0 of ' + data.soldTickets;
        }

        $scope.processTicketsPerStore(data.ticketAnalyticItems);
    };
    
    $scope.processTicketsPerStore = function(items) {
        $scope.statsPerStore = [];
        $scope.statsPerStoreMap = [];
        $scope.statusPerTicketype = [];

        var statusPerTicketypeMap = [];

        for (var idx in items) {
            var id = "store-" + items[idx].storeNumber;
            var item = items[idx];
            var eventItem = $scope.statsPerStoreMap[id];
            if (typeof (eventItem) == 'undefined') {
                eventItem = {};
                eventItem.storeName = item.storeName;
                eventItem.id = id;
                eventItem.totalTickets = 0;
                eventItem.soldTickets = 0;
                eventItem.canceledTickets = 0;
                eventItem.totalSales = 0;
                eventItem.checkedInTickets = 0;
                $scope.statsPerStoreMap[id] = eventItem;
                eventItem.statusPerTicketype = [];
                eventItem.statusPerTicketypeMap = [];
                $scope.statsPerStore.push(eventItem);
            }

            var ticketTypeStat = statusPerTicketypeMap[item.ticketName];
            if (typeof (ticketTypeStat) == 'undefined') {
                ticketTypeStat = {};
                ticketTypeStat.ticketName = item.ticketName;
                ticketTypeStat.totalTickets = 0;
                ticketTypeStat.soldTickets = 0;
                ticketTypeStat.canceledTickets = 0;
                ticketTypeStat.totalSales = 0;
                statusPerTicketypeMap[item.ticketName] = ticketTypeStat;
                $scope.statusPerTicketype.push(ticketTypeStat);

            }

            var eventTicketTypeStat = eventItem.statusPerTicketypeMap[item.ticketName];
            if (typeof (eventTicketTypeStat) == 'undefined') {
                eventTicketTypeStat = {};
                eventTicketTypeStat.ticketName = item.ticketName;
                eventTicketTypeStat.totalTickets = 0;
                eventTicketTypeStat.soldTickets = 0;
                eventTicketTypeStat.canceledTickets = 0;
                eventTicketTypeStat.totalSales = 0;
                eventItem.statusPerTicketypeMap[item.ticketName] = eventTicketTypeStat;
                eventItem.statusPerTicketype.push(eventTicketTypeStat);

            }


            eventTicketTypeStat.totalTickets += item.totalCount;
            ticketTypeStat.totalTickets += item.totalCount;
            eventItem.totalTickets += item.totalCount;

            if (item.status === 'CANCELED') {
                eventItem.canceledTickets += item.soldCount;
                ticketTypeStat.totalTickets += item.totalCount;
                eventTicketTypeStat.totalTickets += item.totalCount;
            } else {
                eventItem.checkedInTickets += item.checkedIn;
                eventItem.soldTickets += item.soldCount;
                eventItem.totalSales += item.totalPrice;
                ticketTypeStat.soldTickets += item.soldCount;
                ticketTypeStat.totalSales += item.totalPrice;

                eventTicketTypeStat.soldTickets += item.soldCount;
                eventTicketTypeStat.totalSales += item.totalPrice;
            }




        }
    };
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
    $scope.setType = function(type) {
        if ($scope.selectedType !== type){
            $scope.selectedType = type;
            $scope.setDisplayData();
        }
    };

    
    
    /**
     * loading visitor states
     */
    $scope.reload = function() {

       
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
	
    
    
    $scope.setVenue = function(venueName, venueNumber) {
        $scope.init();
    };
    // Donut
    $scope.donutInit = function () {
        var Selector = '.chart-donut';
        $(Selector).each(function() {
            //var source = $(this).data('source') || $.error('Donut: No source defined.');
            var chart = new FlotChart(this, null);
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
            // Send Request
            if ($scope.requestByStatus[$scope.selectedType] !== 'undefined') {
                chart.setData(option, $scope.requestByStatus[$scope.selectedType]);
            }
        });
    };
    
    $scope.donutInit();
    $scope.init();

}]);
