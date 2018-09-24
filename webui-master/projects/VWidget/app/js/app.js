'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('venuelytics', ['ngRoute', 'templates', 'ngIframeResizer'])
.config(['$locationProvider', '$routeProvider',  function($locationProvider, $routeProvider) {
  

  $routeProvider
  .when('/:portalName', {
    templateUrl: 'html/home.html',
    controller: 'homeController'
  })
  .when('/', {
    templateUrl: 'html/welcome.html'
  })
  .otherwise('/');

  /*$locationProvider.html5Mode({
        enabled: true,
        requireBase: true,
        rewriteLinks: true
    });*/
}]).run(['$location', '$window',function($location, $window) {
  var url = $location.absUrl();
  var index = url.indexOf("site=");
  if (index > 0) {
    var siteName = url.substring(index+5, url.length);
    var protocol = $location.protocol();
    var host = $location.host();
    var port = $location.port();
    var targetUrl = protocol + '://' + host;
    if (port !== 80) {
      targetUrl = targetUrl + ':' + port;
    }
    targetUrl = targetUrl + '/portal/#/' +siteName;
    $window.location.href=targetUrl;
  }
}]);

angular.module('templates', []);
