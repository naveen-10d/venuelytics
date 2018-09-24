/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider',
    '$provide', '$ocLazyLoadProvider', 'APP_REQUIRES', 'USER_ROLES', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide,
        $ocLazyLoadProvider, appRequires, USER_ROLES, $locationProvider) {
        'use strict';

        App.controller = $controllerProvider.register;
        App.directive = $compileProvider.directive;
        App.filter = $filterProvider.register;
        App.factory = $provide.factory;
        App.service = $provide.service;
        App.constant = $provide.constant;
        App.value = $provide.value;

        // LAZY MODULES
        // ----------------------------------- 
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(http?|https?|file|tel|javascript):/);
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: appRequires.modules
        });

        $urlRouterProvider.otherwise('/app/myprofile');

        // 
        // Application Routes
        // -----------------------------------   
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: basepath('app.html'),
                controller: 'AppController',
                data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.owner, USER_ROLES.manager] },
                resolve: angular.extend(resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines',
                    'slimscroll', 'classyloader', 'toaster', 'csspiner', 'angularSpectrumColorpicker', 'spectrum'))
            })
            .state('app.dashboard', {
                url: '/dashboard',
                title: 'Dashboard',
                controller: 'DashBoardController',
                templateUrl: basepath('analytics/dashboard.html'),
                data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager] },
                resolve: resolveFor('flot-chart', 'moment', 'flot-chart-plugins')
            }).state('app.ticketingDashboard', {
                url: '/ticketing-dashboard',
                title: 'Ticketing Dashboard',
                controller: 'TicketDashBoardController',
                templateUrl: basepath('analytics/ticket-dashboard.html'),
                data: { authorizedRoles: [50, 51, 75, 100] },
                resolve: resolveFor('flot-chart', 'moment', 'flot-chart-plugins')
            }).state('app.eventDashboard', {
                url: '/event-dashboard/:eventId',
                title: 'Event Dashboard',
                controller: 'EventDashBoardController',
                templateUrl: basepath('analytics/event-dashboard.html'),
                data: { authorizedRoles: [50, 51, 75, 100] },
                resolve: resolveFor('flot-chart', 'moment', 'flot-chart-plugins')
            }).state('app.requestsDashboard', {
                url: '/requests-dashboard',
                title: 'Requests Dashboard',
                controller: 'RequestsDetailController',
                templateUrl: basepath('analytics/requests-details.html'),
                data: { authorizedRoles: [50, 51, 75, 100] },
                resolve: resolveFor('flot-chart', 'moment', 'flot-chart-plugins')
            }).state('app.visitorInsight', {
                url: '/dashboard/visitor-insight',
                title: 'Visitor Insight',
                templateUrl: basepath('analytics/visitor/visitor-insights.html'),
                controller: 'VisitorDashBoardController',
                data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager] },
                resolve: resolveFor('flot-chart', 'flot-chart-plugins')
            }).state('app.vipInsight', {
                url: '/dashboard/vip-insight',
                title: 'VIP Visitor Insight',
                templateUrl: basepath('analytics/vip-insights.html'),
                controller: 'VIPDashBoardController',
                data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager] },
                resolve: resolveFor('flot-chart', 'flot-chart-plugins')
            }).state('app.reservationInsight', {
                url: '/dashboard/reservation-insight',
                title: 'Reservation Insight',
                templateUrl: basepath('analytics/reservation-insights.html'),
                controller: 'ReservationDashBoardController',
                data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager] },
                resolve: resolveFor('flot-chart', 'flot-chart-plugins')
            }).state('app.revenueInsight', {
                url: '/dashboard/revenue-insight',
                title: 'Revenue Insight',
                templateUrl: basepath('analytics/revenue-insights.html'),
                controller: 'RevenueDashBoardController',
                data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager] },
                resolve: resolveFor('flot-chart', 'flot-chart-plugins')
            }).state('app.productInsight', {
                url: '/dashboard/product-insight',
                title: 'Product Insight',
                templateUrl: basepath('analytics/product-insights.html'),
                controller: 'ProductDashBoardController',
                data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager] },
                resolve: resolveFor('flot-chart', 'flot-chart-plugins')
            }).state('app.cityInsight', {
                url: '/dashboard/city-insight',
                title: 'City Insight',
                templateUrl: basepath('analytics/city-insights.html'),
                controller: 'CityInsightController',
                data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager] },
                resolve: resolveFor('flot-chart', 'flot-chart-plugins')
            }).state('app.cancelInsight', {
                url: '/dashboard/cancel-insight',
                title: 'Cancel Insight',
                templateUrl: basepath('analytics/cancel-insights.html'),
                controller: 'CancelDashBoardController',
                data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager] },
                resolve: resolveFor('flot-chart', 'flot-chart-plugins')
            }).state('app.popularInsight', {
                url: '/dashboard/popular-insight',
                title: 'Cancel Insight',
                templateUrl: basepath('analytics/popular-day-time.html'),
                controller: 'PopularDayTimeController',
                data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager] },
                resolve: resolveFor('flot-chart', 'flot-chart-plugins')
            })
            .state('app.masonry', {
                url: '/content',
                title: 'Content Image View',
                templateUrl: basepath('content.html'),
                controller: 'NullController',
                data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager] },
                resolve: resolveFor('flot-chart', 'flot-chart-plugins')
            }).state('app.venues', {
                url: '/venues',
                title: 'Venues',
                templateUrl: basepath('venue/venues.html'),
                controller: 'VenuesController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('datatables', 'datatables-plugins', 'ngDialog')
            }).state('app.band_artists', {
                url: '/performers',
                title: 'Bands And performers',
                templateUrl: basepath('artists/band_artists.html'),
                controller: 'BandArtistController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('datatables', 'datatables-plugins', 'ngDialog')
            }).state('app.artistedit', {
                url: '/artist/:id',
                title: 'Edit Artist',
                templateUrl: basepath('artists/artist_edit.html'),
                controller: 'ArtistController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley', 'inputmask')
            }).state('app.bandedit', {
                url: '/band/:id',
                title: 'Edit Band',
                templateUrl: basepath('artists/band_edit.html'),
                controller: 'BandController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley', 'inputmask')
            }).state('app.band-performers', {
                url: '/bandperformers/:id',
                title: 'Performers in the Band',
                templateUrl: basepath('artists/associate_artists.html'),
                controller: 'BandPerformerController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('datatables', 'datatables-plugins', 'ngDialog')
            }).state('app.newbandperformer', {
                url: '/newbandperformer/:id',
                title: 'Associate Performer to Band',
                templateUrl: basepath('artists/new_band_performer.html'),
                controller: 'AddBandPerformerController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('datatables', 'datatables-plugins', 'ngDialog')
            }).state('app.users', {
                url: '/users',
                title: 'Users',
                templateUrl: basepath('user/users.html'),
                controller: 'UsersController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('datatables', 'datatables-plugins', 'ngDialog')
            }).state('app.businessRequest', {
                url: '/businessRequest',
                title: 'Business Request',
                templateUrl: basepath('businessRequest/business-request.html'),
                controller: 'BusinessRequestController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('datatables', 'datatables-plugins', 'ngDialog')
            }).state('app.agencies', {
                url: '/agencies',
                title: 'Agencies',
                templateUrl: basepath('agency/agencies.html'),
                controller: 'AgenciesController',
                data: { authorizedRoles: [USER_ROLES.admin], type: 'AGENCY' },
                resolve: resolveFor('datatables', 'datatables-plugins', 'ngDialog')
            }).state('app.agencyedit', {
                url: '/agencyedit/:id',
                title: 'Edit Agency',
                templateUrl: basepath('agency/agency_edit.html'),
                controller: 'AgencyController',
                data: { authorizedRoles: [USER_ROLES.admin], type: 'AGENCY' },
                resolve: resolveFor('parsley', 'inputmask')
            })
            .state('app.stores', {
                url: '/stores',
                title: 'Stores',
                templateUrl: basepath('agency/stores.html'),
                controller: 'StoresController',
                data: { authorizedRoles: [USER_ROLES.admin], type: 'STORE' },
                resolve: resolveFor('datatables', 'datatables-plugins', 'ngDialog')
            })
            .state('app.storeedit', {
                url: '/storeedit/:id',
                title: 'Edit Store',
                templateUrl: basepath('agency/agency_edit.html'),
                controller: 'AgencyController',
                data: { authorizedRoles: [USER_ROLES.admin], type: 'STORE' },
                resolve: resolveFor('parsley', 'inputmask')
            })
            .state('app.agencyStores', {
                url: '/agency/:id/stores',
                title: 'Agency Stores',
                templateUrl: basepath('agency/agency-stores.html'),
                controller: 'AgencyStoresController',
                data: { authorizedRoles: [USER_ROLES.admin], mode: 'AS' },
                resolve: resolveFor('datatables', 'datatables-plugins', 'ngDialog')
            })
            .state('app.addAgencyStores', {
                url: '/agency/:id/stores',
                title: 'Add Agency Store',
                templateUrl: basepath('agency/new-agency-store.html'),
                controller: 'AgencyStoresController',
                data: { authorizedRoles: [USER_ROLES.admin], mode: 'AAS' },
                resolve: resolveFor('datatables', 'datatables-plugins', 'ngDialog')
            })
            .state('app.loyalty', {
                url: '/loyalty',
                title: 'Loyalty',
                templateUrl: basepath('loyalty/loyalty.html'),
                controller: 'LoyaltyController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('datatables', 'datatables-plugins')
            })
            /*.state('app.contest', {
                url: '/contest',
                title: 'Contest Management',
                templateUrl: basepath('contest/contest.html'),
                controller: 'ContestController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('datatables', 'datatables-plugins')
            })*/
            .state('app.chatbot', {
                url: '/chatbot/:id',
                title: 'Chat Bot',
                templateUrl: basepath('chatbot/chatbot.html'),
                controller: 'ChatbotController',
                data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, 76] },
                resolve: resolveFor('datatables', 'parsley', 'inputmask', 'ngDialog', 'taginput')
            })
            /*.state('app.smsChatbot', { //'parsley', 'inputmask', 'datatables', 'datatables-plugins', 'ngDialog', 'taginput', 'chosen'
                url: '/venues/:venueNumber/chatbot/:id',
                title: 'SMS Chat Bot',
                templateUrl: basepath('chatbot/smsChat-tab.html'),
                controller: 'smsChatbotController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley', 'inputmask', 'ngDialog')
            })*/
            .state('app.loyaltyedit', {
                url: '/loyaltyedit/:id',
                title: 'Edit Loyalty',
                templateUrl: basepath('loyalty/loyalty_edit.html'),
                controller: 'NullController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley', 'angularSpectrumColorpicker')
            })
            .state('app.venueedit', {
                url: '/venues/:id',
                title: 'Edit Store',
                templateUrl: basepath('venue/store_edit.html'),
                controller: 'StoreController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley', 'inputmask', 'datatables', 'datatables-plugins', 'ngDialog', 'jquery-ui','moment')
            })
            .state('app.editProducts', {
                url: '/editProducts/:venueNumber/:id',
                title: 'Edit Products',
                templateUrl: basepath('venue/products-edit.html'),
                controller: 'ProductsEditController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley', 'inputmask')
            })
            .state('app.editServiceHours', {
                url: '/editServiceHours/:venueNumber/:id',
                title: 'Edit ServiceHours',
                templateUrl: basepath('venue/service-hours-edit.html'),
                controller: 'VenueServiceTimeEditController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley', 'inputmask')
            })
            .state('app.editBanquetHall', {
                url: '/editBanquetHall/:venueNumber/:id',
                title: 'Edit BanquetHall',
                templateUrl: basepath('venue/banquet-hall-edit.html'),
                controller: 'PrivateEventController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley', 'inputmask', 'datatables', 'datatables-plugins')
            })
            .state('app.editPartyHall', {
                url: '/editPartyHall/:venueNumber/:id',
                title: 'Edit Party Hall',
                templateUrl: basepath('venue/banquet-hall-edit.html'),
                controller: 'PrivateEventController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley', 'inputmask', 'datatables', 'datatables-plugins')
            })
            .state('app.editVenueMap', {
                url: '/venues/:venueNumber/editVenueMap/:id',
                title: 'Edit VenueMap',
                templateUrl: basepath('venuemap-edit.html'),
                controller: 'NullController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley', 'inputmask', 'datatables', 'datatables-plugins', 'ngImgMap', 'ngDialog')
            })
            .state('app.editVenueEvent', {
                url: '/venues/:venueNumber/events/:id',
                title: 'Edit Venue Event',
                templateUrl: basepath('venue-events/venue-event-edit.html'),
                controller: 'VenueEventController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley', 'inputmask', 'datatables', 'datatables-plugins', 'ngDialog', 'taginput', 'chosen')
            })
            .state('app.editVenueDeals', {
                url: '/venues/:venueNumber/deals/:id',
                title: 'Edit Venue Deals',
                templateUrl: basepath('venue/create-deal.html'),
                controller: 'VenueDealsController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley', 'inputmask', 'datatables', 'datatables-plugins', 'ngDialog', 'taginput', 'chosen')
            })
            .state('app.dealsManagement', {
                url: '/dealsManagement',
                title: 'Manage Venue Deals',
                templateUrl: basepath('venue/venue-deals.html'),
                controller: 'VenueDealsController',
                data: { authorizedRoles: [USER_ROLES.admin, 51] },
                resolve: resolveFor('datatables', 'datatables-plugins', 'ngDialog')
            })
            .state('app.eventManagement', {
                url: '/eventManagement',
                title: 'Manage Venue Event',
                templateUrl: basepath('venue-events/venue-events.html'),
                controller: 'VenueEventsController',
                data: { authorizedRoles: [USER_ROLES.admin, 51] },
                resolve: resolveFor('datatables', 'datatables-plugins', 'ngDialog', 'jquery-ui', 'moment', 'fullcalendar')
            })
            .state('app.addVenueStore', {
                url: '/venues/:id/stores',
                title: 'Add Venue Store',
                templateUrl: basepath('venue/new-venue-store.html'),
                controller: 'NewVenueStoreController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('datatables', 'datatables-plugins', 'ngDialog')
            })
            .state('app.useredit', {
                url: '/useredit/:id',
                title: 'Edit User',
                templateUrl: basepath('user/user_edit.html'),
                controller: 'NullController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley', 'inputmask')
            })
            .state('app.businessrequestedit', {
                url: '/businessrequestedit/:id',
                title: 'Edit Business Request',
                templateUrl: basepath('businessRequest/business_request_edit.html'),
                controller: 'BusinessRequestEditController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley', 'inputmask', 'datatables', 'datatables-plugins', 'ngDialog')
            })
            .state('app.uservenues', {
                url: '/uservenue/:id',
                title: 'Manage User Venues',
                templateUrl: basepath('user/user_venue.html'),
                controller: 'NullController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('datatables', 'datatables-plugins')
            }).state('app.venueUsers', {
                url: '/venueUsers/:id',
                title: 'Add users to Venue',
                templateUrl: basepath('venue/add-venue-user.html'),
                controller: 'AddVenueUsersController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('datatables', 'datatables-plugins')
            })
            .state('app.agencyUsers', {
                url: '/agencyUsers/:id',
                title: 'Manage Agency Users',
                templateUrl: basepath('agency/agency_users.html'),
                controller: 'AgencyUserController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('datatables', 'datatables-plugins')
            })
            .state('app.newuservenues', {
                url: '/newuservenue/:id',
                title: 'Add User Venue',
                templateUrl: basepath('user/new_user_venue.html'),
                controller: 'NullController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('datatables', 'datatables-plugins')
            })
            .state('app.newagencyuser', {
                url: '/newagencyuser/:id',
                title: 'Add Agency User',
                templateUrl: basepath('agency/new_agency_user.html'),
                controller: 'UserAgencyController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('datatables', 'datatables-plugins')
            })
            .state('app.associateAgencyUser', {
                url: '/associateAgencyUser/:id',
                title: 'Associate Agency User',
                templateUrl: basepath('agency/associate_agency_user.html'),
                controller: 'AssociateAgencyUserController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('datatables', 'datatables-plugins')
            })
            .state('app.myprofile', {
                url: '/myprofile',
                title: 'My Profile',
                templateUrl: basepath('myprofile.html'),
                controller: 'NullController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley', 'inputmask')
            })
            .state('app.partners', {
                url: '/partners',
                title: 'Partners',
                templateUrl: basepath('user/partners.html'),
                controller: 'PartnerController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley')
            })
            .state('app.settings', {
                url: '/appsettings',
                title: 'Application Settings',
                templateUrl: basepath('app_settings.html'),
                controller: 'NullController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('parsley', 'codemirror', 'codemirror-plugins', 'moment', 'taginput', 'inputmask', 'chosen', 'slider', 'filestyle')
            })
            .state('app.reservations', {
                url: '/reservations',
                title: 'Reservations',
                templateUrl: basepath('reservations.html'),
                controller: 'ReservationsController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('jquery-ui', 'moment', 'fullcalendar')
            })
            .state('app.guestList', {
                url: '/guestlist',
                title: 'GuestList',
                templateUrl: basepath('guest/hotel-guests.html'),
                controller: 'HotelGuestsController',
                data: { authorizedRoles: [1000, 500, 100,80] },
                resolve: resolveFor('jquery-ui', 'moment', 'inputmask', 'ngDialog', 'taginput')
            })
            /*.state('app.eventsCalendar', {
                url: '/eventsCalendar',
                title: 'Events Calendar',
                templateUrl: basepath('venue/eventCalendar.html'),
                controller: 'EventsCalendarController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('jquery-ui', 'moment', 'fullcalendar')
            })*/
            .state('app.ticketsCalendar', {
                url: '/ticketsCalendar',
                title: 'Tickets Calendar',
                templateUrl: basepath('venue-events/ticketCalendar.html'),
                controller: 'TicketsCalendarController',
                data: { authorizedRoles: [10, 11, 12] },
                resolve: resolveFor('jquery-ui', 'moment', 'fullcalendar', 'ngDialog', 'parsley', 'inputmask')
            })
            .state('app.ticketsSold', {
                url: '/ticketsSold',
                title: 'Sold Tickets',
                templateUrl: basepath('venue-events/ticketsSold.html'),
                controller: 'TicketsSoldController',
                data: { authorizedRoles: [10, 11, 12] },
                resolve: resolveFor('datatables', 'datatables-plugins', 'moment', 'fullcalendar')
            })
            .state('app.reports', {
                url: '/ve-reports',
                title: 'Reports',
                templateUrl: basepath('venue-events/venue-event-report.html'),
                controller: 'NullController',
                data: { authorizedRoles: [10, 11, 12, 51] },
                resolve: resolveFor('datatables', 'datatables-plugins', 'moment', 'fullcalendar', 'parsley', 'inputmask')
            })
            .state('app.cancelReports', {
                url: '/ve-reports/cancel',
                title: 'Canceled Tickets Reports',
                templateUrl: basepath('venue-events/venue-event-cancel-report.html'),
                controller: 'VenueEventReportController',
                data: { authorizedRoles: [10, 11, 12, 51] },
                resolve: resolveFor('datatables', 'datatables-plugins', 'moment', 'fullcalendar', 'parsley', 'inputmask')
            })
            .state('app.soldReports', {
                url: '/ve-reports/sold',
                title: 'Sold Tickets Reports',
                templateUrl: basepath('venue-events/venue-event-sold-report.html'),
                controller: 'VenueEventReportController',
                data: { authorizedRoles: [10, 11, 12, 51] },
                resolve: resolveFor('datatables', 'datatables-plugins', 'moment', 'fullcalendar', 'parsley', 'inputmask')
            })
            .state('app.registerComputer', {
                url: '/registerComputer',
                title: 'Register Computer',
                templateUrl: basepath('venue-events/register-computer.html'),
                controller: 'NullController',
                data: { authorizedRoles: [11, 12] },
                resolve: resolveFor('bwizard', 'parsley')
            })
            .state('app.profile', {
                url: '/visitorAnalytics/:visitorId',
                title: '',
                templateUrl: basepath('analytics/profile.html'),
                controller: 'VisitorAnalyticsController',
                data: { authorizedRoles: [USER_ROLES.admin] },
                resolve: resolveFor('bwizard', 'parsley')
            })



            // Mailbox
            // ----------------------------------- 
            // Mailbox
            // ----------------------------------- 
            .state('app.mailbox', {
                url: '/mailbox',
                title: 'Mailbox',
                abstract: true,
                templateUrl: basepath('inbox/mailbox.html'),
                controller: 'MailboxController'
            })
            .state('app.mailbox.folder', {
                url: '/folder/:folder',
                title: 'Mailbox',
                templateUrl: basepath('inbox/mailbox-inbox.html'),
                controller: 'NullController'
            })
            .state('app.mailbox.all', {
                url: '/folder/all',
                title: 'Mailbox',
                templateUrl: basepath('inbox/mailbox-inbox.html'),
                controller: 'NullController'
            })
            .state('app.mailbox.view', {
                url: "/{mid:[0-9]{1,4}}",
                title: 'View mail',
                templateUrl: basepath('inbox/mailbox-view.html'),
                controller: 'NullController',
                resolve: resolveFor('ngWig')
            })
            .state('app.mailbox.compose', {
                url: '/compose',
                title: 'Mailbox',
                templateUrl: basepath('inbox/mailbox-compose.html'),
                controller: 'NullController',
                resolve: resolveFor('ngWig')
            })
            // 
            // Single Page Routes
            // ----------------------------------- 
            .state('page', {
                url: '/page',
                templateUrl: 'app/pages/page.html',
                data: { authorizedRoles: [USER_ROLES.admin, USER_ROLES.owner, USER_ROLES.manager] },
                resolve: angular.extend(resolveFor('modernizr', 'icons', 'parsley', 'toaster'))
            })
            .state('page.login', {
                url: '/login',
                title: "Login",
                params: ['message'],
                controller: 'LoginFormController',
                templateUrl: 'app/pages/login.html'
            })
            .state('page.register', {
                url: '/register',
                title: "Register",
                templateUrl: 'app/pages/register.html'
            })
            .state('page.recover', {
                url: '/recover',
                title: "Recover",
                controller: 'PasswordResetController',
                templateUrl: 'app/pages/recover.html'
            })
            .state('page.reset', {
                url: '/reset',
                title: "Reset Password",
                controller: 'PasswordResetController',
                templateUrl: 'app/pages/reset-password.html'
            })
            .state('page.lock', {
                url: '/lock',
                title: "Lock",
                templateUrl: 'app/pages/lock.html'
            })
            // 
            // CUSTOM RESOLVES
            //   Add your own resolves properties
            //   following this object extend
            //   method
            // ----------------------------------- 
            // .state('app.someroute', {
            //   url: '/some_url',
            //   templateUrl: 'path_to_template.html',
            //   controller: 'someController',
            //   resolve: angular.extend(
            //     resolveFor(), {
            //     // YOUR RESOLVES GO HERE
            //     }
            //   )
            // })
            ;

        //$locationProvider.html5Mode(true);

        // Set here the base of the relative path
        // for all app views
        function basepath(uri) {
            return 'app/views/' + uri;
        }

        // Generates a resolve object by passing script names
        // previously configured in constant.APP_REQUIRES
        function resolveFor() {
            var _args = arguments;
            return {
                deps: ['$ocLazyLoad', '$q', function ($ocLL, $q) {
                    // Creates a promise chain for each argument
                    var promise = $q.when(1); // empty promise
                    for (var i = 0, len = _args.length; i < len; i++) {
                        promise = andThen(_args[i]);
                    }
                    return promise;

                    // creates promise to chain dynamically
                    function andThen(_arg) {
                        // also support a function that returns a promise
                        if (typeof _arg === 'function')
                            return promise.then(_arg);
                        else
                            return promise.then(function () {
                                // if is a module, pass the name. If not, pass the array
                                var whatToLoad = getRequired(_arg);
                                // simple error check
                                if (!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                                // finally, return a promise
                                return $ocLL.load(whatToLoad);
                            });
                    }
                    // check and returns required data
                    // analyze module items with the form [name: '', files: []]
                    // and also simple array of script files (for not angular js)
                    function getRequired(name) {
                        if (appRequires.modules)
                            for (var m in appRequires.modules)
                                if (appRequires.modules[m].name && appRequires.modules[m].name === name)
                                    return appRequires.modules[m];
                        return appRequires.scripts && appRequires.scripts[name];
                    }

                }]
            };
        }

    }]).config(['$translateProvider', function ($translateProvider) {
        'use strict';
        var version = new Date().getTime();
        $translateProvider.useStaticFilesLoader({
            prefix: 'app/i18n/',
            suffix: '.json?v=' + version
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useLocalStorage();

    }]).config(['$httpProvider', function ($httpProvider) {
        'use strict';
        $httpProvider.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };
        $httpProvider.interceptors.push(['$q', 'Session', '$injector', function ($q, Session, $injector) {
            return {
                request: function (config) {
                    if (null != Session.id) {
                        config.headers['X-XSRF-TOKEN'] = Session.id;
                    }
                    return config || $q.when(config);
                },
                responseError: function (rejection) {
                    if (rejection.status === 0) {
                        $injector.get('$state').go('page.login');
                        return $q.reject(rejection);
                    }
                    return $q.reject(rejection);
                }
            };
        }]);
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    }]).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        'use strict';
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 300;
        // cfpLoadingBarProvider.parentSelector = '.wrapper > section';
    }])
    .controller('NullController', function () { });
