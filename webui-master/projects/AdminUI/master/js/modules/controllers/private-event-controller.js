/**=========================================================
 * Module: private-event-controller.js
 *smangipudi
 =========================================================*/
App.controller('PrivateEventController', ['$scope', '$state', '$stateParams', '$compile',
 '$timeout', 'DataTableService','RestServiceFactory', 'toaster', 'FORMATS','$rootScope','ngDialog', function($scope, $state, $stateParams,
  $compile, $timeout, DataTableService, RestServiceFactory, toaster, FORMATS, $rootScope, ngDialog) {
    'use strict';

    $scope.deletedPrivateImage = [];
    $scope.imageUrl = [];
    var promise = RestServiceFactory.ProductService().getPrivateEvent({id:$stateParams.venueNumber, productId: $stateParams.id, role: 'admin'});
    $scope.venueNumber = $stateParams.venueNumber;
    $scope.data = {enabled: 'N'};
    promise.$promise.then(function(data) {
 	    $scope.data = data;
        $scope.imageUrl = data.imageUrls;
    });
    $scope.displayTypeName = "Party Hall";
    $scope.displayName = "Party Package  Name *";
    if($state.current.name === 'app.editBanquetHall'){
        $scope.displayTypeName = "Banquet Hall";
        $scope.displayName = "Banquet Hall Name *"
    }
    $scope.deleteImage = function(index, deletedImage) {
      var id= {
          "id" : deletedImage.id
      };
      
      RestServiceFactory.VenueImage().deleteVenueImage(id, function(data){
        deletedImage.status = "DELETED";
        toaster.pop('data', "Deleted the selected Image successfull");
      },function(error){
        if (typeof error.data !== 'undefined') {
          toaster.pop('error', "Server Error", error.data.developerMessage);
        }
      });
    };
    

	$scope.update = function(isValid, data, num) {
        if($state.current.name === 'app.editBanquetHall'){
            data.brand = "BanquetHall";
            data.productType = "BanquetHall";
            data.category = "BanquetHall";
        } else {
            data.brand = "PartyHall";
            data.productType = "PartyHall";
            data.category = "PartyHall";
        }
    	if (!isValid) {
    		return;
    	}
        data.imageUrls = $scope.imageUrl;
        $scope.imageUrl = [];
        angular.forEach(data.imageUrls, function(value, key){ 
            var venueImageId = {
                "id" : value.id
            };
            angular.forEach($scope.deletedPrivateImage, function(value1, key1) {
                if(venueImageId.id == value1.id) {
                    delete venueImageId.id;
                }
            });
            $scope.imageUrl.push(venueImageId);
        });
        data.imageUrls = $scope.imageUrl;
    	var payload = RestServiceFactory.cleansePayload('ProductService', data);
    	//var target = {id: data.id};
    	var target = {id:data.venueNumber, productId: $stateParams.id};
    	if ($stateParams.id === 'new'){
    		target = {id: num};
    	}
    	RestServiceFactory.ProductService().updatePrivateEvent(target,payload, function(success){
            if(target.productId == success.id){
                ngDialog.openConfirm({
                    template: '<p>Your information update successfull</p>',
                    plain: true,
                    className: 'ngdialog-theme-default'
                });
            } else {
                ngDialog.openConfirm({
                    template: '<p>Your information saved successfull</p>',
                    plain: true,
                    className: 'ngdialog-theme-default'
                });
            }
            $state.go('app.venueedit', {id : $scope.venueNumber});
    	},function(error){
    		if (typeof error.data !== 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
    };
    $scope.uploadFile = function(PrivateImage) {
        var fd = new FormData();
        fd.append("file", PrivateImage[0]);
        var payload = RestServiceFactory.cleansePayload('PrivateImage', fd);
        RestServiceFactory.VenueImage().uploadPrivateImage(payload, function(success){
          if(success !== {}){
            $scope.imageUrl.push(success);
            toaster.pop('success', "Image upload successfull");
            document.getElementById("clear").value = "";
          }
        },function(error){
            if (typeof error.data !== 'undefined') {
                toaster.pop('error', "Server Error", error.data.developerMessage);
            }
        });
    };
 
}]);