/**
 * @author Saravanakumar K
 * @date 05-sep-2017
 */
"use strict";
app.controller('DealListCtrl', ['$log', '$scope', '$routeParams', 'AjaxService', '$rootScope','$timeout','ngMeta', 'VenueService', 'screenSize',
  function ($log, $scope,  $routeParams, AjaxService, $rootScope, $timeout, ngMeta, venueService, screenSize) {
        
    
    var self = $scope;
    var DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
    /**
    * Invoke full calendar plugin and attach behavior
    * @param  jQuery [calElement] The calendar dom element wrapped into jQuery
    * @param  EventObject [events] An object with the event list to load when the calendar displays
    */
    self.deals = [];
    self.calEvents = [];
    


   
    self.init = function() {
      self.dealListData = true ||self.isSmallScreen();
      self.venueDetails = venueService.getVenue($routeParams.venueId);
      self.venueId = self.venueDetails.id;
      ngMeta.setTag('description', self.venueDetails.description + " Deals Services");
      $rootScope.title = self.venueDetails.venueName+  " Venuelytics - Deal List";
      ngMeta.setTitle($rootScope.title);
        self.tabParam = $routeParams.tabParam;
        AjaxService.getDeals(self.venueId).then(function(response) {
          self.deals = response.data;
          self.dealsCalender();
          setTimeout(function() {
              self.getSelectedTab();
          }, 600);
        });
    };

    self.isSmallScreen = function() {
      return screenSize.is('xs, sm');
    };

    self.calenderEventView = function() {
        self.dealListData = false;
    };
    self.listEventView = function() {
        self.dealListData = true;
    };
    self.getSelectedTab = function() {
      $(".service-btn .card").removeClass("tabSelected");
      $("#deals > .card").addClass("tabSelected");
    };
    self.dealsCalender = function() {
      var today = new Date();
      self.calEvents = [];
      for(var i = 0; i < self.deals.length; i++) {
        var deal = self.deals[i];
        
        var obj = {};
        obj.title = deal.title;  
        var sDate = $scope.UTC(deal.startDate);
        var endDate = $scope.UTC(deal.expiryDate);
        
        obj.start = sDate;
        
        obj.allDay = true;
        deal.startTime = obj.start;
        
        obj.className = '__event_id_class';
      

        for (var timeMilliSecs = sDate.getTime(); timeMilliSecs <= endDate.getTime(); timeMilliSecs = timeMilliSecs + 24*60*60*1000) {
          var cloneObj = $.extend({}, obj);
          
          if (timeMilliSecs > today.getTime() + 180 * 24 * 60 * 60 * 1000) {
            break; // show only for 6 months from today.
          }
          var d = new Date(timeMilliSecs);
          cloneObj.start = d;
          
          cloneObj.venueDeal = deal;
          self.calEvents.push(cloneObj);
        }
      }
      $('#calendar').fullCalendar( 'removeEvents');
      $('#calendar').fullCalendar( 'addEventSource', self.calEvents );
      $('#calendar').fullCalendar('rerenderEvents' );
    };

  self.initCalendar = function () {
    var calElement = $('#calendar');
    // check to remove elements from the list 
    calElement.fullCalendar({
      isRTL: false,
      header: {
        left:   'prev',
        center: 'title',
        right:  'next'
      },
      buttonIcons: { // note the space at the beginning
        prev:    ' fa fa-caret-left',
        next:    ' fa fa-caret-right'
      },
      timeFormat: 'h(:mm) A',
      editable: false,
      selectable: true,
      droppable: false, // this allows things to be dropped onto the calendar 
     
      dayClick: function (date, jsEvent, view) {
        self.selectedDate = date;
        self.selectCalender = true;
        self.deal = null;
      },
      eventClick: function( event, jsEvent, view ) {
        self.selectCalender = false;
        self.deal = event.venueDeal;
        self.dealSelectedDate = event.start.toDate();
        $timeout(function() {
          $('#dealView').modal('show');
          $('.modal-backdrop').remove();
          $('.__event_id_class').css('border-color', '');
          $(this).css('border-color', 'red');
        }, 300);
      },
      eventDragStart: function (event, js, ui) {
        //draggingEvent = event;
      },
      eventRender: function(event, eventElement) {
       
        
      },
       
      events: self.calEvents
    });
    self.selectedDate = calElement.fullCalendar('getDate');
  };
  setTimeout(function() { 
    self.initCalendar();
  }, 1000);

  $scope.listItemClicked = function(deal) {
    $scope.deal = deal; 
    $scope.dealSelectedDate = $scope.UTC(deal.startDate);
    $timeout(function() {
          $('#eventView').modal('show');
          $('.modal-backdrop').remove();
        }, 300);
  };
  
  $scope.UTC = function(date) {
      if (typeof(date) === 'undefined') {
        return new Date();
      }
      var startDate = date.substring(0,10);
      var from = startDate.split("-");
      return new Date(from[0], from[1] - 1, from[2]);
  };

  self.init();
}]);