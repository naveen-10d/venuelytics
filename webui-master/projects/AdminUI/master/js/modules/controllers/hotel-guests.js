/**
 * smangipudi
 * ========================================================= 
 * Module:
 * guestlist.js  for guestlist manager view
 * =========================================================
 */

 App.controller('HotelGuestsController',  ['$state', '$stateParams','$scope', '$rootScope','AUTH_EVENTS',
  'AuthService', '$cookies', 'Session', 'ContextService', 'RestServiceFactory', 'APP_EVENTS', '$timeout', 'ngDialog','DialogService',
        function ($state, $stateParams, $scope, $rootScope, AUTH_EVENTS,  AuthService, $cookies, Session,
         contextService, RestServiceFactory, APP_EVENTS, $timeout, ngDialog, DialogService) {
    "use strict";

  
  $scope.venueNumber = contextService.userVenues.selectedVenueNumber;
  

  $scope.guestList = [];

  $scope.ratings = 1;
  $scope.ratingPosition = 1;
  $scope.maxDate = new Date();
  $scope.maxDate.setMonth($scope.maxDate.getMonth()+1);
  $scope.minDate = new Date();
  
  $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
  };
  
  $scope.checkin = new Date();
  $scope.guest = {};
  $scope.reasonText = null;
  $scope.ratingMax = 5;
  $scope.ratingScaleFactor = 1;

  $scope.initCalendar = function () {
    $('#hgCalendarId').on('click', function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $timeout(function() {
            $scope.config.startOpened = !$scope.config.startOpened;
        }, 200);
    
    }); 
  
      
    $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
          // register on venue change;
       
        $scope.venueNumber = contextService.userVenues.selectedVenueNumber;
        $scope.getGuestList();
      });
  };
  
  
  
  $scope.deleteGuest = function(guest) {
    DialogService.confirmYesNo('Delete Guest Entry?', 'Do you want to delete selected Guest?', function () {
     
      var target = { id: $scope.venueNumber, guestId: guest.id };
      RestServiceFactory.HotelService().deleteGuest(target, function (success) {
        $scope.getGuestList();
      }, function (error) {
        if (typeof error.data !== 'undefined') {
          toaster.pop('error', "Server Error", error.data.developerMessage);
        }
      });
    });
  };

  $scope.sendMessage = function(guest) {
    $scope.guest = guest;
    var dialog = ngDialog.open({
      template: 'app/views/guest/guest-message.html',
      className: 'ngdialog-theme-default custom-width', 
      scope: $scope,
      controller: ['$scope','$timeout',function($scope, $timeout) {
        var self = $scope;
        self.reasons = [{value: "Welcome", name:"Welcome Message"},{value:"CheckinRating", name:"Checkin Rating"}, 
        {value:"CheckoutRating", name: "Checkout Rating"}, {value: "ServiceMessage", name: "Service Message"}, {value:"Other", name: "Other"}];

        self.reasons = $scope.reasons;
        self.sms = {};
        self.init = function() {
          self.sms.liveAgentNumber = self.venueInfo['sms.liveAgentNumber'];
          self.sms.defaultWelcomeMessage = self.venueInfo['sms.defaultWelcomeMessage'];
            
            //$scope.customerMessage = $scope.sms.defaultWelcomeMessage;

          self.sms.checkInMessage = self.venueInfo['sms.checkInMessage'];
          self.sms.checkOutMessage = self.venueInfo['sms.checkOutMessage'];
          self.sms.venueVisitMessage = self.venueInfo['sms.venueVisitMessage'];
          self.sms.enableCheckoutRating = self.venueInfo['sms.enableCheckoutRating'];
          self.sms.enableCheckinRating = self.venueInfo['sms.enableCheckinRating'];
          self.sms.enableVenueVisitRating = self.venueInfo['sms.enableVenueVisitRating'];

          self.sms.enableVenueVisitRating = self.venueInfo['sms.enableVenueVisitRating'];
          vi = infos.get("");

        };
        self.onReasonSectionChange = function() {
             if (self.reasonText === "Welcome") {
                 $scope.message = self.sms.defaultWelcomeMessage || "";
             }  else if (self.reasonText === "CheckinRating") {
                 self.message = self.sms.checkInMessage || "";
             } else if ($scope.reasonText === "CheckoutRating") {
                 self.message = self.sms.checkOutMessage || "";
             } else {
                 self.message = "";
             }
        };

        self.sendCustomerMessage = function(valid) {
          if (!valid) {
              return;
          }
          var target = { id: $scope.venueNumber };
          var payload = {channelType: 'SMSBot', parameters: {contactName: self.guest.contact.name, contactPhone: self.guest.contact.phone, 
            contactEmail: self.guest.contact.email, guestId: self.guest.id}, type: self.reasonText, message: self.message, to: guest.contact.phone};

          RestServiceFactory.MessangerService().sendSMS(target, payload, function (success) {
              dialog.close();
          }, function(error) {
            alert("Saving Guest failed with Error: " + error.data.message);
          });
        };

        self.init();
      }]
    });

  };
  $scope.addGuest = function() {
    var checkin = {};
    var checkout = {};
       
    checkin.checkinDate = new Date();
    checkout.checkoutDate = new Date();
    checkout.checkoutDate.setDate(checkin.checkinDate.getDate() + 1);
    checkin.checkinTime = new Date();
    checkout.checkoutTime = $scope.checkoutTime;
    $scope.editGuest(
      {
        checkinTime: checkin.checkinDate.toISOString(),
        checkoutTime: checkout.checkoutDate.toISOString()
      });
  };
  $scope.editGuest = function(guest) {
    $scope.guest = guest;
    $scope.refreshCb = $scope.getGuestList; 
    $scope.dialog = ngDialog.open({
      template: 'app/views/guest/hotel-guest.html',
      className: 'ngdialog-theme-default custom-width', 
      scope: $scope,
      controller: 'EditGuestController'
    });
  };

  $scope.getServiceTime = function() {
    var target = { id: contextService.userVenues.selectedVenueNumber, type: 'Hotel' };
    RestServiceFactory.VenueService().getServiceTimings(target, function (data) {
      $scope.data = data;
      var checkinCheckoutTimes = $scope.data;

      // Checkin and Checkout time for hotel doesn't depend on DAY.
      if (checkinCheckoutTimes && checkinCheckoutTimes.length > 0) {
        $scope.checkinTime = checkinCheckoutTimes[0].startTime;
        $scope.checkoutTime = checkinCheckoutTimes[0].endTime;
      }
    });
  };

  $scope.getGuestList = function() {

    RestServiceFactory.VenueService().getHotelGuests({id: contextService.userVenues.selectedVenueNumber,  date: $scope.checkin.checkinDate}, function(data){
      $scope.guestList =  data;
    });
  };
  
  $scope.refresh = function() {
     $scope.init();
  };
  
  $scope.getRatingStatus = function(guest, type) {

    var clz ="";
    for(var i=0; i < guest.ratings.length; i++){
      if (guest.ratings[i].serviceType === type) {
        if (clz.indexOf("fa-check-circle") === -1) {
          clz= "fa-check-circle";
        }
        if (guest.ratings[i].rating > 0 && clz.indexOf("text-success") === -1) {
          clz += " text-success";
        }

      }
    }
    return clz;
  };

  $scope.getRating = function(guest, type) {

    for(var i=0; i < guest.ratings.length; i++){
      if (guest.ratings[i].serviceType === type && guest.ratings[i].rating > 0) {
        return guest.ratings[i].rating / ratingScaleFactor;
      }
    }
  };

  $scope.getVenueInfo = function() {
    RestServiceFactory.VenueService().getInfo({ id: $scope.venueNumber} ,function (data) {
      $scope.venueInfo = data;

      $scope.ratingAlert = $scope.venueInfo['service.rating.alert'];
      $scope.ratingMax = $scope.venueInfo['service.rating.max'];
      $scope.ratingScaleFactor = $scope.ratingMax/5;


      $scope.getGuestList();
    });

  };
  $scope.init = function() {
   /*
    $('#hotelGuestListTable').on('click', 'tbody tr', function() {
      $(this).addClass('highlight').siblings().removeClass('highlight');
    });*/
    $scope.getVenueInfo();
    
    $scope.getServiceTime();
    
  };

  $scope.init();
  $scope.initCalendar();


}]);
