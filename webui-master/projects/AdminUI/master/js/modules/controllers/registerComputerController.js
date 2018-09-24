/**=========================================================
 * Module: registerComputerController.js
 =========================================================*/

App.controller('RegisterComputerController', ['$scope', '$state', 'RestServiceFactory', 'toaster','Session',
	function($scope, $state, RestServiceFactory, toaster, session) {

	'use strict';
	$scope.option = {};
	$scope.option.selectedOption = 1;
	$scope.submitTitle = "Register";
	$scope.waitCursor = 'csspinner double-up';
	$scope.isManager = session.roleId == 11 || session.roleId == 12;
	
	$scope.registered = false;
	$scope.tabIndex = 0;
	$scope.init = function() {
		$scope.getAgencyInfo();
	};
	$scope.getAgencyInfo = function() {

	    RestServiceFactory.UserService().getAgencyInfo({id: session.userId}, function(data) {
		$scope.agency = data;
		$scope.registration = angular.fromJson($scope.$storage['computerRegistration@AID:'+$scope.agency.id]);

		if (typeof $scope.registration === 'undefined' ) {
			$scope.registration = {};
		}

		$scope.checkRegistration($scope.registration);
	  });
	};

	$scope.validate = function(event, ui) {
		if (!$scope.isManager) {
			return false;
		}
		var retValue = $scope.registered;
		if($scope.registered) {
			$scope.tabDone = ui.nextIndex;	
			$scope.$digest();
			return true;
		} 
		if (ui.index === 0) {
			if ($scope.option.selectedOption == '2' || $scope.option.selectedOption == '3' ) {
				var target = {medium : $scope.option.selectedOption == '2' ? 'EMAIL' : 'SMS'};
				RestServiceFactory.AgencyService().sendRegistrationCode(target,{}, function(data){
					$scope.registration.registrationCode = data.registrationCode;
					$scope.$storage['computerRegistration@AID:'+$scope.agency.id] = angular.toJson($scope.registration);
					$scope.waitCursor = '';
				}, function(error) {
					$scope.waitCursor = '';
					toaster.pop('error', "Registration Error", "Unexpected error occurred. Please click Previous and re-register.");
				});
			}
			$scope.tabDone = ui.nextIndex;	
			return true;
		}
		if (ui.index === 1 && ui.nextIndex === 0) { // previous clicked
			$scope.tabDone = ui.nextIndex;	
			return true;
		}
		if (ui.index === 2 && ui.nextIndex === 1) {// previous in done stage
			return false;
		}

		if (ui.index === 1 && $scope.registrationInfo.$valid) {
			$scope.waitCursor = 'csspinner double-up';
	
			var payload = {machineName: $scope.registration.machineName,securityCode: $scope.securityCode, registrationCode: $scope.registration.registrationCode};

			RestServiceFactory.AgencyService().completeRegistration({},payload, function(data){
				$scope.waitCursor = '';
				$scope.$storage['computerRegistration@AID:'+$scope.agency.id] = angular.toJson($scope.registration);
				if (data.status <= 0) {
					toaster.pop('error', "Registration Error", "Unexpected error occurred. Please click Previous and re-register.");
				} else {
					$scope.registered = true;
					$scope.tabDone = ui.nextIndex;
					$('#wizardId').bwizard("next");
				}

			}, function(error) {
				$scope.waitCursor = '';
				toaster.pop('error', "Registration Error", "Unexpected error occurred. Please click Previous and re-register.");
			});

			return false;
		}
		$('#registionForm').submit();

		return false;
		
	};

	$scope.checkRegistration = function(registration) {
		var target = {};
		RestServiceFactory.AgencyService().checkRegistration(target, registration, function(data) {
			if (data.status == 1) { // computer is registered, go to done screen.
				$scope.registered = true;
				$scope.waitCursor = '';
				$('#wizardId').bwizard("play");
			} else {
				$scope.registered = false;
				$scope.maskedEmail = data.email;
				$scope.maskedPhone = data.phone;
				$scope.waitCursor = '';
			}
		});
	};
	
	$scope.$watch('option.selectedOption', function(value) {
   		console.log(value);
   		if (value > 1) {
   			$scope.submitTitle = "Send Security Code";
   		} else {
   			$scope.submitTitle = "Register";
   		}
	});

	$scope.registrationComplete = function() {
		$state.go("app.ticketsCalendar");
	};
	
	$scope.init();
}]);