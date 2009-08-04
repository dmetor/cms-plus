function noop(){
}


var HeaderManager = {
    menuState: 0, //default is closed
    InitManagementMenu: function() {


        $("#cmsplus-header-menu-wrapper #cmsplus-rootmenu-master")
        .hover(function() {
            $(this).find("h2").css("color","#fff");
        }, function() {
            $(this).find("h2").css("color", "#ccc");
        })
        .click(function() { 
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
        
        //set toolbar position background 
        var menuBackgroundTop, menuBackgroundLeft = 0;            
        $("#cmsplus-toolbarmenu")
            .find("li").click(function(){

            menuBackgroundTop = $(this).position().top;

            switch($(this).attr("id"))
            {
                case "edit":   
                    menuBackgroundLeft = $(this).position().left + 10;
                    break;
                case "widgets":
                    menuBackgroundLeft = $(this).position().left + 10;
                    break;
                case "theme":
                    menuBackgroundLeft = $(this).position().left + 10;
                    break;
                case "preview":
                    menuBackgroundLeft = $(this).position().left + 6;
                    break;
            }
            
            
            $(this).parent().find(".active-menuitem-background").animate({
                left:menuBackgroundLeft,
                top:menuBackgroundTop},
                        300, 
                            function(){
                                //do something when the animation completed
                        });
             
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