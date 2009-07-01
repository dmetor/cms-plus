
var HeaderManager = {
    menuState: 0, //default is closed
    InitManagementMenu: function() {
        $("#cmsplus-rootmenu-master").hover(function() {
            $(this).find("h2").css("color","#fff");
        }, function() {
            $(this).find("h2").css("color", "#ccc");
        });
        $("#cmsplus-rootmenu-master").click(function() {
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

        $("#cmsplus-websites-panel .domainArea").hover(function() {
        $(this).css({ "color": "#831D1D" });
        }, function() {
            $(this).css({ "color": "#1F1914" });
        });

    }

}


var NotificationManager = {
    ShowProgress: function(message) {   
        $("#cmsplus-management-notification").stop().show().animate({
            top:"100px",
            right:"50px"
        },200);
    },
    
    HideProgress: function(){
        $("#cmsplus-management-notification").stop().animate({
            top:"90px",
            right:"10px"
        },200, function(){
            $(this).hide();
        });        
    }
}