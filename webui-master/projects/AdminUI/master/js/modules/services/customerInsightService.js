App.service('CustomerInsightService', [ '$log', '$http', '$sce', 'ContextService',
	function($log, $http, $sce, ContextService) {
		'use strict';
		var self = this;

		self.getCustomerInsights = function(callback) {
			
			$log.log(" Customer insights has been called!");
				
			var baseUrl=ContextService.contextName+"/v1/eventsinsight";

			$http.get(baseUrl).success(function(data) {
				if(callback && callback.success){
					callback.success(data);
				}
				$log.log("Got success result for event analytics: ", data);
			}).error(function(data) {
				if(callback && callback.error){
					callback.error(data);
				}
				$log.log("Got error result for event analytics: ", data);
			});

		
		};

} ]);
