"use strict";
$(document).ready(function(){
    document.addEventListener('touchstart', function(){}, true);

    new WOW().init();

    $('.sb-site-container > .container').css('min-height', $(window).height() - $('.sb-site-container').height() + 'px');

    plyr.setup();

    $('.counter').counterUp({
        delay: 10,
        time: 2000,
    });

    $('.carousel').carousel({
        interval: 15000
    });
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    $('#status').fadeOut(); // will first fade out the loading animation
    $('#ms-preload').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('body').delay(350).css({'overflow':'visible'});

    var slidebar = new $.slidebars();


    $('.megamenu-col').matchHeight();
    $('.ms-footer-col').matchHeight();
    $('.hero-img-col').matchHeight();
    //$('.collapse').collapse();
    $.material.options.autofill = true;
    $.material.init();

    new SmoothScroll('a[href*="#"]', {
        // Selectors
        ignore: '[data-scroll-ignore]', // Selector for links to ignore (must be a valid CSS selector)
        header: null, // Selector for fixed headers (must be a valid CSS selector)

        // Speed & Easing
        speed: 500, // Integer. How fast to complete the scroll in milliseconds
        offset: 0, // Integer or Function returning an integer. How far to offset the scrolling anchor location in pixels
        easing: 'easeInOutCubic', // Easing pattern to use
        customEasing: function (time) {}, // Function. Custom easing pattern

        // Callback API
        before: function () {}, // Callback to run before scroll
        after: function () {} // Callback to run after scroll
    });

    var backTop = $('.btn-back-top');
    $(window).scroll(function() {
        if ($(this).scrollTop() > 400) {
            backTop.addClass('back-show');
        } else {
            backTop.removeClass('back-show');
        }
    });


    (function($) {
        $(function() {
            $(document).off('click.bs.tab.data-api', '[data-hover="tab"]');
            $(document).on('mouseenter.bs.tab.data-api', '[data-hover="tab"]', function() {
                $(this).tab('show');
            });
        });
    })(jQuery);

    var $container = $('.masonry-container');
    $container.imagesLoaded( function () {
        $container.masonry({
            columnWidth: '.masonry-item',
            itemSelector: '.masonry-item'
        });
    });

    $('.nav').on('click mousedown mouseup touchstart', 'a.has_children', function () {
        if ( $(this).next('ul').hasClass('open_t') && !$(this).parents('ul').hasClass('open_t')) {
            $('.open_t').removeClass('open_t');
            return false;
        }
        $('.open_t').not($(this).parents('ul')).removeClass('open_t');
        $(this).next('ul').addClass('open_t');
        return false;
    });
    $(document).on('click', ':not(.has_children, .has_children *)', function() {
        if( $('.open_t').length > 0 ) {
            $('.open_t').removeClass('open_t');
            $('.open_t').parent().removeClass('open');
            return false;
        }
    });

    var confOpen = false;

    $('.ms-conf-btn').click(function () {
        if (!confOpen) {
            confOpen = true;
            openConf();
        }
        else {
            confOpen = false;
            closeConf();
        }
    });
    $('.sb-site-container').click(function () {
        if (confOpen) {
            confOpen = false;
            closeConf();
        }
    });

    $('#datePicker').datepicker({
        orientation: 'bottom left',
        autoclose: true,
        todayHighlight: true
    });

    /* Change navbar with scroll */
    var navbar_selector = $('.ms-navbar');
    var navbar_nav_selector = $('.navbar-nav');
    var body_selector = $('body');

    var navbarFixed = $('.sb-site-container').hasClass('ms-nav-fixed');

    $(window).scroll(function() {
        if (!navbarFixed) {
            if ($(window).scrollTop() > 120) {
                navbar_selector.addClass('shrink');
                navbar_selector.addClass('navbar-fixed-top');
                navbar_selector.removeClass('navbar-static-top');
                navbar_nav_selector.addClass('navbar-right');
                body_selector.addClass('bd-scroll');
            }
            if ($(window).scrollTop() < 121) {
                navbar_selector.removeClass('shrink');
                navbar_selector.addClass('navbar-static-top');
                navbar_selector.removeClass('navbar-fixed-top');
                navbar_nav_selector.removeClass('navbar-right');
                body_selector.removeClass('bd-scroll');
            }
        }
    });
});

function openConf(op) {
    $('#ms-configurator').animate({
        'right': '0px'
    }, 400);
    $('.ms-configurator-btn').animate({
        'right': '-60px'
    }, 200);
}

function closeConf() {
    $('#ms-configurator').animate({
        'right': '-310px'
    }, 200);
    $('.ms-configurator-btn').animate({
        'right': '20px'
    }, 400);
}



(function ($) {
  $('.input-number .btn-circle:first-of-type').on('click', function() {
    $('.input-number input').val( parseInt($('.input-number input').val(), 10) - 1);
  });
  $('.input-number .btn-circle:last-of-type').on('click', function() {
    $('.input-number input').val( parseInt($('.input-number input').val(), 10) + 1);
  });
})(jQuery);