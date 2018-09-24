/**=========================================================
 * Module: profile.js
 * smangipudi
 =========================================================*/

App.controller('ProfileController', ['$scope', '$state', 'RestServiceFactory', 'toaster', 'FORMATS', 'Session', 
                                     function($scope, $state, RestServiceFactory, toaster, FORMATS, Session) {
  'use strict';
    

    RestServiceFactory.UserService().getMyProfile({}, function(data) {
    	if (data.phone !== null) {
    		data.phone = $.inputmask.format(data.phone,{ mask: FORMATS.phoneUS} );
    	}
    	$scope.data = data;
    });
  
    $scope.update = function(isValid, data) {
        if (!isValid || !$('#profileInfo').parsley().isValid()) {
            return;
        }

        var payload = RestServiceFactory.cleansePayload('ProfileService', data);
        var target = {};
       
        payload.phone = $('#phoneNumberId').val();
        RestServiceFactory.UserService().saveMyProfile(target,payload, function(success){
            toaster.pop({ type: 'success', body: 'Profile Saved Successfully.', toasterId: 1000 });
        },function(error){
            if (typeof error.data !== 'undefined') { 
                toaster.pop({ type: 'error', body: error.data.message, toasterId: 1000 } );
            }
        });
    };

    $scope.showHideSecurityCode = function() {
        $scope.showSecurityCode = ! $scope.showSecurityCode;
        if ( $scope.showSecurityCode) {
            $scope.securityCodeSecure = $scope.data.securityCode ;
            $scope.showHideText = "Hide Security Code";
        } else {
            $scope.securityCodeSecure = "XXXX-XXXX-XXXX" ;
            $scope.showHideText = "Show Security Code";
        }

    };
    $scope.showGenerateSecurityToken = function() {
        return $scope.data.roleId === 9 && Session.roleId >= 10;
    };
    $scope.init =function() {
        
        $scope.securityCodeSecure = 'XXXX-XXXX-XXXX';
        $scope.securityBarCode  = '';
        $scope.showSecurityCode = false;
        $scope.showHideText = "Show Security Code";
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

    $scope.init();
}]);