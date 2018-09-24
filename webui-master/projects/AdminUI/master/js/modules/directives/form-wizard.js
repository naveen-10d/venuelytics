/**=========================================================
 * Module: form-wizard.js
 * Handles form wizard plugin and validation
 =========================================================*/

App.directive('formWizard', function(){
  'use strict';

  if(!$.fn.bwizard) return;

  return {
    restrict: 'EA',
    link: function(scope, element, attrs) {
      var wizard = $(element).children('.form-wizard'),
          validate = attrs.validateStep; // allow to set options via data-* attributes
      
      if(validate) {
        wizard.bwizard({
          clickableSteps: false,
          delay: 500,
          validating: function(e, ui) {

            var $this = $(this),
            form = $this.parent(),
            group = form.find('.bwizard-activated');

            if (!scope.validate(e, ui)) {
              e.preventDefault();
              return;
            }
           /* if (false === form.parsley().validate( group[0].id )) {
              
            }*/
          },
          activeIndexChanged: function (e, ui) { 
           /* console.log(JSON.stringify(ui));
            e.preventDefault();
            return false;*/
          } 
        });
      }
      else {
        wizard.bwizard();
      }
    }
  };

});
