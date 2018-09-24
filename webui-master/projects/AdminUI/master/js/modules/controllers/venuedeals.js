/**
 * =======================================================
 * Module: venuedeals.js
 * smangipudi 
 * =========================================================
 */

App.controller('VenueDealsController', ['$scope', '$state', '$compile', '$timeout', 'RestServiceFactory', 'DataTableService', 'toaster', '$stateParams', 'ngDialog', 'ContextService', 'APP_EVENTS',
  function ($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, $stateParams, ngDialog, contextService, APP_EVENTS) {
    'use strict';

    $scope.listClicked = function () {
      $scope.activebutton = "list";
      $scope.content = 'app/views/venue/deal-list-include.html';
    };

    $scope.tableClicked = function () {
      $scope.activebutton = "table";
      $scope.content = 'app/views/venue/deal-table-include.html';
    };
    $scope.$on(APP_EVENTS.venueSelectionChange, function (event, data) {
      // register on venue change;
      $scope.init();
    });
    
    $scope.init = function () {
      // $scope.activebutton = "list";
      $scope.listClicked();
      $scope.data = {};
      $scope.config = {};
      $scope.dealTypes = { OFFER: "OFFER", AD: "AD" }
      $scope.serviceTypes = { Food: "Food", Drinks: "Drinks", Bottle: "Bottle", }
      if ($stateParams.id !== 'new' && $stateParams.id !== undefined) {
        $scope.getDeals($stateParams.id);
      }

    };
    $scope.getDeals = function (id) {
      var target = { vid: id, venueNumber: $stateParams.venueNumber };
      var promise = RestServiceFactory.VenueDeals().getDeals(target);
      promise.$promise.then(function (data) {
        $scope.data = data;
        $scope.data.enabled = data.enabled === true ? 'Y' : 'N';
      });
    };

    $('#startDtCalendarId').on('click', function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $timeout(function () {
        $scope.config.startOpened = !$scope.config.startOpened;
      }, 200);
    });

    $('#expiryDtCalendarId').on('click', function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $timeout(function () {
        $scope.config.endOpened = !$scope.config.endOpened;
      }, 200);
    });

    $scope.update = function (isValid, form, data) {
      data.venueNumber = contextService.userVenues.selectedVenueNumber;
      data.enabled = data.enabled === "Y" ? "true" : "false";
      var target = { vid: $stateParams.id, venueNumber: $stateParams.venueNumber };
      var payload = RestServiceFactory.cleansePayload('venueDeal', data);
      if ($stateParams.id === 'new') {
        target = {};
        RestServiceFactory.VenueDeals().saveDeal(target, payload, function (success) {
          ngDialog.openConfirm({
            template: '<p>Venue Deals information successfully saved</p>',
            plain: true,
            className: 'ngdialog-theme-default'
          });
          $state.go('app.dealsManagement');
        }, function (error) {
          if (typeof error.data !== 'undefined') {
            toaster.pop('error', "Server Error", error.data.developerMessage);
          }
        });
      } else {
        RestServiceFactory.VenueDeals().updateDeals(target, payload, function (success) {
          ngDialog.openConfirm({
            template: '<p>Venue Deals information successfully updated</p>',
            plain: true,
            className: 'ngdialog-theme-default'
          });
          $state.go('app.dealsManagement');
        }, function (error) {
          if (typeof error.data !== 'undefined') {
            toaster.pop('error', "Server Error", error.data.developerMessage);
          }
        });
      }
    }

    $scope.uploadFile = function (images) {
      var payload = new FormData();
      payload.append("file", images[0]);
      var target = { objectType: 'venueDeal' };
      RestServiceFactory.VenueImage().uploadImage(target, payload, function (success) {
        if (success !== {}) {
          $scope.data.imageUrl = success.originalUrl;
          $scope.data.thumbnailUrl = success.smallUrl;
          toaster.pop('success', "Image upload successfull");
          document.getElementById("control").value = "";
        }
      }, function (error) {
        if (typeof error.data !== 'undefined') {
          toaster.pop('error', "Server Error", error.data.developerMessage);
        }
      });
    };

    $scope.createNewDeals = function () {
      $state.go('app.editVenueDeals', { venueNumber: contextService.userVenues.selectedVenueNumber, id: 'new' });
    };
    $scope.init();
  }]);

