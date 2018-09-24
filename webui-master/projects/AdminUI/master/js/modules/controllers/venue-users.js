/**=========================================================
 * Module: uservenues.js
 *smangipudi
 =========================================================*/
App.controller('VenueUsersController', ['$scope', '$state', '$stateParams', '$compile', '$timeout',
  'DataTableService','RestServiceFactory', 'toaster', 'FORMATS', 'UserRoleService',
          function($scope, $state, $stateParams, $compile, $timeout, DataTableService, RestServiceFactory, toaster, FORMATS, UserRoleService) {
  'use strict';
  var userRoles = UserRoleService.getRoles();
  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
	    var columnDefinitions = [
	      { sWidth: "5%", aTargets: [0] },
        { sWidth: "15%", aTargets: [1, 2, 3, 4, 5] },
        { sWidth: "20%", aTargets: [6] },
        {
		    	"targets": [6],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		var actionHtml = '<button type="button" class="btn btn-default btn-oval fa fa-unlink"></button>';
		    		
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	  }
	    	},
        {
          "targets": [5],
          "orderable": false,
          "createdCell": function (td, cellData, rowData, row, col) {

            var actionHtml = '<em class="fa fa-check-square-o"></em>';
            if (cellData === false) {
              actionHtml = '<em class="fa fa-square-o"></em>';
            }
            $(td).html(actionHtml);
            $compile(td)($scope);
          }
        },
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
        }

      ];
    
	    DataTableService.initDataTable('venue_users_table', columnDefinitions);
   
	    var promise = RestServiceFactory.VenueService().getVenueUsers({id:$stateParams.id});
	    promise.$promise.then(function(data) {
    	  $scope.data = data;
    	  var table = $('#venue_users_table').DataTable();
    	  data.users.map(function(user) {	
          var role = userRoles[user.roleId];

          if (role == null) {
            role = user.role;
          }
          var img = user.profileImageThumbnail;
          if (typeof img === 'undefined') {
            img = '';
          }
    		  table.row.add([img, user.userName, user.loginId, user.email, role,  user.enabled, user]);
    	  });
    	 table.draw();
      
    });

  });
  
  $('#venue_users_table').on('click', '.fa-unlink',function() {
    var table = $('#venue_users_table').DataTable();
    $scope.deleteUserVenue(this, table);
  });
  $scope.deleteUserVenue = function(button, tableAPI) {

      var targetRow = $(button).closest("tr");
      var rowData = tableAPI.row( targetRow).data();   
      var target = {id:rowData[6].id, venueNumber: $stateParams.id};   
      RestServiceFactory.UserVenueService().deleteVenues(target, function(success){
        tableAPI.row(targetRow).remove().draw();
      },function(error){
        if (typeof error.data !== 'undefined') { 
          toaster.pop('error', "Server Error", error.data.developerMessage);
        }
      });
    };

    $scope.addUserToVenue = function() {
      $state.go('app.venueUsers', {id:$stateParams.id});
    };
}]);