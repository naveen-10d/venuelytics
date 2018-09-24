
App.controller('TicketDashBoardController',['$log','$scope','$window', '$http', '$timeout','ContextService',
    'RestServiceFactory','$translate','colors', 'APP_EVENTS','Session','$state', 
    function($log, $scope, $window, $http, $timeout, contextService, RestServiceFactory, $translate, colors, APP_EVENTS, session, $state) {
	'use strict';
    if (session.roleId >= 10 && session.roleId <= 12) {
        $state.go('app.ticketsCalendar'); 
        return;
    }
    $scope.TYPES = ['ACTIVE', 'HISTORY', 'ALL'];
    $scope.selectedType = 'ACTIVE';
    
    $scope.totalDays = {icon: 'fa-sun-o', bgColor: 'bg-purple', bgColorSecondary: 'bg-purple-dark', label: 'Total Days', value: ' '};
    $scope.totalTickets = {icon: 'fa-ticket', bgColor: 'bg-info', bgColorSecondary: 'bg-info-dark', label: 'Total Tickets', value: ' '};
    $scope.canceledTickets = {icon: 'fa-ticket', bgColor: 'bg-green', bgColorSecondary: 'bg-green-dark', label: 'Canceled Tickets', value: ' '};
    $scope.numberOfStores = {icon: 'fa-building', bgColor: 'bg-danger', bgColorSecondary: 'bg-danger-dark', label: 'Number of Stores', value: ' '};
    $scope.statsPerEvent = [];
    $scope.pieData = [];
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

        $scope.top3Stats[0] = createPDO($scope.colorPalattes[0],{"label":"Total Revenue", "value":0, "icon":"fa fa-dollar"}, "javascript:void();");
        $scope.top3Stats[1] = createPDO($scope.colorPalattes[1],{"label":"Tickets Sold", "value":0, "icon":"fa fa-ticket"}, "javascript:void();");
        $scope.top3Stats[2] = createPDO($scope.colorPalattes[2],{"label":"Number of Shows", "value":0, "icon":"fa fa-shopping-cart"}, "javascript:void();");
        $scope.top3Stats[3] = createPDO($scope.colorPalattes[3],{"label":"Number of Events", "value":0, "icon":"fa fa-diamond"}, "javascript:void();");       
       
        //$scope.top3Stats[3] = createPDO($scope.colorPalattes[3],{"label":"CheckIns", "value":0, "icon":"icon-login"}, "#/app/dashboard/reservation-insight");
        
        $scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;

      

       $scope.setDisplayData();
    
	};

    $scope.eventDrillDown = function(item) {
        $state.go('app.eventDashboard', {eventId: item.eventId});
    };

    $scope.setDisplayData = function() {
        RestServiceFactory.AnalyticsService().getTicketingAnalytics({id: $scope.effectiveVenueId, type: $scope.selectedType}, function(data){
            $scope.processAnalytics(data);
        },function(error){
            /*if (typeof error.data !== 'undefined') { 
                toaster.pop('error', "Server Error", error.data.developerMessage);
            }*/
        });   
    };


    $scope.processAnalytics = function(data) {
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

        $scope.processTicketsPerEvent(data.ticketAnalyticItems);
        $scope.initAmountCollectedChart(data.paidAmounAnalytics);
    };

    $scope.initAmountCollectedChart = function(data) {
        
        var option = {
                series: {
                    pie: {
                        show: true,
                        innerRadius: 0.2, // This makes the donut shape,
                        radius: 1,
                        label: {
                            show: "true",
                            formatter: function(label, slice) {
                                return "<div style='font-size:small;text-align:center;padding:2px;color:#fff;'><strong>" + label + "<br/>$" + slice.data[0][1] + "</strong></div>";
                            },  // formatter function
                            radius: 2/3,  // radius at which to place the labels (based on full calculated radius if <=1, or hard pixel value)
                            threshold: 0    // percentage at which to hide the label (i.e. the slice is too narrow)
                        }

                    }

                },
                legend: {
                        show: false
                    },
                grid: {
                    hoverable: true
                },
                tooltip: true,
                tooltipOpts: {
                    cssClass: "flotTip",
                    content: "%s: %y.0",
                    defaultTheme: true
                } 
                
            };
        // Send Request
        
      
       $scope.pieData = [];
        
        angular.forEach(data, function(value, colorIndex) {
            //console.log(colorIndex +": " + value.paidAmount);
            $scope.pieData.push(createPieElem($scope.colorPalattes[colorIndex % $scope.colorPalattes.length],value.storeName,value.paidAmount));
        });
        var chart = new FlotChart($('#amountedCollectedPieId'), null);
       chart.setData(option, $scope.pieData);
        
    };
    $scope.P = function(a,b) {
        if (b <= 0) {
            return 0;
        }
        return Math.round(a*1000/b)/10;
    };

    $scope.processTicketsPerEvent = function(items) {
        $scope.statsPerEvent = [];
         $scope.statsPerEventMap = [];
        for (var idx in items) {
            var id = "event-" + items[idx].eventId;
            var item = items[idx];
            var eventItem = $scope.statsPerEventMap[id];
            if (typeof (eventItem) == 'undefined') {
                eventItem = {};
                eventItem.eventName = item.eventName;
                eventItem.id = id;
                eventItem.eventId = items[idx].eventId;
                eventItem.totalTickets = 0;
                eventItem.soldTickets = 0;
                eventItem.canceledTickets = 0;
                eventItem.totalSales = 0;
                eventItem.checkedInTickets = 0;
                $scope.statsPerEventMap[id] = eventItem;
                $scope.statsPerEvent.push(eventItem);
            }
            eventItem.totalTickets += item.totalCount;
            if (item.status === 'CANCELED') {
                eventItem.canceledTickets += item.soldCount;
            } else {
                eventItem.checkedInTickets += item.checkedIn;
                eventItem.soldTickets += item.soldCount;
                eventItem.totalSales += item.totalPrice;
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
