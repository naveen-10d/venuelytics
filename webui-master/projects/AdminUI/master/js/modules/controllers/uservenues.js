/**=========================================================
 * Module: uservenues.js
 *smangipudi
 =========================================================*/
App.controller('UserVenueController', ['$scope', '$state', '$stateParams', '$compile', '$timeout',
  'DataTableService','RestServiceFactory', 'toaster', 'FORMATS', 
          function($scope, $state, $stateParams, $compile, $timeout, DataTableService,
            RestServiceFactory, toaster, FORMATS) {
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
		    		var actionHtml = '<button type="button" class="btn btn-default btn-oval fa fa-unlink"></button>';
		    		
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	  }
	    	} ];
    
	    DataTableService.initDataTable('users_venue_table', columnDefinitions);
   
	    var promise = RestServiceFactory.UserService().get({id:$stateParams.id});
	    promise.$promise.then(function(data) {
    	$scope.data = data;
    	var table = $('#users_venue_table').DataTable();
    	data.venues.map(function(venue) {
    		
    		table.row.add([venue.venueName, venue.address, venue.city, venue.country, venue.venueNumber]);
    	});
    	table.draw();

    });

    

  });
  
  $('#users_venue_table').on('click', '.fa-unlink',function() {
    var table = $('#users_venue_table').DataTable();
    $scope.deleteUserVenue(this, table);
  });
  $scope.deleteUserVenue = function(button, tableAPI) {

    var targetRow = $(button).closest("tr");
    var rowData = tableAPI.row( targetRow).data();   
    var target = {id:$stateParams.id, venueNumber: rowData[4]};   
    RestServiceFactory.UserVenueService().deleteVenues(target, function(success){
      tableAPI.row(targetRow).remove().draw();
    },function(error){
      if (typeof error.data !== 'undefined') { 
        toaster.pop('error', "Server Error", error.data.developerMessage);
      }
    });
  };

  $scope.search = function(venueName) {
      var promise = RestServiceFactory.VenueService().get({search: venueName});
      promise.$promise.then(function(data) {
      
        $scope.venues = data.venues;
        
      });
    };

    $scope.doneAction = function() {
      $state.go('app.uservenues', {id:$stateParams.id});
    };
    
    
    $scope.addUserVenue = function(venue) {
      var venues = [];
      venues[0] = venue.venueNumber;
      var target = {id: $stateParams.id};
      RestServiceFactory.UserVenueService().save(target, venues,  function(success){
        var index = $scope.venues.indexOf(venue);
        $scope.venues.splice(index, 1);
      },function(error){
        if (typeof error.data !== 'undefined') { 
          toaster.pop('error', "Server Error", error.data.developerMessage);
        }
      });
      
    };
}]);