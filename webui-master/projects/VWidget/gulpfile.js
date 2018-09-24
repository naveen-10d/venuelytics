var gulp = require('gulp');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var prettify = require('gulp-prettify');
var beautify = require('gulp-beautify');
var uglify = require('gulp-uglify');
var del = require('del');
var path = require('path');
var CacheBuster = require('gulp-cachebust');
var templateHtmlCache = require('gulp-angular-templatecache');
var cleanCSS = require('gulp-clean-css');
var cachebust = new CacheBuster();
var runSequence = require('run-sequence').use(gulp);
var webserver = require('gulp-webserver');
var replace = require('gulp-replace');
var gutil = require('gulp-util');
// var app = seo4ajax();
var config = {
    compress: true
};

var plugins = {
    js : [
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-route/angular-route.js',
        'app/lib/iframeResizer.min.js',
        'app/lib/ng-iframe-resizer.js'
    ],
    modernizr : [
        'app/bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js'
    ],
    css: [
        'app/bower_components/html5-boilerplate/dist/css/normalize.css',
        'app/bower_components/html5-boilerplate/dist/css/main.css'
    ]
};
var build = {
    dist: path.join('dist'),
    html: path.join('dist','html'),
    js: path.join('dist', 'js'),
    css: path.join('dist', 'css')
};

var src = {
    html: path.join('app', 'html', '*.html'),
    js: path.join('app', 'js', '**/*.js'),
    css: path.join('app', 'css', '*.css'),
    index : path.join('app', 'index.html')
};

gulp.task('html', function() {
    return gulp.src(src.html)
        .pipe(gulpif(config.compress, prettify({
            indent_size: 2
        })))
        .pipe(replace('__website__',baseWebsite()))
        .pipe(templateHtmlCache('templates.js', {root: 'html'}))
        .pipe(gulp.dest(build.js));
       // .pipe(connect.reload());
});

gulp.task('js', ['js:modernizr', 'js:dependencies'], function() {
    return gulp.src(src.js)
       // .pipe(gulpi//false, concat('configurator.min.js'))) //config.compress
        .pipe(replace('dev.api.venuelytics.com',baseAPIUrl()))
        .pipe(gulpif(config.compress, uglify()))

        .pipe(concat('app.min.js'))
        .pipe(cachebust.resources())
        .pipe(gulp.dest(build.js));
});


gulp.task('js:dependencies', function() {
    return gulp.src(plugins.js)
        .pipe(concat('plugins.min.js'))
        .pipe(cachebust.resources())
        .pipe(gulp.dest(build.js));
});

gulp.task('js:modernizr', function() {
    return gulp.src(plugins.modernizr)
        .pipe(concat('modernizr.min.js'))
        .pipe(cachebust.resources())
        .pipe(gulp.dest(build.js));
});

gulp.task('css', ['plugins:css'], function() {
    return gulp.src(src.css)
       // .pipe(gulpi//false, concat('configurator.min.js'))) //config.compress
        .pipe(gulpif(config.compress, cleanCSS({compatibility: 'ie8', keepBreaks:true})))
        .pipe(concat('app.min.css'))
        .pipe(cachebust.resources())
        .pipe(gulp.dest(build.css));
});

gulp.task('plugins:css', function() {
    return gulp.src(plugins.css)
        .pipe(gulpif('!*.min.css', cleanCSS({compatibility: 'ie8', keepBreaks:true})))
        .pipe(concat('plugins.min.css'))
        .pipe(cachebust.resources())
        .pipe(gulp.dest(build.css));
});

gulp.task('index', function() {
    return gulp.src(src.index)
        .pipe(gulpif(config.compress, prettify({
                 indent_size: 2
            })))
        .pipe(cachebust.references())
        .pipe(gulp.dest(build.dist));
});


gulp.task('clean', function() {
    return del.sync([
        build.dist
    ]);
});

gulp.task('watch', function() {
    gulp.watch(src.html, ['html']);
    gulp.watch(src.js, ['js']);
    gulp.watch(src.css, ['css']);

});


gulp.task('connect', function() {

  return gulp.src(build.dist)
    .pipe(webserver({
      livereload: true,
      path: '/portal',
      port: 8100,
      directoryListing: false,
      open: 'http://localhost:8100/portal',
      fallback: 'index.html'
    }));
});


gulp.task('dist', function(cb) {
    config.compress = true;
    return runSequence(
        ['js', 'css', 'html'], 'index',cb
    );
});



gulp.task('work', function(cb) {
    config.compress = false;
    return runSequence(
        ['js', 'css', 'html'], 'index','connect',cb
    );
});

function baseAPIUrl() {
    if (gutil.env.build === 'prod') {
        return "prod.api.venuelytics.com";
    } else if (gutil.env.build === 'dev') {
        return "dev.api.venuelytics.com";
    } 
    return "localhost:8080";
}

function baseWebsite() {
    if (gutil.env.build === 'prod') {
        return "www.venuelytics.com";
    } else if (gutil.env.build === 'dev') {
        return "52.9.4.76";
    } 
    return "localhost:8000";
}

