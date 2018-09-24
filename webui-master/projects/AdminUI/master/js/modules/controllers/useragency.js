/**=========================================================
 * Module: useragency.js
 *smangipudi
 =========================================================*/
App.controller('UserAgencyController', ['$scope', '$state', '$stateParams', '$compile', '$timeout', 'DataTableService',
	'RestServiceFactory', 'toaster', 'UserRoleService', function($scope, $state, $stateParams, $compile, $timeout, DataTableService,
	 RestServiceFactory, toaster, userRoleService) {
  'use strict';
  
 	var userRoles = userRoleService.getRoles();
  
  	$scope.init = function() {
	  	$timeout(function(){

		    if ( ! $.fn.dataTable ) return;
		    var columnDefinitions = [
		        { sWidth: "15%", aTargets: [0,1,3] },
		        { sWidth: "5%", aTargets: [2] },
		        {
			    	"targets": [5],
			    	"orderable": false,
			    	"createdCell": function (td, cellData, rowData, row, col) {
			    		var actionHtml = '<button title="Add User" class="btn btn-default btn-oval fa fa-link"></button>&nbsp;&nbsp;';
			    		
			    		$(td).html(actionHtml);
			    		$compile(td)($scope);
			    	  }
		    	},
		    	{
			    	"targets": [3],
			    	"orderable": false,
			    	"createdCell": function (td, cellData, rowData, row, col) {
			    		
			    		var actionHtml = '<em class="fa fa-check-square-o"></em>';
			    		if (cellData === false || cellData === 'N' || cellData === "false") {
			    			actionHtml = '<em class="fa fa-square-o"></em>';
			    		}
			    		$(td).html(actionHtml);
			    		$compile(td)($scope);
			    	}
			 	} 
			];
	    
		    DataTableService.initDataTable('users_table', columnDefinitions);
	   		var table = $('#users_table').DataTable();
	      	$('#users_table').on('click', '.fa-link', function() {
	        	$scope.addAgencyUser(this, table);
	      	});
	      	var target = "";
	      	if ($scope.agency.type === 'AGENCY') {
	      		target = {roleId: "7,9,10,11,50,51"};
	      	} else {
	      		target = {roleId: "10,12"};
	      	}
		    var promise = RestServiceFactory.UserService().get(target);
		    promise.$promise.then(function(data) {
			    $scope.data = data;
		    	var table = $('#users_table').DataTable();
		    	
		    	data.users.map(function(user) {

		    		var role = userRoles[user.role];
		    		if (role == null) {
		    			role = user.role;
		    		}
	    			if (user.agencyId === -1) {
	    				table.row.add([user.userName, user.loginId, user.businessName, user.enabled, role, user.id]);
	    			}
		    	});
		    	table.draw();
	    	});
	  	
		});
	};

	$scope.doneAction = function() {
		$state.go('app.agencyUsers', {id:$stateParams.id});
	};
	
	
	$scope.addAgencyUser = function(button, table) {

  		var targetRow = $(button).closest("tr");
      	var rowData = table.row(targetRow).data();
 		var userIds = [rowData[4]];

		var target = {id: $stateParams.id};
		RestServiceFactory.AgencyService().addAgent(target, userIds,  function(success){
			table.row(targetRow).remove().draw();
		},function(error){
			if (typeof error.data !== 'undefined') { 
  				toaster.pop('error', "Server Error", error.data.developerMessage);
			}
		});
	};

	RestServiceFactory.AgencyService().get({id:$stateParams.id}, function(data) {
    	$scope.agency = data;
    	$scope.init();
    });
}]);