$(document).ready(function () {
    var menuItem = $('.sidebarMenu li'),
        menuItemLink = $('.sidebarMenu li a');

    $('.productFilters__selectFilters select').selectric();
    $('.selectSort').selectric();

    menuItem.each(function () {
       if($(this).children().length == 2){
           $(this).addClass('hasChildren')
       }
    });

    menuItemLink.click(function (e) {
        if($(this).parent().hasClass('hasChildren')){
            e.preventDefault();
            $(this).next().slideToggle();
            $(this).parent().toggleClass('active')
        }
    });
});
