app.factory('RestAPI',['$http', function($http) {
 		'use strict';
 
 		var BASE_URL = "https://dev.api.venuelytics.com/WebServices/rsapi/v1";
 		this.contextName = BASE_URL;
 
 		return {
 			getPortalInfo : function(portalName) {
 				return $http({
					method: 'GET',
					url: BASE_URL + '/venues/portal/' + portalName
				});
 			}
 		};
 	
}]);