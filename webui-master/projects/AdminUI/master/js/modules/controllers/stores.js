/**=========================================================
 * Module: stores.js
 *smangipudi
 =========================================================*/

App.controller('StoresController', ['$scope', '$state', '$compile', '$timeout', 'RestServiceFactory', 'DataTableService', 'toaster', 'DialogService',
  function ($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, DialogService) {
    'use strict';
    $scope.agencyType = $state.current.data.type;

    $scope.typeLabel = $scope.agencyType === 'AGENCY' ? 'Agencies' : 'Stores';

    $timeout(function () {

      if (!$.fn.dataTable) return;
      var columnDefinitions = [
        { sWidth: "13%", aTargets: [0] },
        { sWidth: "17%", aTargets: [4] },
        { sWidth: "5%", aTargets: [7] },
        { sWidth: "9%", aTargets: [1, 2, 3, 5, 6] },
        { sWidth: "7%", aTargets: [5, 6] },
        {
          "targets": [8],
          "orderable": false,
          "createdCell": function (td, cellData, rowData, row, col) {

            var actionHtml = '<button title="Edit User" class="btn btn-default btn-oval fa fa-edit"></button>' +
              '&nbsp;&nbsp;<button title="Associate Users" class="btn btn-default btn-oval fa fa-users"></button>';
            if ($scope.agencyType === 'AGENCY') {
              actionHtml += '<button title="Associate Stores" class="btn btn-default btn-oval mr fa fa-building"></button>';
            }
            actionHtml += '<button title="Delete Agency" class="btn btn-default btn-oval fa fa-trash"></button>';

            $(td).html(actionHtml);
            $compile(td)($scope);
          }
        },
        {
          "targets": [7],
          "orderable": false,
          "createdCell": function (td, cellData, rowData, row, col) {

            var actionHtml = '<em class="fa fa-check-square-o"></em>';
            if (cellData !== 'Y') {
              actionHtml = '<em class="fa fa-square-o"></em>';
            }
            $(td).html(actionHtml);
            $compile(td)($scope);
          }
        }];

      DataTableService.initDataTable('agencies_table', columnDefinitions);

      var table = $('#agencies_table').DataTable();

      $('#agencies_table').on('click', '.fa-edit', function () {
        $scope.editAgency(this, table);
      });

      $('#agencies_table').on('click', '.fa-users', function () {
        $scope.agencyUsers(this, table);
      });

      $('#agencies_table').on('click', '.fa-trash', function () {
        $scope.deleteAgency(this, table);
      });

      $('#agencies_table').on('click', '.fa-building', function () {
        var targetRow = $(this).closest("tr");
        var rowData = table.row(targetRow).data();
        var target = { id: rowData[8] };
        $state.go("app.addAgencyStores", target);
      });

      var promise = RestServiceFactory.AgencyService().get({ type: $scope.agencyType });
      promise.$promise.then(function (data) {

        var table = $('#agencies_table').DataTable();
        data.agencies.map(function (agency) {
          table.row.add([agency.name, agency.managerName,  agency.accountNumber, agency.mobile || agency.phone, agency.address +", " + agency.city, agency.budget, agency.budgetUsed, agency.enabled, agency.id]);
        });
        table.draw();
      });
      $scope.addNew = function () {
        /*$scope.editAgency('new');*/
        var route = $scope.agencyType === 'AGENCY' ? 'app.agencyedit' : 'app.storeedit';
        $state.go(route, { id: 'new' });
      };
      $scope.editAgency = function (button, table) {
        var targetRow = $(button).closest("tr");
        var rowData = table.row(targetRow).data();
        var route = $scope.agencyType === 'AGENCY' ? 'app.agencyedit' : 'app.storeedit';
        $state.go(route, { id: rowData[6] });
      };

      $scope.agencyUsers = function (button, table) {
        var targetRow = $(button).closest("tr");
        var rowData = table.row(targetRow).data();
        $state.go('app.agencyUsers', { id: rowData[6] });
      };

      $scope.deleteAgency = function (button, table) {

        DialogService.confirmYesNo('Delete Business Entity?', 'Do you want to delete selected venue?', function () {
          var targetRow = $(button).closest("tr");
          var rowData = table.row(targetRow).data();
          var target = { id: rowData[6] };
          RestServiceFactory.AgencyService().delete(target, function (success) {
            table.row(targetRow).remove().draw();
          }, function (error) {
            if (typeof error.data !== 'undefined') {
              toaster.pop('error', "Server Error", error.data.developerMessage);
            }
          });
        });
      };
    });
  }]);