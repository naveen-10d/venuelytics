/**=========================================================
 * Module: storeInfo.js
 * smangipudi
 =========================================================*/
/*jshint bitwise: false*/
App.controller('StoreController', ['$translate', '$scope', '$state', '$stateParams',
  'RestServiceFactory', 'toaster', 'FORMATS', '$timeout', 'DataTableService', '$compile', 'ngDialog',
  function ($translate, $scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS,
    $timeout, DataTableService, $compile, ngDialog) {
    'use strict';
    $scope.deletedVenueImage = [];
    $scope.shortCuts = [];
    $scope.advanceSwitches = {
      "Advance.BottleService.enable": false,
      "Advance.BookBanquetHall.enable": false,
      "Advance.TableService.enable": false,
      "Advance.DrinksService.enable": false,
      "Advance.FoodRequest.enable": false,
      "Advance.BookKaroakeRoom.enable": false,
      "Advance.Bowling.enable": false,
      "Advance.ClickerOption.enable": false,
      "Advance.Events.enable": false,
      "Advance.DJRequest.enable": false,
      "Advance.enabledPayment": false,
      "Advance.FastPass.enable": false,
      "Advance.Game.enable": false,
      "Advance.LostFound.enable": false,
      "Advance.Tournaments.enable": false,
      "Advance.GuestList.enable": false,
      "Advance.KarokeRequest.enable": false,
      "Advance.ShowGameWaiting.enable": false,
      "Advance.NearbyAttractions.enable": false,
      "Advance.NearbyBusiness.enable": false,
      "Advance.Reservation.enable": false,
      "Advance.PartyPackage.enable": false,
      "Advance.SeatReservation.enable": false,
      "Advance.Deals.enable": false,
      "Advance.ShowGenderRatio.enable": false,
      "Advance.ShowCoverCharge.enable": false,
      "Advance.Bowling.enable": false,
      "Advance.Wine2Home.enable": false,
      "Advance.Contests.enable": false,
      "Advance.Rewards.enable": false,
      "Advance.NightLife.enable": false,
    };

    $scope.additionalFields = [
      F("ui.service.theme", "Background Theme"),
      F("Advance.fav-items", "Popular Categories"),
      F("Bottle.ContactName", "Bottle Service Contact Name"),
      F("Bottle.ContactPhone", "Bottle Service Contact Phone"),
      F("Bottle.ContactEmail", "Bottle Service Contact Email"),
      F("Bottle.BottleVIPPolicy", "Bottle Service VIP Policy"),
      F("Bottle.BottleMinimumrequirements", "Bottle Service Minimum Requirements"),
      F("Bottle.formUrl", "Bottle Service Request Form"),
      F("Bottle.menuUrl", "Bottle Service Menu url"),


      F("BanquetHall.ContactName", "Private Event Contact Name"),
      F("BanquetHall.ContactPhone", "Private Event Contact Phone"),
      F("BanquetHall.ContactEmail", "Private Event Contact Email"),
      F("BanquetHall.formUrl", "Private Event Request From"),
      F("BanquetHall.Menu", "Private Event Menu"),
      F("BanquetHall.ThreeSixtyVideo", "Private Event 360 Video"),
      F("BanquetHall.Video", "Private Event Video"),
      F("BanquetHall.FloorMap", "Private Event Floor Plan"),
      F("BanquetHall.Details", "Private Event Details"),

      F("Drinks.menuUrl", "Drinks Menu URL"),
      F("Drinks.cocktailsUrl", "Drinks Cocktails Menu URL"),
      F("Drinks.beerMenuUrl", "Drinks Beer Menu URL"),
      F("Drinks.wineListuUrl", "Drinks Wine List Menu URL"),
      F("Drinks.happyHourDrinkUrl", "Drinks Happy Hour Menu URL"),

      F("Drinks.RequestTimeOut", "Drinks Request Timeout Alert (in minutes)"),
      F("Drinks.DeliveryTimeOut", "Drinks Delivery Timeout Alert (in minutes)"),
      F("Drinks.CompletedTimeOut", "Drinks Completed Timeout Alert (in minutes)"),
      F("Drinks.PaymentPendingTimeOut", "Drinks Payment pending Timeout Alert (in minutes)"),
      
      F("Food.RequestTimeOut", "Food Request Timeout Alert (in minutes)"),
      F("Food.DeliveryTimeOut", "Food Delivery Timeout Alert (in minutes)"),
      F("Food.CompletedTimeOut", "Food Completed Timeout Alert (in minutes)"),
      F("Food.PaymentPendingTimeOut", "Food Payment pending Timeout Alert (in minutes)"),

     
      F("Bottle.PaymentPendingTimeOut", "Bottle Payment pending Timeout Alert (in minutes)"),
      F("PartyPackage.PaymentPendingTimeOut", "Party Package Payment pending Timeout Alert (in minutes)"),
      F("PrivateEvent.PaymentPendingTimeOut", "Private Event Payment pending Timeout Alert (in minutes)"),
      F("Reservation.PaymentPendingTimeOut", "Reservation Payment pending Timeout Alert (in minutes)"),  

    ];
    if ($stateParams.id === 'new') {
      $scope.tabs = [
        { name: 'Venue Information', content: 'app/views/venue/form-venue.html', icon: 'fa-home' }
      ];
    } else {
      $scope.tabs = [
        { name: 'Venue Information', content: 'app/views/venue/form-venue.html', icon: 'fa-home' },
        { name: 'Attributes', content: 'app/views/venue/venue-attributes.html', icon: 'fa-list-ul' },
        { name: 'Service Hours', content: 'app/views/venue/service-hours.html', icon: 'fa-home' },
        { name: 'Private Events', content: 'app/views/venue/private-events.html', icon: 'fa-birthday-cake' },
        { name: 'Reservations', content: 'app/views/venue/venue-bottle.html', icon: 'fa-cutlery' },
        { name: 'Party Packages', content: 'app/views/venue/party-events.html', icon: 'fa-trophy' },
        { name: 'Products', content: 'app/views/venue/venue-products.html', icon: 'fa-shopping-basket' },
        { name: 'Offers/Deals', content: 'app/views/venue/venue-deals.html', icon: 'fa-money' },
        { name: 'Outlets', content: 'app/views/venue/venue-stores.html', icon: 'fa-building-o' },
        { name: 'Portal', content: 'app/views/venue/venue-portal.html', icon: 'fa-home' },
        { name: 'Users', content: 'app/views/venue/venue-users.html', icon: 'fa-users' },
        { name: 'Shortcuts', content: 'app/views/venue/venue-shortcuts.html', icon: 'fa-fa-bookmark' },
        { name: 'Venue Services', content: 'app/views/webui/webui-buttons.html', icon: 'fa-fa-bookmark' },
      ];
    }

    $scope.onEnableServices = function () {
      var payload = {};
      angular.forEach($scope.advanceSwitches, function (v, k, o) {
        $scope.data.info[k] = v ? 'Y' : 'N';
        payload[k] = v ? 'Y' : 'N';
      });
      $scope.updateServices(payload);
    };

    $scope.onUpdateOptions = function () {
      var payload = {};
      angular.forEach($scope.additionalFields, function (v, k, o) {
        $scope.data.info[v.name] = v.value;
        payload[v.name] = v.value;
      });
      $scope.updateServices(payload);
    };

    $scope.initInfoTable = function () {
      if (!$.fn.dataTable || $stateParams.id === 'new') {
        return;
      }
      var columnDefinitions = [
        {
          "sWidth": "70%", aTargets: [1],
          "sWidth": "20%", aTargets: [0, 2],
           "sWidth": "10%", aTargets: [2]

        },
        {
          "targets": [0, 1, 2],
          "orderable": false,
        },
        {
          "targets": [2],
          "orderable": false,
          "createdCell": function (td, cellData, rowData, row, col) {
            var actionHtml = ('<button title="Edit" class="btn btn-default btn-oval fa fa-edit" ' +
              'ng-click="updateAttribute(\'' + row + '\'  )"></button>&nbsp;&nbsp;');

            $(td).html(actionHtml);
            $compile(td)($scope);
          }
        }];
      DataTableService.initDataTable('venue_info_table', columnDefinitions);
      var table = $('#venue_info_table').DataTable();
      $scope.initAdditionalFields();
      $.each($scope.data.info, function (k, v) {
        if ($scope.advanceSwitches.hasOwnProperty(k)) {
          $scope.advanceSwitches[k] = (v === 'Y' ? true : false);
        } else {
          table.row.add([$translate.instant(k), v, k]);
        }
      });
      table.draw();

    };
    $scope.initAdditionalFields = function () {
      $.each($scope.data.info, function (k, v) {
        for (var j = 0; j < $scope.additionalFields.length; j++) {
          if (k == $scope.additionalFields[j].name) {
            $scope.additionalFields[j].value = v;
            delete $scope.data.info[k];
            break;
          }
        }
      });

    }
    function F(name, displayName) {
      return {
        name: name,
        displayName: displayName,
        value: ""
      };
    }
    function addType(typeName, typeValue, displayName, venueTypeCode) {

      var obj = {
        typeName: typeName,
        typeValue: typeValue,
        value: (venueTypeCode & typeValue) > 0,
        displayName: displayName,
      };

      $scope.venueTypes.push(obj);

    }
    $scope.venueTypeCodes = function (data) {
      $scope.venueTypes = [];
      addType("barType", 1, "Bar", data.venueTypeCode);
      addType("clubType", 2, "Club", data.venueTypeCode);
      addType("loungeType", 4, "Lounge", data.venueTypeCode);
      addType("casinoType", 8, "Casino", data.venueTypeCode);
      addType("concertType", 16, "Concert", data.venueTypeCode);
      addType("nightClubType", 32, "Night Club", data.venueTypeCode);
      addType("restaurantType", 64, "Restaurant", data.venueTypeCode);
      addType("bowlingType", 128, "Bowling", data.venueTypeCode);
      addType("karaokeType", 256, "Karaoke", data.venueTypeCode);
      //addType("adultType", 512, "Adult", data.venueTypeCode);
      addType("golfType", 1024, "Golf", data.venueTypeCode);
      addType("liveEventType", 2048, "Live Event", data.venueTypeCode);
      addType("hotelType", 4096, "Hotel", data.venueTypeCode);
      addType("attractionType", 8192, "Attraction", data.venueTypeCode);

     addType("artCultureType", Math.pow(2,16), "Art and Culture", data.venueTypeCode);
     addType("dayTripType", Math.pow(2,17), "Day Trips", data.venueTypeCode);
     addType("familyAttractionType", Math.pow(2,18), "Family Attractions", data.venueTypeCode);
     addType("parkRecreationType", Math.pow(2,19), "Parks and Recreations", data.venueTypeCode);
     addType("shoppingType", Math.pow(2,20), "Shopping", data.venueTypeCode);
     addType("sportsType", Math.pow(2,21), "Sports", data.venueTypeCode);
    };
    $scope.deleteImage = function (index, deletedImage) {
      var id = {
        "id": deletedImage.id
      };

      RestServiceFactory.VenueImage().deleteVenueImage(id, function (data) {
        deletedImage.status = "DELETED";
        toaster.pop('data', "Deleted the selected Image successfull");
      }, function (error) {
        if (typeof error.data !== 'undefined') {
          toaster.pop('error', "Server Error", error.data.developerMessage);
        }
      });
    };
    $scope.isVenueType = function (code) {
      if (typeof $scope.venueType === 'undefined') {
        return true;
      }
      var val = $scope.venueType[code];
      return val === 1;
    };
    $scope.updateAttribute = function (rowId) {
      var table = $('#venue_info_table').DataTable();
      var createTitle;
      var rowData = '';
      if (rowId === undefined) {
        createTitle = "Create Venue Attribute";
      } else {
        rowData = table.row(rowId).data();
        createTitle = "Update Venue Attribute";
        var hideKeyText = true;
      }
      ngDialog.openConfirm({
        template: 'modalDialogId',
        className: 'ngdialog-theme-default',
        data: { key: rowData[0], value: rowData[1], title: createTitle, text: hideKeyText },
      }).then(function (value) {
        var payload = {};
        if (rowId === undefined) {
          var attributeValue = value.value;
          var attributeKey = value.key;
          payload[attributeKey] = attributeValue;
          $scope.updateServices(payload);
          $scope.data.info[attributeKey] = attributeValue;
        } else {
          value = value.value;
          payload[rowData[2]] = value;
          $scope.updateServices(payload);
          $scope.data.info[rowData[2]] = value;
        }
        table.clear();
        $.each($scope.data.info, function (k, v) {
          table.row.add([$translate.instant(k), v, k]);
        });
        table.draw();
      }, function (reason) {
        //mostly cancelled  
      });
    };
    $scope.updateServices = function (payload) {
      var promise = RestServiceFactory.VenueService().updateAttribute({ id: $stateParams.id }, payload, function (data) {
        toaster.pop('data', "Attribute updated successfull");
      }, function (error) {
        if (typeof error.data !== 'undefined') {
          toaster.pop('error', "Server Error", error.data.developerMessage);
        }
      });
    };
    $scope.update = function (isValid, data) {
      if (!isValid) {
        return;
      }
      var venueTypeCode = 0;
      for (var tIndex = 0; tIndex < $scope.venueTypes.length; tIndex++) {
        if ($scope.venueTypes[tIndex].value) {
          venueTypeCode += $scope.venueTypes[tIndex].typeValue;
        }
      }
      data.venueTypeCode = venueTypeCode;
      $scope.imageId = [];
      angular.forEach($scope.imageUrl, function (value, key) {
        var venueImageId = {
          "id": value.id
        };
        angular.forEach($scope.deletedVenueImage, function (value1, key1) {
          if (venueImageId.id === value1.id) {
            delete venueImageId.id;
          }
        });
      $scope.imageId.push(venueImageId);
    });
    data.imageUrls = $scope.imageId;
    var payload = RestServiceFactory.cleansePayload('VenueService', data);
    var target = {id: data.id};
    if ($stateParams.id === 'new'){
      target = {};
    }
    if (payload.cleansed===true || payload.cleansed=== "true" ) {
      payload.options = 1;
    } else {
      payload.options = 0;
    }
    RestServiceFactory.VenueService().save(target,payload, function(success){
        ngDialog.openConfirm({
          template: '<p>venue information saved successfully</p>',
          plain: true,
          className: 'ngdialog-theme-default'
        });

        $state.go('app.venues');
      }, function (error) {
        if (typeof error.data !== 'undefined') {
          toaster.pop('error', "Server Error", error.data.developerMessage);
        }
      });
    };

    $scope.uploadFile = function (venueImage) {
      var fd = new FormData();
      fd.append("file", venueImage[0]);
      var payload = RestServiceFactory.cleansePayload('venueImage', fd);
      RestServiceFactory.VenueImage().uploadVenueImage(payload, function (success) {
        if (success !== {}) {
          $scope.imageUrl.push(success);
          toaster.pop('success', "Image upload successfully");
          document.getElementById("control").value = "";
        }
      }, function (error) {
        if (typeof error.data !== 'undefined') {
          toaster.pop('error', "Server Error", error.data.developerMessage);
        }
      });
    };

    function __URL(path) {
      return "https://www.venuelytics.com" + path;
    }
    $scope.initShortCuts = function () {
      $scope.shortCuts.push({ name: "Web Page", link: __URL("/cities/" + $scope.data.city + "/" + unqName()) });
      const serviceNames = [["Bottle Service", "bottle-service"], ["Private Events", "private-event"], ["Guest List", "guest-list"],
      ["Food Service", "food-service"], ["Drinks Service", "drink-service"], ["Table Service", "table-service"], ["Wait Time", "wait-time"], 
      ["Deals", "deals-list"], ["Event List", "event-list"], ["Reservation", "reservation"], ["Wine 2 Home", "wine2home"], ["Party Package", "party-package"],];

      for (var i = 0; i < serviceNames.length; i++) {
        const obj = serviceNames[i];
        $scope.shortCuts.push({ name: obj[0], link: __URL("/cities/" + $scope.data.city + "/" + unqName() + "/" + obj[1]) });
      }


      for (var i = 0; i < serviceNames.length; i++) {
        const obj = serviceNames[i];
        $scope.shortCuts.push({ name: obj[0] + " - embeded", link: __URL("/cities/" + $scope.data.city + "/" + unqName() + "/" + obj[1] + "/embed") });
      }

    };

    function unqName() {
      if (!$scope.data.uniqueName) {
        return $scope.data.id;
      } else {
        return $scope.data.uniqueName;
      }
    }
    $scope.copyToClipboard = function (text) {
      const el = document.createElement('textarea');
      el.value = text;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    };

    $timeout(function () {
      if ($stateParams.id !== 'new') {
        RestServiceFactory.VenueService().get({ id: $stateParams.id }, function (data) {
          data.phone = $.inputmask.format(data.phone, { mask: FORMATS.phoneUS });
          $scope.imageUrl = [];
          for (var imgIndex = 0; imgIndex < data.imageUrls.length; imgIndex++) {
            if (data.imageUrls[imgIndex].id !== null) {
              $scope.imageUrl.push(data.imageUrls[imgIndex]);
            }
          }
          $scope.venueTypeCodes(data);
          $scope.data = data;
          $scope.initInfoTable();
          $scope.initShortCuts();
        });
      } else {
        var data = {};
        $scope.imageUrl = [];

        data.country = "USA";
        data.venueTypeCode = 0;
        $scope.venueTypeCodes(data);
        $scope.data = data;
        $scope.initInfoTable();
      }
    });
  }]);