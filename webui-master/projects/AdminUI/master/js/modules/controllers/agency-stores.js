/**=========================================================
 * Module: venuestores.js
 *smangipudi
 =========================================================*/
App.controller('AgencyStoresController', ['$scope', '$state', '$stateParams','RestServiceFactory', 'toaster', '$timeout', 'DataTableService', '$compile',
  function($scope, $state, $stateParams, RestServiceFactory, toaster, $timeout, DataTableService, $compile ) {
  'use strict';
  
    $scope.asMode = $state.current.data.mode === 'AS';

	$scope.init = function() {

		var promise = RestServiceFactory.AgencyService().get({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	$scope.agency = data;
	    }); 

	 	if ($scope.asMode) {
	 		$scope.initDataTable();
	 	}
	};
  
	$scope.search = function(storeName) {
		var promise = RestServiceFactory.AgencyService().get({search: storeName, type: 'STORE'});
		promise.$promise.then(function(data) {
			$scope.stores = data.agencies;
		});
	};

	$scope.doneAction = function() {
		if ($scope.asMode) {
			$state.go('app.agencies');
		} else {
			$state.go('app.agencyStores', {id:$stateParams.id});
		}
	};
	
	$scope.addAgencyStore = function(store) {
		
		var target = {id: $stateParams.id, storeId: store.id};
		RestServiceFactory.AgencyService().addStore(target,  function(success){
			var index = $scope.stores.indexOf(store);
			$scope.stores.splice(index, 1);
	  	},function(error){
	  		if (typeof error.data !== 'undefined') { 
	  			toaster.pop('error', "Server Error", error.data.developerMessage);
	  		}
	  	});
	};

	$scope.initDataTable = function() {
		$timeout(function(){

    		if ( ! $.fn.dataTable ) return;
    		var columnDefinitions = [
	        { sWidth: "25%", aTargets: [0] },
	        { sWidth: "30%", aTargets: [1] },
	        { sWidth: "20%", aTargets: [2,3] },
	        { "targets": [0,1,2,3,4], 
	        	"orderable": false
				},
	        
	        {
		    	"targets": [4],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		var actionHtml = '<button type="button" title="Remove Association" class="btn btn-default btn-oval fa fa-unlink"></button>';
		    		
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	  }
	    	} ];
  
    		DataTableService.initDataTable('agency_store_table', columnDefinitions);
		    var table = $('#agency_store_table').DataTable();
		    
			var promise = RestServiceFactory.AgencyService().getStores({id:$stateParams.id});
		    promise.$promise.then(function(data) {
		    	$scope.stores = data.stores;
		    	data.stores.map(function(store) {
		    		table.row.add([store.name, store.address, store.city, store.country, store]);
		    	});
    			table.draw();
		    });
		 
		    $('#agency_store_table').on('click', '.fa-unlink',function() {
		        $scope.deleteAgencyStore(this, table);
		    });
  		});
	};
	$scope.addNewStore = function() {
		$state.go('app.addAgencyStores', {id:$stateParams.id});
	};
	$scope.deleteAgencyStore = function(button, tableAPI) {

	    var targetRow = $(button).closest("tr");
	    var rowData = tableAPI.row( targetRow).data();   
	    var target = {id:$stateParams.id, storeId: rowData[4].id};   
	    RestServiceFactory.AgencyService().removeStore(target, function(success){
	      tableAPI.row(targetRow).remove().draw();
	    },function(error){
	      if (typeof error.data !== 'undefined') { 
	        toaster.pop('error', "Server Error", error.data.developerMessage);
	      }
	    });
  	};
 	$scope.init();
}]);