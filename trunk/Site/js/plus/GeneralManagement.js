function noop(){
}

var pageManagerStates = {
    activeMode: "preview"     
}





//Widgets management
//==================================================================================================
var WidgetOptions = {
    behaviour: {
        useCookies: true
    },
    effects: {
        effectDuration: 100,
        widgetShow: 'fade',
        widgetHide: 'slide',
        widgetClose: 'slide',
        widgetExtend: 'slide',
        widgetCollapse: 'slide',
        widgetOpenEdit: 'slide',
        widgetCloseEdit: 'slide',
        widgetCancelEdit: 'slide'
    },
    i18n: {
        editText: '<img src="css/images/edit.png" alt="Settings" width="16" height="16" />',
        closeText: '<img src="css/images/close.png" alt="Close" width="16" height="16" />',
        collapseText: '<img src="css/images/collapse.png" alt="Close" width="16" height="16" />',
        cancelEditText: '<img src="css/images/edit.png" alt="Settings" width="16" height="16" />',
        extendText: '<img src="css/images/extend.png" alt="Close" width="16" height="16" />'
    }
}

function EnableWidgets() {
        $.fn.EasyWidgets(WidgetOptions);
        $.fn.EnableEasyWidgets();
        
        /*  
        $(".widget").each(function() {
            $(this).css({ "border": "#AAACAD solid 3px" });
        });

        $(".widget-header").each(function() {
            $(this).css({ 'background-color': '#D4DFE2', 'border-bottom': ' 2px solid #454443' });
        });
        */
}

function DisableWidgets() {
    $.fn.DisableEasyWidgets();
    /*
    $(".widget").each(function() {
        $(this).css({ "border": "Transparent solid 3px" });
    });
    $(".widget-header").each(function() {
        $(this).css({ 'background-color': 'Transparent', 'border-bottom': ' 2px solid Transparent' });
    });
    */
}
//==================================================================================================




var HeaderManager = {
    menuState: 0, //default is closed
    InitManagementMenu: function() {

        $("#cmsplus-header-menu-wrapper #cmsplus-rootmenu-master")
        .hover(function() {
            $(this).find("h2").css("color", "#fff");
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
            .find("li").click(function() {

                menuBackgroundTop = $(this).position().top;

                switch ($(this).attr("id")) {
                    case "edit":
                        menuBackgroundLeft = $(this).position().left + 10;
                        pageManagerStates.activeMode = "edit";
                        break;
                    case "widgets":
                        menuBackgroundLeft = $(this).position().left + 10;
                        pageManagerStates.activeMode = "widgets";
                        break;
                    case "theme":
                        menuBackgroundLeft = $(this).position().left + 10;
                        pageManagerStates.activeMode = "theme";
                        break;
                    case "preview":
                        menuBackgroundLeft = $(this).position().left + 6;
                        pageManagerStates.activeMode = "preview";
                        break;
                }


                $(this).parent().find(".active-menuitem-background").animate({
                    left: menuBackgroundLeft,
                    top: menuBackgroundTop
                },
                        300,
                            function() {
                                debugger;
                                //do something when the animation completed
                                if (pageManagerStates.activeMode === "widgets") {
                                    //Activate widgets
                                    EnableWidgets();
                                } else {
                                    DisableWidgets();
                                }
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