App.controller('VenueDealsTableController', ['$scope', '$state', '$compile', '$timeout', 'RestServiceFactory', 'DataTableService', 'toaster', '$stateParams', 'ngDialog', 'ContextService', 'APP_EVENTS',
  function ($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, $stateParams, ngDialog, contextService, APP_EVENTS) {
    'use strict';

    $timeout(function () {

      if (!$.fn.dataTable) return;
      var columnDefinitions = [
        { sWidth: "8%", aTargets: [2, 3, 5, 6, 7] }, //40
        { sWidth: "14%", aTargets: [0] }, //54
        { sWidth: "12%", aTargets: [4] }, //66
        { sWidth: "25%", aTargets: [1] },  //91
        { sWidth: "9%", aTargets: [8] }, //100
        {
          "targets": [7],
          "orderable": false,
          "createdCell": function (td, cellData, rowData, row, col) {

            var actionHtml = '<em class="fa fa-check-square-o"></em>';
            if (cellData !== true) {
              actionHtml = '<em class="fa fa-square-o"></em>';
            }
            $(td).html(actionHtml);
            $compile(td)($scope);
          }
        },
        {
          "targets": [8],
          "orderable": false,
          "createdCell": function (td, cellData, rowData, row, col) {
            var actionHtml = '<button title="Edit Deals" class="btn btn-default btn-oval fa fa-edit"' +
              ' ng-click="editDeal(' + row + "," + cellData + ')"></button>&nbsp;&nbsp;';

            $(td).html(actionHtml);
            $compile(td)($scope);
          }
        }];
        
      DataTableService.initDataTable('deals_table', columnDefinitions, false);
        
      $scope.init();


    });

    $scope.init = function () {
      var table = $('#deals_table').DataTable();
      
      RestServiceFactory.CouponService().get({ id: contextService.userVenues.selectedVenueNumber }, function (data) {
        table.clear();
        $scope.dealMap = [];
        data.map(function (deal) {
          $scope.dealMap[deal.id] = deal;
          table.row.add([deal.title, deal.description, deal.couponType, deal.discountAmount, deal.actionUrl,
          formatDate(new Date(deal.startDate)), formatDate(new Date(deal.expiryDate)), deal.enabled, deal.id]);
        });

        table.draw();
      });
    };

    function formatDate(value) {
      return value.getMonth() + 1 + "/" + value.getDate() + "/" + value.getFullYear();
    }

    $scope.editDeal = function (rowId, colId) {
      $state.go('app.editVenueDeals', {venueNumber: contextService.userVenues.selectedVenueNumber, id: colId});
    };

    $scope.createNewDeal = function () {
      $state.go('app.venueMapedit', { id: 'new' });
    };

    $scope.$on(APP_EVENTS.venueSelectionChange, function (event, data) {
      // register on venue change;
      $scope.init();
    });
  }]);



App.controller('VenueDealsListController', ['$scope', '$state', '$compile', '$timeout', 'RestServiceFactory', 'DataTableService', 'toaster', '$stateParams', 'ngDialog', 'ContextService', 'APP_EVENTS',
  function ($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, $stateParams, ngDialog, contextService, APP_EVENTS) {
    'use strict';


    $scope.init = function () {

      RestServiceFactory.CouponService().get({ id: contextService.userVenues.selectedVenueNumber }, function (data) {
        $scope.deals = data;
      });
    };


    $scope.editDeal = function (rowId, colId) {
      var table = $('#deals_table').DataTable();
      var d = table.row(rowId).data();
      $scope.deal = $scope.dealMap[d[8]];

      ngDialog.openConfirm({
        template: 'app/templates/content/form-deal-info.html',
        // plain: true,
        className: 'ngdialog-theme-default',
        scope: $scope
      }).then(function (value) {
        $('#tables_table').dataTable().fnDeleteRow(rowId);
        var t = $scope.deal;
        table.row.add([t.name, t.price, t.servingSize, t.description, t.enabled, t.id]);
        table.draw();
      }, function (error) {

      });
    };

    $scope.createNewDeal = function () {
      $state.go('app.venueMapedit', { id: 'new' });
    };

    $scope.$on(APP_EVENTS.venueSelectionChange, function (event, data) {
      // register on venue change;
      $scope.init();
    });
    $scope.init();
  }]);