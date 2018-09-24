/**=========================================================
 * Module: sidebar-menu.js
 * Provides a simple way to implement bootstrap collapse plugin using a target 
 * next to the current element (sibling)
 * Targeted elements must have [data-toggle="collapse-next"]
 =========================================================*/
App.controller('SidebarController', ['$rootScope', '$scope', '$state', '$http', '$timeout', 'APP_MEDIAQUERY', 'Session',
  function($rootScope, $scope, $state, $http, $timeout, mq, Session){
    'use strict';
    var currentState = $rootScope.$state.current.name;
    var $win = $(window);
    var $html = $('html');
    var $body = $('body');

    // Adjustment on route changes
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      currentState = toState.name;
      // Hide sidebar automatically on mobile
      $('body.aside-toggled').removeClass('aside-toggled');

      $rootScope.$broadcast('closeSidebarMenu');
    });

    // Normalize state on resize to avoid multiple checks
    $win.on('resize', function() {
      if( isMobile() )
        $body.removeClass('aside-collapsed');
      else
        $body.removeClass('aside-toggled');
    });

    // Check item and children active state
    var isActive = function(item) {

      if(!item) return;

      if( !item.sref || item.sref === '#') {
        var foundActive = false;
        angular.forEach(item.submenu, function(value, key) {
          if(isActive(value)) foundActive = true;
        });
        return foundActive;
      }
      else
        return $state.is(item.sref);
    };

    // Load menu from json file
    // ----------------------------------- 
    
    $scope.getMenuItemPropClasses = function(item) {
      return (item.heading ? 'nav-heading' : '') +
             (isActive(item) ? ' active' : '') ;
    };
    var filterFx = function(item) {
    	if (typeof item.roleId === 'undefined') {
    		return 0;
    	}
      if (item.roleId.constructor === Array) {
        return item.roleId.indexOf(Session.roleId) >=0;
      } else {
        return item.roleId <= Session.roleId;
      }

    };
    $scope.loadSidebarMenu = function() {

      var menuJson = 'app/menu/sidebar-menu.json',
          menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache
      $http.get(menuURL)
        .success(function(items) {
        	var filteredMenu = items.filter(filterFx);
           $rootScope.menuItems = filteredMenu;
        })
        .error(function(data, status, headers, config) {
          alert('Failure loading menu');
        });
     };

     $scope.loadSidebarMenu();

    // Handle sidebar collapse items
    // ----------------------------------- 
    var collapseList = [];

    $scope.addCollapse = function($index, item) {
      collapseList[$index] = !isActive(item);
    };

    $scope.isCollapse = function($index) {
      return (collapseList[$index]);
    };

    $scope.toggleCollapse = function($index) {

      // collapsed sidebar doesn't toggle drodopwn
      if( isSidebarCollapsed() && !isMobile() ) return true;
      // make sure the item index exists
      if( typeof collapseList[$index] === undefined ) return true;

      closeAllBut($index);
      collapseList[$index] = !collapseList[$index];
    
      return true;
    
      function closeAllBut($index) {
        angular.forEach(collapseList, function(v, i) {
          if($index !== i)
            collapseList[i] = true;
        });
      }
    };

    // Helper checks
    // ----------------------------------- 

    function isMobile() {
      return $win.width() < mq.tablet;
    }
    function isTouch() {
      return $html.hasClass('touch');
    }
    function isSidebarCollapsed() {
      return $body.hasClass('aside-collapsed');
    }
    function isSidebarToggled() {
      return $body.hasClass('aside-toggled');
    }
}]);
