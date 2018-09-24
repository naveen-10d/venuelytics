/**
 * @author Saravanakumar K
 * @date 05-sep-2017
 */
"use strict";
app.controller('EventListCtrl', ['$log', '$scope', '$routeParams', 'AjaxService', '$rootScope','$timeout','ngMeta', 'VenueService','screenSize',
  function ($log, $scope,  $routeParams, AjaxService, $rootScope, $timeout, ngMeta, venueService, screenSize) {
        
    var self = $scope;
    var DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
    /**
    * Invoke full calendar plugin and attach behavior
    * @param  jQuery [calElement] The calendar dom element wrapped into jQuery
    * @param  EventObject [events] An object with the event list to load when the calendar displays
    */
    self.events = [];
    self.calEvents = [];
    
    self.init = function() {
      self.dealListData = false ||self.isSmallScreen();
      self.venueDetails = venueService.getVenue($routeParams.venueId);
      self.venueId = self.venueDetails.id;
      ngMeta.setTag('description', self.venueDetails.description + " Event Services");
      $rootScope.title = self.venueDetails.venueName+  " Venuelytics - Event List";
      ngMeta.setTitle($rootScope.title);
      self.tabParam = $routeParams.tabParam;
      AjaxService.getEvents(self.venueId).then(function(response) {
        self.events = response.data['venue-events'];
        self.eventCalender();
        setTimeout(function() {
            self.getSelectedTab();
        }, 600);
      });
    };

     self.isSmallScreen = function() {
      return screenSize.is('xs, sm');
    };

    self.calenderEventView = function() {
        self.eventListData = false;
        
    };
    self.listEventView = function() {
        self.eventListData = true;
    };
    self.getSelectedTab = function() {
      $(".service-btn .card").removeClass("tabSelected");
      $("#eventList > .card").addClass("tabSelected");
    };
    self.eventCalender = function() {
      var today = new Date();
      self.calEvents = [];
      for(var i = 0; i < self.events.length; i++) {
        var event = self.events[i];
        if (event.enabled !== 'Y') {
          continue;
        }
        var obj = {};
        obj.title = "\n\n\n\n";//event.eventName;  
        var sDate = $scope.UTC(event.startDate);
        var endDate = $scope.UTC(event.endDate);
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
        event.eventTimes = obj.start;
        event.doorOpens = moment(sDate).add(-45, 'm').toDate();
        var dateValue = moment(obj.end).format("HH:mm a");
        var H = + dateValue.substr(0, 2);
        h = (H % 12) || 12;
        var ampm = H < 12 ? " AM" : " PM";
        dateValue = h + dateValue.substr(2, 3) + ampm;
        if(dateValue.indexOf(":") ) {
        } else {
          dateValue = h + ':'+ dateValue.substr(2, 3) + ampm;
        }
        event.endtimes = dateValue;
        obj.backgroundColor = 'rgba(0,0,0,0);';
        obj.borderColor = 'rgba(0,0,0,0);';
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
            if (event.scheduleDayOfWeek.indexOf(day) >=0  || event.scheduleDayOfWeek === "*") {
              self.calEvents.push(cloneObj);
            }
          } else if (event.scheduleDayOfMonth.length > 0) {
            if (mDays[d.getDate()] === 1) {
              self.calEvents.push(cloneObj);
            }
          } else {
            self.calEvents.push(cloneObj);
            break;
          }
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
        buttonText: {
          today: 'today',
          month: 'month',
          week:  'week',
          day:   'day'
        },
        timeFormat: 'h(:mm) A',
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
          self.selectedDate = date;
          self.selectCalender = true;
          self.event = null;
        },
        eventClick: function( event, jsEvent, view ) {
          self.selectCalender = false;
          self.event = event.venueEvent;
          self.eventSelectedDate = event.start.toDate();
          $timeout(function() {
            $('#eventView').modal('show');
            $('.modal-backdrop').remove();
            $('.__event_id_class').css('border-color', '');
            $(this).css('border-color', 'red');
          }, 300);
        },
        eventDragStart: function (event, js, ui) {
          //draggingEvent = event;
        },
        eventRender: function(event, eventElement) {
          var dId = event.start.format("Y-MM-DD");
          //console.log();
          var image = event.venueEvent.imageURL || 'assets/img/placeholder.jpg';
          event.venueEvent.noImage = false;
          if (!event.venueEvent.imageURL) {
            event.venueEvent.noImage = true;
          }
          $('#'+dId).css("background", "url("+image+") no-repeat center center");
          $('#'+dId).css("background-size", "cover");
          $('#'+dId).css("margin", "30px");
          $(eventElement).css("margin-top", "30px");
          $(eventElement).css("margin-top", "30px");
          if (!event.venueEvent.noImage) {
            $(eventElement).find('.fc-event-time').hide();
          } else {
            $(eventElement).css("background-color", "rgba(0,0,0,0.7)");
            $(eventElement).find('.fc-event-title').text(event.venueEvent.eventName);
          }
         // console.log(eventElement);
         // console.log(eventElement[0]);
         // eventElement[0].setAttribute("style","background-image: url('https://d1hx7mabke4m1h.cloudfront.net/artist/image/2864/01May2018182949.jpg') no-repeat center center cover;");
          //eventElement.append("<img src='https://d1hx7mabke4m1h.cloudfront.net/artist/image/2864/01May2018182949.jpg'>");
          //
        },
        eventMouseover: function(event, jsEvent, view) {
          $(this).css("background-color", "rgba(0,0,0,0.7)");
          $(this).find('.fc-event-time').show();
          $(this).find('.fc-event-title').text(event.venueEvent.eventName);
          // This array is the events sourc === 'BottleService'es
        },
        eventMouseout: function(event, jsEvent, view) {
         
          if (!event.venueEvent.noImage) {
             $(this).css("background-color", "rgba(0,0,0,0)");
            $(this).find('.fc-event-time').hide();
            $(this).find('.fc-event-title').html("<br><br><br><br>");
          }
        }, 
        events: self.calEvents
      });
      self.selectedDate = calElement.fullCalendar('getDate');
    };
    
    setTimeout(function() { 
      self.initCalendar();
    }, 2500);

    $scope.listItemClicked = function(event) {
      $scope.event = event; 
      $scope.eventSelectedDate = $scope.UTC(event.startDate);
      $timeout(function() {
        $('#eventView').modal('show');
        $('.modal-backdrop').remove();
      }, 300);
    };

    $scope.getAgeRestriction = function(event) {
      if (!event || event.ageRestriction === 'NONE' || typeof(event.ageRestriction) == 'undefined' || event.ageRestriction.trim() == "") {
        return "No Restriction";
      } 

      return event.ageRestriction.replace("+", "") + " years and above";
    };

    $scope.getPricePolicy = function(event) {
      if (!event || event.agePricePolicy === 'NONE' || typeof(event.agePricePolicy) == 'undefined' || event.agePricePolicy.trim() == "") {
        return "No Free Passes";
      } 

      if (event.agePricePolicy.endsWith("-")) {
        return "Free for " + event.agePricePolicy.replace("-", "") + " years and younger";
      }
      return event.agePricePolicy;
    };
    $scope.UTC = function(date) {
      if (typeof(date) === 'undefined') {
        return new Date();
      }
      var startDate = date.substring(0,10);
      var from = startDate.split("-");
      return new Date(from[0], from[1] - 1, from[2]);
    };

    $scope.getPerformers = function(event) {
      if (event && !!event.performer) {
        return event.performer.performerName;
      } else if (event && !!event.performers) {
        return event.performers;
      }
      return "";
    };
    self.init();
}]);