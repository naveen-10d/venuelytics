/**
 * @author Saravanakumar K
 * @date 28-JULY-2017
 */
"use strict";
app.controller('BlogPostController', ['$log', '$scope', 'DataShare', '$routeParams', 'APP_ARRAYS', '$rootScope', 'ngMeta',
    function ($log, $scope, DataShare, $routeParams, APP_ARRAYS, $rootScope, ngMeta) {

        $log.log('Inside Blog Post Controller.');

        var self = $scope;
        self.blogPostUrl = '';
        $rootScope.selectedTab = 'blogs';
        $rootScope.blackTheme = "";
        self.init = function () {
            self.postId = $routeParams.postId;
            self.blogPost = APP_ARRAYS.nightlife;
            for (var i = 0; i < (APP_ARRAYS.blogs).length; i++) {
                if (self.postId === APP_ARRAYS.blogs[i].link) {
                    self.blogPostUrl = APP_ARRAYS.blogs[i].bindHtml;
                    self.blogPostImage = APP_ARRAYS.blogs[i].image;
                    self.blogPostTitle = APP_ARRAYS.blogs[i].title;
                    self.blogPostDescription = APP_ARRAYS.blogs[i].description;
                    $log.info("Readmore blog post:", self.blogPostUrl);
                    ngMeta.setTitle(self.blogPostTitle + " - Venuelytics");
                    ngMeta.setTag('image', self.blogPostImage);
                    ngMeta.setTag('description', self.blogPostDescription);
                }
            }
        };

        self.init();
    }]);
