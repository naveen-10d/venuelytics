/**=========================================================
 * Module: userInfo.js
 * smangipudi
 =========================================================*/

App.controller('UserController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'FORMATS', 'Session','UserRoleService',
    function($scope, $state, $stateParams, RestServiceFactory, toaster, FORMATS, Session, UserRoleService) {
   
   'use strict';
    $scope.data = {};
    $scope.showSecurityCode = false;
    $scope.showHideText = "Show Security Code";
    if($stateParams.id !== 'new') {
	    var promise = RestServiceFactory.UserService().get({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	
	    	data.enabled = data.enabled ? "true" : "false";
	    	$scope.data = data;
            
            $scope.getSecurityToken();
            
	    });
    } else {
    	var data = {};
    	data.enabled = "false";
    	$scope.data = data;
    }
	
    var allRoles = UserRoleService.getRoles();
    $scope.userRoles = {};
    self = $scope;
    angular.forEach(allRoles, function(value, key) {
        if (key <= Session.roleId) {
            self.userRoles[key] = value;
        }
    });
    $scope.managerUsers = [];
    $scope.getManagers = function() {
        RestServiceFactory.UserService().getManagers({}, function(managerUsers) {
            $scope.managerUsers = managerUsers;
        });
    };

    $scope.storeAddress = function(store) {
    	return store.address.concat(", ", store.city, ", " , store.state);
    };

    $scope.getSecurityToken = function() {
        RestServiceFactory.UserService().getSecurityToken({id:$stateParams.id},function(data){
            $scope.securityCodeSecure = data.securityCode;
            $scope.securityBarCode = 'data:image/png;base64,' +data.securityBarCode;
             
        });
    };
    
    $scope.newSecurityToken = function() {
        $scope.showSecurityCode = true;
        $scope.showHideSecurityCode();
        RestServiceFactory.UserService().generateSecurityToken({id:$stateParams.id},function(data){
            $scope.securityCodeSecure = data.securityCode;
            $scope.securityBarCode = 'data:image/png;base64,' +data.securityBarCode;
            toaster.pop("success", "New Security Code", "New Security Code is generated and saved in the user profile.")
             
        });
    };
    
    $scope.showHideSecurityCode = function() {
        $scope.showSecurityCode = ! $scope.showSecurityCode;
        if ( $scope.showSecurityCode) {
            $scope.securityCode = $scope.securityCodeSecure ;
            $scope.showHideText = "Hide Security Code";
        } else {
            $scope.securityCode = "XXXX-XXXX-XXXX" ;
            $scope.showHideText = "Show Security Code";
        }

    };
    
    $scope.showGenerateSecurityToken = function() {
        return $scope.data.roleId === 9 && Session.roleId >= 10;
    };
    
    $scope.init =function() {
        $scope.securityCode = "XXXX-XXXX-XXXX";
        $scope.securityCodeSecure = '';
        //$scope.securityBarCode  = '';
        $scope.showHideText = "Show Security Code";
        $scope.getManagers();

        angular.element(document).ready(function() {

        var progressbar = $('#progressbar'),
            bar         = progressbar.find('.progress-bar'),
            settings    = {

                action: RestServiceFactory.getImageUploadUrl("user-profile"), // upload url

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
                           $scope.data.profileImage = data.originalUrl;
                           $scope.data.profileImageThumbnail = data.smallUrl;
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
    	var payload = RestServiceFactory.cleansePayload('UserService', data);
    	var target = {id: data.id};
    	if ($stateParams.id === 'new'){
    		target = {};
    	}
        payload.phone = $('#phoneNumberId').val();
    	RestServiceFactory.UserService().save(target,payload, function(success){
    		$state.go('app.users');
    	},function(error){
    		if (typeof error.data !== 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
    };

    $scope.init();
}]);