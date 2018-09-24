App.directive('formUpload', [ '$log','$timeout','Session','ContextService','$http',"$rootScope",
                              function($log, $timeout, Session, contextService, $http, $rootScope) {
	return {
		restrict:'EA',
		scope:{
			imagedata:'=',
			imageType:'@imageType'
		},
		link:function($scope, element, attrs){
			$log.log("initializing file upload...", attrs.imagedata);
			
			
			$log.log("file input",element.find('.file-upload'));
			
			element.find('.file-upload').bind('change',function(eve){
				var f=eve.target.files[0];
				if (!f.type.match('image.*')) {
			       return;
			    }

			    var reader = new FileReader();

		      // Closure to capture the file information.
		      reader.onload = function(e) {
		          // Render thumbnail.
		         /* var span = document.createElement('span');
		          span.innerHTML = ['<img class="thumb" src="', e.target.result,
		                            '" title="', escape(theFile.name), '"/>'].join('');
		          document.getElementById('list').insertBefore(span, null);*/
		        	$log.log(e.target.result);
		        	
		        	$scope.imagedata=e.target.result;
		        	
		        	$scope.$apply();
		        	

	        		var head=e.target.result.split(';')[0];
	        		var imageType=head.split(':')[1];
	        		
	        		$log.log("image type is: ",imageType);
	        		
	        		var baseUrl= contextService.contextName+"/v1/upload/"+imageType.split('/')[1];
	        		
	        		$log.log("base Url",baseUrl);	
	        		
	        		$log.log("file Url",$("#uploadForm"));	
	        		var formData=new FormData();
	        		formData.append("file",f,f.name);
	        		
	        		$.ajax({
	        			url:baseUrl,
	        			type:"POST",
	        			 crossDomain: true,
	        			data:formData,
	        			processData: false,
	        			contentType: false,
	        			
	        			headers: {'Application-Encoding': 'multipart/form-data'
	        				,"Access-Control-Allow-Origin":"*",'X-XSRF-TOKEN':Session.id},
	        			success:function(data){
	        				$log.log("success data: ",data);
	        				$log.log("success 2: ",data.href);
	        				$scope.imagedata=data.href;
	        				Session.imageData = data.href;
	        				$rootScope.$broadcast("FileUploaded",{
	        					url:data.href,
	        					type:$scope.imageType,
	        					format:imageType.split('/')[1]
	        				});
	        			},
	        			error:function(data){
	        				$log.log("error data: ",data);
	        			}
	        		});
		        	
		        };
		      

		      // Read in the image file as a data URL.
		      reader.readAsDataURL(f);
			});
			
			$scope.$on('newImage',function(eve, data){
				$log.log("message received!", data);
				$scope.imagedata=data;
				
			});
			
		},
		controller:['$scope',function($scope){
			$log.log("initializing controller of file upload...");
		}],
		templateUrl:'app/templates/file-upload.html'
	};
	
} ]);