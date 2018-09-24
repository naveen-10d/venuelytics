module.exports = {
    environment : 'dev',
    concat: true,
    primaryColor: 'light-green',
    shine: '300',
    headerClass: 'ms-header-white',
    navbarClass: 'ms-navbar-white',
    navbarMode: false,
    allColors: false,
    compress: true,

    themes : ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey'],
    shines : ['300', '400', '500', '600', '700', '800'],

    headers : ['header-primary', 'header-dark', 'header-white'],
    navbars : ['navbar-primary', 'navbar-dark', 'navbar-white'],

    folders : {
        dist : 'dist',
        assets: 'assets',
        plugins: 'plugins'
    },

    plugins : {
        js : [
            'bower_components/html5shiv/dist/html5shiv.min.js',
            'bower_components/respond/dest/respond.min.js',
        ],
        angular : [
            'bower_components/angular/angular.min.js'
        ],
        jsConcat : [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/jquery-ui/jquery-ui.min.js',
            'bower_components/jquery.cookie/jquery.cookie.js',
			'bower_components/owl.carousel/dist/owl.carousel.min.js',
			'bower_components/owl.carousel/docs/assets/vendors/jquery.mousewheel.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',
            'bower_components/bootstrap-select/dist/js/bootstrap-select.min.js',
            'bower_components/holderjs/holder.min.js',
            'bower_components/Slidebars/dist/slidebars.min.js',
            'bower_components/matchHeight/dist/jquery.matchHeight-min.js',
            'bower_components/prism/prism.js',
            'bower_components/prism/plugins/line-numbers/prism-line-numbers.min.js',
            'bower_components/wow/dist/wow.min.js',
            'bower_components/plyr/dist/plyr.js',
            'bower_components/imagesloaded/imagesloaded.pkgd.min.js',
            'bower_components/masonry/dist/masonry.pkgd.min.js',
            'bower_components/waypoints/lib/jquery.waypoints.min.js',
            'bower_components/jquery.counterup/jquery.counterup.min.js',
            'bower_components/chart.js/dist/Chart.bundle.min.js',
            'bower_components/chartjs-plugin-deferred/dist/chartjs-plugin-deferred.min.js',
            'bower_components/circles/circles.min.js',
            'bower_components/owl.carousel/dist/owl.carousel.min.js',
            'bower_components/jquery.countdown/dist/jquery.countdown.min.js',
            'bower_components/mixitup/build/jquery.mixitup.min.js',
            'bower_components/smooth-scroll/dist/smooth-scroll.polyfills.min.js',
            'bower_components/typed.js/dist/typed.min.js',
            "bower_components/snackbar/dist/snackbar.min.js",
            "bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js",
			'bower_components/angular-route/angular-route.min.js',
           /* 'bower_components/momentjs/min/moment.min.js',*/
            'bower_components/bootstrap-daterangepicker/daterangepicker.js',
            'bower_components/angular-daterangepicker/js/angular-daterangepicker.js',
			'bower_components/clipboard/dist/clipboard.min.js',
			'bower_components/ngclipboard/dist/ngclipboard.min.js',
            'bower_components/iframe-resizer/js/iframeResizer.min.js',
            'bower_components/angular-cookies/angular-cookies.min.js',
            'bower_components/angular-translate/angular-translate.min.js',
            'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
            'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
            'bower_components/angular-translate-storage-local/angular-translate-storage-local.min.js',
            'bower_components/angular-translate-handler-log/angular-translate-handler-log.min.js', 
            'bower_components/parsleyjs/dist/parsley.min.js',
            'bower_components/inputmask/dist/min/jquery.inputmask.bundle.min.js',
            'bower_components/ngMeta/dist/ngMeta.min.js',
            'bower_components/satellizer/satellizer.min.js',
            'bower_components/ngstorage/ngStorage.min.js',
            'bower_components/ngclipboard/dist/ngclipboard.min.js',
            'bower_components/angular-media-queries/match-media.js',
            'bower_components/AngularJS-Toaster/toaster.min.js',
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/angular-modal-service/dst/angular-modal-service.min.js',
            'bower_components/angular-card-input/angular_card_input.js',
            'bower_components/angular-ui-select/dist/select.js',
            'bower_components/angular-sanitize/angular-sanitize.min.js'
        ],
        js_sourcemap: [
            'bower_components/iframe-resizer/js/iframeResizer.contentWindow.map',
            'bower_components/iframe-resizer/js/iframeResizer.map',
            'bower_components/iframe-resizer/js/iframeResizer.map',
            'bower_components/angular-animate/angular-animate.min.js.map',
            'bower_components/angular-modal-service/dst/angular-modal-service.min.js.map',
            'bower_components/angular-sanitize/angular-sanitize.min.js.map'
        ],
        css_sourcemap: [
            'bower_components/bootstrap/dist/css/bootstrap.min.css.map'
        ],
        css : [
            'bower_components/animate.css/animate.min.css',
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'bower_components/bootstrap-select/dist/css/bootstrap-select.min.css',
            'bower_components/font-awesome/css/font-awesome.min.css',
            'bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css',
            'bower_components/Slidebars/dist/slidebars.min.css',
            'bower_components/prism-theme-one-dark/prism-onedark.css',
            'bower_components/bootstrap-daterangepicker/daterangepicker.css',
            'bower_components/Yamm3/yamm/yamm.css',
            'bower_components/plyr/dist/plyr.css',
            'bower_components/owl.carousel/dist/assets/owl.carousel.min.css',
            'bower_components/owl.carousel/dist/assets/owl.theme.default.min.css',
            "bower_components/snackbar/dist/snackbar.min.css",
            "bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css.map",
            'bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css',
			'bower_components/owl.carousel/dist/assets/owl.carousel.min.css',
			'bower_components/owl.carousel/dist/assets/owl.theme.default.min.css',
			'src/css/custom.css',
            'bower_components/AngularJS-Toaster/toaster.min.css',
            'bower_components/angular-ui-select/dist/select.css',

        ],
        fonts : [
            'bower_components/bootstrap/dist/fonts/*',
            'bower_components/font-awesome/fonts/*',
            'bower_components/material-design-iconic-font/dist/fonts/*'
        ],
        img : [
            'bower_components/owl.carousel/dist/assets/owl.video.play.png'
        ]
    },
};
