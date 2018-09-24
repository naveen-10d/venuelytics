/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 * https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
 =========================================================*/
App
  .constant('APP_COLORS', {
    'primary':                '#5d9cec',
    'success':                '#27c24c',
    'info':                   '#23b7e5',
    'warning':                '#ff902b',
    'danger':                 '#f05050',
    'inverse':                '#131e26',
    'green':                  '#37bc9b',
    'pink':                   '#f532e5',
    'purple':                 '#7266ba',
    'dark':                   '#3a3f51',
    'yellow':                 '#fad732',
    'gray-darker':            '#232735',
    'gray-dark':              '#3a3f51',
    'gray':                   '#dde6e9',
    'gray-light':             '#e4eaec',
    'gray-lighter':           '#edf1f2'
  })
  .constant('APP_MEDIAQUERY', {
    'desktopLG':             1200,
    'desktop':                992,
    'tablet':                 768,
    'mobile':                 480
  })
  .constant('AUTH_EVENTS', {
	  loginSuccess: 'auth-login-success',
	  loginFailed: 'auth-login-failed',
	  logoutSuccess: 'auth-logout-success',
	  sessionTimeout: 'auth-session-timeout',
	  notAuthenticated: 'auth-not-authenticated',
	  notAuthorized: 'auth-not-authorized'
	}).constant('APP_EVENTS', {
    venueSelectionChange: 'venueSelectionChange',
    deleteEvent: 'deleteEvent'
  })
	.constant('USER_ROLES', {
		 any: {id: 0, name: 'Public'},
		 user: {id: 1, name: 'Basic User'},
		 bouncer: {id: 2, name: 'Bouncer'},
		 bartender: {id: 3, name: 'Bartender'},
		 waitress: {id: 4, name: 'Waitress'},
		 dj: {id: 5, name: 'DJ'},
		 karaokeManager:  {id: 6, name: 'Karaoke Manager'},
		 artist:  {id: 7, name: 'Artist'},
		 manager:  {id: 100, name: 'Manager'},
		 owner:  {id: 500, name: 'Owner'},
		 admin:  {id: 1000, name: 'Admin'},
	})
	.constant('FORMATS', {
		  phoneUS: '(999) 999-9999'
	})
  .constant('APP_REQUIRES', { 
    scripts: {
      'icons':              ['vendor/skycons/skycons.js', 'vendor/fontawesome/css/font-awesome.min.css','vendor/simplelineicons/simple-line-icons.css', 
                            'vendor/weathericons/css/weather-icons.min.css'],
      'modernizr':          ['vendor/modernizr/modernizr.js'],
      'fastclick':          ['vendor/fastclick/fastclick.js'],
      'filestyle':          ['vendor/filestyle/bootstrap-filestyle.min.js'],
      'csspiner':           ['vendor/csspinner/csspinner.min.css'],
      'animo':              ['vendor/animo/animo.min.js'],
      'sparklines':         ['vendor/sparklines/jquery.sparkline.min.js'],
      'slimscroll':         ['vendor/slimscroll/jquery.slimscroll.min.js'],
      'screenfull':         ['vendor/screenfull/screenfull.min.js'],
      'classyloader':       ['vendor/classyloader/js/jquery.classyloader.js'],
      'vector-map':         ['vendor/jvectormap/jquery-jvectormap-1.2.2.min.js', 'vendor/jvectormap/maps/jquery-jvectormap-world-mill-en.js', 
                            'vendor/jvectormap/jquery-jvectormap-1.2.2.css'],
      'loadGoogleMapsJS':   ['vendor/gmap/load-google-maps.js'],
      'google-map':         ['vendor/gmap/jquery.gmap.min.js'],
      'flot-chart':         ['vendor/flot/jquery.flot.min.js'],
      'flot-chart-plugins': ['vendor/flot/jquery.flot.tooltip.min.js','vendor/flot/jquery.flot.resize.min.js','vendor/flot/jquery.flot.pie.min.js',
      'vendor/flot/jquery.flot.time.min.js','vendor/flot/jquery.flot.categories.min.js','vendor/flot/jquery.flot.spline.min.js', 'vendor/flot/jquery.flot.stack.js', 'vendor/flot/jquery.flot.orderBars.js' ],
      'jquery-ui':          ['vendor/jqueryui/jquery-ui.min.js', 'vendor/touch-punch/jquery.ui.touch-punch.min.js'],
      'chosen':             ['vendor/chosen/chosen.jquery.min.js', 'vendor/chosen/chosen.min.css'],
      'slider':             ['vendor/slider/js/bootstrap-slider.js', 'vendor/slider/css/slider.css'],
      'moment' :            ['vendor/moment/min/moment-with-locales.min.js'],
      'fullcalendar':       ['vendor/fullcalendar/dist/fullcalendar.min.js', 'vendor/fullcalendar/dist/fullcalendar.css'],
      'codemirror':         ['vendor/codemirror/lib/codemirror.js', 'vendor/codemirror/lib/codemirror.css'],
      'codemirror-plugins':  ['vendor/codemirror/addon/mode/overlay.js','vendor/codemirror/mode/markdown/markdown.js','vendor/codemirror/mode/xml/xml.js',
                              'vendor/codemirror/mode/gfm/gfm.js','vendor/marked/marked.js'],
      'taginput' :          ['vendor/tagsinput/bootstrap-tagsinput.min.js', 'vendor/tagsinput/bootstrap-tagsinput.css'],
      'inputmask':          ['vendor/inputmask/jquery.inputmask.bundle.min.js'],
      'bwizard':            ['vendor/wizard/js/bwizard.min.js'],
      'parsley':            ['vendor/parsley/parsley-2.8.1.min.js'],
      'datatables':         ['vendor/datatable/media/js/jquery.dataTables.min.js', 
                              'vendor/datatable/extensions/datatable-bootstrap/css/dataTables.bootstrap.css'],
      'datatables-plugins':  ['vendor/datatable/extensions/datatable-bootstrap/js/dataTables.bootstrap.js',
                             'vendor/datatable/extensions/datatable-bootstrap/js/dataTables.bootstrapPagination.js',
                             'vendor/datatable/extensions/ColVis/js/dataTables.colVis.min.js',
                              'vendor/datatable/extensions/ColVis/css/dataTables.colVis.css'],
      'flatdoc':            ['vendor/flatdoc/flatdoc.js'],
      'spectrum':            ['vendor/spectrumcolor/js/spectrum.js','vendor/spectrumcolor/css/spectrum.css'],
      'ngDialog':			['vendor/ngDialog/js/ngDialog.min.js', 'vendor/ngDialog/css/ngDialog.min.css', 
                      'vendor/ngDialog/css/ngDialog-theme-default.min.css'],
      'ngImgMap': ['vendor/ngImgMap/compile/ng-img-map.css']
     
  	// Also add in gulpfile.js 
    },
   
    modules: [
      { name: 'toaster',         files: ['vendor/toaster/toaster.js', 'vendor/toaster/toaster.css'] },
      { name: 'ngWig',          files: ['vendor/ngwig/ng-wig.min.js'] },
     
      {name: 'angularSpectrumColorpicker',   files:    ['vendor/spectrumcolor/js/angular-spectrum-color-min.js']}
    ]
  })
;