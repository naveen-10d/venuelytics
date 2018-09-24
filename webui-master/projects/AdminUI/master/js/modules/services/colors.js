/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/
 
App.factory('colors', ['APP_COLORS', function(colors) {
  'use strict';
  return {
    byName: function(name) {
      return (colors[name] || '#fff');
    }
  };

}]);
