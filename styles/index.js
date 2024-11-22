var hide_lists = function(cb) {
    $('#interests').fadeOut(300);
    $('#projects').fadeOut(300);
    $('#about').fadeOut(300);
    $('#interests-btn').removeClass('disabled');
    $('#projects-btn').removeClass('disabled')
    $('#about-btn').removeClass('disabled')
};
var show_projects = function() {
    $('#interests-btn').removeClass('disabled');
    $('#about-btn').removeClass('disabled');
    $('#interests').fadeOut(300, function() {
        $('#projects').fadeIn(300)
    });
    $('#about').fadeOut(300, function() {
        $('#projects').fadeIn(300)
    });
    $('#post-body').fadeOut(300, function() {
        $('#projects').fadeIn(300)
    });
    $('#projects-btn').addClass('disabled')
    
};
var show_about = function() {
    $('#interests-btn').removeClass('disabled');
    $('#projects-btn').removeClass('disabled');
    $('#interests').fadeOut(300, function() {
        $('#about').fadeIn(300)
    });
    $('#projects').fadeOut(300, function() {
        $('#about').fadeIn(300)
    });
    $('#post-body').fadeOut(300, function() {
        $('#about').fadeIn(300)
    });
    $('#about-btn').addClass('disabled')
};
var show_interests = function() {
    $('#projects-btn').removeClass('disabled');
    $('#about-btn').removeClass('disabled');
    $('#projects').fadeOut(function() {
        $('#interests').fadeIn(300)
    });
    $('#about').fadeOut(function() {
        $('#interests').fadeIn(300)
    });
    $('#post-body').fadeOut(300, function() {
        $('#interests').fadeIn(300)
    });
    $('#interests-btn').addClass('disabled')
};
