
/**=========================================================
 * Module: band-artist-controller.js
 * smangipudi
 =========================================================*/
 /*jshint bitwise: false*/
 App.controller('BandArtistController', ['$scope', function($scope) {
    'use strict';

   $scope.tabs = [
   	  {name: 'Performers', content: 'app/views/artists/artists.html', icon: 'fa-list-ul'},
      //{name: 'Bands', content: 'app/views/artists/bands.html', icon: 'fa-home'},
    ];

}]);


App.controller('ArtistsController', ['$scope', '$state', 'RestServiceFactory', '$timeout','DataTableService','$compile', 'DialogService',
  function($scope, $state,  RestServiceFactory, $timeout,DataTableService, $compile, DialogService) {

	'use strict';

  
	$timeout(function () {

		if (!$.fn.dataTable) return;
		var columnDefinitions = [
			{ sWidth: "5%", aTargets:  [0] },
			{ sWidth: "25%", aTargets: [1] },
			{ sWidth: "10%", aTargets: [2] },
			{ sWidth: "35%", aTargets: [3] },
			{ sWidth: "5%", aTargets:  [5] },
			{ sWidth: "20%", aTargets: [4] },
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
				"targets": [5],
				"orderable": false,
				"createdCell": function (td, cellData, rowData, row, col) {

					var actionHtml = '<button title="Edit Performer" class="btn btn-default btn-oval fa fa-edit"></button>';
						//'&nbsp;&nbsp;<button title="Delete Performer" class="btn btn-default btn-oval fa fa-trash"></button>';

					$(td).html(actionHtml);
					$compile(td)($scope);
				}
			},
			{
				"targets": [4],
				"orderable": false,
				"createdCell": function (td, cellData, rowData, row, col) {

					var actionHtml = '<em class="fa fa-check-square-o"></em>';
					if (cellData === false || cellData === 'N') {
						actionHtml = '<em class="fa fa-square-o"></em>';
					}
					$(td).html(actionHtml);
					$compile(td)($scope);
				}
			}
		];

		DataTableService.initDataTable('artists_table', columnDefinitions);

		var promise = RestServiceFactory.PerformerService().get({all: 'Y'});
		promise.$promise.then(function (data) {
			var table = $('#artists_table').DataTable();
			data.performers.map(function (performer) {
				
				table.row.add([performer.thumbnailImageUrl, performer.performerName, performer.artistType, performer.description, performer.enabled, performer]);
			});
			table.draw();
		});

		var table = $('#artists_table').DataTable();

		/*$('#artists_table').on('click', '.fa-trash', function () {
			$scope.deleteArtist(this, table);
		});*/

		$('#artists_table').on('click', '.fa-edit', function () {
			$scope.editArtist(this, table);
		});

	});

	$scope.editArtist = function (button, table) {
		var targetRow = $(button).closest("tr");
		var rowData = table.row(targetRow).data();
		$state.go('app.artistedit', { id: rowData[5].id });
	};


	/*$scope.deleteArtist = function (button, table) {
		DialogService.confirmYesNo('Delete Performer?', 'Are you sure want to delete selected Performer?', function () {
			var targetRow = $(button).closest("tr");
			var rowData = table.row(targetRow).data();
			var target = { id: rowData[6].id };
			RestServiceFactory.PerformerService().delete(target, function (success) {
				table.row(targetRow).remove().draw();
			}, function (error) {
				if (typeof error.data !== 'undefined') {
					toaster.pop('error', "Server Error", error.data.developerMessage);
				}
			});
		});
	};
*/
	$scope.createNewArtist = function () {
		$state.go('app.artistedit', { id: 'new' });
	};

}]);


