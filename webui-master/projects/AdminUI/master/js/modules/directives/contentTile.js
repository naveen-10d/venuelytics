/**
 * ===========================
 * 		Content tiles for Masonary view
 * ===========================
 */

App.directive('contentTile', function() {
  return {
    restrict: 'E',
    scope:{
    	content: '='
  	},
  	controller:['$scope','$log', '$location', '$state', 'RestServiceFactory',function($scope, $log, $location, $state, RestServiceFactory){
  		$log.log("content widget controller has been initialized!");
  		
  		$scope.showOverlay=false;
  		
  		$log.log("content channel type: ", $scope.content.channelType);
  		
  		/**
  		 * edit function
  		 */
  		$scope.editContent=function(content){
  			$log.log("edit is called!", content);
  			$state.go('app.createcontent', {id: content.id});
  		}
  		
  		/**
  		 * delete action
  		 */
  		$scope.deleteContent=function(content){
  			var target = {id: content.id};
  			
  	   		RestServiceFactory.ContentService().delete(target,  
  	   			function(success){
	  	   			if((typeof $scope.$parent != 'undefined') && (typeof $scope.$parent.$parent != 'undefined') && (typeof $scope.$parent.$parent.promotionsList != 'undefined')) {
	  	   			    var promotionsList = $scope.$parent.$parent.promotionsList;
	  	   				for(var i = promotionsList.length - 1; i >= 0; i--) {
				  	   	    if(promotionsList[i].id === content.id) {
				  	   	    	promotionsList.splice(i, 1);
				  	   	    	break;
				  	   	    }
	  	   				}
	  	   			}
	  	     	},
	  	     	function(error){
	  	     	
	  	     	}
	  	    );
  			$log.log("delete is called", content);
  		}
  		$scope.activateContent=function(content){
  			var target = {id: content.id};
  	   		RestServiceFactory.ContentService().activate(target,  function(success){
  	   		content.state = 'ACTIVE';
  	     	},function(error){
  	     		if (typeof error.data != 'undefined') { 
  	     		}
  	     	});
  			$log.log("activating the content ", content.id);
  		}
  		$scope.deActivateContent=function(content){
  			var target = {id: content.id};
  	   		RestServiceFactory.ContentService().deactivate(target,  function(success){
  	   		content.state = 'INACTIVE';
  	     	},function(error){
  	     		if (typeof error.data != 'undefined') { 
  	     		}
  	     	});
  			$log.log("de-activating the content ", content.id);
  		}
  		/**
  		 * This functionality gets called when you hover the image
  		 */
  		$scope.overlayImage=function(){
  			$scope.showOverlay=true;
  			$log.log("Hover!");
  		};
  		
  		/**
  		 * This functionality gets called when you leave the image
  		 */
  		$scope.removeOverlay=function(){
  			$scope.showOverlay=false;
  			$log.log("leave");
  		};
  	}],
    templateUrl: 'app/templates/content-masonry.html'
  };
});