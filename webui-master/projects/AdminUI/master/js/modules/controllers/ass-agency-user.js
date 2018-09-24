/**=========================================================
 * Module: ass-agency-user.js
 *smangipudi
 =========================================================*/
App.controller('AssociateAgencyUserController', ['$scope', '$state', '$stateParams', '$compile', '$timeout', 'DataTableService',
  'RestServiceFactory', 'toaster', 'FORMATS', 'UserRoleService',function($scope, $state, $stateParams, $compile, $timeout, DataTableService, 
    RestServiceFactory, toaster, FORMATS, userRoleService) {
    'use strict';
  	$scope.agencyType = '';
  	var promise = RestServiceFactory.AgencyService().get({id:$stateParams.id});
  	promise.$promise.then(function(data) {
    	$scope.agencyName = data.name;
    	$scope.agencyType = data.type;
  	});

  	$scope.associateUser = function(button, table) {
	    var targetRow = $(button).closest("tr");
	    var rowData = table.row(targetRow).data();
	    var target = {id:$stateParams.id, partnerId: rowData[5].id};

	    RestServiceFactory.AgencyService().addPartner(target, function(success){
	      table.row(targetRow).remove().draw();
	    },function(error){
	      if (typeof error.data !== 'undefined') { 
	        toaster.pop('error', "Server Error", error.data.developerMessage);
	      }
	    });
  	};

	$scope.doneAction = function() {
	
		$state.go('app.agencyUsers' , {id:$stateParams.id});
	
	};

  $scope.initAgencyUsers = function() {
    $timeout(function(){

      if ( ! $.fn.dataTable ) return;
        var columnDefinitions = [
            { sWidth: "5%", aTargets: [0] },
            { sWidth: "20%", aTargets: [1,2] },
            { sWidth: "10%", aTargets: [3,4] },
            { sWidth: "20%", aTargets: [5] },
            { "targets": [0,1,2,3,4,5, 6], 
              "orderable": false
           },
           {
              "targets": [0],
              "orderable": false,
              "createdCell": function (td, cellData, rowData, row, col) {
                var imgHtml = '<div class="media text-center">';

                if (cellData !== null && cellData !== '') {
                  imgHtml += '<img src="'+cellData+'" alt="Image" class="img-responsive img-circle">';
                } else {
                  imgHtml += '<em class="fa fa-2x fa-user-o"></em>';
                }

                imgHtml += '</div>';
                $(td).html(imgHtml);
                $compile(td)($scope);
              }
            },
            {
             "targets": [4],
             "orderable": false,
             "createdCell": function (td, cellData, rowData, row, col) {
              
               var actionHtml = '<em class="fa fa-check-square-o"></em>';
               if (cellData === false){
                  actionHtml = '<em class="fa fa-square-o"></em>';
                }
                $(td).html(actionHtml);
                $compile(td)($scope);
              }
           },
          {
            "targets": [6],
            "orderable": false,
            "createdCell": function (td, cellData, rowData, row, col) {
              var actionHtml = '<button title="Unlink User " class="btn btn-default btn-oval fa fa-link"></button>';
              
              $(td).html(actionHtml);
              $compile(td)($scope);
              }
          } ];
      
        DataTableService.initDataTable('agency_user_table', columnDefinitions);
        var table = $('#agency_user_table').DataTable();
        $('#agency_user_table').on('click', '.fa-link', function() {
            $scope.associateUser(this, table);
        });


        var promise = RestServiceFactory.AgencyService().getPossiblePartners({id:$stateParams.id, partner: 'Y'});
        promise.$promise.then(function(data) {
          $scope.data = data;
          var table = $('#agency_user_table').DataTable();
          data.users.map(function(user) {
            var img = user.profileImageThumbnail;
            if (typeof img === 'undefined') {
              img = '';
            }
            table.row.add([img, user.userName, user.loginId, user.businessName, user.enabled, userRoleService.getRoles()[user.roleId], user]);
          });
          table.draw();
        });
        
    });
  };

  $scope.initAgencyUsers();
 
}]);