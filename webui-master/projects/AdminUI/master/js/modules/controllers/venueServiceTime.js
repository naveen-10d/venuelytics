/**=========================================================
 * Module: venueServiceTime.js
 * smangipudi
 =========================================================*/

App.controller('VenueServiceTimeController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'FORMATS', '$timeout', 'DataTableService', '$compile', 'DialogService', 'ngDialog',
    function ($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS, $timeout, DataTableService, $compile, DialogService, ngDialog) {
        'use strict';

        $scope.startServiceTime = "09:00";
        $scope.endServiceTime = "22:00";
        $scope.lastServiceTime = "21:00";


        $scope.initServiceTimeTable = function () {
            if (!$.fn.dataTable || $stateParams.id === 'new') {
                return;
            }
            var columnDefinitions = [
                {
                    "sWidth": "20%", aTargets: [0, 2],
                    "sWidth": "15%", aTargets: [1, 3, 4, 5]

                },
                {
                    "targets": [5],
                    "orderable": false,
                    "createdCell": function (td, cellData, rowData, row, col) {

                        // var actionHtml = ('<button title="Edit" class="btn btn-default btn-oval fa fa-edit"></button>');
                        var actionHtml = '<button title="Edit" class="btn btn-default btn-oval fa fa-edit"></button>' +
                            '&nbsp;&nbsp;<button title="Delete" class="btn btn-default btn-oval fa fa-trash"></button>';

                        $(td).html(actionHtml);
                        $compile(td)($scope);
                    }
                }];

            DataTableService.initDataTable('venue_service_time_table', columnDefinitions, false);
            var table = $('#venue_service_time_table').DataTable();

            $('#venue_service_time_table').on('click', '.fa-edit', function () {
                $scope.editService(this);
            });

            $('#venue_service_time_table').on('click', '.fa-trash', function () {
                $scope.deleteService(this, table);
            });

            $scope.editService = function (button) {
                var targetRow = $(button).closest("tr");
                var rowData = table.row(targetRow).data();
                $state.go('app.editServiceHours', { venueNumber: $stateParams.id, id: rowData[5].id });
            };

            var target = { id: $stateParams.id };
            RestServiceFactory.VenueService().getServiceTimings(target, function (data) {
                $scope.data = data;
                $.each(data, function (i, d) {
                    table.row.add([d.day, d.type, formatTime(d.startTime) + " - " + formatTime(d.endTime), formatTime(d.lastCallTime), d.value, d]);
                });
                table.draw()
            });
        }

        function formatTime(normalizedTime) {
            // Check correct time format and split into components
            if (!normalizedTime) {
                return "";
            }
           /* var time = normalizedTime.match(/^([01]?[0-9]|2[0-3])(:)([0-5]|[0-9]\d)(:[0-5]|[0-9]\d)?$/) || [normalizedTime];

            if (time.length > 1) {
                time = time.slice(1); // Remove full string match value
                time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
                time[0] = +time[0] % 12 || 12; // Adjust hours
            }*/


              var time = normalizedTime;
              if (time.length < 5) {
                time += '0';
              }
              var hms = time.split(':');
              
              var h = +hms[0];
              var suffix = (h < 12) ? ' AM' : ' PM';
              hms[0] = h % 12 || 12;        
              return hms.join(':') + suffix;

            return time.join(""); // return adjusted time or original string
        }

        $scope.createServiceTimings = function () {
            $state.go('app.editServiceHours', { venueNumber: $stateParams.id, id: 'new' });
        };

        $scope.deleteService = function (button, table) {
            DialogService.confirmYesNo('Delete Service?', 'Are you sure want to delete selected service hours?', function () {
                var targetRow = $(button).closest("tr");
                var rowData = table.row(targetRow).data();
                var target = { id: $stateParams.id, objId: rowData[5].id };
                RestServiceFactory.VenueService().deleteServiceHour(target, function (data) {
                    table.row(targetRow).remove().draw();
                }, function (error) {
                    if (typeof error.data !== 'undefined') {
                        toaster.pop('error', "Server Error", error.data.developerMessage);
                    }
                });
            });
        };

        $timeout(function () {
            $scope.initServiceTimeTable();
        });
    }]);


