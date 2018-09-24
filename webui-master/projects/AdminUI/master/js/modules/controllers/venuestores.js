/**=========================================================
 * Module: venuestores.js
 *smangipudi
 =========================================================*/
App.controller('VenueStoreController', ['$scope', '$state', '$stateParams', '$compile', '$timeout',
  'DataTableService','RestServiceFactory', 'toaster', 'VenueService',  function($scope, $state, $stateParams, 
    $compile, $timeout, DataTableService, RestServiceFactory, toaster, venueService) {
  'use strict';
  
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
  
    DataTableService.initDataTable('venue_store_table', columnDefinitions);
    var table = $('#venue_store_table').DataTable();
    var promise = RestServiceFactory.VenueService().getAgencies({id:$stateParams.id});
    promise.$promise.then(function(data) {
    	$scope.data = data;
    	
    	data.agencies.map(function(store) {
    		table.row.add([store.name, store.address, store.city, store.country, store]);
    	});
    	table.draw();
    
    });

    $('#venue_store_table').on('click', '.fa-unlink',function() {
        $scope.deleteVenueStore(this, table);
    });
  });
  $scope.deleteVenueStore = function(button, tableAPI) {

    var targetRow = $(button).closest("tr");
    var rowData = tableAPI.row( targetRow).data();   
    var target = {id:$stateParams.id, agencyId: rowData[4].id};   
    RestServiceFactory.VenueService().removeAgency(target, function(success){
      tableAPI.row(targetRow).remove().draw();
    },function(error){
      if (typeof error.data !== 'undefined') { 
        toaster.pop('error', "Server Error", error.data.developerMessage);
      }
    });
  };
  $scope.addStore = function() {
    venueService.setVenueInfo($stateParams.id, 'name', $scope.data.venueName);
    $state.go('app.addVenueStore', {id: $stateParams.id});
  } ;
	
}]);