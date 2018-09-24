/**=========================================================
 * Module: venueService.js
 * smangipudi
 =========================================================*/
 
 App.factory('VenueService',  function() {
 	'use strict';
 	var venues = [];
 	function _getVenue(venueNumber) {
 		var venue = venues[venueNumber];
		if (typeof venue === 'undefined') {
			venue = {};
			venues[venueNumber] = venue;
		}
		return venue;
 	} 
 	return {
 		setVenueInfo : function(venueNumber, name, value) {
 			var venue = _getVenue(venueNumber);
 			venue[name] = value;
 		},
 		getVenueInfo : function(venueNumber, name) {
			var venue = _getVenue(venueNumber);
			return venue[name];
 		}
 	};
 });
 