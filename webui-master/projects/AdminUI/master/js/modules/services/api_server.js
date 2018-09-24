/**
 * ========================================================= Module:
 * api_server.js smangipudi
 * =========================================================
 */
App.service('APIServer',['$http', function($http) {
	"use strict";
	this.init = function (url) {
		this.URL = url;
	};
	var self = this;
	this.get = function() {
		this.init("//dev.api.venuelytics.com/WebServices/rsapi");
		return this;
	};
	this.getURL = function() {
		return this.URL;
		/*var promise = this.get();
		promise.then(function(response) {
			self.init(response.data.URL);
		});
		return promise;*/
	};
	return this;
}]);