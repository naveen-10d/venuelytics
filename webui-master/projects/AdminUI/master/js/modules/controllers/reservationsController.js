/**
 * smangipudi
 * ========================================================= 
 * Module:
 * reservationsController.js  for reservation manager view
 * =========================================================
 */

 App.controller('ReservationsController',  ['$state', '$stateParams','$scope', '$rootScope','AUTH_EVENTS',
  'AuthService', '$cookies', 'Session', 'ContextService', 'RestServiceFactory', 'APP_EVENTS',
        function ($state, $stateParams, $scope, $rootScope, AUTH_EVENTS, AuthService, $cookies, Session, contextService, RestServiceFactory, APP_EVENTS) {
    "use strict";

  $scope.venueMapData = [];
  $scope.selectedDate = null;
  $scope.selectedVenueMap = {};
  $scope.venueNumber = contextService.userVenues.selectedVenueNumber;
  $scope.selectedTable = {};
  $scope.order = {};
  $scope.isCurrSelReserved = false;
  $scope.isBanquetHallReserved = false;
  $scope.loading = false;
  $scope.selectCalender = false;
 /**
 * Invoke full calendar plugin and attach behavior
 * @param  jQuery [calElement] The calendar dom element wrapped into jQuery
 * @param  EventObject [events] An object with the event list to load when the calendar displays
 */
 $scope.events = [];

 $scope.getReservationSummary = function() {
  RestServiceFactory.AnalyticsService().get({id: contextService.userVenues.selectedVenueNumber, 
   anaType: 'ReservedBookings', aggPeriodType: 'Yearly', filter: 'scodes=BPK&aggTypeFilter=2017'}, function(data){
    $scope.reservedBookings = data;
    $scope.events.splice(0);
    var tableCount = $scope.reservedBookings['VenueMap.count'];
    var banquetCount = $scope.reservedBookings['BanquetHall.count'];
    for( var dateKey in $scope.reservedBookings.calendar){
      if ($scope.reservedBookings.calendar.hasOwnProperty(dateKey)) {
        if (typeof tableCount !== 'undefined' && tableCount > 0) {
          var reservedTables = $scope.reservedBookings.calendar[dateKey].VenueMap;
          var reservedBanquetHall = $scope.reservedBookings.calendar[dateKey].BanquetHall;
          //Reserved Tables In calender
          if (typeof reservedTables === 'undefined') {
            reservedTables = 0;
          }
          var from = dateKey.split("-");
          var fromDate = new Date(from[0], from[1] - 1, from[2]);
          var remaining = (tableCount - reservedTables);
          if (remaining < 0) {
            remaining = 0;
          }
          var obj = {};
          obj.title = 'A: ' + remaining;	
          obj.serviceType = 'BottleService';
          obj.start = fromDate;
          if (remaining === 0) 	{
            obj.title = 'Fully Booked';	
            obj.backgroundColor = '#f56954'; //red 
            obj.borderColor = '#f56954'; //red
          } else if (remaining < tableCount ) {
            obj.backgroundColor = '#f39c12'; //green 
            obj.borderColor = '#f39c12'; //green
          } else {
            obj.backgroundColor = '#00a65a'; //yellow 
            obj.borderColor = '#00a65a'; //yellow
          }
          obj.allDay = true;  
          $scope.events.push(obj);

          //BanquetHall Events In calender
          if (typeof reservedBanquetHall === 'undefined') {
            reservedBanquetHall = 0;
          }
          
          var remaining = (banquetCount - reservedBanquetHall);
          if (remaining < 0) {
            remaining = 0;
          }
          var banquetObj = {};
          banquetObj.title = 'A: ' + remaining;  
          banquetObj.serviceType = 'BanquetHall';
          banquetObj.start = fromDate;
          if (remaining === 0)  {
            banquetObj.title = 'Fully Booked'; 
            banquetObj.backgroundColor = '#f56954'; //red 
            banquetObj.borderColor = '#f56954'; //red
          } else if (remaining < banquetCount ) {
            banquetObj.backgroundColor = '#f39c12'; //green 
            banquetObj.borderColor = '#f39c12'; //green
          } else {
            banquetObj.backgroundColor = '#00a65a'; //yellow 
            banquetObj.borderColor = '#00a65a'; //yellow
          }
          banquetObj.allDay = true;  
          $scope.events.push(banquetObj);
        }
      }
    }
     $('#calendar').fullCalendar( 'removeEvents');
     $('#calendar').fullCalendar( 'addEventSource', $scope.events );
     $('#calendar').fullCalendar('rerenderEvents' );
    },function(error){
      /*if (typeof error.data !== 'undefined') { 
          //toaster.pop('error', "Server Error", error.data.developerMessage);
      }*/
    });
};

$scope.initCalendar = function () {
 var calElement = $('#calendar');
	  	// check to remove elements from the list 
	  	calElement.fullCalendar({
       isRTL: $scope.app.layout.isRTL,
       header: {
         left:   'prev,next today',
         center: 'title',
         right:  'month,agendaWeek,agendaDay'
       },
	      buttonIcons: { // note the space at the beginning
         prev:    ' fa fa-caret-left',
         next:    ' fa fa-caret-right'
       },
       buttonText: {
         today: 'today',
         month: 'month',
         week:  'week',
         day:   'day'
       },
       editable: false,
       selectable: true,
	      droppable: false, // this allows things to be dropped onto the calendar 
	      drop: function(date, allDay) { // this function is called when something is dropped

         var $this = $(this),
	              // retrieve the dropped element's stored Event Object
               originalEventObject = $this.data('calendarEventObject');

	          // if something went wrong, abort
	          if(!originalEventObject) return;

	          // clone the object to avoid multiple events with reference to the same object
	          var clonedEventObject = $.extend({}, originalEventObject);

	          // assign the reported date
	          clonedEventObject.start = date;
	          clonedEventObject.allDay = allDay;
	          clonedEventObject.backgroundColor = $this.css('background-color');
	          clonedEventObject.borderColor = $this.css('border-color');

	          // render the event on the calendar
	          // the last `true` argument determines if the event "sticks" 
	          // (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
	          //calElement.fullCalendar('renderEvent', clonedEventObject, true);
	          
         },
         dayClick: function (date, jsEvent, view) {
          $scope.selectedDate = date;
          $scope.setVenueMapImage();
          $scope.selectCalender = true;

        },
        eventClick: function( event, jsEvent, view ) {
          if(event.serviceType === 'BottleService') {
              $scope.selectedDate = event.start;
              calElement.fullCalendar('select',$scope.selectedDate);
              $scope.serviceType = 'BottleService';
              $scope.setVenueMapImage();
          } else if(event.serviceType === 'BanquetHall') {
              $scope.selectedDate = event.start;
              calElement.fullCalendar('select',$scope.selectedDate);
              $scope.serviceType = 'BanquetHall';
              $scope.getBanquetHall();
          }
          
        },
        eventDragStart: function (event, js, ui) {
	        //draggingEvent = event;
	      },
	      eventRender: function(event, eventElement) {
          if (event.serviceType === 'BottleService') {
            eventElement.find("span.fc-event-title").prepend('<em class="fa fa-glass">');
          } else if (event.serviceType === 'BanquetHall') {
            eventElement.find("span.fc-event-title").prepend('<em class="fa fa-diamond">');
          }
        },
	      // This array is the events sourc === 'BottleService'es
	      events: $scope.events
      });
      $scope.selectedDate = calElement.fullCalendar('getDate');
     
      var promise = RestServiceFactory.VenueMapService().getAll({id: $scope.venueNumber, type: 'VenueMap'});

      promise.$promise.then(function(data) {
        $scope.venueMapData = data;
        $scope.setVenueMapImage();    
      });
    };
    $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
        // register on venue change;
      $scope.venueMapData = [];
      $scope.selectedDate = null;
      $scope.selectedVenueMap = {};
      $scope.venueNumber = contextService.userVenues.selectedVenueNumber;
      $scope.selectedTable = {};
      $scope.order = {};
      $scope.isCurrSelReserved = false;
      $scope.isBanquetHallReserved = false;
      $scope.loading = false;
      $scope.selectCalender = false;
       $scope.getReservationSummary();
    });

    $scope.clickServiceType =  function( event ) {
          if(event === 'BottleService') {
              $scope.serviceType = 'BottleService';
              $scope.selectCalender = false;
              $scope.setVenueMapImage();
              $scope.order.type = $scope.reservationData[$scope.selectedTable.id].type;
          } else if(event === 'BanquetHall') {
              $scope.serviceType = 'BanquetHall';
              $scope.selectCalender = false;
              $scope.getBanquetHall();
              $scope.banquetOrder.type = $scope.reservationData[$scope.selectBanquet.id].type;
          }
          
        }
    $scope.selectTable = function(tableId, name, table) {
      $scope.idSelectedTable = tableId.id;
      if($scope.selectedVenueMap.imageUrls.length === 0) {
          $scope.selectedTable =  table;
      } else {
          $scope.selectedTable =  $scope.selectedVenueMap.productsByName[name];
      }
      $scope.isCurrSelReserved = typeof $scope.reservationData[$scope.selectedTable.id] !== 'undefined';
      $scope.order = {};
      if (typeof $scope.reservationData[$scope.selectedTable.id] === 'undefined') {
          $scope.order.type = 'OPEN';
      } else {
          $scope.order = $scope.reservationData[$scope.selectedTable.id].serviceInfo;
          $scope.order.type = $scope.reservationData[$scope.selectedTable.id].type;
      }
    };

    $scope.selectBanquetHall = function(banquet) {
      $scope.idSelectedTable = banquet.id;
      $scope.selectBanquet =  banquet;
      $scope.isBanquetHallReserved = typeof $scope.reservationData[$scope.selectBanquet.id] !== 'undefined';
      $scope.banquetOrder = {};
      if (typeof $scope.reservationData[$scope.selectBanquet.id] === 'undefined') {
        $scope.banquetOrder.type = 'OPEN';
      } else {
        $scope.banquetOrder = $scope.reservationData[$scope.selectBanquet.id].serviceInfo;
        $scope.banquetOrder.type = $scope.reservationData[$scope.selectBanquet.id].type;
      }
    };

    $scope.getBanquetHall = function() {

      var promise = RestServiceFactory.ProductService().getPrivateEvents({id:$scope.venueNumber});
      promise.$promise.then(function(data) {
      $scope.BanquetHallDetails = data;
      });
        $scope.reservationData = [];
        RestServiceFactory.ReservationService().getForDate({id: $scope.venueNumber, date: $scope.selectedDate.format("YYYYMMDD")}, function(data){
          angular.forEach(data, function(obj, key) {
            $scope.reservationData[obj.productId] = obj;
            if (typeof obj.product !== 'undefined') {
              $scope.reservationData[obj.product.sku] = obj;

            }
          });
          $scope.loading = false;  
        }, function(error){
          $scope.loading = false;
        });
    }

    $scope.setVenueMapImage = function() {
      if ($scope.selectedDate != null) {
         $scope.loading  = true;
        var day = $scope.selectedDate.format('ddd').toUpperCase();

        for (var index = 0; index < $scope.venueMapData.length; index++) {
          var venueMap = $scope.venueMapData[index];
          if(venueMap.days === '*' || venueMap.days.indexOf(day) !== -1) {
            $scope.selectedVenueMap = venueMap;
            $scope.selectedVenueMap.productsByName = [];
            angular.forEach(venueMap.elements, function(obj, key){
              $scope.selectedVenueMap.productsByName[obj.name] = obj;
            });
            var tableMaps = JSON.parse(venueMap.imageMap);
            var maps =[];
            tableMaps.map(function(t){
              var arc = JSON.parse("["+t.coordinates+"]");
              var elem = {};
              elem.name = t.TableName;
              elem.id =  $scope.selectedVenueMap.productsByName[elem.name].sku;
              elem.coords = [];
              elem.coords[0] = arc[0];
              elem.coords[1] = arc[1]; 
              elem.coords[2] = arc[4];
              elem.coords[3] = arc[5];
              maps.push(elem);
            });
            $scope.selectedVenueMap.coordinates = maps;
            break;
          } 
        }
        $scope.reservationData = [];
        RestServiceFactory.ReservationService().getForDate({id: $scope.venueNumber, date: $scope.selectedDate.format("YYYYMMDD")}, function(data){
          angular.forEach(data, function(obj, key) {
            $scope.reservationData[obj.productId] = obj;
            if (typeof obj.product !== 'undefined') {
              $scope.reservationData[obj.product.sku] = obj;
            }
          });
          $scope.paintVenueMapItems();
          $scope.loading = false;  
        }, function(error){
          $scope.loading = false;
        });
      }

    };
    $scope.fillColor = function(id) {
     var obj = $scope.reservationData[id];
     if (typeof obj === 'undefined') {
      return "00FF00";
     } else {
      return "FF0000";
     }

    };
    $scope.bookedTableColor = function(type){
      var obj = $scope.reservationData[type];
      if(typeof obj === 'undefined') {
        return 'success';
      } else {
        return 'danger';
      }
    };

    $scope.getStatusColor = function(type) {
      
      if (typeof type === 'undefined') {
        return 'gray';
      } else if ( type === 'OPEN') {
        return 'success';
      } else if (type === 'HOLDON') {
        return 'warning';
      } else {
        return 'danger';
      }
    };
    $scope.paintVenueMapItems = function() {

      var divHeight = $('#imageMap').height();
      var divWidth = $('#imageMap').width();
      
      if (divHeight > 0) {
        $('div.map.img-responsive').css('width', divWidth + 'px');
        $('div.map.img-responsive').css('height', divHeight + 'px');
        $('canvas').css('height', divHeight + 'px');
        $('canvas').css('width', divWidth + 'px');
        $('#imageMap').css('height', divHeight + 'px');
        $('#imageMap').css('width', divWidth + 'px');
      }

      setTimeout(function() {  
        $("img[usemap]").jMap();
        setTimeout(function(){
          $('#imageMap').maphilight();
        }, 200);
      }, 200);

    };
    $scope.initCalendar();
    $scope.getReservationSummary();
    $("img[usemap]").jMap();
    $('#imageMap').maphilight();

  }]);
