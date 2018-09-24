/**=========================================================
 * Module: loyalty.js
 * smangipudi
 =========================================================*/

App.controller('LoyaltyMembershipController', ['$scope', '$state', '$compile', '$timeout', 'RestServiceFactory', 'DataTableService', 'toaster', 'ContextService', 'DialogService',
	function ($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, contextService, DialogService) {
		'use strict';

		$timeout(function () {

			if (!$.fn.dataTable) return;
			var columnDefinitions = [{
				"targets": [5],
				"orderable": false,
				"createdCell": function (td, cellData, rowData, row, col) {

					var actionHtml = '<button title="Edit" class="btn btn-default btn-oval fa fa-edit"></button>' +
						'&nbsp;&nbsp;<button title="Delete" class="btn btn-default btn-oval fa fa-trash"></button>';

					$(td).html(actionHtml);
					$compile(td)($scope);
				}
			}, {
				"targets": [0],
				"orderable": false,
				"createdCell": function (td, cellData, rowData, row, col) {
					$(td).html('<div class="circle circle-xxl" style="background-color:' + cellData + '"></div>');
				}
			}
			];

			var conditionFormat = function (condition, conditionType) {
				if (conditionType == "V") {
					return condition + " Visits";
				} else {
					return "$" + condition + " spend";
				}
			}
			$scope.venueNumber = contextService.userVenues.selectedVenueNumber;

			DataTableService.initDataTable('loyalty_table', columnDefinitions, false);

			var promise = RestServiceFactory.LoyaltyService().get({ id: $scope.venueNumber });

			promise.$promise.then(function (data) {

				var table = $('#loyalty_table').DataTable();

				$('#loyalty_table').on('click', '.fa-trash', function () {
					$scope.deleteLevel(this, table);
				});

				$('#loyalty_table').on('click', '.fa-edit', function () {
					$scope.editLevel(this, table);
				});

				data.levels.map(function (level) {
					table.row.add([level.displayAttributes.BG_COLOR, level.name, level.discount, level.rewardText, conditionFormat(level.condition, level.conditionType), level]);
				});
				table.draw();
			});

			$scope.editLevel = function (button, table) {
				var targetRow = $(button).closest("tr");
				var rowData = table.row(targetRow).data();
				$state.go('app.loyaltyedit', { id: rowData[5].id });
			}

			$scope.deleteLevel = function (button, table) {
				DialogService.confirmYesNo('Delete level?', 'Do you want to delete selected level?', function () {
					var targetRow = $(button).closest("tr");
					var rowData = table.row(targetRow).data();
					var target = { id: rowData[5].id };
					RestServiceFactory.LoyaltyService().delete(target, function (success) {
						table.row(targetRow).remove().draw();

					}, function (error) {
						if (typeof error.data != 'undefined') {
							toaster.pop('error', "Server Error", error.data.developerMessage);
						}
					});
				});
			}

			$scope.createNewLevel = function () {
				$state.go('app.loyaltyedit', { id: 'new' });
			}
		});
	}]);