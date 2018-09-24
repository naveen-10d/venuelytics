/**=========================================================
 * Module: application.js

 =========================================================*/

App.controller('ApplicationController', ['$scope','RestServiceFactory','AuthService','Session', '$http', '$state','$log','$rootScope', 'ContextService', 'AUTH_EVENTS', 
	'$timeout', '$location', function($scope, RestServiceFactory, AuthService, Session,$http, $state, $log, $rootScope, contextService, AUTH_EVENTS, $timeout, $location) {
    'use strict';
    var host =  $location.host();
	host = host.replace("www.", "");
	if (host === 'localhost') {
		host = "venuelytics.com";
	}
	console.log(host);
	$scope.partner = host;

	$scope.appLogo = "app/img/itzfun_logo.png";
	$scope.appLogoSingle = "app/img/itzfun_logo.png";
	$scope.serverName = contextService.serverName.indexOf("prod.api") >= 0 ? "Production" : "Development";
	$scope.notificationSummaries = {};
	$scope.totalTypes = 0;
	$rootScope.unreadMessages = 0;
	$rootScope.requestCount = 0;
    $rootScope.comfirmedCount = 0;
    $scope.session = Session;
	$scope.getNotificationIconClass = $rootScope.getNotificationIconClass;
	$scope.userInfo = {};
    var statusArray = ['REQUEST', 'COMPLETED', 'ASSIGNED', 'CANCELED', 'REJECTED'];
	$scope.notificationSummary = function() {
		var target = {id:contextService.userVenues.selectedVenueNumber};
		
		var promise = RestServiceFactory.NotificationService().getNotificationSummary(target);

		promise.$promise.then(function(data) {
			$scope.notificationSummaries = data.summary;
			$scope.totalTypes = 0;
			$rootScope.unreadMessages = 0;
			for(var key in $scope.notificationSummaries) {
				if ($scope.notificationSummaries.hasOwnProperty(key)){
					if($.inArray(key, statusArray) === -1) {
						$rootScope.unreadMessages += $scope.notificationSummaries[key];
						$scope.totalTypes++;
					}
				}
			}
			$rootScope.banquetHallCount = data.summary["BanquetHall"];
			$rootScope.bottleCount = data.summary["Bottle"];
			$rootScope.GuestCount = data.summary["GuestList"];
			
		});
	};
	$scope.userData = function() {
		var promise = RestServiceFactory.UserService().get({id: Session.userId});

		promise.$promise.then(function(data) {
			$scope.userInfo = data;
		});
	};
	$scope.notificationSummary();
	$timeout(function() {
		$scope.userData();
	}, 1000);
	
	setInterval(function(){
  		$scope.notificationSummary();
	}, 300000);
	
	$rootScope.$on("onLogoChange",function(ev, data){
		$log.log("Logo has changed!", data);		
		$scope.appLogo = data.url;
		$rootScope.appLogo = data.url;
		
	});
	
	$scope.logout = function() {
	  
	  AuthService.logout().then(function (user) {
		  $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
		  $state.go("page.login");
	  }, function () {
		    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
	  });
  	};
  	$scope.showUserProfile = function() {
		$state.go("app.myprofile");
	};
}]);
