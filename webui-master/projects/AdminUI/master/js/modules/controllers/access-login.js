/**
 * smangipudi
 * ========================================================= 
 * Module:
 * access-login.js  for login api
 * =========================================================
 */

App.controller('LoginFormController',  ['$state', '$stateParams','$scope', '$rootScope','AUTH_EVENTS',
										'AuthService', '$cookies', 'Session', 'ContextService','$timeout', '$location','UserRoleService',
                                     function ($state, $stateParams, $scope, $rootScope,  AUTH_EVENTS, 
                                     	AuthService, $cookies, Session, ContextService, timeout, $location, userRoleService) {
  // bind here all data from the form
  'use strict';
  $scope.account = {};
  $scope.account.loginId = $rootScope.$storage.userName;
  $scope.account.remember = $rootScope.$storage.remember;
  $scope.account.loginType = 'user';

  $scope.serverName = ContextService.serverName;
  // place the message if something goes wrong
  
  var host =  $location.host();
  host = host.replace("www.", "");
  if (host === 'localhost') {
  	host = "venuelytics.com";
  }
  console.log(host);
  $scope.partner = host;
  $scope.isVenuelytics = host.toLowerCase().indexOf("venuelytics.com") === 0;

  $scope.authMsg = '';
  $scope.loginAction = true;
  $scope.userName = Session.userName;

  $scope.login = function(account) {

	  $scope.authMsg = '';
	  $rootScope.cookies = $cookies;
	  $scope.loginAction = true;
	  if(account.remember === "true") {
		  $rootScope.$storage.userName = account.loginId;
		  $rootScope.$storage.remember = account.remember;
	  } else {
		  $rootScope.$storage.userName = "";
		  $rootScope.$storage.remember = false;
	  }

	  function retryCall( fx) {
	  	timeout(fx, 200);
	  }
	  $scope.fx = function() {
		if (ContextService.userVenues.available.length > 0) {
			var landingPage = userRoleService.getLandingPage(Session.roleId);
		     $state.go(landingPage);
	  		$rootScope.exitDashboardRetry = true;
	  	} else {
	  		retryCall($scope.fx);
	  	}
	  };
	  
	  AuthService.login(account).then(function (user) {
		$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
		$rootScope.exitDashboardRetry = false; 
		retryCall($scope.fx);
		$scope.loginAction = false;
	  }, function () {
		    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		    $scope.authMsg = "login.FAILED";
		    $scope.loginAction = false;
	  });
  };
  
}]);
