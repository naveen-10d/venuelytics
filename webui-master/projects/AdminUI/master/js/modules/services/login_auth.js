/**=========================================================
 * Module: login_auth.js
 * smangipudi
 * https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
 =========================================================*/
 
App.factory(
		'AuthService',['$http','Session','USER_ROLES','$rootScope', 'RestServiceFactory', 
		function($http, Session, USER_ROLES, $rootScope, RestServiceFactory) {
		"use strict";
		var authService = {};
		
		authService.login = function(credentials) {
			var baseUrl = RestServiceFactory.contextName + "/v1/auth/";
			return $http.post(baseUrl + 'login', credentials).then(
					function(result) {
						Session.create(result.data.sessionId, result.data.userId, result.data.userName,result.data.roleId);
						$rootScope.$storage.sessionData = JSON.stringify(result.data);
						return result.data;
					});
		};
		authService.logout = function() {
			var baseUrl = RestServiceFactory.contextName + "/v1/auth/";
			return $http.post(baseUrl + 'logout', '{"sessionId":"'+Session.id +'"}').then(function(result) {
				Session.destroy();
				$rootScope.$storage.sessionData = null;
				return "success";
			}, function(error) {
				Session.destroy();
				$rootScope.$storage.sessionData = null;
				return "error";
			});
			
		};
		authService.isAuthenticated = function() {
			return !!Session.userId;
		};
		authService.needAuthorization = function(authorizedRoles) {
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [ authorizedRoles ];
			}
			return (authorizedRoles.indexOf(USER_ROLES.any) === -1);
		};
		authService.isAuthorized = function(authorizedRoles) {
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [ authorizedRoles ];
			}
			return true;
			//(authorizedRoles.indexOf(USER_ROLES.any) !== -1 ||
			// ( authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1));
		};

		return authService;
	}]).service('Session', function() {
		'use strict' ;
		this.create = function(sessionId, userId, userName, roleId) {
		this.id = sessionId;
		this.userId = userId;
		this.userName = userName;
		this.roleId = roleId;
	};
	this.init = function(session) {
		this.id = session.sessionId;
		this.userId = session.userId;
		this.userName = session.userName;
		this.roleId = session.roleId;
	};
	this.destroy = function() {
		this.id = null;
		this.userId = null;
		this.userName = null;
		this.roleId = null;
	};
	return this;
});

App.factory('AuthInterceptor', ['$rootScope','$q','AUTH_EVENTS',function ($rootScope, $q, AUTH_EVENTS) {
	'use strict' ;
	return {
			responseError: function (response) { 
					$rootScope.$broadcast({
							401: AUTH_EVENTS.notAuthenticated,
							403: AUTH_EVENTS.notAuthorized,
							419: AUTH_EVENTS.sessionTimeout,
							440: AUTH_EVENTS.sessionTimeout
					}[response.status], response);
					return $q.reject(response);
			}
	};
}]);