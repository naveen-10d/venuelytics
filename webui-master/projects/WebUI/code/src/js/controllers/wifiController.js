/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
 "use strict";
 app.controller('WifiController', ['$log', '$scope','$location','$rootScope','$auth',
 	function ($log, $scope, $location,$rootScope, $auth) {
 		$rootScope.embeddedFlag = true;
 		$rootScope.blackTheme = "";
 		$scope.login = function() {
 			$auth.login($scope.user)
 			.then(function() {
 				//toastr.success('You have successfully signed in!');
 				$location.path('/');
 			})
 			.catch(function(error) {
 				//toastr.error(error.data.message, error.status);
 			});
 		};
 		$scope.authenticate = function(provider) {
 			$auth.authenticate(provider)
 			.then(function() {
 				//toastr.success('You have successfully signed in with ' + provider + '!');
 				$location.path('/');
 			})
 			.catch(function(error) {
 				if (error.message) {
            // Satellizer promise reject error.
           // toastr.error(error.message);
        } else if (error.data) {
            // HTTP response error from server
           // toastr.error(error.data.message, error.status);
        } else {
        	//toastr.error(error);
        }
    });
 		};

 	}]);