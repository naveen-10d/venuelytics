/**
 * @author Saravanakumar K
 * @date 25-MAY-2017
 */
"use strict";
app.controller('SubscribeController', 
    ['$log', '$scope',  '$rootScope', 'AjaxService', 'ngMeta','$uibmodal', 'APP_ARRAYS', function ($log, $scope, $rootScope, AjaxService,  $modal, APP_ARRAYS) {

    $scope.business = {};
    $scope.businessRoles = APP_ARRAYS.roles;
	$scope.saveBusiness = function() {
        var business = $scope.business;
        var role = (typeof business.businessRole  === 'undefined') ? '' :  business.businessRole.role;
        var subscribeEmail = {
            "email": $rootScope.successEmail,
            "mobile": business.phoneNumber,
            "name": business.NameOfPerson,
            "businessName": business.businessName,
            "role": role ,
             "utmSource" : "venuelytics.com",
             "utmCampaign" :"30DaysFree",
             "utmMedium": "homepage-subscribe"
        };
        AjaxService.subscribe(subscribeEmail).then(function(response) {
            $rootScope.successEmail = subscribeEmail.email;
            $('#subscribeSuccessModal').modal('show');
            $('.modal-backdrop').remove();
            self.subscribeEmails = '';
            $rootScope.emailToSend = '';
        });
    };

 }]);