/**=========================================================
* smangipudi
 * Module: primarypanel.js
*
 =========================================================*/
App.directive('panelPrimary', function() {
  'use strict';
  return {
    restrict: 'E',
    scope:{
	  customerinsight: '='
  	},
    templateUrl: 'app/templates/panel-primary-template.html'
  };
});