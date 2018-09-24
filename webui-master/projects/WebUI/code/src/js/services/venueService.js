/**
 * @author Suryanarayana
 * @date NOV'25 2017
 */
"use strict";
app.service('VenueService', ['$localStorage', function($localStorage) {
	const PREFIX = 'V-';
	const PREFIX_I = 'VI-';
	this.getVenue = function(venueNumber) {
		return $localStorage[PREFIX+venueNumber];
	};



	this.saveVenue = function(venueNumber, venue) {
		$localStorage[PREFIX+venueNumber] = venue;
	};

	this.saveVenueInfo = function(venueNumber, venueInfo) {
		$localStorage[PREFIX_I+venueNumber] = venueInfo;
	};

	this.getVenueInfo = function(venueNumber, infoName) {
		var vInfo = $localStorage[PREFIX_I+venueNumber];
		if (typeof  vInfo !== 'undefined' && typeof vInfo.data !== 'undefined') {
			return vInfo.data[infoName];
		}
		return null;
	};


	this.saveProperty = function(venueNumber, name, value) {
		$localStorage[PREFIX+venueNumber + '-' + name] = value;
	};

	this.getProperty = function(venueNumber, name) {
		return $localStorage[PREFIX+venueNumber + '-' + name];
	};
}]);
