
App.controller('BusinessRequestController', ['$scope', '$state', '$compile', '$timeout', 'RestServiceFactory', 'DataTableService', 'toaster', 'UserRoleService', 'DialogService', '$stateParams',
	function ($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, UserRoleService, DialogService, $stateParams) {
		'use strict';

		$scope.initServiceTimeTable = function () {
			if (!$.fn.dataTable || $stateParams.id === 'new') {
				return;
			}
			var columnDefinitions = [
				{ sWidth: "5%", aTargets: [0] },
				{ sWidth: "15%", aTargets: [1, 2, 3] },
				{ sWidth: "10%", aTargets: [4, 5] },
				{ sWidth: "30%", aTargets: [6] },
				{
					"targets": [0],
					"orderable": false,
					"createdCell": function (td, cellData, rowData, row, col) {
						var imgHtml = '<div class="media text-center">';

						if (cellData !== null && cellData !== '') {
							imgHtml += '<img src="' + cellData + '" alt="Image" class="img-responsive img-circle">';
						} else {
							imgHtml += '<em class="fa fa-2x fa-user-o"></em>';
						}

						imgHtml += '</div>';
						$(td).html(imgHtml);
						$compile(td)($scope);
					}
				},
				{
					"targets": [6],
					"orderable": false,
					"createdCell": function (td, cellData, rowData, row, col) {

						var actionHtml = '<button title="Edit Business" class="btn btn-default btn-oval fa fa-edit"></button>' ;
							/*+ '&nbsp;&nbsp;<button title="Delete Business" class="btn btn-default btn-oval fa fa-trash"></button>';*/

						$(td).html(actionHtml);
						$compile(td)($scope);
					}
				},
				{
					"targets": [4],
					"orderable": false,
					"createdCell": function (td, cellData, rowData, row, col) {

						var actionHtml = '<em class="fa fa-check-square-o"></em>';
						if (cellData !== 'N') {
							actionHtml = '<em class="fa fa-square-o"></em>';
						}
						$(td).html(actionHtml);
						$compile(td)($scope);
					}
				}
			];

			DataTableService.initDataTable('business_request_table', columnDefinitions);

			var promise = RestServiceFactory.BusinessService().get({ id: $stateParams.id });
			promise.$promise.then(function (data) {
				var table = $('#business_request_table').DataTable();
				data.map(function (business) {
					var img = business.profileImageThumbnail;
					if (typeof img === 'undefined') {
						img = '';
					}
					table.row.add([img, business.businessName, business.address, business.category, business.unRead, business.role, business]);
				});
				table.draw();
			});

			var table = $('#business_request_table').DataTable();

			/*$('#business_request_table').on('click', '.fa-trash', function () {
				$scope.deleteBusiness(this, table);
			});*/

			$('#business_request_table').on('click', '.fa-edit', function () {
				$scope.editBusiness(this, table);
			});

		};

		$scope.editBusiness = function (button, table) {
			var targetRow = $(button).closest("tr");
			var rowData = table.row(targetRow).data();
			$state.go('app.businessrequestedit', { venueNumber: $stateParams.id, id: rowData[6].id });
		};

		/*$scope.deleteBusiness = function (button, table) {
			DialogService.confirmYesNo('Delete Business Request?', 'Are you sure want to delete selected business request?', function () {
				var targetRow = $(button).closest("tr");
				var rowData = table.row(targetRow).data();
				var target = { id: $stateParams.id, businessId: rowData[6].id };
				RestServiceFactory.BusinessService().delete(target, function (success) {
					table.row(targetRow).remove().draw();
				}, function (error) {
					if (typeof error.data !== 'undefined') {
						toaster.pop('error', "Server Error", error.data.developerMessage);
					}
				});
			});
		};*/

		/*$scope.createNewUser = function () {
			$state.go('app.useredit', { id: 'new' });
		};*/
		$timeout(function () {
			$scope.initServiceTimeTable();
		});

	}]);
