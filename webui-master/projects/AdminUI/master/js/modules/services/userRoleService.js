/**=========================================================
 * Module: userRoleService.js
 * smangipudi
 =========================================================*/
 
 App.factory('UserRoleService',  function() {
 	'use strict';
 	var userRoles = {};
	userRoles[1] = 'Basic User';
	userRoles[2] = 'Bouncer';
	userRoles[3] = 'Bartender';
	userRoles[4] = 'Waitress';
	userRoles[5] = 'DJ';
	userRoles[6] = 'Karaoke Manager';
	userRoles[7] = 'Artist';
	userRoles[8] = 'Host';
	userRoles[9] = 'Runner';
	userRoles[10] = 'Store Agent';
	userRoles[11] = 'Agent Manager';
	userRoles[12] = 'Store Manager';
	userRoles[75] = 'Service Manager';
	userRoles[76] = 'IT Manager';
	userRoles[80] = 'Front Office';
	userRoles[50] = 'Promoter';
	userRoles[51] = 'Event Manager';
	userRoles[100] = 'Manager';
	userRoles[500] = 'Owner';
	userRoles[1000] = 'Administrator';

	var roleLandingPage = {};
	var DEFAULT_LANDING = 'app.myprofile';

	roleLandingPage[10] = 'app.ticketingDashboard';
	roleLandingPage[11] = 'app.ticketingDashboard';
	roleLandingPage[12] = 'app.ticketingDashboard';
	roleLandingPage[76] = 'app.chatbot';
	roleLandingPage[80] = 'app.guestList';
	roleLandingPage[51] = 'app.eventDashboard';
	roleLandingPage[100] = 'app.dashboard';
	roleLandingPage[500] = 'app.dashboard';
	roleLandingPage[1000] = 'app.dashboard';
 	return {
 		getRoles : function() {
			return userRoles;
 		},
 		getRoleText : function (roleId) {
 			return userRoles[roleId];
 		},
 		getLandingPage(roleId) {
 		 if (roleLandingPage[roleId]) {
 		 	return roleLandingPage[roleId];
 		 }
 		 return DEFAULT_LANDING;
 		}
 	};
 });
 