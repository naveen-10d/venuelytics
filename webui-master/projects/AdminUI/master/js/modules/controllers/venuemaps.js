/**
 * =======================================================
 * Module: venuemaps.js
 * smangipudi 
 * =========================================================
 */

App.controller('VenueMapsController', ['$scope', '$state', '$compile', '$timeout', 'RestServiceFactory', 'DataTableService', 'toaster', '$stateParams', 'ngDialog', 'DialogService',
    function ($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, $stateParams, ngDialog, DialogService) {
        'use strict';

        $timeout(function () {

            if (!$.fn.dataTable) return;
            var columnDefinitions = [
                { sWidth: "10%", aTargets: [0] },
                { sWidth: "30%", aTargets: [1] },
                { sWidth: "20%", aTargets: [2] },
                { sWidth: "10%", aTargets: [3] },
                {
                    "targets": [4],
                    "orderable": false,
                    "createdCell": function (td, cellData, rowData, row, col) {

                        var actionHtml = '<button title="Edit User" class="btn btn-default btn-oval fa fa-edit"></button>' +
                            '&nbsp;&nbsp;<button title="Delete User" class="btn btn-default btn-oval fa fa-trash"></button>';

                        $(td).html(actionHtml);
                        $compile(td)($scope);
                    }
                }];

            DataTableService.initDataTable('venue_map_table', columnDefinitions);

            var promise = RestServiceFactory.VenueMapService().getAll({ id: $stateParams.id, type: 'ALL' });
            promise.$promise.then(function (data) {

                var table = $('#venue_map_table').DataTable();

                data.map(function (venueMap) {
                    table.row.add([venueMap.section, venueMap.days, venueMap.type, venueMap.elements.length, venueMap]);
                });
                table.draw();
            });
            var table = $('#venue_map_table').DataTable();

            $('#venue_map_table').on('click', '.fa-trash', function () {
                $scope.deleteBottle(this, table);
            });

            $('#venue_map_table').on('click', '.fa-edit', function () {
                $scope.editVenueMap(this, table);
            });
        });

        $scope.editVenueMap = function (button, table) {
            var targetRow = $(button).closest("tr");
            var rowData = table.row(targetRow).data();
            $state.go('app.editVenueMap', { venueNumber: $stateParams.id, id: rowData[4].id });
        };

        $scope.createBottle = function () {
            $state.go('app.editVenueMap', { venueNumber: $stateParams.id, id: 'new' });
        };
        $scope.deleteVenueMap = function (rowId, mapId) {

        };

        $scope.createNewVenueMap = function () {
            $state.go('app.venueMapedit', { id: 'new' });
        };

        $scope.deleteBottle = function (button, table) {
            DialogService.confirmYesNo('Delete VenueMap?', 'Are you sure want to delete selected VenueMap?', function () {
                var targetRow = $(button).closest("tr");
                var rowData = table.row(targetRow).data();
                var target = { id: $stateParams.id, tableId: rowData[4].id };
                RestServiceFactory.VenueMapService().delete(target, function (data) {
                    table.row(targetRow).remove().draw();
                }, function (error) {
                    if (typeof error.data !== 'undefined') {
                        toaster.pop('error', "Server Error", error.data.developerMessage);
                    }
                });
            });
        };
    }]);