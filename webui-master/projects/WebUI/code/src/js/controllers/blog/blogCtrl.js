/**
 * @author Saravanakumar K
 * @date 25-JULY-2017
 */
"use strict";
app.controller('BlogController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', 'APP_ARRAYS', '$rootScope', 'AjaxService','ngMeta',
    function ($log, $scope, $http, $location, RestURL, DataShare, APP_ARRAYS, $rootScope, AjaxService, ngMeta) {

    	$log.log('Inside Blog Controller.');

        
        var self = $scope;
        $rootScope.showItzfun = false;
        $rootScope.selectedTab = 'blogs';
        var urlPattern = $location.$$url; 
        $rootScope.blackTheme = "";
        if(urlPattern === '/about'){
            ngMeta.setTitle("About - Venuelytics");
            ngMeta.setTag('description', 'VenueLytics provides Next-Generation Entertainment Experience & VIP services for consumers with Real Time Smart Data Technology');
        }
        if(urlPattern === '/contact'){
            ngMeta.setTitle("Contact - Venuelytics");
            ngMeta.setTag('description', 'consumer contact details for venuelytics');
        }
        if(urlPattern === '/blog'){
            ngMeta.setTitle("Blog - Venuelytics");
            ngMeta.setTag('description', 'Follow our blog and discover the latest content and trends in the market. In addition you will discover the best tricks and discounts.');
        }
        ngMeta.setTag('image', 'assets/img/screen2.jpg');
        self.blogs = APP_ARRAYS.blogs;
        self.news = [
            {date:"May 14, 2018", name:"glimpse",image:"Glimpse-logo-1.png", title: "7 BEST RESTAURANT RESERVATION APPS", url: "https://www.glimpsecorp.com/7-best-restaurant-reservation-apps/", 
            description: "Gone are the days of calling and making appointments or reservations because now everyone expects, even simple tasks, to be done instantly with the click of a button. Over 75% of Americans now own a smartphone, which makes digital applications crucial to the success of any business"},
            {date:"March 1, 2018", name:"Casino Journal",image:"casino-journal.png", title: "VL Enterprise digital concierge answer — VENUELYTICS", url: "https://www.casinojournal.com/articles/91954-vl-enterprise-digital-concierge-solution----venuelytics", 
            description: "VenueLytics, the main supplier of built-in venue administration and buyer expertise platform and AI Automation, just lately introduced VenueLytics VL Enterprise."},
            {date:"February 27, 2018", name:"Telus International",image:"telus-international.png", title: "How artificial intelligence in the contact center improves customer satisfaction", url: "https://www.telusinternational.com/articles/artificial-intelligence-improves-customer-satisfaction/", description: "Discover three areas in the customer journey where artificial intelligence (AI) can help to better engage and satisfy consumers."},
            {date:"January 26, 2018", name:"MarTech Today",image:"martechtoday-logo-1.png", title: "The MarTech Minute: Stackies, collaborations and a new VenueLytics platform", url: "https://martechtoday.com/martech-minute-stackies-collaborations-new-venuelytics-platform-210005", description: "VenueLytics announced the debut of VenueLytics VL SMB. The company says it will enable independent hospitality businesses like restaurants, hotels, bars, nightclubs, casinos and more to add automated revenue-boosting services."},
            {date:"February 16, 2018", name:"Hospitality Technology",image:"hospitality-tech.png", title: "Mobile Tech Increases Crowds, Bottle Service Revenue for San Francisco Hot Spot.", url: "https://hospitalitytech.com/mobile-tech-increases-crowds-bottle-service-revenue-san-francisco-hot-spot", description: "Mayes Oyster House is a restaurant by day and dance club by night. Located on Polk Street in San Francisco, Calif., the restaurant uses VenueLytics to draw in guests and increase its bottle service revenue.  VenueLytics' ItzFun! mobile app helps businesses in the hospitality..."},
            {date:"January 31, 2018", name:"Hospitality Technology",image:"hospitality-tech.png", title: "VenueLytics' ItzFun App Acts as Real-Time Digital Concierge to Draw Consumers to Hotels, Restaurants, Casinos and More.", url: "https://hospitalitytech.com/venuelytics-itzfun-app-acts-real-time-digital-concierge-draw-consumers-hotels-restaurants-casinos", description: "VenueLytics, provider of a fully integrated customer experience & venue management platform, announced the availability of  “ItzFun” consumer solution via Mobile App, Web & Desktop.  ItzFun is a real-time personalized digital concierge service for consumers with premium mobile services like VIP bottle and table reservations, food and beverage orders, guest list, party packages, fast pass, events & ticketing, deals and even private event booking."},
            {date:"January 11, 2018", name:"Modern Restaurant Management",image:"mrm.png", title: "VenueLytics Introduces New Platform", url: "https://www.modernrestaurantmanagement.com/patina-brings-new-shine-to-disney-springs-and-double-duty-dinnerware", description: "VenueLytics announced VenueLytics VL SMB. The new platform enables independent hospitality businesses such restaurants, hotels, bars, nightclubs, casinos, and more, to add automated revenue boosting services."},
            {date:"January 8, 2018", name:"Hospitality Technology",image:"hospitality-tech.png", title: "VenueLytics' New Platform Automates Revenue Boosting Services for Independent Hospitality Venues", url: "https://hospitalitytech.com/venuelytics-new-platform-automates-revenue-boosting-services-independent-hospitality-venues", description: "VenueLytics, provider of fully integrated venue management, predictive intelligence, and data analytics platform, today announced VenueLytics VL SMB. The new platform enables independent hospitality businesses like restaurants, hotels, bars, nightclubs, casinos, and more, to add automated revenue boosting services."},
            {date:"January 8, 2018", name:"GlobeNewsWire",image:"nasdaq-gnw.png", title: "VenueLytics Platform Automates Revenue Boosting Services for Independent Hospitality Venues", url: "https://globenewswire.com/news-release/2018/01/08/1285146/0/en/VenueLytics-Platform-Automates-Revenue-Boosting-Services-for-Independent-Hospitality-Venues.html", description: "VenueLytics, provider of fully integrated venue management, predictive intelligence, and data analytics platform, today announced VenueLytics VL SMB. The new platform enables independent hospitality businesses like restaurants, hotels, bars, nightclubs, casinos, and more, to add automated revenue boosting services."},
            {date:"December 27, 2017", name:"New Gen Apps",image:"newgenapps.png", title: "3 Case Studies: Successful Use of Innovative Technology in Marketing", url: "https://www.newgenapps.com/blog/successful-use-innovative-technology-in-marketing-tech-for-marketing", description: "VenueLytics team have been working with the owner (David Pogue) at Shboom Nightclub in San Ramon, California.  This Venue is a combination of Restaurant and nightclub with different music themes from Wednesday to Saturday every week (Latin Nights, Top 40 Hits, Top DJ nights..)."},
            {date:"December 6, 2017", name:"Bloomberg",image:"bloomberg.png", title: "Fanlogic Signs Software and Marketing Partnership Agreement", url: "https://www.bloomberg.com/press-releases/2017-12-06/fanlogic-signs-software-and-marketing-partnership-agreement-with-palo-alto-peer-to-peer-consumer-concierge-leader-venuelytics", description: "Calgary, AB (FSCwire) - FanLogic Interactive Inc. (TSXV: FLGC – OTCQB: FNNGF) (“FanLogic” or the “Company”) is pleased to announce a partnership with VenueLytics, a technology firm based out of Palo Alto, California."},
            {date:"December 22, 2017", name:"App Advice",image:"app-advice.png", title: "The VenueLytics Business App is an integrated venue experience and management platform", url: "https://appadvice.com/app/venuelytics-venue-management/1155767700", description: "The VenueLytics Business App is an integrated venue experience and management platform which provides venues like Restaurant, Casinos, Clubs, Bars, Lounges, Karaoke, Stadiums, Concerts, Resorts & Bowling with features that generate incremental revenue through bottle/table reservation, ordering, mobile pay, analytics, rewards and more. "},
            {date:"December 19, 2017", name:"Capterra",image:"capterra-2018.png", title: "Best Venue Management Software!", url: "https://www.capterra.com/p/168651/VenueLytics/", description: "VenueLytics empowers businesses, in the entertainment, hospitality and service industries, to engage their customers in real-time and deliver Table & Bottle Service Reservations, Food & Drink Ordering, Private Event Bookings, Events Booking, 360 degree view of the venue, Guest Lists, Campaigns, Loyalty Rewards & other premium services across Omni-Channel & WiFI. VenueLytics provides a patent-pending deep learning technology for venues to get real-time insights & predictive recommendations."},
            {date:"December 6, 2017", name:"Yahoo! Finance",image:"yahoo.png", title: "Fanlogic Signs Software and Marketing Partnership Agreement", url: "https://finance.yahoo.com/news/fanlogic-signs-software-marketing-partnership-110000708.html", description: "Calgary, AB (FSCwire) - FanLogic Interactive Inc. (TSXV: FLGC – OTCQB: FNNGF) (“FanLogic” or the “Company”) is pleased to announce a partnership with VenueLytics, a technology firm based out of Palo Alto, California."},
            {date:"December 22, 2017", name:"App Advice",image:"app-advice.png", title: "ItzFun: Digital Concierge App", url: "https://appadvice.com/app/itzfun-digital-concierge-app/1035171101", description: "ItzFun! is an entertainment platform for consumers who want to know what are the happening & fun venues near them, at this very moment! Which are the casinos, clubs and lounges nearest to them, and what's the vibe at those venues right now? Users can also learn which venues offer the exclusive ItzFun! "},
            {date:"December 27, 2017", name:"App Advice",image:"get-app.png", title: "VenueLytics Pricing, Features, Reviews & Comparison of Alternatives", url: "https://www.getapp.com/operations-management-software/a/venuelytics/", description: "VenueLytics is a cloud-based event and venue management solution designed for businesses in the hospitality, entertainment, and service industries. The software includes tools for managing real-time reservations, food and drink services, guest lists, private events, customer loyalty and marketing campaigns, WiFi access, custom apps, and more."},
        ];
        
       /* $rootScope.getSearchBySearch = function(searchVenue){
          $location.url('/cities');
          setTimeout(function(){
              $rootScope.getSearchBySearch(searchVenue);
          },3000);
        };
        $rootScope.getserchKeyEnter = function(keyEvent,searchVenue) {
            if (keyEvent.which === 13){
                $rootScope.getSearchBySearch(searchVenue);
            }
        };*/
        self.init = function() {
            var $container = $('.masonry-container');
            $container.imagesLoaded( function () {

                $container.masonry({
                    columnWidth: '.masonry-item',
                    itemSelector: '.masonry-item'
                });
               
            });
            var delay = 500;
            self.delayedRender(delay);
           
        };

        self.delayedRender = function(delay) {
            if (delay < 15000) {
                 setTimeout(function() {
                     $container.masonry({
                    columnWidth: '.masonry-item',
                    itemSelector: '.masonry-item'
                });
                }, delay);
                 self.delayedRender(delay+1500);
             }
        };
        self.init();

    }]);