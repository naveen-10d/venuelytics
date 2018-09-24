/**=========================================================
* smangipudi
 * Module: paypalButton.js
*
 =========================================================*/
app.directive('paymentButton', function() {
  'use strict';
  return {
    restrict: 'EA',
    scope:{
     id: '@',
     venueNumber: '@',
     taxDate: '@',
     amount: '=',
     serviceType: '@',
     order: '=',
     authToken: '@',
     redirectUrl: '@',
     payAtVenueUrl: '@',
     enablePayments: '@'
  	},
    
  	controller: [ '$scope', 'AjaxService', 'TaxNFeesService', '$location', 'toaster','DataShare', 'DialogService', function ($scope, AjaxService, TaxNFeesService, $location, toaster,DataShare, DialogService) {
  	  var self = $scope;


      self.init = function() {
        self.orderId = -1;
        self.taxNFeeRates = -[];
    
        self.paymentData = TaxNFeesService.initPayment(0);
        self.enablePaypal = false;
        self.enableCC = false;
        self.enablePAV = false;

        self.$on('$locationChangeStart', function(event, next, current){            
            // Here you can take the control and call your own functions:
            if (window.backButton) {
              DialogService.showError('Navigation Error', 'Please use the Edit or Cancel Buttons on the page instead of browser back.');
              // Prevent the browser default action (Going back): = false;
              window.backButton = false;
              event.preventDefault();            
            }
        });
        
        AjaxService.getPaymentAuthorizationKeys(self.venueNumber).then(function(response) {
          $("#cover-spin").show(0);
          var data = response.data;
          self.stripeKey = data.stripePublicKey; 
          self.paypalKey = data.paypalPublicKey;
          
          self.enablePayments = self.enablePayments & (data.enablePayments || 7);
          self.enablePaypal = self.enablePayments & 1;
          self.enableCC = self.enablePayments & 2;
          self.enablePAV = self.enablePayments & 4;

          self.initPaypalButton();
          AjaxService.getTaxType(self.venueNumber, self.taxDate).then(function(response) {
            self.taxNFeeRates = response.data;
            self.recordPaymentIntent();
          });

          
        });
      };
      
      self.toast = function(paymentType, message) {
        DialogService.showError(paymentType + ' - Payment Error', message);
      };

      self.recordPaymentIntent = function() {
        self.paymentData = TaxNFeesService.calculateTotalAmount(self.taxNFeeRates, parseFloat(self.amount), self.serviceType, '');
        self.order.status = "PENDING_PAYMENT";
        self.order.order.status = "PENDING_PAYMENT";
        self.order.order.paymentMode = "CREDIT_CARD";
        self.order.order.originalPrice = self.paymentData.originalAmount;
        self.order.order.totalCost = self.paymentData.subTotal;
        self.order.order.totalTaxes = self.paymentData.taxAmount;
        self.order.order.totalFees = self.paymentData.totalFees;
        self.order.order.finalTransactionAmount = self.paymentData.finalCost;
        AjaxService.placeServiceOrder(self.venueNumber, self.order, self.authToken).then(function(response) {
            $("#cover-spin").hide();
            if (response.status == 200 ||  response.status == 201) {
              self.orderId = response.data.id;
              self.order.id = self.orderId;

            } else {
              if (response.data && response.data.message) {
                self.toast("Save Order Information","Saving order failed with message: " + response.data.message );
                return;
              }
              self.toast("Save Order Information", "Saving order failed");
              return;
            }
          }, function(e,r) {
             $("#cover-spin").hide();
          });
      }

      self.payAtVenue = function() {
          DataShare.paymentObject.paid = false;
        
          self.order.status = "REQUEST";
          self.order.order.status = "COMPLETED";
          self.order.order.paymentMode = "PAY_AT_VENUE";
          AjaxService.placeServiceOrder(self.venueNumber, self.order, self.authToken).then(function(response) {
            if (response.status == 200 ||  response.status == 201) {
              self.orderId = response.data.id;
              $location.url(self.redirectUrl);
              return;
            } else {
              if (response.data && response.data.message) {
                self.toast("Pay At Venue", "Saving order failed with message: " + response.data.message );
                return;
              }
              self.toast("Pay At Venue", "Saving order failed");
              return;
            }
          });
      };


      self.payWithCC = function() {
        var currencyType = 'USD';
        var handler = StripeCheckout.configure({
            key: self.stripeKey,
            image: 'assets/img/logo_dark.png',
            locale: 'auto',
            name: "Venuelytics, Inc",
            token: function(token) {
              if(token.card.country === 'INR') {
                  currencyType = 'INR';
              }
              var payment = {
                              "gatewayId": 1,
                              "token": token.id,
                              "currencyCode": currencyType,
                              "orderAmount": self.paymentData.amount,
                              "tax": self.paymentData.taxAmount,
                              "gratuity": self.paymentData.serviceFee,
                              "processingFee": self.paymentData.processingFee + self.paymentData.providerFee ,
                              "discountAmount": self.paymentData.discountAmount,
                              "paymentType": "CREDIT_CARD",
                              "chargedAmount": self.paymentData.finalCost
                          };
              //Save Payment Transaction for card
               $("#cover-spin").show(0);
              AjaxService.createTransaction(self.venueNumber, self.orderId, payment, self.authToken).then(function(response) {
                  $("#cover-spin").hide();
                  if (response.data.status >= 200 && response.data.status < 300) {
                     $location.url(self.redirectUrl);
                  } else {
                    AjaxService.cancelOrder(self.venueNumber, self.orderId, self.authToken);
                    self.toast("Credit Card", response.data.message);
                  }
                 
              }, function(error) {
                 $("#cover-spin").hide();
                AjaxService.cancelOrder(self.venueNumber, self.orderId, self.authToken);
                self.toast("Credit Card", 'Unexpected error: ' +error.error+ ' occured while process this request. Please try again.');
              });
            }
          });
          handler.open({
              name: self.venueName,
              description: 'Purchase Products',
              zipCode: true,
              amount: self.paymentData.finalCost*100, // in cents
              shippingAddress: true,
              billingAddress: true,
          });
          window.addEventListener('popstate', function() {
            handler.close();
          });
      };


      self.initPaypalButton = function() {
        console.log('initPaypalButton');
        braintree.client.create({
          authorization: self.paypalKey 
        }, function (clientErr, clientInstance) {

          // Stop if there was a problem creating the client.
          // This could happen if there is a network error or if the authorization
          // is invalid.
          if (clientErr) {
            console.error('Error creating client:', clientErr);
            return;
          }

          // Create a PayPal Checkout component.
          braintree.paypalCheckout.create({
            client: clientInstance
          }, function (paypalCheckoutErr, paypalCheckoutInstance) {

            // Stop if there was a problem creating PayPal Checkout.
            // This could happen if there was a network error or if it's incorrectly
            // configured.
            if (paypalCheckoutErr) {
              console.error('Error creating PayPal Checkout:', paypalCheckoutErr);
              return;
            }

            // Set up PayPal with the checkout.js library
            paypal.Button.render({
              env: 'sandbox', // or 'sandbox'
              style: {
                size: 'medium',
                color: 'gold',
                shape: 'rect',
                label: 'pay',
                tagline: false
              },

              payment: function () {
      
                return paypalCheckoutInstance.createPayment({
                  // Your PayPal options here. For available options, see
                  // http://braintree.github.io/braintree-web/current/PayPalCheckout.html#createPayment
                  flow: 'checkout',
                  amount: self.paymentData.finalAmount.toFixed(2),
                  currency: 'USD',
                  intent: 'sale',
                  locale: 'en_US'
                });
              },

              onAuthorize: function (data, actions) {
                return paypalCheckoutInstance.tokenizePayment(data, function (err, payload) {
                  console.log(payload);
                  var payment = {
                      "gatewayId":2,
                      "token":payload.nonce,
                      "currencyCode":'USD',
                      "orderAmount":self.paymentData.amount,
                      "tax":self.paymentData.taxAmount,
                      "gratuity":self.paymentData.serviceFee,
                      "processingFee":self.paymentData.processingFee + self.paymentData.providerFee ,
                      "discountAmount":self.paymentData.discountAmount,
                      "paymentType":"PAYPAL",
                      "chargedAmount":self.paymentData.finalCost
                  };                           
                  AjaxService.createTransaction(self.venueNumber, self.orderId, JSON.stringify(payment), self.authToken).then(function(response) {
                    if (response.data.status >= 200 && response.data.status < 300) {
                      $location.url(self.redirectUrl);
                    } else {
                      AjaxService.cancelOrder(self.venueNumber, self.orderId, self.authToken);
                      self.toast("Paypal", response.data.message);
                    }
                  }, function(error) {
                    AjaxService.cancelOrder(self.venueNumber, self.orderId, self.authToken);
                    self.toast("Paypal", 'Unexpected error: ' +error.error+ ' occured while process this request. Please try again.');
                  });
                  
                });
              },

              onCancel: function (data) {
                AjaxService.cancelOrder(self.venueNumber, self.orderId, self.authToken);
                console.log('checkout.js payment cancelled', JSON.stringify(data, 0, 2));
              },

              onError: function (err) {
                AjaxService.cancelOrder(self.venueNumber, self.orderId, self.authToken);
                self.toast("Paypal", 'Unexpected error. Please try again.');
              }
            }, '#paypalButtonId').then(function () {
            // The PayPal button will be rendered in an html element with the id
            // `paypal-button`. This function will be called when the PayPal button
            // is set up and ready to be used.
            });

          });

        });
      };

     
      
      self.init();
  	}],
  	templateUrl: 'templates/payment-button.html'
  };
});

