/**=========================================================
 * Module: party-event-controller.js
 *smangipudi
 =========================================================*/
App.controller('PartyEventsController', ['$scope', '$state', '$stateParams', '$compile', '$timeout',
	'DataTableService', 'RestServiceFactory', 'toaster', 'FORMATS', 'ngDialog', '$rootScope', 'DialogService',
	function ($scope, $state, $stateParams, $compile, $timeout,
		DataTableService, RestServiceFactory, toaster, FORMATS, ngDialog, $rootScope, DialogService) {
		'use strict';
		$timeout(function () {

			if (!$.fn.dataTable) return;
			var columnDefinitions = [
				{ "sWidth": "15%", aTargets: [0] },
				{ "sWidth": "8%", aTargets: [1] },
				{ "sWidth": "10%", aTargets: [2, 3, 6] },
				{ "width": "40%", aTargets: [4] },
				{ "sWidth": "7%", aTargets: [5] },
				{ "bAutoWidth": false },
				{
					"targets": [6],
					"orderable": false,
					"createdCell": function (td, cellData, rowData, row, col) {

						var actionHtml = '<button title="Edit" class="btn btn-default btn-oval fa fa-edit"></button>' +
							'&nbsp;&nbsp;<button title="Delete" class="btn btn-default btn-oval fa fa-trash"></button>';

						$(td).html(actionHtml);
						$compile(td)($scope);
					}
				},
				{
					"targets": [5],
					"orderable": false,
					"createdCell": function (td, cellData, rowData, row, col) {

						var actionHtml = '<em class="fa fa-check-square-o"></em>';
						if (cellData === false || cellData === 'N' || cellData === "false") {
							actionHtml = '<em class="fa fa-square-o"></em>';
						}
						$(td).html(actionHtml);
						$compile(td)($scope);
					}
				}];

			DataTableService.initDataTable('party_events_table', columnDefinitions, false);

			var promise = RestServiceFactory.ProductService().getPartyEvents({ id: $stateParams.id, role: 'admin' });
			promise.$promise.then(function (data) {
				$scope.data = data;
				var table = $('#party_events_table').DataTable();

				data.map(function (room) {
					var d = room.description;
					if (d.length > 150) {
						d = d.substring(0, 147) + " ...";
					}
					table.row.add([room.name, room.price, room.size, room.servingSize, d, room.enabled, room]);
				});
				table.draw();
			});

			var table = $('#party_events_table').DataTable();

			$('#party_events_table').on('click', '.fa-trash', function () {
				$scope.deletePartyEvent(this, table);
			});

			$('#party_events_table').on('click', '.fa-edit', function () {
				$scope.editPartyEvent(this, table);
			});

		});

		$scope.doneAction = function () {
			$state.go('app.agencyUsers', { id: $stateParams.id });
		};

		$scope.editPartyEvent = function (button, table) {
			var targetRow = $(button).closest("tr");
			var rowData = table.row(targetRow).data();
			$state.go('app.editPartyHall', { venueNumber: $stateParams.id, id: rowData[6].id });
		};

		$scope.createPartyEvent = function () {
			$state.go('app.editPartyHall', { venueNumber: $stateParams.id, id: 'new' });
		};

		$scope.deletePartyEvent = function (button, table) {
			DialogService.confirmYesNo('Delete Party Events?', 'Are you sure want to delete Party Events?', function () {
				var targetRow = $(button).closest("tr");
				var rowData = table.row(targetRow).data();
				var target = { id: $stateParams.id, productId: rowData[6].id };
				RestServiceFactory.ProductService().delete(target, function (data) {
					table.row(targetRow).remove().draw();
				}, function (error) {
					if (typeof error.data !== 'undefined') {
						toaster.pop('error', "Server Error", error.data.developerMessage);
					}
				});
			});
		};
	}]);