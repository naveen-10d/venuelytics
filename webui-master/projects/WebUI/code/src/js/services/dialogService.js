/**
 * @author Suryanarayana Mangipudi

 */
"use strict";
app.service('DialogService', ['ModalService', function (ModalService) {

	this.showSuccess = function(title, message) {
		showModal("modal-success", title, message);
	};

	this.showError = function(title, message) {
		showModal("modal-danger", title, message);
	}
	this.closeModals = function() {
		$('.modal-backdrop').remove();
		ModalService.closeModals(0, 100);
	}
	function showModal(type, title, message) {
		//$('#partyDescriptionModal').modal('show');
		ModalService.showModal({
	  		templateUrl: "templates/message-dialog.html",
	  		controller: ['$scope', 'close', function($scope, close) {
	  			$scope.title = title;
	  			$scope.message = message;
	  			$scope.dialogType = type;

	  			$scope.closeDialog = function() {
	  				close("close", 200);
	  			};
	  		}]
			}).then(function(modal) {
				//$('#dialogMessage').modal('show');
				$(modal.element).modal('show');
                 modal.close.then(function (result) {
                     console.log(result);
                 });
			});
	}
}]);
