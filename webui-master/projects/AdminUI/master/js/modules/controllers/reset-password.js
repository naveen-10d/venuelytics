/**
 * smangipudi
 * ========================================================= 
 * Module:
 * reset-password.js  for password reset
 * =========================================================
 */

App.controller('PasswordResetController',  ['$state','$scope','RestServiceFactory','toaster', '$timeout',
                                     function ($state, $scope, RestServiceFactory, toaster, $timeout) {
  // bind here all data from the form
  'use strict';
  $scope.account = {};
 
  // place the message if something goes wrong
  
  $scope.resetPassword = function(account) {

  	  if(account.password == '' || account.password !== account.newpassword) {
  	  	return;
  	  }

	  RestServiceFactory.UserService().resetPassword(account, function (response) {
		if (response.statusCode < 0 ) {
			toaster.pop('error', "Reset Password", response.reason);
		} else {
			toaster.pop('success', "Reset Password", "Congratulations! You have successfully changed your password.");
			$timeout(function() {
				$state.go('page.login');
			}, 3000);
		}
	  }, function () {

	  });
  };

  $scope.goResetScreen = function() {
	$state.go('page.reset');
  }
  $scope.recoverPassword = function(account) {
  	RestServiceFactory.UserService().recoverPassword({email: account.email}, function (response) {
		toaster.pop('success', "Reset Password", "We have send you an email with instructions on how to reset password.");
		$timeout(function() {
			$state.go('page.login');
		}, 3000)
	});
  };
  
}]);
