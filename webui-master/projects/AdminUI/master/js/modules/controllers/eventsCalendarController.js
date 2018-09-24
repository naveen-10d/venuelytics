/**
 * smangipudi
 * ========================================================= 
 * Module:
 * reservationsController.js  for reservation manager view
 * =========================================================
 */

App.controller('EventsCalendarController',  ['$state', '$stateParams','$scope', '$rootScope',  'ContextService', 'RestServiceFactory', 'APP_EVENTS',
  function ($state, $stateParams, $scope, $rootScope, contextService, RestServiceFactory, APP_EVENTS) {
  "use strict";

  var DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
 /**
 * Invoke full calendar plugin and attach behavior
 * @param  jQuery [calElement] The calendar dom element wrapped into jQuery
 * @param  EventObject [events] An object with the event list to load when the calendar displays
 */
  $scope.events = [];
  $scope.calEvents = [];
  $scope.colorPalattes = ["rgb(45,137,239)", "rgb(153,180,51)", "rgb(227,162,26)",  "rgb(0,171,169)","#f05050", "rgb(135,206,250)", "rgb(255,196,13)"];
  $scope.getEvents = function() {
    var promise = RestServiceFactory.VenueService().getEvents({id: contextService.userVenues.selectedVenueNumber});
    promise.$promise.then(function(data) {
      $scope.events = data['venue-events'];
      var today = new Date();
      $scope.calEvents = [];
      for(var i = 0; i < $scope.events.length; i++) {
        var event = $scope.events[i];
        if (event.enabled !== 'Y') {
          continue;
        }
        var obj = {};
        obj.title = event.eventType  + ':' +  event.eventName;  
     
        var startDate = event.startDate.substring(0,10);
        var from = startDate.split("-");
        var sDate = new Date(from[0], from[1] - 1, from[2]);

        var endDate = event.endDate.substring(0,10);
        from = endDate.split("-");
        var endDate = new Date(from[0], from[1] - 1, from[2]);

     
        var t = event.eventTime.split(":");
        var h = parseInt(t[0]);
        var m = parseInt(t[1]);
       
        sDate.setHours(h);
        sDate.setMinutes(m);
        sDate.setSeconds(0);

        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);

        obj.start = sDate;
        obj.end = moment(sDate).add(event.durationInMinutes, 'm');
        obj.allDay = false;
        obj.backgroundColor = $scope.colorPalattes[i % $scope.colorPalattes.length];
        obj.borderColor = $scope.colorPalattes[i % $scope.colorPalattes.length];
        obj.className = '__event_id_class';
        var tempDays = event.scheduleDayOfMonth.split(",");
        var mDays = [];
        for (var md = 0; md < tempDays.length; md++) {
          mDays[tempDays[md].trim()] = 1;
        }
        for (var timeMilliSecs = sDate.getTime(); timeMilliSecs <= endDate.getTime(); timeMilliSecs = timeMilliSecs + 24*60*60*1000) {
          var cloneObj = $.extend({}, obj);
          
          if (timeMilliSecs > today.getTime() + 180 * 24 * 60 * 60 * 1000) {
            break; // show only for 6 months from today.
          }
          var d = new Date(timeMilliSecs);
          cloneObj.start = d;
          cloneObj.end = moment(cloneObj.start).add(event.durationInMinutes, 'm');
          var day = DAYS[d.getDay()];
          cloneObj.venueEvent = event;
          if (event.scheduleDayOfWeek.length > 0) {
            if (event.scheduleDayOfWeek.indexOf(day) >=0) {
              $scope.calEvents.push(cloneObj);
            }
          } else if (event.scheduleDayOfMonth.length > 0) {
            if (mDays[d.getDate()] === 1) {
              $scope.calEvents.push(cloneObj);
            }
          } else {
            $scope.calEvents.push(cloneObj);
            break;
          }
        }
      }
      $('#eventsCalendar').fullCalendar( 'removeEvents');
      $('#eventsCalendar').fullCalendar( 'addEventSource', $scope.calEvents );
      $('#eventsCalendar').fullCalendar('rerenderEvents' );
    });  
  };


  $scope.initCalendar = function () {
    var calElement = $('#eventsCalendar');
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
          $scope.selectCalender = true;
          $scope.event = null;
          $scope.$digest();
      },
      eventClick: function( event, jsEvent, view ) {
        $scope.selectCalender = false;
        $scope.event = event.venueEvent;
        $scope.eventSelectedDate = event.start;
        $('.__event_id_class').css('border-color', '');
        $(this).css('border-color', 'red');
        $scope.$digest();
      },
      eventDragStart: function (event, js, ui) {
        //draggingEvent = event;
      },
      eventRender: function(event, eventElement) {
      },
	      // This array is the events sourc === 'BottleService'es
	    events: $scope.calEvents
    });
    $scope.selectedDate = calElement.fullCalendar('getDate');
     
    var promise = RestServiceFactory.VenueMapService().getAll({id: contextService.userVenues.selectedVenueNumber});

    promise.$promise.then(function(data) {
          
    });
  };
  $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
      $scope.getEvents();  
  
  });

  $scope.initCalendar();
  $scope.getEvents();
}]);
