/**=========================================================
 * Module: venues.js
 * smangipudi
 =========================================================*/

App.controller('VenuesController', ['$scope', '$state','$compile','$timeout', 'RestServiceFactory', 'DataTableService', 'toaster','ngDialog', 
    function($scope, $state, $compile, $timeout, RestServiceFactory, DataTableService, toaster, ngDialog) {
  'use strict'; 
  
  $timeout(function(){

    if ( ! $.fn.dataTable ) return;
    var columnDefinitions = [ 
        { sWidth: "10%", aTargets: [0] },
        {
        	"targets": [0,1,2,3,4,5],
        	"orderable": false
        },
        {
	    	"targets": [6],
	    	"orderable": false,
	    	"createdCell": function (td, cellData, rowData, row, col) {
	    		 $(td).html('<button class="btn btn-primary btn-oval fa fa-edit" ></button>&nbsp;&nbsp;'+
            '<button class="btn btn-default btn-oval fa fa-trash" ></button>');
	    		 $compile(td)($scope);
	    		}
        },
    	{
	    	"targets": [5],
	    	"orderable": false,
	    	"createdCell": function (td, cellData, rowData, row, col) {
	    		
	    		var actionHtml = '<em class="fa fa-check-square-o"></em>';
	    		if (cellData !== 'Y'){
	    			actionHtml = '<em class="fa fa-square-o"></em>';
	    		}
	    		$(td).html(actionHtml);
	    		$compile(td)($scope);
	    	}
    	} ];
   
    DataTableService.initDataTable('stores_table', columnDefinitions, false);
    var table = $('#stores_table').DataTable();
    $('#stores_table').on('click', '.fa-edit', function() {
        $scope.editStore(this);
    });

    $('#stores_table').on('click', '.fa-trash', function() {
      $scope.deleteStore(this, table);
    });

    $('#stores_table_filter input').unbind();
    
    $('#stores_table_filter input').bind('keyup', function(e) {
    	if(e.keyCode === 13) {
    		
    		var promise = RestServiceFactory.VenueService().get({search:  $('#stores_table_filter input').val()});
    	    
    	    promise.$promise.then(function(data) {
    	    	 var table = $('#stores_table').DataTable();
    	    	 table.clear();
    	    	 data.venues.map(function(store) {
    	    		 table.row.add([store.venueName, store.address, store.phone, store.website, store.venueType, store.enabled, store.id]);
    	    	 });
    	    	 table.draw();
    	    });
    	    
    	}
    });
    
    var promise = RestServiceFactory.VenueService().get();
    
    promise.$promise.then(function(data) {
    	 var table = $('#stores_table').DataTable();
    	 data.venues.map(function(store) {
    		 table.row.add([store.venueName, store.address, store.phone, store.website, store.venueType, store.enabled, store.id]);
    	 });
    	 table.draw();
    });

    $scope.editStore = function(button) {
      var targetRow = $(button).closest("tr");
      var rowData = table.row(targetRow).data();
  		$state.go('app.venueedit', {id: rowData[6]});
  	};

    $scope.deleteStore = function(button, table) {
      var targetRow = $(button).closest("tr");
      var rowData = table.row(targetRow).data();
      ngDialog.openConfirm({
          template: 'deleteVenueId',
          className: 'ngdialog-theme-default'
      }).then(function (value) {
         var target = {id: rowData[6]};
          RestServiceFactory.VenueService().delete(target,  function(success){
            table.row(targetRow).remove().draw();
          }, function(error){
            if (typeof error.data !== 'undefined') { 
              toaster.pop('error', "Server Error", error.data.message);
            }
          });
      });
    };
  	$scope.createNewStore = function() {
  		$state.go('app.venueedit', {id: 'new'});
  	};
  });
}]);      