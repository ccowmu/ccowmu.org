var clamp = function (min, max, val) {
    return Math.max(Math.min(max, val), min);
};
/* Slide away landing header on scroll past banner. */
$(window).load(function () {
    update_landing_navbar = function () {
        content_top = $('#content').offset().top;
        navbar_height = $('#navbar').height();
        // Includes navbar height.
        header_height = $('#headerwrap').height();
        // Move the header up or down so that it never only the navbar ever
        // occludes any content.
        $('#headerwrap').css('top', clamp(navbar_height - header_height, 0,
                content_top - ($(this).scrollTop() + header_height)
                ));
    };
    $(window).scroll(update_landing_navbar);
    $(window).resize(update_landing_navbar);
});
