App.directive("tableWidget", [ '$log', function($log) {

	return {
		restrict : 'EA',
		scope : {
			inputkeys : '=inputKeys',
			inputlist : '=inputList',
			rowsPerPage: '=rowsPerPage',
			id:'=id'
		},
		link : function($scope, element, attrs) {
			$log.log("link: Data table Controller has been initialized.. -- "+$scope.rowsPerPage);
			$log.log("keys", $scope.inputkeys);
			$log.log("list", $scope.inputlist);
			$scope.actionValue = '';
			$log.log("Value received in directive");
			
			if(!$scope.inputkeys || !$scope.inputlist){
				element.replaceWith("<p style='color: red; text-style:oblique;'> Data Table Error: invalid input! </p>");
			}
		},
		controller : [ '$scope', function($scope) {
			$scope.init=function(){
				$log.log("Data table Controller has been initialized..");
			};
		
			$scope.init();
			
		} ],
		templateUrl : 'app/templates/data-table-widget.html',
		controllerAs:'dataTab'
	};

} ]);