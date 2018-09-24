(function() {

// Localize jQuery variable
var jQuery;

/******** Load jQuery if not present *********/
if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.4.2') {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type","text/javascript");
    script_tag.setAttribute("src",
        "http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js");
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () { // For old versions of IE
          if (this.readyState == 'complete' || this.readyState == 'loaded') {
              scriptLoadHandler();
          }
      };
    } else {
      script_tag.onload = scriptLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
} else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    main();
}

/******** Called once jQuery has loaded ******/
function scriptLoadHandler() {
    // Restore $ and window.jQuery to their previous values and store the
    // new jQuery in our local jQuery variable
    jQuery = window.jQuery.noConflict(true);
    // Call our main function
    main(); 
}

/******** Our main function ********/
function main() { 
    jQuery(document).ready(function($) { 
        /******* Load CSS *******/
        var css_link = $("<link>", { 
            rel: "stylesheet", 
            type: "text/css", 
            href: "style.css" 
        });
        css_link.appendTo('head');  

        //var css = $("<link>", { rel: "stylesheet", type: "text/css", href: "style.css" }).appendTo('head');		

        /******* Load HTML *******/
       /* var jsonp_url = "http://al.smeuh.org/cgi-bin/webwidget_tutorial.py?callback=?";*/
	   
	    var msg = '';
		 msg += '<center>FORM</center>';
	    msg += '<form id="formoid"  title="" method="post">';
		msg += '<div class="naveen">'
        msg += '<div> <label class="title">First Name</label> <input type="text" id="fname" name="fname" ></div> <br> ';
		msg += '<div> <label class="title">Last Name</label> <input type="text" id="lname" name="lname" ></div><br>';
	    msg += '<center><div> <input type="submit" id="submitButton"  name="submitButton" value="Submit"></div><center>';
		msg += '</div>'
		msg += '</form>'
		$('#example-widget-container').append(msg);
		
		
	 $("#formoid").submit(function(event) {

      /* stop form from submitting normally */
      event.preventDefault();

     /* Send the data using post with element id name and name2*/
     /* var posting = $.post( url, { name: $('#name').val(), name2: $('#name2').val() } );*/

	  alert("First name   : "+$('#fname').val());
	  alert("last name   : "+ $('#lname').val());
	 

    });
		
	   
	    /*$.getJSON(jsonp_url, function(data) {
          $('#example-widget-container').html("This data comes from another server: " + data.html);
        });*/
		
    });
}

})(); // We call our anonymous function immediately