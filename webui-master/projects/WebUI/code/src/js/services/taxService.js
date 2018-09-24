/**
 * @author Suryanarayana Mangipudi
 * @date JUNE'4 2018
 */
"use strict";
app.service('TaxNFeesService', function() {
	const PROCESSING_FEES = ['convenience-fee'];
	const DISCOUNT = 'discount';
	const SERVICE_FEES = ['service-fee','delivery-fee'];
	const TIPS = 'tips';
	const PAYPAL_FEE = 'paypal-convenience-fee';
	const CREDIT_CARD = 'credit-convenience-fee';
	this.initPayment = function(amount) {
		var payment = {};
		payment.originalAmount = amount;
		payment.discountAmount = 0;
		payment.subTotal = amount - payment.discountAmount;
		payment.taxPercent = 0;
        payment.taxAmount = 0;
        payment.discount = 0;
        payment.processingFees = [];
        payment.serviceFees = [];
        payment.otherFees = [];
        payment.finalCost = amount;
        payment.totalFees = 0;
        return payment;
	}
	
	this.calculateTotalAmount = function(taxesNFees, amount, serviceType, providerFeeType) {
		var payment = this.initPayment(amount);
		
		if (!taxesNFees) {
			taxesNFees = [];
		}
		// formula for calculating 
	    // (cost Amount - discount Amount)*(1+ taxPercent) + fees 
	    // Percentage Fees are based on the discounted amount not on the total amount
	    
        angular.forEach(taxesNFees, function (value, key) {
            if (value.type === 'tax') {
                payment.taxPercent = value.value;
            }  else if (value.type === DISCOUNT) {
                payment.discount = value.value;
                payment.discountType = value.valueType;
            } 
        });
	    
        payment.discountAmount = calculate(amount, payment.discount, payment.discountType);
	    
	    payment.subTotal = amount - payment.discountAmount;
	    payment.finalCost = amount - payment.discountAmount;

	    var tax = 0;
	    if (payment.taxPercent > 0) {
	    	tax = payment.subTotal*payment.taxPercent*0.01;
	    }
	    payment.taxAmount = tax;
	    payment.finalCost += tax;

	    var otherFees = [];
	    otherFees.push(providerFeeType);
	    if (!serviceType) {
	    	serviceType = "";
	    }

	    angular.forEach(taxesNFees, function (value, key) {
	    	var fee = $.extend({}, value);
            fee.calculatedAmount = calculate(payment.subTotal, value.value, value.valueType);
            var validFees = false;
            var taxable = false;
            fee.describe = describe(fee);
            if (fee.calculatedAmount > 0 && (value.serviceType.toUpperCase() === serviceType.toUpperCase() || value.serviceType === 'ALL')) {
	            if (PROCESSING_FEES.includes(value.type) ) {
	            	payment.processingFees.push(fee);	
	            	validFees = true;
	            } else if (SERVICE_FEES.includes(value.type)) {
	            	payment.serviceFees.push(fee);
	            	validFees = true;
	            	taxable = true;
	            } else if (otherFees.includes(value.type)){
	            	payment.otherFees.push(fee);
	            	validFees = true;
	            }
	            if (validFees) {
	            	payment.finalCost += fee.calculatedAmount;
	            	payment.totalFees += fee.calculatedAmount;
	            }
	            if (taxable && payment.taxPercent > 0) {
	    			var taxonThisFees = fee.calculatedAmount*payment.taxPercent*0.01;
	    			payment.taxAmount += taxonThisFees;
	    			payment.finalCost += taxonThisFees;
	    		}


	        }
        }); 
	   
	    return payment;
	};
	function describe(fee) {
        if (fee.valueType === '%') {
          return ''+fee.value +'%';
        } else {
          return '$'+fee.value;
        }
    }
	function calculate(amt, fv, fvt ) {
		var r = fvt === '%' ? amt*fv*0.01 : fv;
		return r;
	}
});