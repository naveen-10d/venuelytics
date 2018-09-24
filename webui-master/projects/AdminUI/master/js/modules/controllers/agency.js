/**=========================================================
 * Module: userInfo.js
 * smangipudi
 =========================================================*/

App.controller('AgencyController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'FORMATS','DataTableService','$compile',
    function($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS, DataTableService, $compile) {
  'use strict';
    
    $scope.budgetTypes = [{name: 'M', label: "Max", disabled: false}, 
                          {name: 'NM', label: "No Max", disabled: false}, 
                          {name: 'DM', label: "Daily Max", disabled: true},
                          {name: 'WM', label: "Weekly Max", disabled: true},
                          {name: 'MM', label: "Monthly Max", disabled: true},
                          ];
    
    if($stateParams.id !== 'new') {
	    var promise = RestServiceFactory.AgencyService().get({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	if (data.phone !== null) {
	    		data.phone = $.inputmask.format(data.phone,{ mask: FORMATS.phoneUS} );
	    	}
	    	if (data.mobile !== null) {
	    		data.mobile = $.inputmask.format(data.mobile,{ mask: FORMATS.phoneUS} );
	    	}
	    	$scope.data = data;

	    });
    } else {
    	var data = {};
    	data.enabled = "N";
    	$scope.data = data;
        $scope.data.budgetType = "NM";
    }
	$scope.agencyType = $state.current.data.type;

    $scope.onSectionChange = function(budgetType) {
        if (budgetType === 'NM') {
            $scope.data.budget = "";
        }
    };

    $scope.update = function(isValid, data) {

    	if (!$("#agencyForm").parsley().isValid() || !isValid ) {
    		return;
    	}
    	var payload = RestServiceFactory.cleansePayload('AgencyService', data);
    	var target = {id: data.id};
    	if ($stateParams.id === 'new'){
    		target = {};
    	}
        payload.type = $scope.agencyType;
    	RestServiceFactory.AgencyService().save(target,payload, function(success){
            var route = $scope.agencyType === 'AGENCY'? 'app.agencies': 'app.stores';
    		  $state.go(route);
            
    	},function(error){
    		if (typeof error.data !== 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
    };

    $scope.initMacInfoTable = function() {
        if ( ! $.fn.dataTable || $stateParams.id === 'new') {
          return;
        }
        var columnDefinitions = [
        {
         "sWidth" : "30%", aTargets:[0],
         "sWidth" : "20%", aTargets:[2],
         "sWidth" : "50%", aTargets:[1]
        },
        {
          "targets": [2],
          "createdCell": function (td, cellData, rowData, row, col) {
            var actionHtml = '<button title="Delete" ng-disabled="true" class="btn btn-default btn-oval fa fa-trash" ></button>';

            $(td).html(actionHtml);
            $compile(td)($scope);
          }
        }];
        DataTableService.initDataTable('mac_id_table', columnDefinitions);
        var table = $('#mac_id_table').DataTable();
        RestServiceFactory.AgencyService().getAuthorizedMachines({id:$stateParams.id}, function(data) {
            $scope.macData = data
            $.each($scope.macData, function (k,v) {
                table.row.add([v.name, v.machineInfo, v]);
            });
            table.draw();
        });
        
    };

    $scope.initMacInfoTable();

}]);