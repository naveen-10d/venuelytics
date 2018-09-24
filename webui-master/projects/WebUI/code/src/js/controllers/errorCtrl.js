/**
 * @author Suryanarayana
 */
"use strict";
app.controller('ErrorController', ['$scope', '$location',
    function ( $scope, $location) {

        var self = $scope;
        
        self.title = $location.search().title || "Authorization Failed";
        self.description = $location.search().description || "Stripe merchant onboarding failed."

    }]);
