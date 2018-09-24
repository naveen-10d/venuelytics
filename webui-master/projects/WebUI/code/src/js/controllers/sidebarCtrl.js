/**
 * @author Thomas
 * @date 28-MAY-2017
 */
"use strict";
app.controller('sidebarController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$rootScope',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $rootScope) {

    		$log.log('Inside Sidebar Controller.');
    		
    		var self = $scope;
            $rootScope.blackTheme = "";
            self.init = function() {
                var data = $location.search().sb;
                $rootScope.showBusinessTab = parseInt(data);
                var newConsumer = $location.search().nc;
                $rootScope.showNewConsumer = parseInt(newConsumer);
            };

            self.navigateMenu = function(menu){

                $log.debug('inside navigateMenu');
                $('#ms-slidebar').toggle();
                $location.url('/'+menu);
            };

            self.init();
    		
    }]);