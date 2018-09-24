  /**
   * smangipudi
   * ========================================================= 
   * Module:
   * edit-guest.js 
   * =========================================================
   */

  App.controller('EditGuestController',['$scope','$timeout', 'RestServiceFactory',function($scope, $timeout, RestServiceFactory) {
    var self= $scope;
    var dialog = self.dialog;
    self.guest = $scope.guest;
    self.maxDate = new Date();
    self.maxDate.setMonth($scope.maxDate.getMonth()+1);
    self.minDate = new Date();
    
    self.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
          
    self.config = {endOpened: false, startOpened: false};
    self.checkin = {};
    self.checkout = {};
   
    self.checkin.checkinDate = moment(self.guest.checkinTime).toDate();
    self.checkout.checkoutDate = moment(self.guest.checkoutTime).toDate();
    self.checkin.checkinTime = moment(self.guest.checkinTime).toDate();
    self.checkout.checkoutTime =  moment(self.guest.checkoutTime).toDate();
    
    
    
    self.init = function() {
     
      
    };
    self.checkinCalanderClicked = function() {

      $timeout(function() {
        self.config.startOpened = !self.config.startOpened;
      }, 200);
      
    };  

    self.checkoutCalanderClicked = function() {

      $timeout(function() {
        self.config.endOpened = !self.config.endOpened;
      }, 200);
      
    };

          
    self.saveCustomer = function(valid, form, data) {

      if (valid) {
        console.log(self.checkin.checkinTime);
        console.log(self.checkout.checkoutTime);
        
        self.checkin.checkinDate.setHours(self.checkin.checkinTime.getHours());
        self.checkin.checkinDate.setMinutes(self.checkin.checkinTime.getMinutes());
        self.checkin.checkinDate.setSeconds(0);

        self.checkout.checkoutDate.setHours(self.checkout.checkoutTime.getHours());
        self.checkout.checkoutDate.setMinutes(self.checkout.checkoutTime.getMinutes());
        self.checkout.checkoutDate.setSeconds(0);

        data.checkinTime = $scope.checkin.checkinDate.toISOString();
        data.checkoutTime = $scope.checkout.checkoutDate.toISOString();
        delete data.ratings;
        RestServiceFactory.HotelService().saveCustomer({id: $scope.venueNumber, guestId: data.id}, data, function (success) {
          dialog.close();
          self.refreshCb();
        }, function(error) {
          alert("Saving Guest failed with Error: " + error.data.message);
        }); 
      };

    };
    self.init();  

}]);