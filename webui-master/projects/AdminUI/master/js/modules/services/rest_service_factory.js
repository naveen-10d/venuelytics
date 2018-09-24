/**=========================================================
 * Module: rest_service_factory.js
 * smangipudi
 =========================================================*/

App.factory('RestServiceFactory', ['$resource', 'Session', 'USER_ROLES', '$translate', function ($resource, Session, USER_ROLES, $translate) {
	'use strict';
	var BASE_URL = "//dev.api.venuelytics.com/WebServices/rsapi";
	var BASE_SITE_URL = "http://52.9.4.76";
	this.serverName = "dev.api.venuelytics.com";
	this.contextName = BASE_URL;
	this.baseSiteUrl = BASE_SITE_URL;

	var storeProperties = ['id', 'venueName', 'managerName', 'address', 'city', 'state', 'country', 'zip', 'phone',
		'mobile', 'email', 'website', 'enabled', 'venueNumber', 'venueTypeCode', 'venueType', 'description', 'cleansed', 'imageUrls', 'info', 'options'];

	var beaconProperties = ['beaconName', 'description', 'majorLocCode', 'minorLocCode', 'storeNumber',
		'udid', 'enabled', 'departmentName', 'aisleName'];

	var userProperties = ['badgeNumber', 'businessName', 'email', 'loginId', 'roleId', 'userName', 'phone',
		'storeNumber', 'enabled', 'password', 'profileImage', 'profileImageThumbnail', 'supervisorId'];

	var businessProperties = ['id', 'businessName', 'address', 'state', 'city', 'category', 'role', 'email', 'phone', 'unRead'];

	var loyalityProperties = ['name', 'venueNumber', 'rewardText', 'condition', 'displayAttributes', 'conditionType'];

	var profileProperties = ['email', 'userName', 'phone', 'password', 'newpassword', 'profileImage', 'profileImageThumbnail'];
	var agencyProperties = ['name', 'budget', 'budgetType', 'commissionType', 'commission', 'phone', 'mobile', 'address', 'city', 'country', 'zip', "enabled", 'accountNumber', 'groupNumber', 'region'];
	var productProperties = ['id', 'venueNumber', 'name', 'description', 'unit', 'size', 'imageUrls', 'servingSize',
		'productType', 'BanquetHall', 'category', 'brand', 'enabled', 'price'];
	var venueMapProperties = ['id', 'type', 'section', 'imageMap', 'days', 'elements', 'imageUrls'];

	var venueEventProperties = ['id', 'venueNumber', 'eventName', 'description',
		'eventType', 'eventTime', 'durationInMinutes', 'startDate', 'endDate', 'scheduleDayOfMonth', 'ageRestriction', 'agePricePolicy', 'performers',
		'scheduleDayOfWeek', 'imageURL', 'bookingUrl', 'price', 'enabled', 'performerId', 'processingFeeMode', 'agencyId', 'needSponsor', 'address'];

	var VenueDeal = ['id', 'venueNumber', 'title', 'description', 'serviceType', 'couponType', 'promoCode',
		'actionUrl', 'contentUrl', 'originalPrice', 'discountAmount', 'discountPercent', 'imageUrl', 'thumbnailUrl', 'startDate',
		'expiryDate', 'displayEndDate', 'deleted', 'enabled', 'keywords']

	var eventTicketProperties = ['id', 'storeNumber', 'name', 'description',
		'price', 'discountedPrice', 'sectionName', 'seatStartNumber', 'count', 'row', 'eventDate', 'uiAttribute'];

	var performerService = ['id', 'performerName', 'groupName', 'description', 'imageUrl', 'thumbnailImageUrl', 'performanceUrl', 'phone', 'email',
		'website', 'facebookSocial', 'instagramSocial', 'twitterSocial', 'soundCloud', 'enabled', 'artistTypeCode'];

	var bandService = ['id', 'name', 'type', 'description', 'imageUrls', 'performanceUrl', 'website', 'facebookSocial', 'instagramSocial', 'twitterSocial',
		'enabled'];


	var REQ_PROP = {};

	REQ_PROP['VenueService'] = storeProperties;
	REQ_PROP['VenueDeals'] = storeProperties;
	REQ_PROP['BeaconService'] = beaconProperties;
	REQ_PROP['UserService'] = userProperties;
	REQ_PROP['BusinessService'] = businessProperties;
	REQ_PROP['LoyaltyService'] = loyalityProperties;
	REQ_PROP['ProfileService'] = profileProperties;
	REQ_PROP['AgencyService'] = agencyProperties;
	REQ_PROP['ProductService'] = productProperties;
	REQ_PROP['VenueMapService'] = venueMapProperties;
	REQ_PROP['VenueEventService'] = venueEventProperties;
	REQ_PROP['EventTicket'] = eventTicketProperties;
	REQ_PROP['PerformerService'] = performerService;
	REQ_PROP['BandService'] = bandService;
	REQ_PROP['venueDeal'] = VenueDeal;


	var urlTemplate = BASE_URL + "/v1/@context/:id";

	var contentActivateUrl = BASE_URL + "/v1/content/:id/@activate";
	var self = this;
	return {
		contextName: self.contextName,
		serverName: self.serverName,
		baseSiteUrl: self.baseSiteUrl,
		UserService: function () {
			return $resource(urlTemplate.replace("@context", "users"), {}, {
				getAgencyInfo: {
					method: 'GET', params: { id: '@id' },
					url: urlTemplate.replace("@context", "users") + "/agency"
				},
				resetPassword: {
					method: 'POST', params: { id: '@id' },
					url: urlTemplate.replace("@context", "users") + "/resetpassword"
				},
				getSecurityToken: {
					method: 'GET', params: { id: '@id' },
					url: urlTemplate.replace("@context", "users") + "/securityToken"
				},
				generateSecurityToken: {
					method: 'POST', params: { id: '@id' },
					url: urlTemplate.replace("@context", "users") + "/securityToken"
				},
				getMyProfile: {
					method: 'GET', params: { id: '@id' },
					url: urlTemplate.replace("@context", "users") + "/myProfile"
				},
				saveMyProfile: {
					method: 'POST', params: { id: '@id' },
					url: urlTemplate.replace("@context", "users") + "/myProfile"
				},
				getManagers: {
					method: 'GET', params: { id: '@id' }, isArray: true,
					url: urlTemplate.replace("@context", "users") + "/managers"
				},
				recoverPassword: {
					method: 'POST', params: { id: '@id' }, isArray: false,
					url: urlTemplate.replace("@context", "users") + "/forgotpassword"
				},
				getMyStores: {
					method: 'GET', isArray: true,
					url: urlTemplate.replace("@context", "users") + "/mystores"

				}
			});
		},
		BusinessService: function () {
			return $resource(urlTemplate.replace("@context", "business"), {}, {
				get: { method: 'GET', params: { id: '@id' }, isArray: true },

				updateBusiness: {
					method: 'POST', params: { id: '@id', businessId: '@businessId' },
					url: urlTemplate.replace("@context", "business") + "/:businessId"
				},
				getBusiness: {
					method: 'GET', params: { id: '@id', businessId: '@businessId' },
					url: urlTemplate.replace("@context", "business") + "/:businessId"
				},
				/*delete: {
					method: 'DELETE', params: { id: '@id', businessId: '@businessId' },
					url: urlTemplate.replace("@context", "business") + "/:businessId"
				}*/
			});
		},
		AgencyService: function () {
			return $resource(urlTemplate.replace("@context", "agencies"), {}, {
				getUsers: {
					method: 'GET', params: { id: '@id' },
					url: urlTemplate.replace("@context", "agencies") + "/users"
				},
				addAgent: {
					method: 'POST', params: { id: '@id' },
					url: urlTemplate.replace("@context", "agencies") + "/user"
				},
				deleteAgents: {
					method: 'DELETE', params: { id: '@id', userId: '@userId' },
					url: urlTemplate.replace("@context", "agencies") + "/user/:userId"
				},
				setAsManager: {
					method: 'POST', params: { id: '@id', userId: '@userId' },
					url: urlTemplate.replace("@context", "agencies") + "/manager/:userId"
				},
				getAuthorizedMachines: {
					method: 'GET', params: { id: '@id' }, isArray: true,
					url: urlTemplate.replace("@context", "agencies") + "/authorizedSystems"
				},
				resetBudget: {
					method: 'POST', params: { id: '@id' },
					url: urlTemplate.replace("@context", "agencies") + '/resetBudget'
				},
				checkRegistration: {
					method: 'POST',
					url: urlTemplate.replace("@context", "agencies") + '/validateComputer'
				},
				sendRegistrationCode: {
					method: 'POST', params: { medium: '@medium' },
					url: urlTemplate.replace("@context", "agencies") + '/sendRegistrationCode/:medium'
				},
				completeRegistration: {
					method: 'POST', params: { medium: '@medium' },
					url: urlTemplate.replace("@context", "agencies") + '/validateRegistration'
				},
				getStores: {
					method: 'GET', params: { id: '@id' },
					url: urlTemplate.replace("@context", "agencies") + '/stores'
				},
				addStore: {
					method: 'POST', params: { id: '@id', storeId: '@storeId' },
					url: urlTemplate.replace("@context", "agencies") + '/store/:storeId'
				},
				removeStore: {
					method: 'DELETE', params: { id: '@id', storeId: '@storeId' },
					url: urlTemplate.replace("@context", "agencies") + '/store/:storeId'
				},
				getPartners: {
					method: 'GET', params: { id: '@id' },
					url: urlTemplate.replace("@context", "agencies") + "/partners"
				},
				getPossiblePartners: {
					method: 'GET', params: { id: '@id' },
					url: urlTemplate.replace("@context", "agencies") + "/store/users"
				},
				addPartner: {
					method: 'POST', params: { id: '@id', partnerId: '@partnerId' },
					url: urlTemplate.replace("@context", "agencies") + "/partner/:partnerId"
				},
				removePartner: {
					method: 'DELETE', params: { id: '@id', partnerId: '@partnerId' },
					url: urlTemplate.replace("@context", "agencies") + "/partner/:partnerId"
				},
				validatePartner: {
					method: 'POST', params: {},
					url: urlTemplate.replace("@context", "agencies") + "/partners/validate"
				},
				getActivePaymentAuths: {
					method: 'GET', params: { id: '@id' }, isArray: true,
					url: urlTemplate.replace("@context", "agencies") + "/payments"
				},
				performPayment: {
					method: 'POST', params: { id: '@id' },
					url: urlTemplate.replace("@context", "biz")
				},
			});
		},
		UserVenueService: function () {
			return $resource(urlTemplate.replace("@context", "users") + "/venues", {}, {
				deleteVenues: {
					method: 'DELETE', params: { id: '@id', venueNumber: '@venueNumber' },
					url: urlTemplate.replace("@context", "users") + "/venues/:venueNumber"
				},
			});
		},
		BeaconService: function () {
			return $resource(urlTemplate.replace("@context", "sensors"));
		},
		VenueDeals: function () {
			return $resource(urlTemplate.replace("@context", "coupons"), {}, {
				saveDeal: {
					method: 'POST', params: { venueNumber: '@venueNumber' },
					url: urlTemplate.replace("@context", "coupons") + "/:venueNumber"
				},
				getDeals: {
					method: 'GET', params: { vid: '@vid', venueNumber: '@venueNumber' },
					url: urlTemplate.replace("@context", "coupons") + "/:venueNumber/:vid"
				},
				updateDeals: {
					method: 'POST', params: { vid: '@vid', venueNumber: '@venueNumber' },
					url: urlTemplate.replace("@context", "coupons") + "/:venueNumber/:vid"
				},
				deleteDeals: {
					method: 'DELETE', params: { vid: '@vid', venueNumber: '@venueNumber' },
					url: urlTemplate.replace("@context", "coupons") + "/:venueNumber/:vid"
				},

			});
		},
		VenueService: function () {
			return $resource(urlTemplate.replace("@context", "venues"), {}, {
				updateAttribute: {
					method: 'POST', params: { id: '@id' },
					url: urlTemplate.replace("@context", "venues") + "/info"
				},
				getAnalytics: {
					method: 'GET', params: { id: '@id' },
					url: urlTemplate.replace("@context", "venues") + "/analytics"
				},
				getAgencies: {
					method: 'GET', params: { id: '@id' },
					url: urlTemplate.replace("@context", "venues") + "/agency"
				},
				removeAgency: {
					method: 'DELETE', params: { id: '@id', agencyId: '@agencyId' },
					url: urlTemplate.replace("@context", "venues") + '/agency/:agencyId'
				},
				addAgency: {
					method: 'POST', params: { id: '@id', agencyId: '@agencyId' },
					url: urlTemplate.replace("@context", "venues") + '/agency/:agencyId'
				},
				delete: {
					method: 'DELETE', params: { id: '@id' },
					url: urlTemplate.replace("@context", "venues") + "/:venueNumber"
				},
				getGuests: {
					method: 'GET', params: { id: '@id', date: '@date' }, isArray: true,
					url: urlTemplate.replace("@context", "venues") + "/guests/:date"
				},
				getGuestList: {
					method: 'GET', params: { id: '@id', guestListId: '@guestListId' },
					url: urlTemplate.replace("@context", "venues") + "/guestList/:guestListId"
				},
				getEvents: {
					method: 'GET', params: { id: '@id' }, isArray: false,
					url: urlTemplate.replace("@context", "venues") + "/venueevents"
				},
				getEvent: {
					method: 'GET', params: { id: '@id' }, isArray: false,
					url: urlTemplate.replace("@context", "venueevents")
				},
				saveEvent: {
					method: 'POST', params: { id: '@id' },
					url: urlTemplate.replace("@context", "venueevents")
				},
				deleteEvent: {
					method: 'DELETE', params: { id: '@id' },
					url: urlTemplate.replace("@context", "venueevents")
				},
				deleteServiceHour: {
					method: 'DELETE', params: { id: '@id', objId: '@objId' },
					url: urlTemplate.replace("@context", "servicehours") + "/:objId"
				},
				getServiceTimings: {
					method: 'GET', params: { id: '@id' }, isArray: true,
					url: urlTemplate.replace("@context", "servicehours")
				},
				getServiceTimingById: {
					method: 'GET', params: { id: '@id', objId: '@objId' },
					url: urlTemplate.replace("@context", "servicehours") + "/:objId"
				},
				saveServiceTimings: {
					method: 'POST', params: { id: '@id', objId: '@objId' },
					url: urlTemplate.replace("@context", "servicehours") + "/:objId"
				},
				getTaxNFees: {
					method: 'GET', params: { id: '@id', YYMMDD: '@YYMMDD' }, isArray: true,
					url: urlTemplate.replace("@context", "vas") + "/taxNfees/:YYMMDD"
				},
				getInfo: {
					method: 'GET', params: { id: '@id' }, isArray: false,
					url: urlTemplate.replace("@context", "venues") + "/info"
				},
				getVenueUsers: {
					method: 'GET', params: { id: '@id' }, isArray: false,
					url: urlTemplate.replace("@context", "venues") + "/users"
				},
				getNonVenueUsers: {
					method: 'GET', params: { id: '@id' }, isArray: false,
					url: urlTemplate.replace("@context", "venues") + "/non-users"
				},
				getEventCategories: {
					method: 'GET', params: { id: '@id' }, isArray: true,
					url: urlTemplate.replace("@context", "vas") + "/categories?st=Events&type=EVENT"
				},
				getFacilities: {
					method: 'GET', params: { id: '@id' }, isArray: true,
					url: urlTemplate.replace("@context", "venues") + "/facilities"
				},
				updateFacilities: {
					method: 'POST', params: { id: '@id' },
					url: urlTemplate.replace("@context", "venues") + "/facilities"
				},
				getHotelGuests : {
					method: 'GET', params: { id: '@id' }, isArray: true,
					url: urlTemplate.replace("@context", "hotels") + "/active"
				}

			});
		},
		VenueEventService: function (customHeaders) {
			return $resource(urlTemplate.replace("@context", "venueevents"), {}, {
				getEventTickets: {
					method: 'GET', params: { id: '@id' }, isArray: true,
					url: urlTemplate.replace("@context", "venueevents") + '/ticket'
				},
				saveEventTicket: {
					method: 'POST', params: { id: '@id', ticketId: '@ticketId' },
					url: urlTemplate.replace("@context", "venueevents") + '/ticket/:ticketId'
				},
				deleteEventTicket: {
					method: 'DELETE', params: { id: '@id', ticketId: '@ticketId' },
					url: urlTemplate.replace("@context", "venueevents") + '/ticket/:ticketId'
				},
				buyTicket: {
					method: 'POST', params: { id: '@id', ticketId: '@ticketId' },
					headers: customHeaders || {},
					url: urlTemplate.replace("@context", "venueevents") + '/ticket/:ticketId/sell'
				},
				getSoldTickets: {
					method: 'GET', params: { id: '@id' }, isArray: true,
					url: urlTemplate.replace("@context", "venueevents") + '/soldTickets'
				},
				cancelTicket: {
					method: 'DELETE', params: { id: '@eventId', ticketId: '@ticketId' },
					url: urlTemplate.replace("@context", "venueevents") + '/soldTicket/' + ':ticketId'
				},
				getCancelReport: {
					method: 'GET', params: { id: '@id' }, isArray: true,
					url: urlTemplate.replace("@context", "venueevents") + '/report/cancel'
				}
			});
		},
		NotificationService: function () {
			return $resource(urlTemplate.replace("@context", "notifications"), {}, {
				getActiveNotifications: {
					method: 'GET', params: { id: '@id' },
					url: urlTemplate.replace("@context", "notifications") + "/active"
				},
				getCurrentNotifications: {
					method: 'GET', params: { id: '@id' },
					url: urlTemplate.replace("@context", "notifications") + "/:productId"
				},
				getUnreadNotificationCount: {
					method: 'GET', params: { id: '@id' },
					url: urlTemplate.replace("@context", "notifications") + "/count"
				},
				getNotificationSummary: {
					method: 'GET', params: { id: '@id' },
					url: urlTemplate.replace("@context", "notifications") + "/summary"
				}
			});
		},
		ProductService: function () {
			return $resource(urlTemplate.replace("@context", "products"), {}, {
				get: { method: 'GET', params: { id: '@id' }, isArray: true },
				getPrivateEvents: {
					method: 'GET', params: { id: '@id' }, isArray: true,
					url: urlTemplate.replace("@context", "products") + "/type/BanquetHall"
				},
				getPartyEvents: {
					method: 'GET', params: { id: '@id' }, isArray: true,
					url: urlTemplate.replace("@context", "products") + "/type/partyHall"
				},
				getPrivateEvent: {
					method: 'GET', params: { id: '@id', productId: '@productId' },
					url: urlTemplate.replace("@context", "products") + "/:productId"
				},
				updatePrivateEvent: {
					method: 'POST', params: { id: '@id', productId: '@productId' },
					url: urlTemplate.replace("@context", "products") + "/:productId"
				},
				createProduct: {
					method: 'POST', params: { id: '@id' },
					url: urlTemplate.replace("@context", "products")
				},
				updateProduct: {
					method: 'POST', params: { id: '@id', productId: '@productId' },
					url: urlTemplate.replace("@context", "products") + "/:productId"
				},
				getProduct: {
					method: 'GET', params: { id: '@id', productId: '@productId' },
					url: urlTemplate.replace("@context", "products") + "/:productId"
				},
				delete: {
					method: 'DELETE', params: { id: '@id', productId: '@productId' },
					url: urlTemplate.replace("@context", "products") + "/:productId"
				}

			});
		},
		VenueMapService: function () {
			return $resource(urlTemplate.replace("@context", "venuemap"), {}, {
				getAll: { method: 'GET', isArray: true },
				updateVenueMap: {
					method: 'POST', params: { id: '@id' },
					url: urlTemplate.replace("@context", "venuemap")
				},
				delete: {
					method: 'DELETE', params: { id: '@id', tableId: '@tableId' },
					url: urlTemplate.replace("@context", "venuemap") + "/:tableId"
				}
			});
		},
		VenueImage: function () {
			return $resource(urlTemplate.replace("@context", "upload"), {}, {
				uploadVenueImage: {
					method: 'POST', withCredentials: true, transformRequest: angular.identity, headers: { 'Content-Type': undefined },
					url: urlTemplate.replace("@context", "upload") + "/VenueImg"
				},
				deleteVenueImage: { method: 'DELETE', url: urlTemplate.replace("@context", "upload") },
				uploadTableImage: {
					method: 'POST', withCredentials: true, transformRequest: angular.identity, headers: { 'Content-Type': undefined },
					url: urlTemplate.replace("@context", "upload") + "/venueImgElements"
				},
				uploadPrivateImage: {
					method: 'POST', withCredentials: true, transformRequest: angular.identity, headers: { 'Content-Type': undefined },
					url: urlTemplate.replace("@context", "upload") + "/banquetVenueImg"
				},
				uploadImage: {
					method: 'POST', withCredentials: true, transformRequest: angular.identity, headers: { 'Content-Type': undefined },
					url: urlTemplate.replace("@context", "upload") + "/:objectType"
				},

			});
		},
		LoyaltyService: function () {
			return $resource(urlTemplate.replace("@context", "loyalty"), {}, {
				getLevel: {
					method: 'GET', params: { id: '@venueNumber', levelId: '@id' },
					url: urlTemplate.replace("@context", "loyalty") + '/level/:levelId'
				},
			});
		},

		AppSettingsService: function () {
			return $resource(urlTemplate.replace("@context", "settings"));
		},
		ContentService: function () {
			return $resource(urlTemplate.replace("@context", "content"), {}, {
				activate: {
					method: 'POST', params: { id: '@id' },
					url: contentActivateUrl.replace("@activate", "activate")
				},
				deactivate: {
					method: 'POST', params: { id: '@id' },
					url: contentActivateUrl.replace("@activate", "deactivate")
				},

			}
			);
		},
		CouponService: function () {
			return $resource(urlTemplate.replace("@context", "coupons"), {}, {
				get: { method: 'GET', params: { id: '@id' }, isArray: true },
				activate: {
					method: 'POST', params: { id: '@id' },
					url: contentActivateUrl.replace("@activate", "activate")
				},
				deactivate: {
					method: 'POST', params: { id: '@id' },
					url: contentActivateUrl.replace("@activate", "deactivate")
				},

			});
		},
		getAnalyticsUrl: function (venueNumber, anaType, aggPreriodType, filter) {
			return BASE_URL + "/v1/analytics/" + venueNumber + "/" + anaType + "/" + aggPreriodType + "?" + filter;
		},
		getImageUploadUrl: function (uploadContext) {
			return BASE_URL + "/v1/upload/" + uploadContext;
		},
		AnalyticsService: function () {

			return $resource(urlTemplate.replace("@context", "analytics"), {}, {
				get: {
					method: 'GET', params: { id: '@id', anaType: '@anaType', aggPeriodType: '@aggPeriodType', filter: '@filter' },
					url: urlTemplate.replace("@context", "analytics") + "/:anaType/:aggPeriodType?:filter"
				},
				getArray: {
					method: 'GET', params: { id: '@id', anaType: '@anaType', aggPeriodType: '@aggPeriodType', filter: '@filter' },
					url: urlTemplate.replace("@context", "analytics") + "/:anaType/:aggPeriodType?:filter", isArray: true
				},
				getTopNFavItems: {
					method: 'GET', params: { id: '@id', aggPeriodType: '@aggPeriodType' },
					url: urlTemplate.replace("@context", "analytics") + "/favitems/:aggPeriodType"
				},
				getVisitorAnalytics: {
					method: 'GET', params: { id: '@id', visitorId: '@visitorId' },
					url: urlTemplate.replace("@context", "analytics") + "/visitor/:visitorId"
				},
				getTicketingAnalytics: {
					method: 'GET', params: { id: '@id', type: '@type', eventId: '@eventId' },
					url: urlTemplate.replace("@context", "analytics") + "/ticketing/:type/:eventId"
				},


			});
		},
		ReservationService: function () {
			return $resource(urlTemplate.replace("@context", "reservations"), {}, {
				getForDate: {
					method: 'GET', params: { id: '@id', date: '@date' }, isArray: true,
					url: urlTemplate.replace("@context", "reservations") + "/date/:date"
				}
			});
		},
		PerformerService: function () {
			return $resource(urlTemplate.replace("@context", "performers"));
		},
		BandService: function () {
			return $resource(urlTemplate.replace("@context", "bands"), {}, {
				getPerformers: {
					method: 'GET', params: { id: '@id' }, isArray: true,
					url: urlTemplate.replace("@context", "bands") + "/performers"
				},
				addPerformer: {
					method: 'POST', params: { id: '@id', performerId: '@performerId' },
					url: urlTemplate.replace("@context", "bands") + "/performers/:performerId"
				},
				removePerformer: {
					method: 'DELETE', params: { id: '@id', performerId: '@performerId' },
					url: urlTemplate.replace("@context", "bands") + "/performers/:performerId"
				}
			});
		},
		HotelService: function() {
			return $resource(urlTemplate.replace("@context", "hotels"), {}, {
				
				saveCustomer: {
					method: 'POST', params: { id: '@id', guestId: '@guestId' },
					url: urlTemplate.replace("@context", "hotels") + "/:guestId"
				},
				getActiveCustomer: {
					method: 'GET', params: { id: '@id' }, isArray: true,
					url: urlTemplate.replace("@context", "hotels") + "/active"
				},
				deleteGuest: {
					method: 'DELETE', params: { id: '@id', guestId: '@guestId' },
					url: urlTemplate.replace("@context", "hotels") + "/:guestId"	
				}

			});

		},

		MessangerService: function() {
			return $resource(urlTemplate.replace("@context", "messanger"), {}, {
				sendSMS: {
					method: 'POST', params: { id: '@id' }
				}
			});

		},
		cleansePayload: function (serviceName, payload) {
			var rProps = REQ_PROP[serviceName];
			if (typeof rProps !== 'undefined') {
				return $.Apputil.copy(payload, rProps);
			}
			return payload;
		},
		formatStackData: function (data, propertyName, selectedPeriod) {
			var retData = [];
			var colors = ["#51bff2", "#4a8ef1", "#f0693a", "#a869f2"];
			var colorIndex = 0;
			if (data.length > 0) {
				for (var index in data[0].series) {
					var d = data[0].series[index];
					var elem = {};
					elem.label = $translate.instant(d[propertyName]);
					elem.color = colors[colorIndex % colors.length];
					colorIndex++;

					if (selectedPeriod !== 'DAILY') {
						elem.data = d.data.reverse();
					}
					else {
						elem.data = [];
						var rData = d.data.reverse();
						for (var i = 0; i < rData.length; i++) {
							var from = rData[i][0].split("-");
							var f = new Date(from[0], from[1] - 1, from[2]);
							var dataElem = [f.getTime(), rData[i][1]];
							elem.data.push(dataElem);
						}
					}
					retData.push(elem);
				}
			}
			return retData;
		},
		formatBarData: function (data, propertyName, selectedPeriod) {
			var colors = ["#51bff2", "#4a8ef1", "#3cb44b", "#0082c8", "#911eb4", "#e6194b", "#f0693a", "#f032e6 ", "#f58231", "#d2f53c", "#ffe119", "#a869f2", "#008080", "#aaffc3", "#e6beff", "#aa6e28", "#fffac8", "#800000", "#808000 ", "#ffd8b1", "#808080", "#808080"];
			var retData = [];

			var colorIndex = 0;
			if (data.length > 0) {
				var ticks = [];

				for (var idx in data[0].ticks) {
					var p = data[0].ticks.length - parseInt(idx) - 1;
					ticks[data[0].ticks[parseInt(idx)][1]] = p;
					data[0].ticks[parseInt(idx)][0] = p;
				}

				var barTicks = data[0].ticks;

				for (var index in data[0].series) {
					var d = data[0].series[index];
					var elem = {};
					elem.label = $translate.instant(d[propertyName]);
					elem.color = colors[colorIndex % colors.length];
					colorIndex++;
					elem.bars = {
						show: true,
						barWidth: 0.12,
						fill: true,
						lineWidth: 1,
						align: 'center',
						order: colorIndex,
						fillColor: elem.color
					};
					elem.data = [];

					if (selectedPeriod !== 'DAILY') {
						var existing = [];
						for (var i = 0; i < d.data.length; i++) {
							var dataElem = [ticks[d.data[i][0]], d.data[i][1]];
							existing[ticks[d.data[i][0]]] = 1;
							elem.data.push(dataElem);
						}

						for (var j = 0; j < data[0].ticks.length; j++) {
							if (existing[j] !== 1) {
								var dataElem = [j, null];
								elem.data.push(dataElem);
							}

						}

					}
					else {

						for (var i = 0; i < d.data.length; i++) {
							var from = d.data[i][0].split("-");
							var f = new Date(from[0], from[1] - 1, from[2]);
							var dataElem = [f.getTime(), d.data[i][1]];
							elem.data.push(dataElem);
						}
					}
					retData.push(elem);
				}
			}

			return { data: retData.reverse(), ticks: barTicks.reverse() };
		}

	};

}]);