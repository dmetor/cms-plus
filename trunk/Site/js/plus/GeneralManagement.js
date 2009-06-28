
var HeaderManager = {
    menuState: 0, //default is closed 
    InitManagementMenu: function() {
    $("#header-menu-logo_header-menu").click(function() {
        if (HeaderManager.menuState == 0) {
                $("#cmsplus-management-root-menu").slideDown(500);
                HeaderManager.menuState = 1;
            } else {
                $("#cmsplus-management-root-menu").slideUp(500);
                HeaderManager.menuState = 0;
            }
        });

        $("#cmsplus-management-root-menu .menuitems-wrapper .menuItem").hover(function() {
            $(this).css({ "background-color": "#362C23" });
        }, function() {
            $(this).css({ "background-color": "Transparent" });
        });
    }
}

