/* Fixed navbar on scroll. */
$(window).load(function () {
    navbar_fixed = $('#navbar').clone().addClass('navbar-fixed');
    update_navbar_fixed = function () {
        if ($(this).scrollTop() > $('#navbar').offset().top) {
            $('body').append(navbar_fixed);
        } else {
            navbar_fixed.remove();
        }
    };
    $(window).scroll(update_navbar_fixed);
    $(window).resize(update_navbar_fixed);
    update_navbar_fixed();
});
