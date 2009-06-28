var _windowWidth = 0;
var _windowHeight = 0;

function noop() { }

function CheckWindowSizeEx() {
    var _width = 0, _height = 0;
    if (typeof (window.parent.innerWidth) == 'number') {
        //Non-IE
        _width = window.parent.innerWidth;
        _height = window.parent.innerHeight;
    } else if (window.parent.document.documentElement && (window.parent.document.documentElement.clientWidth || window.parent.document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        _width = window.parent.document.documentElement.clientWidth;
        _height = window.parent.document.documentElement.clientHeight;
    } else if (window.parent.document.body && (window.parent.document.body.clientWidth || window.parent.document.body.clientHeight)) {
        //IE 4 compatible
        _width = window.parent.document.body.clientWidth;
        _height = window.parent.document.body.clientHeight;
    }
    _windowWidth = _width;
    _windowHeight = _height;
}




//When the document ready invoke intialize functions.
jQuery(document, window.parent.document).ready(function() {
    CheckWindowSizeEx();
});


//Windows manager settings
var windowManagerSettings = {
    loadingText: "Loading...",
    MaskCloseText: "Click to Close"
};

var activeWindowSettings = {
    activeWindow: null, //Active window instance - settings
    windowStatus: 0     //0:Default (defined size), 1:Maximized
};


var windows = [];

function UpdateWindowInstanceInQueue(instance) {
    for (var x = 0; x < windows.length; x++) {
        if (windows[x].windowname == instance.windowname) {
            windows[x] = instance;
        }
    }
}

function removeWindowInstanceFromQueue(windowInstance) {
    for (var i = 0; i < windows.length; i++) {
        if (windows[i] == windowInstance)
            windows.splice(i, 1);
    }
}

var activeZIndex = 100000;
function getZIndex() {
    activeZIndex += 1;
    return activeZIndex;
}


var windowManager = {
    returnValue: null,
    arguments: null,
    ShowModalDialog: function(url, windowname, arguments, properties, callback) {
        var wInstance = windowInstance;
        this.returnValue = null; //celar the return value parameter
        //Retrieve window width, height arguments from parameter
        this.InitCompleteCallback = null;
        this.arguments = arguments;
        var props = properties.split(';');
        for (var x = 0; x < props.length; x++) {
            if (props[x] != "") {
                var subprob = props[x].split(':');
                for (var s = 0; s < subprob.length; s++) {
                    switch (subprob[s]) {
                        case "dialogWidth":
                            wInstance.width = subprob[s + 1];
                            break;
                        case "dialogHeight":
                            wInstance.height = subprob[s + 1];
                            break;
                        case "dialogLeft":
                            wInstance.left = subprob[s + 1];
                            break;
                        case "dialogTop":
                            wInstance.top = subprob[s + 1];
                            break;
                    }
                }
            }
        }

        //Create new window instance and put to the windows queue
        wInstance.url = url;
        wInstance.windowname = windowname;
        var tid = windows.length + 1;
        wInstance.id = tid;
        wInstance.IsModal = true;
        wInstance.parentWindowName = window.name;
        wInstance.mask_elementid = "windowmanager-screen-mask-{0}".replace("{0}", tid);
        wInstance.window_elementid = "windowmanager-modal-container-header-{0}".replace("{0}", tid);
        wInstance.window_container_frame_id = "windowmanager-container-frame-{0}".replace("{0}", tid);

        wInstance.arguments = arguments;
        if (callback != undefined)
            wInstance.Callback = callback;
        if (this.InitCompleteCallback != undefined)
            wInstance.InitCompleteCallback = this.InitCompleteCallback;

        activeWindowSettings.activeWindow = wInstance;
        activeWindowSettings.windowStatus = 0;

        wInstance.CreateMaskForThisWindow();
        wInstance.CreateWindow();
        windows.push(wInstance);
        return wInstance;
    },

    ShowModelessDialog: function(url, windowname, arguments, properties, callback) {
        var wInstance = windowInstance;
        this.returnValue = null; //celar the return value parameter
        //Retrieve window width, height arguments from parameter
        this.InitCompleteCallback = null;
        this.arguments = arguments;
        var props = properties.split(';');
        for (var x = 0; x < props.length; x++) {
            if (props[x] != "") {
                var subprob = props[x].split(':');
                for (var s = 0; s < subprob.length; s++) {
                    switch (subprob[s]) {
                        case "dialogWidth":
                            wInstance.width = subprob[s + 1];
                            break;
                        case "dialogHeight":
                            wInstance.height = subprob[s + 1];
                            break;
                        case "dialogLeft":
                            wInstance.left = subprob[s + 1];
                            break;
                        case "dialogTop":
                            wInstance.top = subprob[s + 1];
                            break;
                    }
                }
            }
        }

        //Create new window instance and put to the windows queue
        wInstance.url = url;
        wInstance.windowname = windowname;
        var tid = windows.length + 1;
        wInstance.id = tid;
        wInstance.IsModal = false;
        wInstance.parentWindowName = window.name;
        wInstance.mask_elementid = "windowmanager-screen-mask-{0}".replace("{0}", tid);
        wInstance.window_elementid = "windowmanager-modal-container-header-{0}".replace("{0}", tid);
        wInstance.window_container_frame_id = "windowmanager-container-frame-{0}".replace("{0}", tid);

        wInstance.arguments = arguments;
        if (callback != undefined)
            wInstance.Callback = callback;
        if (this.InitCompleteCallback != undefined)
            wInstance.InitCompleteCallback = this.InitCompleteCallback;

        activeWindowSettings.activeWindow = wInstance;
        activeWindowSettings.windowStatus = 0;

        //wInstance.CreateMaskForThisWindow();
        wInstance.CreateWindow();
        windows.push(wInstance);
        return wInstance;
    },
    
    CloseWindow: function() {
        for (var x = 0; x < windows.length; x++) {
            if (windows[x].windowname == window.name) {
                windows[x].returnValue = windowManager.returnValue;
                windows[x].CloseWindow();
                removeWindowInstanceFromQueue(windows[x]);
            }
        }
    },

    GetWindow: function(windowName) {
        for (var x = 0; x < windows.length; x++) {
            if (windows[x].windowname == windowName) {
                return windows[x];
            }
        }
    },

    InvokeParent: function(args) {
        var currentWindow = windowManager.GetWindow(window.name);
        if (currentWindow.parentWindowName != "") {
            var parentWindow = windowManager.GetWindow(currentWindow.parentWindowName);
            if (typeof window.parent.document.getElementById(parentWindow.window_container_frame_id).contentWindow.Windowmanager_InvokeProxy == "function")
                window.parent.document.getElementById(parentWindow.window_container_frame_id).contentWindow.Windowmanager_InvokeProxy(activeWindowSettings.activeWindow, args);
        }
    }

}

var windowInstance = {
    id: 0,
    parentWindowName: null,
    mask_elementid: null,
    window_elementid: null,
    window_container_frame_id: null,
    url: null,
    windowname: null,
    description: null,
    width: 0,
    height: 0,
    top: 60,
    left: 200,
    IsModal: false,
    Callback: null,
    returnValue: null,
    arguments: null,
    //Create window mask and put to the page body
    CreateMaskForThisWindow: function() {

        //if it's modal
        if (activeWindowSettings.activeWindow.IsModal) {
            windowManagerSettings.MaskCloseText = "";
        }

        var template = "<div title='" + windowManagerSettings.MaskCloseText + "' id='{0}' class='windowmanager-screen-mask'></div>".replace("{0}", this.mask_elementid);
        jQuery("body", window.parent.document, window.parent.document).append(template);

        //alert("_windowWidth : " + _windowWidth + "- _windowHeight : " + _windowHeight);
        var zindex = getZIndex();
        jQuery("#" + this.mask_elementid, window.parent.document).css({
            "width": _windowWidth + "px",
            "height": _windowHeight + "px",
            "position": "fixed",
            "z-index": zindex
        });

        if (!activeWindowSettings.activeWindow.IsModal) {
            jQuery("#" + this.mask_elementid, window.parent.document).click(function() {
                activeWindowSettings.activeWindow.CloseWindow();
            });
        } else {
            jQuery("#" + this.mask_elementid, window.parent.document).css({ "cursor": "default" });
        }

    },



    CloseWindow: function() {
        jQuery("#" + this.window_elementid, window.parent.document).animate({
            height: "0px"
        }, 300, function() {
            jQuery(this).remove();
            jQuery("#" + activeWindowSettings.activeWindow.mask_elementid, window.parent.document).hide().remove();

            //Callback
            if (activeWindowSettings.activeWindow.Callback != null)
                activeWindowSettings.activeWindow.Callback.call(this, activeWindowSettings.activeWindow, activeWindowSettings.activeWindow.returnValue);
        });
    },

    WindowState: function() {
        return "Windows State Enum";
    },

    //Create window Instance and append to page
    CreateWindow: function() {

        var windowmanager_modal_container_id = this.window_elementid;
        //window_elementid = windowmanager_modal_container_id;
        var windowmanager_modal_container_header_id = "windowmanager-modal-container-header-{0}".replace("{0}", this.id);
        var windowmanager_container_subtitle_id = "windowmanager-container-subtitle-{0}".replace("{0}", this.id);
        var expandCollapse_element_id = "windowmanager-control-{0}".replace("{0}", this.id);
        var windowmanager_container_frame_id = this.window_container_frame_id;

        var windowTemplate = " " +
                    "<div id='{0}' class='windowmanager-modal-container'>" +

                        "<div style='padding:10px;height:50px;'>" +
                            "<div class='windowmanager-icon'>" + 
                                "<img alt='' src='css/images/docs_32.png'>" +
                            "</div>" +
                            "<div style='float:left;font-size:20px;'>" +
                                "<div>" +
                                    "{2}" +
                                "</div>" +
                                "<div id='{3}' class='windowmanager-container-subtitle'>" +
                                    "{4}" +
                                "</div>" +
                            "</div>" +
                            "<div style='float:right'>" +
                             "<a id='{5}' href='javascript:noop();'>" +
                                "<img border='0' alt='Maximize' src='css/images/window-header-plus.png' />" +
                              "</a>" +
                            "</div>" +
                        "</div>" +

		                        

		                        
		                    "<div>" +
			                    "<iframe frameborder='0' id='{6}' class='windowmanager-container-frame' src='{7}' style='height: 100%; width: 100%;'></iframe>" +
                           "</div>" +
	                "</div>";

        windowTemplate = windowTemplate.replace("{0}", windowmanager_modal_container_id);
        windowTemplate = windowTemplate.replace("{1}", windowmanager_modal_container_header_id);
        windowTemplate = windowTemplate.replace("{2}", this.windowname);
        windowTemplate = windowTemplate.replace("{3}", windowmanager_container_subtitle_id);
        windowTemplate = windowTemplate.replace("{4}", windowManagerSettings.loadingText);
        windowTemplate = windowTemplate.replace("{5}", expandCollapse_element_id);
        windowTemplate = windowTemplate.replace("{6}", windowmanager_container_frame_id);
        windowTemplate = windowTemplate.replace("{7}", this.url);


        jQuery("body", window.parent.document).append(windowTemplate);

        //set z-index value for active window
        var zindex = getZIndex();
        jQuery("#" + this.window_elementid, window.parent.document).css({
            "position": "fixed",
            "z-index": zindex,
            "display": "block",
            "left": this.left,
            "top": this.top,
            "color": "white",
            "overflow": "hidden",
            "width": this.width,
            "height": "60px"
        });

        //Set iframe height
        jQuery("#" + windowmanager_container_frame_id, window.parent.document).css({
            "height": this.height
        });



        //First load
        var w = this.width;
        var h = this.height;
        jQuery("#" + windowmanager_container_frame_id, window.parent.document).load(function() {
            jQuery("#" + windowmanager_modal_container_id, window.parent.document).stop().animate({
                height: h,
                width: w
            }, 300, function() {
                //When load completed
                jQuery("#" + windowmanager_container_subtitle_id, window.parent.document).text("");
                window.parent.document.getElementById(windowmanager_container_frame_id).contentWindow.windows = windows;
                window.parent.document.getElementById(windowmanager_container_frame_id).contentWindow.name = activeWindowSettings.activeWindow.windowname;
                //window.parent.document.getElementById(windowmanager_container_frame_id).contentWindow.activeWindowSettings = activeWindowSettings;
                window.parent.document.getElementById(windowmanager_container_frame_id).contentWindow.activeZIndex = activeZIndex;
                window.parent.document.getElementById(windowmanager_container_frame_id).contentWindow.focus();
                //Windowmanager_InitComplete event
                if (typeof window.parent.document.getElementById(windowmanager_container_frame_id).contentWindow.Windowmanager_InitComplete == "function")
                    window.parent.document.getElementById(windowmanager_container_frame_id).contentWindow.Windowmanager_InitComplete(activeWindowSettings.activeWindow, activeWindowSettings.activeWindow.arguments);
            });
        });


        //Check is this window modal ?
        if (!this.IsModal) {
            //Expand - collapse click on the window title bar.
            jQuery("#" + expandCollapse_element_id, window.parent.document).click(function() {
                if (activeWindowSettings.windowStatus == 0) { // mean : default size
                    jQuery("#" + windowmanager_container_frame_id, window.parent.document).css({
                        width: _windowWidth - 20 + "px",
                        height: _windowHeight - 20 + "px"
                    });
                    jQuery("#" + windowmanager_modal_container_id, window.parent.document).stop().animate({
                        width: _windowWidth - 20 + "px",
                        height: _windowHeight - 20 + "px",
                        top: "5px",
                        left: "5px"
                    }, 300, function() {
                        jQuery("#" + expandCollapse_element_id, window.parent.document).children().attr("src", "css/images/window-header-minus.png");
                        activeWindowSettings.windowStatus = 1;
                    });
                } else { // == 1 : mean maximized
                    jQuery("#" + windowmanager_modal_container_id, window.parent.document).stop().animate({
                        width: activeWindowSettings.activeWindow.width,
                        height: activeWindowSettings.activeWindow.height,
                        top: activeWindowSettings.activeWindow.top,
                        left: activeWindowSettings.activeWindow.left
                    }, 300, function() {
                        jQuery("#" + expandCollapse_element_id, window.parent.document).children().attr("src", "css/images/window-header-plus.png");
                        activeWindowSettings.windowStatus = 0;
                    });
                }
            });


            //Drag & Drop functionality
            //this.EnsureParentDragRemoved();
            //jQuery("#" + windowmanager_modal_container_header_id, window.parent.document).jqDrag();


            jQuery("#" + windowmanager_modal_container_header_id, window.parent.document).dblclick(function() {
                if (activeWindowSettings.windowStatus == 0) { // mean : default size
                    jQuery("#" + windowmanager_container_frame_id, window.parent.document).css({
                        width: _windowWidth - 20 + "px",
                        height: _windowHeight - 20 + "px"
                    });
                    jQuery("#" + windowmanager_modal_container_id, window.parent.document).stop().animate({
                        width: _windowWidth - 20 + "px",
                        height: _windowHeight - 20 + "px",
                        top: "5px",
                        left: "5px"
                    }, 300, function() {
                        jQuery("#" + expandCollapse_element_id, window.parent.document).children().attr("src", "css/images/window-header-minus.png");
                        activeWindowSettings.windowStatus = 1;
                    });
                } else { // == 1 : mean maximized
                    jQuery("#" + windowmanager_modal_container_id, window.parent.document).stop().animate({
                        width: activeWindowSettings.activeWindow.width,
                        height: activeWindowSettings.activeWindow.height,
                        top: activeWindowSettings.activeWindow.top,
                        left: activeWindowSettings.activeWindow.left
                    }, 300, function() {
                        jQuery("#" + expandCollapse_element_id, window.parent.document).children().attr("src", "css/images/window-header-plus.png");
                        activeWindowSettings.windowStatus = 0;
                    });
                }
            });



        } else {
            jQuery("#" + expandCollapse_element_id, window.parent.document).css({ "display": "none" });
        }

        UpdateWindowInstanceInQueue(this);
    },

    EnsureParentDragRemoved: function() {
        //        if (this.parentWindowName != "") {
        //            var parentWindow = windowManager.GetWindow(this.parentWindowName);
        //            jQuery("#" + parentWindow.window_elementid, window.parent.document).stop();
        //            
        //        }
    }
}

