/**
 * smangipudi
 * ========================================================= 
 * Module:
 * guestlist.js  for guestlist manager view
 * =========================================================
 */

 App.controller('GuestListController',  ['$state', '$stateParams','$scope', '$rootScope','AUTH_EVENTS',
  'AuthService', '$cookies', 'Session', 'ContextService', 'RestServiceFactory', 'APP_EVENTS',
        function ($state, $stateParams, $scope, $rootScope, AUTH_EVENTS,  AuthService, $cookies, Session, contextService, RestServiceFactory, APP_EVENTS) {
    "use strict";

  
  $scope.venueNumber = contextService.userVenues.selectedVenueNumber;
  
   /**
   * Invoke full calendar plugin and attach behavior
   * @param  jQuery [calElement] The calendar dom element wrapped into jQuery
   * @param  EventObject [events] An object with the event list to load when the calendar displays
   */
  $scope.events = [];
  $scope.guestListSummary = [];
  $scope.guestList = [];

  $scope.getGuestListSummary = function() {
    RestServiceFactory.AnalyticsService().getArray({id: contextService.userVenues.selectedVenueNumber, 
      anaType: 'ServiceTypeByStatus', aggPeriodType: 'Daily', filter: 'scodes=G&aggTypeFilter=2017'}, function(data){
      $scope.guestListSummary = data[0].series[0];
      $scope.events.splice(0);
       for( var index  = 0; index < $scope.guestListSummary.data.length ; index++){
        
          var indexData = $scope.guestListSummary.data[index];
          var from = indexData[0].split("-");
          var fromDate = new Date(from[0], from[1] - 1, from[2]);
          var obj = {};
          obj.serviceType = 'GuestList';
          obj.start = fromDate;
          obj.backgroundColor = '#f39c12'; //green 
          obj.borderColor = '#f39c12'; //green
          obj.allDay = true;  
          obj.title = "# Guests: " +indexData[1];
          $scope.events.push(obj);

      }
      
      $('#calendarGuestList').fullCalendar( 'removeEvents');
      $('#calendarGuestList').fullCalendar( 'addEventSource', $scope.events );
      $('#calendarGuestList').fullCalendar('rerenderEvents' );
    },function(error){
        /*if (typeof error.data !== 'undefined') { 
            //toaster.pop('error', "Server Error", error.data.developerMessage);
        }*/
    });
  };

  $scope.initCalendar = function () {
    var calElement = $('#calendarGuestList');
      // check to remove elements from the list 
    calElement.fullCalendar({
     isRTL: $scope.app.layout.isRTL,
     header: {
       left:   'prev,next today',
       center: 'title',
       right:  'month'
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
          $scope.getGuestList();
          $scope.selectCalender = true;
          $scope.selectedRow = false;

        },
        eventClick: function( event, jsEvent, view ) {
          $scope.selectedDate = event.start;
          $scope.getGuestList($scope.selectedDate);
          $scope.selectCalender = true;
           $scope.selectedRow = false;
        
        },
        eventDragStart: function (event, js, ui) {
        //draggingEvent = event;
        },
        eventRender: function(event, eventElement) {
        
        },
        // This array is the events sourc === 'BottleService'es
        events: $scope.events
      });

      $scope.selectedDate = calElement.fullCalendar('getDate');
  
      
    $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
          // register on venue change;
       
        $scope.venueNumber = contextService.userVenues.selectedVenueNumber;
         $scope.getGuestListSummary();
      });
  };
  
  
  $scope.onRowClick = function(rowData) {

    $scope.selectedRow = rowData;
  };


  $scope.getGuestList = function(date) {

    RestServiceFactory.VenueService().getGuests({id: contextService.userVenues.selectedVenueNumber,  date: $scope.selectedDate.format("YYYYMMDD")}, function(data){
      $scope.guestList =  data;
    });
  };
        
  $scope.init = function() {
   // $('#guestListTable').on('click', 'tbody tr', function() {
      //$(this).addClass('highlight').siblings().removeClass('highlight');
    //});​
    $('#guestListTable').on('click', 'tbody tr', function() {
      $(this).addClass('highlight').siblings().removeClass('highlight');
    });
  };

  $scope.init();
  $scope.initCalendar();
  $scope.getGuestListSummary();
  

}]);
