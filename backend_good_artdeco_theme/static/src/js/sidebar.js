odoo.define('good_artdeco_theme.SidebarMenu', function (require) {
    "use strict";

    $(document).on("click", ".apps_toggle", function(event){
        $(".sidebar_menu").toggleClass('active');
        $(".apps_toggle").toggleClass('active');
    });

    $(document).on("click", ".sidebar a", function(event){
        var menu = $(".sidebar a");
        var $this = $(this);

        menu.removeClass("active");
        $this.addClass("active");
    });

    $(document).on("mouseenter", ".sidebar_panel .sidebar li", function(event){
        var menu = $(".sidebar");
        menu.addClass("active");
    });

    $(document).on("mouseleave", ".sidebar_panel .sidebar li", function(event){
        var menu = $(".sidebar");
        menu.removeClass("active");
    });

    $(document).on("mouseenter", ".breadcrumb-item", function(event){
        var menu = $("nav.o_main_navbar");
        menu.addClass("active");
    });

    $(document).on("mouseleave", ".breadcrumb-item", function(event){
        var menu = $("nav.o_main_navbar");
        menu.removeClass("active");
    });

    $(document).on("click", ".sidebar_panel .sidebar .sidebar_menu .parentmenu a", function(event){
        if ($('.apps_toggle').is(":visible"))
        {
            $(".sidebar_menu").toggleClass('active');
            $(".apps_toggle").toggleClass('active');
        }
    });

    $(document).on("click", ".header-sub-menus .nav-item a", function(event){
        var allMenus = $(".nav-link");
        allMenus.removeClass("active");

        var parent = this.closest('.header-sub-menus');
        var currMenu = parent.previousElementSibling.previousElementSibling;
        $(currMenu).addClass("active");
    });

    $(document).ready(()=> {
        let $modal = $(".modal-content");
        $modal.draggable({
            handle: ".modal-header",
        });
        $modal.resizable();
        _selectMenu();
    })

    function _selectMenu() {
        var hash = window.location.hash.substring(1);
        var params = hash.split('&').reduce(function (res, item) {
            var parts = item.split('=');
            res[parts[0]] = parts[1];
            return res;
        }, {});
        const action_id = params.action;
        if (action_id)
            setTimeout(() => {
                var allMenus = $(".nav-link");
                allMenus.removeClass("active");
                let found = false
                allMenus.each(function() {
                    if ($(this).data('action-id') == action_id) {
                        $(this).addClass("active");
                        $(this)[0].scrollIntoView();
                        found = true;
                        return;
                    }
                });

                if (!found) {
                    const allSubmenus = $('.header-sub-menus .nav-item a')
                    allSubmenus.removeClass("active");
                    allSubmenus.each(function() {
                        if ($(this).data('action-id') == action_id) {
                            $(this).parent().parent().parent().addClass("show")
                            $(this).addClass("active");

                            var parent = this.closest('.header-sub-menus');
                            var currMenu = parent.previousElementSibling.previousElementSibling;
                            $(currMenu).addClass("active");
                            $(currMenu)[0].scrollIntoView();

                            found = true;
                            return;
                        }
                    })
                }
            }, 1500)
    }
});