/**=========================================================
 * Module: toolbar.js
 * smangipudi
 =========================================================*/

App.controller('ToolbarController', ['$rootScope', '$scope','$state', 'AuthService', 'AUTH_EVENTS', 
	function ($rootScope, $scope, $state, AuthService, AUTH_EVENTS) {

	'use strict';
	$scope.logout = function() {
		AuthService.logout().then(function (result) {
			  $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
			  $state.go("page.login");
		  }, function (error) {
			    $state.go("page.login");
		  });
		
	};
	$scope.showUserProfile = function() {
		$state.go("app.myprofile");
	};
}]);
