/**=========================================================
 * Module: dialogService.js
 * smangipudi
 =========================================================*/

App.factory('DialogService', ['ngDialog', function(ngDialog) {
	'use strict';
	var dialogTemplate = 
	'<form id="dgForm" name="dgForm" validate-form="" novalidate><div><h3 class="mt0">TITLE</h3><hr class="mt0"></div><div class="modal-body"><p>CONTENT</p>' +
	'<div class="ngdialog-buttons"><button type="button" ng-click="closeThisDialog(0)" class="btn btn-default mr-lg pull-right">NO</button>'+
	'<button type="button"  ng-click="confirm(dgForm,0)" class="btn btn-primary mr-lg pull-right">YES</button></div></div></form>';

	var dialogTemplateReason = 
	'<form id="dgForm" name="dgForm" validate-form="" novalidate><div><h3 class="mt0">TITLE</h3><hr class="mt0"></div><div class="modal-body"><p>CONTENT</p>'+
	'<div class="p-lg"><label>Reason: <input type="text" ng-model="reason" placeholder="Enter reason to cancel" ng-required class="form-control col-sm-10"/></label></div>'+
	'<div class="ngdialog-buttons"><button type="button" ng-click="closeThisDialog(0)" class="btn btn-default mr-lg pull-right">NO</button>'+
	'<button type="button"  ng-click="confirm(dgForm,reason)" class="btn btn-primary mr-lg pull-right">YES</button></div></div></form>';

	var dialogTemplateUserInput = 
	'<form id="dgForm" role="form" name="dgForm" validate-form="" novalidate><div><h3 class="mt0">TITLE</h3><hr class="mt0"></div><div class="modal-body"><p>CONTENT</p>'+
	'<div class="p-lg"><label>LABEL: <input type="password" ng-model="userInput" placeholder="PLACEHOLDER" ng-required required="true" class="form-control col-sm-10"/></label></div>'+
	'<div class="ngdialog-buttons"><button type="button" ng-click="closeThisDialog(0)" class="btn btn-default mr-lg pull-right">Cancel</button>'+
	'<button type="button"  ng-click="confirm(userInput)" class="btn btn-primary mr-lg pull-right">OK</button></div></div></form>';

	var messageTemplage = '<div><h3>MESSAGE</h3></div>';
	return {
		confirmYesNo: function(title, content, confirmCallBack) {
			var temp = dialogTemplate.replace('TITLE', title);
			temp = temp.replace('CONTENT', content);
			ngDialog.openConfirm({
				template: temp,
				plain: true,
				className: 'ngdialog-theme-default'
			}).then(function(value) {
				confirmCallBack();
			});
		},
		confirmYesNoReason: function(title, content, confirmCallBack) {
			var temp = dialogTemplateReason.replace('TITLE', title);
			temp = temp.replace('CONTENT', content);
			var d = ngDialog.openConfirm({
				template: temp,
				plain: true,
				className: 'ngdialog-theme-default',
				data :{reason: 'input'}
			}).then(function(reason) {
				confirmCallBack(reason);
			});
		},
		getUserInput: function(title, content, label, placeholder, callBack) {
			var temp = dialogTemplateUserInput.replace('TITLE', title);
			temp = temp.replace('CONTENT', content);
			temp = temp.replace('LABEL', label);
			temp = temp.replace('PLACEHOLDER', placeholder);
			var d = ngDialog.openConfirm({
				template: temp,
				plain: true,
				className: 'ngdialog-theme-default',
				data :{userInput: 'input'}
			}).then(function(userInput) {
				callBack(userInput);	
			});
		}, 
		displayMessage : function(message) {
			var temp = messageTemplage.replace('MESSAGE', message);
			
			var d = ngDialog.open({
				template: temp,
				plain: true,
				className: 'ngdialog-theme-default'
			});
		}
	};
}]);


