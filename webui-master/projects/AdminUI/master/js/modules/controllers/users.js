/**=========================================================
 * Module: users.js
 *smangipudi
 =========================================================*/

App.controller('UsersController', ['$scope', '$state', '$compile', '$timeout', 'RestServiceFactory', 'DataTableService', 'toaster', 'UserRoleService', 'DialogService',
	function ($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, UserRoleService, DialogService) {
		'use strict';

		var userRoles = UserRoleService.getRoles();
		$timeout(function () {

			if (!$.fn.dataTable) return;
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

						var actionHtml = '<button title="Edit User" class="btn btn-default btn-oval fa fa-edit"></button>' +
							'&nbsp;&nbsp;<button title="Associate Venue" class="btn btn-default btn-oval fa fa-home"></button>' +
							'&nbsp;&nbsp;<button title="Delete User" class="btn btn-default btn-oval fa fa-trash"></button>';

						$(td).html(actionHtml);
						$compile(td)($scope);
					}
				},
				{
					"targets": [4],
					"orderable": false,
					"createdCell": function (td, cellData, rowData, row, col) {

						var actionHtml = '<em class="fa fa-check-square-o"></em>';
						if (cellData === false) {
							actionHtml = '<em class="fa fa-square-o"></em>';
						}
						$(td).html(actionHtml);
						$compile(td)($scope);
					}
				}
			];

			DataTableService.initDataTable('users_table', columnDefinitions);

			var promise = RestServiceFactory.UserService().get();
			promise.$promise.then(function (data) {
				var table = $('#users_table').DataTable();
				data.users.map(function (user) {
					var role = userRoles[user.roleId];

					if (role == null) {
						role = user.role;
					}
					if (user.businessName == null) {
						user.businessName = "";
					}
					var img = user.profileImageThumbnail;
					if (typeof img === 'undefined') {
						img = '';
					}
					table.row.add([img, user.userName, user.loginId, user.businessName, user.enabled, role, user]);
				});
				table.draw();
			});

			var table = $('#users_table').DataTable();

			$('#users_table').on('click', '.fa-trash', function () {
				$scope.deleteUser(this, table);
			});

			$('#users_table').on('click', '.fa-edit', function () {
				$scope.editUser(this, table);
			});

			$('#users_table').on('click', '.fa-home', function () {
				$scope.associateVenue(this, table);
			});
		});

		$scope.editUser = function (button, table) {
			var targetRow = $(button).closest("tr");
			var rowData = table.row(targetRow).data();
			$state.go('app.useredit', { id: rowData[6].id });
		};

		$scope.associateVenue = function (button, table) {
			var targetRow = $(button).closest("tr");
			var rowData = table.row(targetRow).data();
			$state.go('app.uservenues', { id: rowData[6].id });
		};

		$scope.deleteUser = function (button, table) {
			DialogService.confirmYesNo('Delete User?', 'Are you sure want to delete selected User?', function () {
				var targetRow = $(button).closest("tr");
				var rowData = table.row(targetRow).data();
				var target = { id: rowData[6].id };
				RestServiceFactory.UserService().delete(target, function (success) {
					table.row(targetRow).remove().draw();
				}, function (error) {
					if (typeof error.data !== 'undefined') {
						toaster.pop('error', "Server Error", error.data.developerMessage);
					}
				});
			});
		};

		$scope.createNewUser = function () {
			$state.go('app.useredit', { id: 'new' });
		};
	}]);
