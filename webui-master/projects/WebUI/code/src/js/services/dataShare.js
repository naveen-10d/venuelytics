"use strict";
app.service('DataShare', function () {
  this.latitude = '';
  this.tableGuests = '';
  this.longitude = '';
  this.bottleServiceData = {};
  this.claimBusiness = {};
  this.privateEventData = {};
  this.reservationData = {};
  this.guestListData = {};
  this.foodServiceData = {};
  this.drinkServiceData = {};
  this.guest = {};
  this.authBase64Str = {};
  this.bottleZip = '';
  this.payloadObject = '';
  this.selectBottle = '';
  this.selectedDateForBottle = '';
  this.tableSelection = '';
  this.tab = '';

  this.guestFocus = '';
  this.userselectedTables = '';
  this.foodService = [];
  this.drinks = [];
  this.editBottle = '';
  this.enablePayment = '';
  this.serviceTypes = '';
  this.tableService = {};
  this.imageMapping = {
    "pictureURL": "",
    "pictureURLThumbnail": "",
    "maps": []
  };
  this.elements = [];
  this.selectedFoods = '';
  this.selectedDrinks = '';
  this.amount = '';
  this.privateOrderItem = '';
  this.paymentObject={};

  /*this.getCurrentLocation = function() {

    if (navigator && navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(function(position){
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        var location = {
          lat : this.latitude,
          long : this.longitude
        };
        return location;
      },
    function (error) {
      return error;
    });
    }

  };*/
  this.clearmethod = function(){
    this.bottleServiceData = {}; 
    this.drinkServiceData = {};
    this.privateEventData = {};
    this.guestListData = {};
    this.paymentObject = {};
    this.foodServiceData = {};
  };

});