App.controller('ArtistController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'Session',
    function( $scope, $state, $stateParams, RestServiceFactory, toaster , Session) {

	'use strict';
    $scope.data = {};
    if($stateParams.id !== 'new') {
	    var promise = RestServiceFactory.PerformerService().get({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	$scope.data = data;
            
	    });
    } else {
    	var data = {};
    	data.enabled = 'N';
    	$scope.data = data;
    }
  	$scope.init =function() {
       
  		var self  = $scope;
        angular.element(document).ready(function() {

	        var progressbar = $('#progressbar'),
	            bar         = progressbar.find('.progress-bar'),
	            settings    = {

	                action: RestServiceFactory.getImageUploadUrl("artist-profile"), // upload url

	                allow : '*.(jpg|jpeg|gif|png)', // allow only images

	                param: 'file',

	                loadstart: function() {
	                    bar.css('width', '0%').text('0%');
	                    progressbar.removeClass('hidden');
	                },

	                progress: function(percent) {
	                    percent = Math.ceil(percent);
	                    bar.css('width', percent+'%').text(percent+'%');
	                },

	                beforeSend : function (xhr) {
	                    xhr.setRequestHeader('X-XSRF-TOKEN', Session.id);
	                },

	                allcomplete: function(response) {

	                    var data = response && angular.fromJson(response);
	                    bar.css('width', '100%').text('100%');

	                    setTimeout(function(){
	                        progressbar.addClass('hidden');
	                    }, 250);

	                    // Upload Completed
	                    if(data) {
	                        $scope.$apply(function() {
	                           self.data.imageUrl = data.originalUrl;
	                           self.data.thumbnailImageUrl = data.smallUrl;
	                        });
	                    }
	                }
	            };

	        	var select = new $.upload.select($('#upload-select'), settings),
	            drop   = new $.upload.drop($('#upload-drop'), settings);
	     });

    } ;
    
    $scope.update = function(isValid, data) {
    	if (!isValid) {
    		return;
    	}

    	var payload = RestServiceFactory.cleansePayload('PerformerService', data);
   		
   		console.log("Enabled: " + payload.enabled);
  	
    	var target = {id: data.id};
    	if ($stateParams.id === 'new'){
    		target = {};
    	}
        
    	RestServiceFactory.PerformerService().save(target, payload, function(success){
    		$state.go('app.band_artists');
    	},function(error){
    		if (typeof error.data !== 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
    };

    $scope.init();
	

}]);



App.controller('BandsController', ['$scope', '$state', 'RestServiceFactory', '$timeout','DataTableService','$compile', 'DialogService',
  function($scope, $state,  RestServiceFactory, $timeout,DataTableService, $compile, DialogService) {

	'use strict';

  
	$timeout(function () {

		if (!$.fn.dataTable) return;
		var columnDefinitions = [
			{ sWidth: "5%", aTargets:  [0] },
			{ sWidth: "15%", aTargets: [1] },
			{ sWidth: "10%", aTargets: [2,4] },
			{ sWidth: "40%", aTargets: [3] },
			{ sWidth: "20%", aTargets: [5] },
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
				"targets": [5],
				"orderable": false,
				"createdCell": function (td, cellData, rowData, row, col) {

					var actionHtml = '<button title="Edit Band" class="btn btn-default btn-oval fa fa-edit"></button>' +
						'&nbsp;&nbsp;<button title="Add Performer" class="btn btn-default btn-oval fa fa-user-o"></button>'
						'&nbsp;&nbsp;<button title="Delete Band" class="btn btn-default btn-oval fa fa-trash"></button>';

					$(td).html(actionHtml);
					$compile(td)($scope);
				}
			},
			{
				"targets": [4],
				"orderable": false,
				"createdCell": function (td, cellData, rowData, row, col) {

					var actionHtml = '<em class="fa fa-check-square-o"></em>';
					if (cellData === false || cellData === 'N') {
						actionHtml = '<em class="fa fa-square-o"></em>';
					}
					$(td).html(actionHtml);
					$compile(td)($scope);
				}
			}
		];

		DataTableService.initDataTable('bands_table', columnDefinitions);

		var promise = RestServiceFactory.BandService().query();
		promise.$promise.then(function (data) {
			var table = $('#bands_table').DataTable();
			data.map(function (band) {
				
				table.row.add([band.imageUrls, band.name, band.type, band.description, band.enabled, band]);
			});
			table.draw();
		});

		var table = $('#bands_table').DataTable();

		$('#bands_table').on('click', '.fa-trash', function () {
			$scope.deleteBand(this, table);
		});

		$('#bands_table').on('click', '.fa-user-o', function () {
			var targetRow = $(this).closest("tr");
			var rowData = table.row(targetRow).data();
			$state.go('app.band-performers', { id: rowData[5].id });
		});

		$('#bands_table').on('click', '.fa-edit', function () {
			$scope.editBand(this, table);
		});

	});

	$scope.editBand = function (button, table) {
		var targetRow = $(button).closest("tr");
		var rowData = table.row(targetRow).data();
		$state.go('app.bandedit', { id: rowData[5].id });
	};

	
	$scope.deleteBand = function (button, table) {
		DialogService.confirmYesNo('Delete Band?', 'Are you sure want to delete selected Band?', function () {
			var targetRow = $(button).closest("tr");
			var rowData = table.row(targetRow).data();
			var target = { id: rowData[5].id };
			RestServiceFactory.BandService().delete(target, function (success) {
				table.row(targetRow).remove().draw();
			}, function (error) {
				if (typeof error.data !== 'undefined') {
					toaster.pop('error', "Server Error", error.data.developerMessage);
				}
			});
		});
	};

	$scope.createNewBand = function () {
		$state.go('app.bandedit', { id: 'new' });
	};

}]);


App.controller('BandController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'Session',
    function( $scope, $state, $stateParams, RestServiceFactory, toaster , Session) {

	'use strict';
    $scope.data = {};
    $scope.deletedImages = [];
    if($stateParams.id !== 'new') {
	    var promise = RestServiceFactory.BandService().get({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	$scope.data = data;
	    	if (($scope.data.imageUrls == null) || (typeof($scope.data.imageUrls) === 'undefined')) {
	    		$scope.data.imageUrls = [];
	    	}
            
	    });
    } else {
    	var data = {};
    	data.enabled = 'N';
    	$scope.data = data;
    	$scope.data.imageUrls = [];
    }
  	$scope.init =function() {
       
  		var self  = $scope;
        
    } ;
    
    $scope.uploadFile = function(images) {
	    var fd = new FormData();
	    fd.append("file", images[0]);
	    
	    var payload = RestServiceFactory.cleansePayload('venueImage', fd);
	    
	    var target = {objectType: 'band'};

	    RestServiceFactory.VenueImage().uploadImage(target, payload, function(data){
		    if(data !== {}){
		        $scope.data.imageUrls.push(data);
		        toaster.pop('success', "Image upload successfully.");
		        document.getElementById("control").value = "";
		    }
	    },function(error){
	      if (typeof error.data !== 'undefined') {
	     	toaster.pop('error', "Server Error", error.data.developerMessage);
	      }
	    });
  	};

  	$scope.deleteImage = function(index, deletedImage) {
      var id= {
          "id" : deletedImage.id
      };
      
      RestServiceFactory.VenueImage().deleteVenueImage(id, function(data){
        deletedImage.status = "DELETED";
        $scope.deletedImages.push(id);
        toaster.pop('data', "Deleted the selected Image successfull");
      },function(error){
        if (typeof error.data !== 'undefined') {
          toaster.pop('error', "Server Error", error.data.developerMessage);
        }
      });
  };

    $scope.update = function(isValid, data) {
    	if (!isValid) {
    		return;
    	}

    	var imageUrls = $scope.data.imageUrls;
   		
   		$scope.data.imageUrls = [];
   		
   		for (var idx = 0; idx  < imageUrls.length; idx++) {
   			var deleted = false;
   			for (var j =0; j < $scope.deletedImages.length; j++) {
   				if ($scope.deletedImages[i].id === imageUrls[idx].id) {
   					deleted = true;
   					break;
   				}
   			}
   			if (deleted) {
   				continue;
   			}
   			var imageIds = {id: imageUrls[idx].id};
   			$scope.data.imageUrls.push(imageIds);

   		}

    	var payload = RestServiceFactory.cleansePayload('BandService', data);
    	

   		console.log("Enabled: " + payload.enabled);
  	
    	var target = {id: data.id};
    	if ($stateParams.id === 'new'){
    		target = {};
    	}
        
    	RestServiceFactory.BandService().save(target, payload, function(data){
    		$state.go('app.band_artists');
    	},function(error){
    		if (typeof error.data !== 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
    };

    $scope.init();
	

}]);

App.controller('BandPerformerController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'Session', '$timeout', 'DataTableService', '$compile', 
    function( $scope, $state, $stateParams, RestServiceFactory, toaster , Session, $timeout, DataTableService, $compile) {

	'use strict';
    $scope.band = {};
    if($stateParams.id !== 'new') {
	    var promise = RestServiceFactory.BandService().get({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	$scope.band = data;
            
	    });
    } 

  	$timeout(function(){

    	if ( ! $.fn.dataTable ) return;
    	var columnDefinitions = [
	        { sWidth: "25%", aTargets: [0] },
	        { sWidth: "15%", aTargets: [1] },
	        { sWidth: "50%", aTargets: [2] },
	        { sWidth: "10%", aTargets: [3] },
	        
	        {
		    	"targets": [3],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		var actionHtml = '<button type="button" class="btn btn-default btn-oval fa fa-unlink"></button>';
		    		
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	  }
	    	} ];

    	DataTableService.initDataTable('band_performer_table', columnDefinitions);

	    var promise = RestServiceFactory.BandService().getPerformers({id:$stateParams.id});
	    promise.$promise.then(function(data) {
			$scope.performers = data;
			var table = $('#band_performer_table').DataTable();
			data.map(function(performer) {
				table.row.add([performer.performerName, performer.artistType, performer.description, performer]);
			});
			table.draw();
		});
	});
    
    $('#band_performer_table').on('click', '.fa-unlink', function () {
    	var table = $('#band_performer_table').DataTable();
		var targetRow = $(this).closest("tr");
		var rowData = table.row(targetRow).data();
		var target = { id: $scope.band.id, performerId: rowData[3].id };
		RestServiceFactory.BandService().removePerformer(target, function (success) {
			table.row(targetRow).remove().draw();
		}, function (error) {
			if (typeof error.data !== 'undefined') {
				toaster.pop('error', "Server Error", error.data.developerMessage);
			}
		});
	});

  	$scope.init =function() {
       
  		var self  = $scope;
        
    } ;

}]);


App.controller('AddBandPerformerController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'Session', '$timeout', 'DataTableService', '$compile', 
    function( $scope, $state, $stateParams, RestServiceFactory, toaster , Session, $timeout, DataTableService, $compile) {

	'use strict';
    $scope.band = {};
    if($stateParams.id !== 'new') {
	    RestServiceFactory.BandService().get({id:$stateParams.id}, function(data) {
	    	$scope.band = data;
            
	    });
    } 

  	$timeout(function(){

    	if ( ! $.fn.dataTable ) return;
    	var columnDefinitions = [
	        { sWidth: "25%", aTargets: [0] },
	        { sWidth: "15%", aTargets: [1] },
	        { sWidth: "50%", aTargets: [2] },
	        { sWidth: "10%", aTargets: [3] },
	        
	        {
		    	"targets": [3],
		    	"orderable": false,
		    	"createdCell": function (td, cellData, rowData, row, col) {
		    		var actionHtml = '<button type="button" class="btn btn-default btn-oval fa fa-link"></button>';
		    		
		    		$(td).html(actionHtml);
		    		$compile(td)($scope);
		    	  }
	    	} ];

    	DataTableService.initDataTable('search_performer_table', columnDefinitions);

	    var promise = RestServiceFactory.PerformerService().get({}, function(data) {
			var table = $('#search_performer_table').DataTable();
			data.performers.map(function(performer) {
				table.row.add([performer.performerName, performer.artistType, performer.description, performer]);
			});
			table.draw();
		});
	});
    
    $('#search_performer_table').on('click', '.fa-link', function () {
    	var table = $('#search_performer_table').DataTable();
		var targetRow = $(this).closest("tr");
		var rowData = table.row(targetRow).data();
		var target = { id: $scope.band.id, performerId: rowData[3].id };
		RestServiceFactory.BandService().addPerformer(target, function (success) {
			table.row(targetRow).remove().draw();
		}, function (error) {
			if (typeof error.data !== 'undefined') {
				toaster.pop('error', "Server Error", error.data.developerMessage);
			}
		});
	});
	
  	$scope.doneAction = function() {
  		$state.go("app.band-performers", {id: $scope.band.id});
  	}
}]);


