/**=========================================================
 * Module: apputils.js
 * smangipudi
 =========================================================*/

(function($){
	'use strict';
	$.Apputil = {};
	$.Apputil.copy = function(data, properties) {
		var retdata = {};
    	for (var propIndex in properties) {
    		if (properties.hasOwnProperty(propIndex)) {
    			var propName = properties[propIndex];
    			retdata[propName] = data[propName];
    		}
    	}
    	return retdata;
	};
	
	$.Apputil.makeMap = function(arData) {
		var mapData = {};
		arData.map( function(item) {
			mapData[item.name] = item;
		});
		return mapData;
	};
}(jQuery));