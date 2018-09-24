App.directive('pdfDownload', ['$compile', function($compile) {
    return {
        restrict: 'E',
        template: '<a href="" class="btn btn-primary" ng-class="c" ng-click="downloadPdf()"></a>',
        scope: {
        	c: '='
        },
        link: function(scope, element, attr) {
            var anchor = element.children()[0];
            scope.anchor = anchor;
            // When the download starts, disable the link	
            scope.$on('download-start', function() {
                $(anchor).attr('disabled', 'disabled');
            });
	
            // When the download finishes, attach the data to the link. Enable the link and change its appearance.
            scope.$on('downloaded', function(event, b64Data) {
            	//var base64Data = data.slice (0, -2);
            	var contentType = 'application/pdf'; // put your file type here
            	var sliceSize = 512;
				b64Data = b64Data.replace(/^[^,]+,/, '');
				b64Data = b64Data.replace(/\s/g, '');
			    var byteCharacters = window.atob(b64Data);
			    var byteArrays = [];

			    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			        var slice = byteCharacters.slice(offset, offset + sliceSize);

			        var byteNumbers = new Array(slice.length);
			        for (var i = 0; i < slice.length; i++) {
			            byteNumbers[i] = slice.charCodeAt(i);
			        }

			        var byteArray = new Uint8Array(byteNumbers);

			        byteArrays.push(byteArray);
			    }

			    var blob = new Blob(byteArrays, {
			        type: contentType
			    }); 

            
            	var a = document.createElement("a");
			    var url = window.URL.createObjectURL(blob);

			    document.body.appendChild(a);
			    a.style = "display: none";
			    a.href = url;
			    a.download = attr.filename;
			    a.click();
			    window.URL.revokeObjectURL(url); 	
			    $(anchor).removeAttr('disabled')
                .removeClass('btn-primary')
                .addClass('btn-success');

            });
	
        },
        controller: ['$scope', '$attrs', '$http', 'ContextService', 'DialogService',function($scope, $attrs, $http, contextService, DialogService) {
            $scope.downloadPdf = function() {
                DialogService.getUserInput("Authenticate", "Enter password to Authenticate to download the contents.", "Password", "Enter Your account password.", function(password){
                    $scope.$emit('download-start');
                    var fullUrl = contextService.contextName + '/' + $attrs.url;
                    var userPassword = 'self:'+password;
                    var headers = { headers: {'X-Authorization': 'Basic '+ window.btoa(userPassword)} };
                    $http.get(fullUrl, headers).then(function(response) {
                        $scope.$emit('downloaded', response.data);
                    }, function(error) {
                        if (error.data.hasOwnProperty("message")) {
                            DialogService.displayMessage(error.data.message);
                        } else {
                            DialogService.displayMessage("Server Error:" + JSON.stringify(error));    
                        }
                        $($scope.anchor).removeAttr('disabled')
                    });
                });
                
            };
        }]
    }
}]);