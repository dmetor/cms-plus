var D = YAHOO.util.Dom;
var E = YAHOO.util.Event;

Squarespace.EDITING_MODE_WYSIWYG = 1;
Squarespace.EDITING_MODE_RAW = 2;
Squarespace.EDITING_MODE_TEXTILE = 3;
Squarespace.EDITING_MODE_MARKDOWN = 4;

function switchEditingMode(C)
   {   var B = C;
    if (B == Squarespace.EDITOR_MODE)
       {       return;
       }
    var A = Squarespace.EDITOR_SWITCH_URL;
    if (A == null)
       {var A = String(document.location.href);
       }
    A = Squarespace.URL.adjustQueryParameter(A, "editingMode", B);
    if ( ! window.confirmPageExit || confirm("You are about to switch editing modes for this editing document.\n\nYou have unsaved changes.  These changes will be LOST if you leave this page\n\nPress OK to continue, or Cancel to stay on the current page."))
       {window.confirmPageExit = false;
        Squarespace.EDITOR_MODE = B;
        setTimeout(function()
           {document.location.href = A;
           }, 100);
       }
}

Squarespace.Constants.EDITOR_TOOLBAR_STANDARD =[{group: "insertitem", label: "Insert Item", buttons:[{type: "push", label: "Add", value: "ssaddtext", 
  disabled: true}, {type: "push", label: "Insert Link", value: "ssinsertlink", disabled: true}, {type: "push", label: "Insert Image", value: "ssinsertimage"}
  , {type: "push", label: "Insert Video", value: "ssinsertvideo"}, {type: "push", label: "Insert Code Block", value: "ssinsertcode"}]}, {group: "formatgroup", 
  label: "Format Text", buttons:[]}, {group: "textstyle", label: "Font Style", buttons:[{type: "push", label: "Bold CTRL + B", value: "bold"}, {type: "push", 
  label: "Italic CTRL + I", value: "italic"}, {type: "push", label: "Underline CTRL + U", value: "underline"}]}, {type: "separator"}, {group: "indentlist", 
  label: "Lists &amp; Indentation", buttons:[{type: "push", label: "Blockquote", value: "blockquote"}, {type: "push", label: "Unordered List", value: "insertunorderedlist"}
  , {type: "push", label: "Ordered List", value: "insertorderedlist"}, {type: "push", label: "Outdent", value: "outdent"}, {type: "push", 
  label: "Indent", value: "indent"}]}, {type: "separator"}, {group: "undoredo", label: "Undo/Redo", buttons:[{type: "push", label: "Undo CTRL + Z", value: "undo", 
  disabled: true}, {type: "push", label: "Redo CTRL + Y", value: "redo", disabled: true}]}, {type: "separator"}, {group: "misc", label: "Insert Item", 
  buttons:[{type: "push", label: "Define Excerpt", value: "ssdefineexcerpt"}, {type: "push", label: "Spellcheck", value: "ssspellcheck"}, {type: "push", label: "Edit HTML Source", 
  value: "sshtml"}]}, {group: "modegroup", label: "Editing Mode", buttons:[]}];
Squarespace.Constants.EDITOR_TOOLBAR_MINIMAL =[{group: "textstyle", label: "Font Style", buttons:[{type: "push", label: "Bold CTRL + B", 
  value: "bold"}, {type: "push", label: "Italic CTRL + I", value: "italic"}, {type: "push", label: "Underline CTRL + U", 
  value: "underline"}, {type: "push", label: "Strikethrough", value: "strikethrough"}, {type: "push", label: "Subscript", 
  value: "subscript"}, {type: "push", label: "Superscript", value: "superscript"}, {type: "push", label: "Remove Formatting", value: "removeformat"}]}, {type: "separator"}
  , {type: "separator"}, {group: "indentlist", label: "Lists &amp; Indentation", buttons:[{type: "push", label: "Blockquote", value: "blockquote"}, {type: "push", 
  label: "Unordered List", value: "insertunorderedlist"}, {type: "push", label: "Ordered List", value: "insertorderedlist"}]}, {type: "separator"}
  , {type: "separator"}, {group: "insertitem", label: "Insert Item", buttons:[{type: "push", label: "Insert Link", value: "ssinsertlink", disabled: true}, {type: "push", 
  label: "Insert Image", value: "ssinsertimage"}, {type: "push", label: "Insert Video", value: "ssinsertvideo"}]}];
Squarespace.TextEditor = 
{getContent: function()
   {
   return (document.getElementById("body").value);
   }
, setContent: function(A)
   {
   document.getElementById("body").value = A;
   }
, getSel: function()
   {var C = document.getElementById("body");
    if (document.selection)
       {return (document.selection.createRange().text);
       }
    else 
       {var B = C.textLength;
        var F = C.selectionStart;
        var A = C.selectionEnd;
       
        return (C.value.substring(F, A));
       }
   }
, setSel: function(G)
   {if (document.selection)
       {document.selection.createRange().text = G;
        return;
       }
    window.confirmPageExit = true;
    var C = document.getElementById("body");
    C.focus();
    var F = null, A = null, B = null;
    F = this.getSelStart();
    A = this.getSelEnd();
    B = C.scrollTop;
    if (document.selection)
       {document.selection.createRange().text = G;
       }
    else 
       {C.value = C.value.substring(0, C.selectionStart) + G + C.value.substr(C.selectionEnd, C.textLength);
       }
    if (F != null)
       {this.setSelectionPoints(F, F + G.length);
        if (B)
           {
           C.scrollTop = B;
           }
       }
   }
, wrapSel: function(B, H)
   {var F = document.getElementById("body");
    var G = null, A = null, C;
    G = this.getSelStart();
    A = this.getSelEnd();
    C = F.scrollTop;
    this.setSel(B + this.getSel() + H);
    if (G != null && G == A)
       {this.setSelectionPoints(G + B.length, G + B.length);
        if (C)
           {
           F.scrollTop = C;
           }
       }
   }
, setSelectionPoints: function(A, F)
   {var H = document.getElementById("body");
    if (document.selection)
       {H.focus();
        var J = document.selection.createRange();
        var B = J.duplicate();
        B.moveToElementText(document.getElementById("body"));
        B.collapse();
        var I = H.value;
        var C = 0, K = 0;
        for (var G = 0;G < I.length; ++ G)
           {if (G < A && (I.charAt(G) == "\n"))
               { ++ C;
               }
            if (G > A && G < F && (I.charAt(G) == "\n"))
               { ++ K;
               }
           }
        B.moveStart("character", (A - C));
        B.moveEnd("character", (F - A - K));
        B.select();
       }
    else 
       {H.selectionStart = A;
       
        H.selectionEnd = F;
       }
   }
, _calcEndpoints: function()
   {if (document.selection)
       {var C = document.getElementById("body");
        C.focus();
        var A = document.selection.createRange();
        var F = false;
        if (A.text.length == 0)
           {A.text = "x";
            A.moveStart("character", - 1);
            F = true;
           }
        var B = A.duplicate();
        B.moveToElementText(C);
        B.setEndPoint("EndToEnd", A);
        C.selectionStart = B.text.length - A.text.length;
        C.selectionEnd = C.selectionStart + A.text.length;
        if (F)
           {A.text = "";
           
            C.selectionEnd--;
           }
       }
   }
, getSelStart: function()
   {this._calcEndpoints();
   
    return document.getElementById("body").selectionStart;
   }
, getSelEnd: function()
   {this._calcEndpoints();
   
    return document.getElementById("body").selectionEnd;
   }
, getHTML: function(B, A)
   {
   return (this.preHtml + '<textarea tabindex="' + B + 
      '" name="body" id="body" style="width: 100%; height: 99%; font-family: Courier; font-size: 8pt; padding: 2px;">' + A.replace(new RegExp("\\&", "g"), 
      "&amp;").replace(new RegExp("\\<", "g"), "&lt;").replace(new RegExp("\\>", "g"), "&gt;") + "</textarea>" + this.postHtml);
   }
, saveSelection: function()
   {this.lastSelStart = this.getSelStart();
   
    this.lastSelEnd = this.getSelEnd();
   }
, restoreSelection: function()
   {if (this.lastSelStart != null && this.lastSelEnd != null)
       {this.setSelectionPoints(this.lastSelStart, this.lastSelEnd);
        this.lastSelStart = null;
       
        this.lastSelEnd = null;
       }
   }
, _onFileSelectionCompleted: function(B)
   {textEditor.restoreSelection();
    textEditor.editorToolbar.enableAllButtons();
    if (B.link != "" && ! B.link.endsWith("#"))
       {var A = '<a href="' + B.link + '"' + (B.newwindow ? ' target="_blank"': "") + (B.description ? ' title="' + B.description + 
          '"': "") + (B.offsiteindicator ? ' class="offsite-link-inline"': "") + ">";
        textEditor.wrapSel(A, "</a>");
       }
    else 
       {
       D.get("body").focus();
       }
   }
, _onImageSelectionCompleted: function(B)
   {textEditor.restoreSelection();
    textEditor.editorToolbar.enableAllButtons();
    if (B.src != "")
       {var A = '<span class="' + (B.thumbnailStyle ? "thumbnail-image-": "full-image-") + B.align + ' ssNonEditable"><span>' + 
          (B.linkUrl.length > 0 ? "<a" + (B.linkNewWindow ? ' target="_blank"': "") + ' href="' + B.linkUrl + '">': "") + "<img" + (B.previewWidth ? 
          ' style="width: ' + B.previewWidth + 'px;"': "") + ' src="' + Squarespace.URL.adjustQueryParameter(B.src, "__SQUARESPACE_CACHEVERSION", (new Date().getTime())) + 
          '" alt=""/>' + (B.linkUrl.length > 0 ? "</a>": "") + "</span>" + (B.caption.length > 0 ? '<span class="thumbnail-caption">' + B.caption + 
          "</span>": "") + "</span>";
       
        textEditor.setSel(A);
       }
   }
, _onImageSelectionAdjust: function(A){}, _construct: function()
   {textEditor = this;
    this.styleWrapperElement = (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_RAW ? "span": "div");
    this.editorToolbar = new YAHOO.widget.Toolbar("editorToolbar",  {collapse: false, titlebar: "Editor", draggable: false, buttonType: "advanced", buttons: (Squarespace.EDITOR_MINIMAL ? Squarespace.Constants.EDITOR_TOOLBAR_MINIMAL: Squarespace.Constants.EDITOR_TOOLBAR_STANDARD)}
      );
    this.editorToolbar.enableButton("ssinsertlink");
    this.editorToolbar.getButtonByValue("ssinsertvideo").setStyle("display", "none");
    this.editorToolbar.getButtonByValue("ssinsertcode").setStyle("display", "none");
    this.editorToolbar.getButtonByValue("indent").setStyle("display", "none");
    this.editorToolbar.getButtonByValue("outdent").setStyle("display", "none");
    if ( ! Squarespace.EDITOR_EXCERPT_BUTTON)
       {this.editorToolbar.getButtonByValue("ssdefineexcerpt").setStyle("display", "none");
       }
    this.editorToolbar.getButtonByValue("ssspellcheck").setStyle("display", "none");
    this.editorToolbar.getButtonByValue("sshtml").setStyle("display", "none");
    E.addListener("body", "click", function()
       {window.parent.Squarespace.FileSelector.accept(true);
        window.parent.Squarespace.ImageSelector.accept(true);
        textEditor.editorToolbar.getButtonByValue("ssmode")._menu.hide();
        textEditor.editorToolbar.getButtonByValue("ssformat")._menu.hide();
       });
    var C = 
    {type: "push", label: "", value: "ssmode", menu: function()
       {var G = new YAHOO.widget.Overlay("ssmode",  {effect:  {effect: YAHOO.widget.ContainerEffect.FADE, duration: 0.07}, 
          visible: false});
        var F = '<div class="ssoverlay">';
        F += '<div><a id="mode_wysiwyg" href="#">WYSIWYG</a></div>';
        F += '<div><a id="mode_html" href="#">Raw HTML</a></div>';
        F += '<div><a id="mode_textile" href="#">Textile</a></div>';
        F += '<div><a id="mode_markdown" href="#">Markdown</a></div>';
        F += "</div>";
        G.setBody( '<div id="modeMenu">' + F + "</div>");
       
        G.show = function()
           {G.cfg.setProperty("context",[textEditor.editorToolbar.getButtonByValue("ssmode").get("element"), "tl", "bl"]);
            textEditor.editorToolbar.getButtonByValue("ssformat")._menu.hide();
            G.element.style.visibility = "visible";
           };
       
        G.hide = function()
           {G.element.style.visibility = "hidden";
           };
        G.render(document.body);
        G.element.style.visibility = "hidden";
        return G;
       }
   ()};
    this.editorToolbar.addButtonToGroup(C, "modegroup");
    var B = D.getElementsByClassName("yui-toolbar-icon", "span", D.getElementsByClassName("yui-toolbar-ssmode", "span")[0])[0];
    switch (Squarespace.EDITOR_MODE)
       {case Squarespace.EDITING_MODE_RAW: 
            B.style.backgroundImage = "url('/universal/images/toolbar/html-button.png')";
            break;
        case Squarespace.EDITING_MODE_TEXTILE: 
            B.style.backgroundImage = "url('/universal/images/toolbar/textile-button.png')";
            break;
        case Squarespace.EDITING_MODE_MARKDOWN: 
            B.style.backgroundImage = "url('/universal/images/toolbar/markdown-button.png')";
            break;
        default: 
            break;
       }
    YAHOO.util.Event.onAvailable("modeMenu", function()
       {YAHOO.util.Event.on("modeMenu", "click", function(G)
           {var F = YAHOO.util.Event.getTarget(G);
            if (F.tagName.toLowerCase() == "a")
               {this.fireEvent("ssmodeClick",  {mode: F.id});
                this.getButtonByValue("ssmode")._menu.hide();
               }
            YAHOO.util.Event.stopEvent(G);
           }, textEditor.editorToolbar, true);
       });
    var A = 
    {type: "push", label: "", value: "ssformat", menu: function()
       {var G = new YAHOO.widget.Overlay("ssformat",  {effect:  {effect: YAHOO.widget.ContainerEffect.FADE, duration: 0.07}, visible: false}
          );
        var F = 
          '<div><a id="format_clear" href="#" onmouseover="javascript:textEditor.editorToolbar.hideFormatSubmenus()"><img src="/universal/images/toolbar/removeformat_inv.png"/><span style="padding-left: 10px" />Remove Formatting</a></div>';
        F += '<div class="ssoverlay-separator">&nbsp;</div>';
        F += 
          '<div><a id="fontsize_menu" class="ssoverlay-text" href="#" onmouseover="javascript:textEditor.editorToolbar.fontsizemenu.show();">Font Size<span class="ssoverlay-arrow">></span></a></div>';
        F += 
          '<div><a id="align_menu" class="ssoverlay-text" href="#" onmouseover="javascript:textEditor.editorToolbar.alignmentmenu.show();">Text Alignment<span class="ssoverlay-arrow">></span></a></div>';
        F += 
          '<div><a id="heading_menu" class="ssoverlay-text" href="#" onmouseover="javascript:textEditor.editorToolbar.headingmenu.show();">Heading<span class="ssoverlay-arrow">></span></a></div>';
        F += '<div class="ssoverlay-separator">&nbsp;</div>';
        F += 
          '<div><a id="format_strike" href="#" onmouseover="javascript:textEditor.editorToolbar.hideFormatSubmenus()"><img src="/universal/images/toolbar/strikethrough_inv.png"/><span style="padding-left: 10px" />Strikeout</a></div>';
        F += 
          '<div><a id="format_super" href="#" onmouseover="javascript:textEditor.editorToolbar.hideFormatSubmenus()"><img src="/universal/images/toolbar/superscript_inv.png"/><span style="padding-left: 10px" />Superscript</a></div>';
        F += 
          '<div><a id="format_sub" href="#" onmouseover="javascript:textEditor.editorToolbar.hideFormatSubmenus()"><img src="/universal/images/toolbar/subscript_inv.png"/><span style="padding-left: 10px" />Subscript</a></div>';
        G.setBody( '<div id="formatMenu" class="ssoverlay">' + F + "</div>");
       
        G.show = function()
           {G.cfg.setProperty("context",[textEditor.editorToolbar.getButtonByValue("ssformat").get("element"), "tl", "bl"]);
            textEditor.editorToolbar.getButtonByValue("ssmode")._menu.hide();
            G.element.style.visibility = "visible";
           };
       
        G.hide = function()
           {textEditor.editorToolbar.hideFormatSubmenus();
            G.element.style.visibility = "hidden";
           };
        G.render(document.body);
        G.element.style.visibility = "hidden";
        return G;
       }
   ()};
    this.editorToolbar.addButtonToGroup(A, "formatgroup");
    YAHOO.util.Event.onAvailable("formatMenu", function()
       {       YAHOO.util.Event.on("formatMenu", "click", function(G)
           {           var F = YAHOO.util.Event.getTarget(G);
            F = (F.tagName == "A" ? F: D.getAncestorByTagName(F, "A"));
            if (F && F.tagName.toLowerCase() == "a")
               {if (F.id != "fontsize_menu" && F.id != "align_menu" && F.id != "heading_menu")
                   {this.fireEvent("ssformatClick",  {formatType: F.id});
                    this.getButtonByValue("ssformat")._menu.hide();
                   }
               }
            YAHOO.util.Event.stopEvent(G);
           }, textEditor.editorToolbar, true);
       });
    this.editorToolbar.fontsizemenu = new YAHOO.widget.Overlay("ssfontsize",  {effect:  {effect: YAHOO.widget.ContainerEffect.FADE, duration: 0.07}, visible: false});
    this.editorToolbar.fontsizemenu.setBody( '<div id="fontsizeMenu" class="ssoverlay ssoverlay-submenu">' + '<div><a id="format_50" href="#">50%</a></div>' + 
      '<div><a id="format_60" href="#">60%</a></div>' + '<div><a id="format_70" href="#">70%</a></div>' + '<div><a id="format_80" href="#">80%</a></div>' + 
      '<div><a id="format_90" href="#">90%</a></div>' + '<div><a id="format_100" href="#">100%</a></div>' + '<div><a id="format_110" href="#">110%</a></div>' + 
      '<div><a id="format_120" href="#">120%</a></div>' + '<div><a id="format_130" href="#">130%</a></div>' + '<div><a id="format_140" href="#">140%</a></div>' + 
      '<div><a id="format_150" href="#">150%</a></div>' + '<div><a id="format_200" href="#">200%</a></div>' + '<div><a id="format_250" href="#">250%</a></div>' + 
      '<div><a id="format_300" href="#">300%</a></div>' + '<div><a id="format_350" href="#">350%</a></div>' + '<div><a id="format_400" href="#">400%</a></div>' + 
      "</div>");
   
    this.editorToolbar.fontsizemenu.show = function()
       {if (textEditor.editorToolbar.fontsizemenu.element.style.visibility == "hidden")
           {textEditor.editorToolbar.fontsizemenu.cfg.setProperty("context",[D.get("formatMenu"), "tl", "tr"]);
            textEditor.editorToolbar.hideFormatSubmenus("fontsizeMenu");
            textEditor.editorToolbar.fontsizemenu.element.style.visibility = "visible";
           }
       };
   
    this.editorToolbar.fontsizemenu.hide = function()
       {if (textEditor.editorToolbar.fontsizemenu.element.style.visibility == "visible")
           {textEditor.editorToolbar.fontsizemenu.element.style.visibility = "hidden";
           }
       };
    this.editorToolbar.fontsizemenu.render(document.body);
    this.editorToolbar.fontsizemenu.element.style.visibility = "hidden";
    YAHOO.util.Event.onAvailable("fontsizeMenu", function()
       {YAHOO.util.Event.on("fontsizeMenu", "click", function(G)
           {var F = YAHOO.util.Event.getTarget(G);
            F = (F.tagName == "A" ? F: D.getAncestorByTagName(F, "A"));
            if (F && F.tagName == "A")
               {this.fireEvent("ssformatClick",  {formatType: F.id});
                this.getButtonByValue("ssformat")._menu.hide();
               }
            YAHOO.util.Event.stopEvent(G);
           }, textEditor.editorToolbar, true);
       });
    this.editorToolbar.alignmentmenu = new YAHOO.widget.Overlay("ssalignment",  {effect:  {effect: YAHOO.widget.ContainerEffect.FADE, duration: 0.07}, visible: false});
    this.editorToolbar.alignmentmenu.setBody( '<div id="alignmentMenu" class="ssoverlay ssoverlay-submenu">' + 
      '<div><a id="format_left" href="#"><img src="/universal/images/toolbar/justifyleft_inv.png"/><span style="padding-left: 10px" />Left</a></div>' + 
      '<div><a id="format_center" href="#"><img src="/universal/images/toolbar/justifycenter_inv.png"/><span style="padding-left: 10px" />Center</a></div>' + 
      '<div><a id="format_right" href="#"><img src="/universal/images/toolbar/justifyright_inv.png"/><span style="padding-left: 10px" />Right</a></div>' + 
      '<div><a id="format_full" href="#"><img src="/universal/images/toolbar/justifyfull_inv.png"/><span style="padding-left: 10px" />Full</a></div>' + 
      "</div>");
   
    this.editorToolbar.alignmentmenu.show = function()
       {if (textEditor.editorToolbar.alignmentmenu.element.style.visibility == "hidden")
           {textEditor.editorToolbar.alignmentmenu.cfg.setProperty("context",[D.get("formatMenu"), "tl", "tr"]);
            textEditor.editorToolbar.hideFormatSubmenus("alignmentMenu");
            textEditor.editorToolbar.alignmentmenu.element.style.visibility = "visible";
           }
       };
   
    this.editorToolbar.alignmentmenu.hide = function()
       {if (textEditor.editorToolbar.alignmentmenu.element.style.visibility == "visible")
           {textEditor.editorToolbar.alignmentmenu.element.style.visibility = "hidden";
           }
       };
    this.editorToolbar.alignmentmenu.render(document.body);
    this.editorToolbar.alignmentmenu.element.style.visibility = "hidden";
    YAHOO.util.Event.onAvailable("alignmentMenu", function()
       {YAHOO.util.Event.on("alignmentMenu", "click", function(G)
           {var F = YAHOO.util.Event.getTarget(G);
            F = (F.tagName == "A" ? F: D.getAncestorByTagName(F, "A"));
            if (F && F.tagName == "A")
               {this.fireEvent("ssformatClick",  {formatType: F.id});
                this.getButtonByValue("ssformat")._menu.hide();
               }
            YAHOO.util.Event.stopEvent(G);
           }, textEditor.editorToolbar, true);
       });
    this.editorToolbar.headingmenu = new YAHOO.widget.Overlay("ssheading",  {effect:  {effect: YAHOO.widget.ContainerEffect.FADE, duration: 0.07}, 
      visible: false});
    this.editorToolbar.headingmenu.setBody( '<div id="headingMenu" class="ssoverlay ssoverlay-submenu">' + 
      '<div><a id="format_h2" href="#"><img src="/universal/images/toolbar/h2.png"/><span style="padding-left: 10px" />Heading (H2)</a></div>' + 
      '<div><a id="format_h3" href="#"><img src="/universal/images/toolbar/h3.png"/><span style="padding-left: 10px" />Heading (H3)</a></div>' + 
      '<div><a id="format_h4" href="#"><img src="/universal/images/toolbar/h4.png"/><span style="padding-left: 10px" />Heading (H4)</a></div>' + 
      '<div><a id="format_h5" href="#"><img src="/universal/images/toolbar/h5.png"/><span style="padding-left: 10px" />Heading (H5)</a></div>' + 
      '<div><a id="format_h6" href="#"><img src="/universal/images/toolbar/h6.png"/><span style="padding-left: 10px" />Heading (H6)</a></div>' + 
      "</div>");
   
    this.editorToolbar.headingmenu.show = function()
       {if (textEditor.editorToolbar.headingmenu.element.style.visibility == "hidden")
           {textEditor.editorToolbar.headingmenu.cfg.setProperty("context",[D.get("formatMenu"), "tl", "tr"]);
            textEditor.editorToolbar.hideFormatSubmenus("headingMenu");
            textEditor.editorToolbar.headingmenu.element.style.visibility = "visible";
           }
       };
   
    this.editorToolbar.headingmenu.hide = function()
       {       if (textEditor.editorToolbar.headingmenu.element.style.visibility == "visible")
           {           textEditor.editorToolbar.headingmenu.element.style.visibility = "hidden";
           }
       };
    this.editorToolbar.headingmenu.render(document.body);
    this.editorToolbar.headingmenu.element.style.visibility = "hidden";
    YAHOO.util.Event.onAvailable("headingMenu", function()
       {YAHOO.util.Event.on("headingMenu", "click", function(G)
           {var F = YAHOO.util.Event.getTarget(G);
            F = (F.tagName == "A" ? F: D.getAncestorByTagName(F, "A"));
            if (F && F.tagName == "A")
               {this.fireEvent("ssformatClick",  {formatType: F.id});
                this.getButtonByValue("ssformat")._menu.hide();
               }
            YAHOO.util.Event.stopEvent(G);
           }, textEditor.editorToolbar, true);
       });
   
    this.editorToolbar.hideFormatSubmenus = function(F)
       {if (F != "fontsizeMenu" && textEditor.editorToolbar.fontsizemenu.element.style.visibility == "visible")
           {textEditor.editorToolbar.fontsizemenu.hide();
           }
        if (F != "alignmentMenu" && textEditor.editorToolbar.alignmentmenu.element.style.visibility == "visible")
           {textEditor.editorToolbar.alignmentmenu.hide();
           }
        if (F != "headingMenu" && textEditor.editorToolbar.headingmenu.element.style.visibility == "visible")
           {textEditor.editorToolbar.headingmenu.hide();
           }
       };
    this.editorToolbar.on("ssmodeClick", function(F)
       {var G = (F.mode ? F.mode: "");
        switch (G)
           {case "mode_wysiwyg": 
                switchEditingMode(Squarespace.EDITING_MODE_WYSIWYG);
                break;
            case "mode_html": 
                switchEditingMode(Squarespace.EDITING_MODE_RAW);
                break;
            case "mode_textile": 
                switchEditingMode(Squarespace.EDITING_MODE_TEXTILE);
                break;
            case "mode_markdown": 
                switchEditingMode(Squarespace.EDITING_MODE_MARKDOWN);
                break;
            default: 
                break;
           }
       }, null, true);
    this.editorToolbar.on("undoClick", function(G)
       {var F = textEditor.undoRedo.getUndo();
        textEditor.setContent(F);
        this.enableButton("redo");
        if ( ! this.hasUndo())
           {this.disableButton("undo");
           }
       }, textEditor.editorToolbar, true);
    this.editorToolbar.on("redoClick", function(G)
       {var F = textEditor.undoRedo.getRedo();
        textEditor.setContent(F);
        textEditor.editorToolbar.enableButton("undo");
        if ( ! textEditor.undoRedo.hasRedo())
           {textEditor.editorToolbar.disableButton("redo");
           }
       }, null, true);
    this.editorToolbar.on("ssformatClick", function(F)
       {if (F.formatType)
           {var G = F.formatType;
            this.format(G);
           }
       }, textEditor, true);
   
    textEditor.format = function(F)
       {switch (F)
           {case "format_clear": 
                textEditor.setSel(textEditor.getSel().replace(new RegExp( "<[^>]*>", "g"), ""));
                break;
            case "format_h6": 
                textEditor.wrapSel( "<h6>", "</h6>");
                break;
            case "format_h5": 
                textEditor.wrapSel( "<h5>", "</h5>");
                break;
            case "format_h4": 
                textEditor.wrapSel( "<h4>", "</h4>");
                break;
            case "format_h3": 
                textEditor.wrapSel( "<h3>", "</h3>");
                break;
            case "format_h2": 
                textEditor.wrapSel( "<h2>", "</h2>");
                break;
            case "format_h1": 
                textEditor.wrapSel( "<h1>", "</h1>");
                break;
            case "format_strike": 
                if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_TEXTILE)
                   {textEditor.wrapSel( "-", "-");
                   }
                else 
                   {textEditor.wrapSel( "<strike>", "</strike>");
                   }
                break;
            case "format_super": 
                textEditor.wrapSel( "<sup>", "</sup>");
                break;
            case "format_sub": 
                textEditor.wrapSel( "<sub>", "</sub>");
                break;
            case "format_50": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="font-size: 50%;">', "</" + 
                  textEditor.styleWrapperElement + ">");
                break;
            case "format_60": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="font-size: 60%;">', "</" + 
                  textEditor.styleWrapperElement + ">");
                break;
            case "format_70": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="font-size: 70%;">', "</" + textEditor.styleWrapperElement + 
                  ">");
                break;
            case "format_80": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="font-size: 80%;">', "</" + 
                  textEditor.styleWrapperElement + ">");
                break;
            case "format_90": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="font-size: 90%;">', "</" + textEditor.styleWrapperElement + ">");
                break;
            case "format_100": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="font-size: 100%;">', "</" + textEditor.styleWrapperElement + 
                  ">");
                break;
            case "format_110": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="font-size: 110%;">', "</" + 
                  textEditor.styleWrapperElement + ">");
                break;
            case "format_120": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="font-size: 120%;">', "</" + textEditor.styleWrapperElement + ">");
                break;
            case "format_130": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="font-size: 130%;">', "</" + 
                  textEditor.styleWrapperElement + ">");
                break;
            case "format_140": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="font-size: 140%;">', "</" + 
                  textEditor.styleWrapperElement + ">");
                break;
            case "format_150": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="font-size: 150%;">', "</" + textEditor.styleWrapperElement + ">");
                break;
            case "format_200": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="font-size: 200%;">', "</" + 
                  textEditor.styleWrapperElement + ">");
                break;
            case "format_250": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="font-size: 250%;">', "</" + 
                  textEditor.styleWrapperElement + ">");
                break;
            case "format_300": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="font-size: 300%;">', "</" + textEditor.styleWrapperElement + 
                  ">");
                break;
            case "format_350": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="font-size: 350%;">', "</" + 
                  textEditor.styleWrapperElement + ">");
                break;
            case "format_400": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="font-size: 400%;">', "</" + textEditor.styleWrapperElement + ">");
                break;
            case "format_left": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="text-align: left;">', "</" + 
                  textEditor.styleWrapperElement + ">");
                break;
            case "format_center": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="text-align: center;">', "</" + 
                  textEditor.styleWrapperElement + ">");
                break;
            case "format_right": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="text-align: right;">', "</" + textEditor.styleWrapperElement + 
                  ">");
                break;
            case "format_full": 
                textEditor.wrapSel( "<" + textEditor.styleWrapperElement + ' style="text-align: justify;">', "</" + 
                  textEditor.styleWrapperElement + ">");
                break;
            default: 
                break;
           }
       };
   
    this.editorToolbar.on("boldClick", function(F)
       {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_RAW)
           {textEditor.wrapSel( "<strong>", "</strong>");
           }
        else 
           {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_TEXTILE)
               {textEditor.wrapSel( "*", "*");
               }
            else 
               {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_MARKDOWN)
                   {textEditor.wrapSel( "**", "**");
                   }
               }
           }
       }, null, true);
    
    this.editorToolbar.on("italicClick", function(F)
       {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_RAW)
           {textEditor.wrapSel( "<em>", "</em>");
           }
        else 
           {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_TEXTILE)
               {textEditor.wrapSel("_", "_");
               }
            else 
               {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_MARKDOWN)
                   {textEditor.wrapSel("_", "_");
                   }
               }
           }
       }, null, true);
    this.editorToolbar.on("underlineClick", function(F)
       {textEditor.wrapSel( "<u>", "</u>");
       }, null, true);
    this.editorToolbar.on("helpClick", function(G)
       {var F;
        if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_RAW)
           {F = "html";
           }
        else 
           {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_TEXTILE)
               {F = "textile";
               }
            else 
               {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_MARKDOWN)
                   {F = "markdown";
                   }
               }
           }
        w = window.open( "/display/ShowHelp?section=" + F, "HTMLHelp_" + F, 
          "width=400,height=550,scrollbars=yes,resizable=yes,titlebar=yes,menubar=no,toolbar=no");
        if ( ! w)
           {alert(Squarespace.Constants.POPUPS_DISABLED_MESSAGE);
           }
       }, null, true);
    this.editorToolbar.on("justifyleftClick", function(F)
       {this.format("format_left");
       }, textEditor, true);
    this.editorToolbar.on("justifycenterClick", function(F)
       {this.format("format_center");
       }, textEditor, true);
    this.editorToolbar.on("justifyrightClick", function(F)
       {this.format("format_right");
       }, textEditor, true);
    this.editorToolbar.on("justifyfullClick", function(F)
       {this.format("format_full");
       }, textEditor, true);
    this.editorToolbar.on("blockquoteClick", function(F)
       {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_RAW)
           {textEditor.wrapSel( "<blockquote>", "</blockquote>");
           }
        else 
           {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_TEXTILE)
               {textEditor.wrapSel("bq. ", "");
               }
            else 
               {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_MARKDOWN)
                   {textEditor.wrapSel( "> ", "");
                   }
               }
           }
       }, null, true);
    this.editorToolbar.on("insertorderedlistClick", function(F)
       {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_RAW)
           {textEditor.wrapSel("\n<ol>\n  <li>", "</li>\n</ol>\n");
           }
        else 
           {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_TEXTILE)
               {textEditor.wrapSel("\n# ", "\n");
               }
            else 
               {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_MARKDOWN)
                   {textEditor.wrapSel("\n1. ", "\n");
                   }
               }
           }
       }, null, true);
    this.editorToolbar.on("insertunorderedlistClick", function(F)
       {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_RAW)
           {textEditor.wrapSel("\n<ul>\n  <li>", "</li>\n</ul>\n");
           }
        else 
           {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_TEXTILE)
               {textEditor.wrapSel("\n* ", "\n");
               }
            else 
               {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_MARKDOWN)
                   {textEditor.wrapSel("\n* ", "\n");
                   }
               }
           }
       }, null, true);
    this.editorToolbar.on("ssinsertlinkClick", function(F)
       {this.saveSelection();
        this.editorToolbar.disableAllButtons();
        window.parent.Squarespace.FileSelector.show( {title: "Create Link", visibleSelectors:["external", "file", "page", 
          "upload", "extended"], data:  {link: "", description: "", newwindow: false, offsiteindicator: false}, actions:  {onAccept: textEditor._onFileSelectionCompleted, 
          onCancel: textEditor._onFileSelectionCompleted}});
       }, textEditor, true);
    this.editorToolbar.on("ssinsertimageClick", function(F)
       {this.saveSelection();
        this.editorToolbar.disableAllButtons();
        window.parent.Squarespace.ImageSelector.show( {title: "Insert Image", visibleSelectors:["image", "upload", 
          "external", "resize", "align", "link"], data:  {src: "", previewWidth: "", thumbnailStyle: false, align: "block", 
          caption: "", linkUrl: "", linkNewWindow: false, initialSelector: "image", captionRefresh: true, linkRefresh: false}, actions:  {onChange: textEditor._onImageSelectionAdjust, 
          onAccept: textEditor._onImageSelectionCompleted, onCancel: textEditor._onImageSelectionCompleted}});
       }, textEditor, true);
    this.editorToolbar.on("ssdefineexcerptClick", function(G)
       {var F = textEditor.getSel();
        if (F.length > 0)
           {showDialogNotice("Excerpt Set", 
              "You have set an excerpt for this entry, which can be viewed or removed from the Details &amp; Timed Actions tab of this editor.");
           }
        else 
           {showDialogNotice("Excerpt Cleared", "You have removed the excerpt for this entry.");
           }
        document.dataform.excerpt.value = F;
       }, this, true);
    setTimeout(function()
       {var F = window.parent.document.getElementById("configuration-container-footer-buttons");
        D.setStyle(F, "visibility", "visible");
        F.removeAttribute("style");
        D.get("yui-gen0").innerHTML = "add:";
        D.removeClass("yui-gen0", "yui-button-disabled");
        D.removeClass("yui-gen0", "yui-push-button-disabled");
       
        D.removeClass("yui-gen0", "yui-toolbar-ssaddtext");
       }, 150);
   }
, save: function(A)
   {if ( ! A)
       {D.setStyle(window.parent.document.getElementById("configuration-container-footer-buttons"), "visibility", 
          "hidden");
       }
    this.onSave();
   
    window.confirmPageExit = false;
   }
, onSave: function(){}, render: function()
   {window.parent.Squarespace.prepareDialogs(["FileSelector", "ImageSelector", "CodeEditor"]);
    this._construct();
    textEditor = this;
    enableUnloadChecking();
    if ( ! Squarespace.EDITOR_MINIMAL)
       {tray.enableResizing();
        this.align();
       }
    textEditor.undoRedo = new UndoRedo();
    this.undoRedo.addUndoLevel(this.getContent());
    this.undoRedo.undoInterval = setInterval(function()
       {if (textEditor.undoRedo.addUndoLevel(textEditor.getContent()))
           {textEditor.editorToolbar.enableButton("undo");
           
            textEditor.editorToolbar.disableButton("redo");
           }
       }, 3000);
   }
, align: function()
   {if (Squarespace.EDITOR_MINIMAL)
       {return;
       }
    var B = tray.currentHeight - Squarespace.EDITOR_TOOL_BUFFER;
    var A = Squarespace.EDITOR_EXCERPT_BUTTON ? 165: 65;
   
    setEditorHeight(B, A);
   }
, toggleToolbar: function(){}, focus: function()
   {
   document.getElementById("body").focus();
   }
, initializeTabFocus: function(){}, setExcerptButtonVisible: function(A){}};
Squarespace.WysiwygEditor = 
{save: function(A)
   {if ( ! A)
       {D.setStyle(window.parent.document.getElementById("configuration-container-footer-buttons"), "visibility", "hidden");
       }
    wysiwygEditor.saveHTML();
    this.onSave();
   
    window.confirmPageExit = false;
   }
, setContent: function(A)
   {if (wysiwygEditor.dom)
       {
       wysiwygEditor.dom.setHTML(wysiwygEditor.getBody(), A);
       }
   }
, onSave: function(){}, render: function()
   {var A = window.parent.document.getElementById("configuration-container-footer-buttons");
    D.setStyle(A, "visibility", "hidden");
    window.parent.Squarespace.prepareDialogs(["FileSelector", "ImageSelector", "CodeEditor"]);
    setTimeout(function()
       {Squarespace.WysiwygEditor._construct();
       }, 100);
    enableUnloadChecking();
    if ( ! Squarespace.EDITOR_MINIMAL)
       {tray.enableResizing();
       
        this.align();
       }
   }
, align: function()
   {if (Squarespace.EDITOR_MINIMAL)
       {return;
       }
    var B = tray.currentHeight - Squarespace.EDITOR_TOOL_BUFFER;
    if (D.get("topToolbarRow") != null)
       {B += 20;
       }
    var A = Squarespace.EDITOR_EXCERPT_BUTTON ? 165: 65;
   
    setEditorHeight(B, A);
   }
, toggleToolbar: function()
   {if (Squarespace.EDITOR_MINIMAL)
       {wysiwygEditor.toolbar.getButtonByValue("ssmode").setStyle("display", "block");
        wysiwygEditor.toolbar.getButtonByValue("undo").setStyle("display", "block");
        wysiwygEditor.toolbar.getButtonByValue("redo").setStyle("display", "block");
        wysiwygEditor.toolbar.getButtonByValue("ssspellcheck").setStyle("display", "block");
        if (Squarespace.EDITOR_EXCERPT_BUTTON)
           {wysiwygEditor.toolbar.getButtonByValue("ssdefineexcerpt").setStyle("display", "block");
           }
        Squarespace.EDITOR_MINIMAL = false;
       }
    else 
       {wysiwygEditor.toolbar.getButtonByValue("ssmode").setStyle("display", "none");
        wysiwygEditor.toolbar.getButtonByValue("undo").setStyle("display", "none");
        wysiwygEditor.toolbar.getButtonByValue("redo").setStyle("display", "none");
        wysiwygEditor.toolbar.getButtonByValue("ssspellcheck").setStyle("display", "none");
        if (Squarespace.EDITOR_EXCERPT_BUTTON)
           {wysiwygEditor.toolbar.getButtonByValue("ssdefineexcerpt").setStyle("display", "none");
           }
       
        Squarespace.EDITOR_MINIMAL = true;
       }
   }
, focus: function()
   {
   wysiwygEditor.focus();
   }
, initializeTabFocus: function(A)
   {
   wysiwygEditor.initializeTabFocus(A);
   }
, setExcerptButtonVisible: function(A)
   {if (A)
       {wysiwygEditor.toolbar.getButtonByValue("ssdefineexcerpt").setStyle("display", "block");
       }
    else 
       {
       wysiwygEditor.toolbar.getButtonByValue("ssdefineexcerpt").setStyle("display", "none");
       }
   }
, _construct: function()
   {wysiwygEditor = null;
    var Q = "body";
    var H = null;
    var T = "ss_temp_url";
    var O = 0;
    var S = {};
    tinyMCE.init(
    {mode: "exact", elements: Q, editor_css: "/universal/styles/editor-ui.css", content_css: "/universal/styles/editor-content.css", 
      theme: "advanced", theme_advanced_toolbar_location: "top", theme_advanced_toolbar_align: "left", 
      theme_advanced_buttons1: "", theme_advanced_buttons2: "", theme_advanced_buttons3: "", theme_advanced_statusbar_location: "bottom", 
      theme_advanced_path: true, custom_undo_redo_levels: 30, custom_undo_redo_restore_selection: false, noneditable_noneditable_class: "ssNonEditable", 
      tab_focus: "null,null", convert_urls: false, spellchecker_languages: "+English=en", spellchecker_rpc_url: "/process/admin/CheckSpelling", paste_create_paragraphs: true, 
      paste_create_linebreaks: false, paste_use_dialog: false, paste_as_plain_text: false, paste_convert_middot_lists: true, 
      paste_unindented_list_class: "unindentedList", paste_convert_headers_to_strong: false, paste_remove_spans: false, paste_remove_styles: false, paste_strip_class_attributes: "mso", 
      extended_valid_elements: "div[id|dir|class|align|style],link[charset|class|dir<ltr?rtl|href|hreflang|id|lang|media|onclick|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|rel|rev|style|title|target|type]", merge_styles_invalid_parents: "^P|H1|H2|H3|H4|H5|H6|LI|TD|STRONG$", 
      submit_patch: false, init_instance_callback: "wysiwygEditor.focusHandler", entity_encoding: "named", plugins: "safari,noneditable,simplepaste,spellchecker", 
      setup: function(V)
       {wysiwygEditor = V;
        V.onMouseDown.add(function(W, X)
           {wysiwygEditor.mouseDownHandler(W, X);
           });
        V.onNodeChange.add(function(X, W, Y, a, Z)
           {wysiwygEditor.nodeChangeHandler(X, W, Y, a, Z);
           });
        V.onKeyDown.add(function(W, X)
           {wysiwygEditor.keyDownHandler(W, X);
           });
        V.onDblClick.add(function(W, X)
           {wysiwygEditor.doubleClickHandler(W, X);
           });
        V.onChange.add(function(X, W)
           {window.confirmPageExit = true;
           });
        V.onInit.add(function(W)
           {D.setStyle("body_tbl", "border", "2px solid #CFCFCF");
            var X = D.get("body").tabIndex;
            D.get("body").tabIndex = - 1;
            D.get("body_ifr").tabIndex = X;
            setTimeout(function()
               {wysiwygEditor.initializeTabFocus(X);
               }, 100);
            U();
            D.get("yui-gen0").innerHTML = "add:";
            D.removeClass("yui-gen0", "yui-button-disabled");
            D.removeClass("yui-gen0", "yui-push-button-disabled");
            D.removeClass("yui-gen0", "yui-toolbar-ssaddtext");
            wysiwygEditor.prepareHTML();
            wysiwygEditor.wordCount();
            setInterval(function()
               {if ((window.confirmPageExit || wysiwygEditor.selection.getContent()) && ! wysiwygEditor.toolbar.htmlSourceMode)
                   {wysiwygEditor.wordCount();
                   }
               }, 7000);
            setTimeout(function()
               {var Y = window.parent.document.getElementById("configuration-container-footer-buttons");
                D.setStyle(Y, "visibility", "visible");
                Y.removeAttribute("style");
               }, 150);
           });
       }
   });
    var C = new YAHOO.widget.Toolbar("editorToolbar",  {collapse: false, titlebar: "Editor", draggable: false, 
      buttonType: "advanced", buttons: (Squarespace.EDITOR_MINIMAL ? Squarespace.Constants.EDITOR_TOOLBAR_MINIMAL: Squarespace.Constants.EDITOR_TOOLBAR_STANDARD)}
      );
    wysiwygEditor.toolbar = C;
    C.enableButton("ssquote");
    C.enableButton("ssinsertlink");
    C.enableButton("ssinsertvideo");
    if ( ! Squarespace.EDITOR_MINIMAL)
       {C.enableButton("undo");
        C.enableButton("redo");
        C.enableButton("justifyleft");
        C.enableButton("justifycenter");
        C.enableButton("justifyright");
        C.enableButton("justifyfull");
        C.enableButton("ssinsertcode");
        if ( ! Squarespace.EDITOR_EXCERPT_BUTTON)
           {C.getButtonByValue("ssdefineexcerpt").setStyle("display", "none");
           }
        var N = 
        {type: "push", label: "", value: "ssmode", menu: function()
           {var W = new YAHOO.widget.Overlay("ssmode",  {effect:  {effect: YAHOO.widget.ContainerEffect.FADE, duration: 0.07}, 
              visible: false});
            var V = '<div class="ssoverlay">';
            V += '<div><a id="mode_wysiwyg" href="#">WYSIWYG</a></div>';
            V += '<div><a id="mode_html" href="#">Raw HTML</a></div>';
            V += '<div><a id="mode_textile" href="#">Textile</a></div>';
            V += '<div><a id="mode_markdown" href="#">Markdown</a></div>';
            V += "</div>";
            W.setBody( '<div id="modeMenu">' + V + "</div>");
           
            W.show = function()
               {W.cfg.setProperty("context",[C.getButtonByValue("ssmode").get("element"), "tl", "bl"]);
                C.getButtonByValue("ssformat")._menu.hide();
                W.element.style.visibility = "visible";
                if (YAHOO.env.ua.ie)
                   {wysiwygEditor.bookmark = wysiwygEditor.selection.getBookmark();
                    setTimeout(function()
                       {wysiwygEditor.selection.moveToBookmark(wysiwygEditor.bookmark);
                       }, 50);
                   }
               };
           
            W.hide = function()
               {W.element.style.visibility = "hidden";
                if (YAHOO.env.ua.ie)
                   {wysiwygEditor.bookmark = wysiwygEditor.selection.getBookmark();
                    setTimeout(function()
                       {wysiwygEditor.selection.moveToBookmark(wysiwygEditor.bookmark);
                       }, 50);
                   }
                else 
                   {F();
                   }
               };
            W.render(document.body);
            W.element.style.visibility = "hidden";
            return W;
           }
       ()};
        C.addButtonToGroup(N, "modegroup");
        var R = D.getElementsByClassName("yui-toolbar-icon", "span", D.getElementsByClassName("yui-toolbar-ssmode", "span")[0])[0];
        R.style.backgroundImage = "url('/universal/images/toolbar/wysiwyg-button.png')";
        YAHOO.util.Event.onAvailable("modeMenu", function()
           {YAHOO.util.Event.on("modeMenu", "click", function(W)
               {var V = YAHOO.util.Event.getTarget(W);
                V = (V.tagName == "A" ? V: D.getAncestorByTagName(V, "A"));
                if (V && V.tagName == "A")
                   {this.getButtonByValue("ssmode")._menu.hide();
                    this.fireEvent("ssmodeClick",  {type: "ssmodeClick", mode: V.id});
                   }
                YAHOO.util.Event.stopEvent(W);
               }, C, true);
           });
        var M = 
        {type: "push", label: "", value: "ssformat", menu: function()
           {var W = new YAHOO.widget.Overlay("ssformat",  {effect:  {effect: YAHOO.widget.ContainerEffect.FADE, 
              duration: 0.07}, visible: false});
            var V = 
              '<div><a id="format_clear" href="#" onmouseover="javascript:wysiwygEditor.toolbar.hideFormatSubmenus()"><img src="/universal/images/toolbar/removeformat_inv.png"/><span style="padding-left: 10px" />Remove Formatting</a></div>';
            V += '<div class="ssoverlay-separator">&nbsp;</div>';
            V += 
              '<div><a id="fontsize_menu" class="ssoverlay-text" href="#" onmouseover="javascript:wysiwygEditor.toolbar.fontsizemenu.show();">Font Size<span class="ssoverlay-arrow">></span></a></div>';
            V += 
              '<div><a id="align_menu" class="ssoverlay-text" href="#" onmouseover="javascript:wysiwygEditor.toolbar.alignmentmenu.show();">Text Alignment<span class="ssoverlay-arrow">></span></a></div>';
            V += 
              '<div><a id="heading_menu" class="ssoverlay-text" href="#" onmouseover="javascript:wysiwygEditor.toolbar.headingmenu.show();">Heading<span class="ssoverlay-arrow">></span></a></div>';
            V += '<div class="ssoverlay-separator">&nbsp;</div>';
            V += 
              '<div><a id="format_strike" href="#" onmouseover="javascript:wysiwygEditor.toolbar.hideFormatSubmenus()"><img src="/universal/images/toolbar/strikethrough_inv.png"/><span style="padding-left: 10px" />Strikeout</a></div>';
            V += 
              '<div><a id="format_super" href="#" onmouseover="javascript:wysiwygEditor.toolbar.hideFormatSubmenus()"><img src="/universal/images/toolbar/superscript_inv.png"/><span style="padding-left: 10px" />Superscript</a></div>';
            V += 
              '<div><a id="format_sub" href="#" onmouseover="javascript:wysiwygEditor.toolbar.hideFormatSubmenus()"><img src="/universal/images/toolbar/subscript_inv.png"/><span style="padding-left: 10px" />Subscript</a></div>';
            W.setBody( '<div id="formatMenu" class="ssoverlay">' + V + "</div>");
           
            W.show = function()
               {W.cfg.setProperty("context",[C.getButtonByValue("ssformat").get("element"), "tl", "bl"]);
                C.getButtonByValue("ssmode")._menu.hide();
                W.element.style.visibility = "visible";
                if (YAHOO.env.ua.ie)
                   {wysiwygEditor.bookmark = wysiwygEditor.selection.getBookmark();
                    setTimeout(function()
                       {wysiwygEditor.selection.moveToBookmark(wysiwygEditor.bookmark);
                       }, 50);
                   }
               };
           
            W.hide = function()
               {wysiwygEditor.toolbar.hideFormatSubmenus();
                W.element.style.visibility = "hidden";
                if (YAHOO.env.ua.ie)
                   {wysiwygEditor.bookmark = wysiwygEditor.selection.getBookmark();
                    setTimeout(function()
                       {wysiwygEditor.selection.moveToBookmark(wysiwygEditor.bookmark);
                       }, 50);
                   }
                else 
                   {F();
                   }
               };
            W.render(document.body);
            W.element.style.visibility = "hidden";
            return W;
           }
       ()};
        C.addButtonToGroup(M, "formatgroup");
        YAHOO.util.Event.onAvailable("formatMenu", function()
           {YAHOO.util.Event.on("formatMenu", "click", function(W)
               {var V = YAHOO.util.Event.getTarget(W);
                V = (V.tagName == "A" ? V: D.getAncestorByTagName(V, "A"));
                if (V && V.tagName == "A")
                   {if (V.id != "fontsize_menu" && V.id != "align_menu" && V.id != "heading_menu")
                       {this.fireEvent("ssformatClick",  {formatType: V.id});
                        this.getButtonByValue("ssformat")._menu.hide();
                       }
                   }
                YAHOO.util.Event.stopEvent(W);
               }, C, true);
           });
        C.fontsizemenu = new YAHOO.widget.Overlay("ssfontsize",  {effect:  {effect: YAHOO.widget.ContainerEffect.FADE, 
          duration: 0.07}, visible: false});
        C.fontsizemenu.setBody( '<div id="fontsizeMenu" class="ssoverlay ssoverlay-submenu">' + 
          '<div><a id="format_50" href="#">50%</a></div>' + '<div><a id="format_60" href="#">60%</a></div>' + 
          '<div><a id="format_70" href="#">70%</a></div>' + '<div><a id="format_80" href="#">80%</a></div>' + '<div><a id="format_90" href="#">90%</a></div>' + 
          '<div><a id="format_100" href="#">100%</a></div>' + '<div><a id="format_110" href="#">110%</a></div>' + 
          '<div><a id="format_120" href="#">120%</a></div>' + '<div><a id="format_130" href="#">130%</a></div>' + 
          '<div><a id="format_140" href="#">140%</a></div>' + '<div><a id="format_150" href="#">150%</a></div>' + 
          '<div><a id="format_200" href="#">200%</a></div>' + '<div><a id="format_250" href="#">250%</a></div>' + 
          '<div><a id="format_300" href="#">300%</a></div>' + '<div><a id="format_350" href="#">350%</a></div>' + '<div><a id="format_400" href="#">400%</a></div>' + "</div>");
       
        C.fontsizemenu.show = function()
           {if (C.fontsizemenu.element.style.visibility == "hidden")
               {C.fontsizemenu.cfg.setProperty("context",[D.get("formatMenu"), "tl", "tr"]);
                C.hideFormatSubmenus("fontsizeMenu");
                C.fontsizemenu.element.style.visibility = "visible";
               }
           };
       
        C.fontsizemenu.hide = function()
           {if (C.fontsizemenu.element.style.visibility == "visible")
               {C.fontsizemenu.element.style.visibility = "hidden";
               }
           };
        C.fontsizemenu.render(document.body);
        C.fontsizemenu.element.style.visibility = "hidden";
        YAHOO.util.Event.onAvailable("fontsizeMenu", function()
           {YAHOO.util.Event.on("fontsizeMenu", "click", function(W)
               {var V = YAHOO.util.Event.getTarget(W);
                V = (V.tagName == "A" ? V: D.getAncestorByTagName(V, "A"));
                if (V && V.tagName == "A")
                   {this.fireEvent("ssformatClick",  {formatType: V.id});
                    this.getButtonByValue("ssformat")._menu.hide();
                   }
                YAHOO.util.Event.stopEvent(W);
               }, C, true);
           });
        C.alignmentmenu = new YAHOO.widget.Overlay("ssalignment",  {effect:  {effect: YAHOO.widget.ContainerEffect.FADE, duration: 0.07}, visible: false});
        C.alignmentmenu.setBody( '<div id="alignmentMenu" class="ssoverlay ssoverlay-submenu">' + 
          '<div><a id="format_left" href="#"><img src="/universal/images/toolbar/justifyleft_inv.png"/><span style="padding-left: 10px" />Left</a></div>' + 
          '<div><a id="format_center" href="#"><img src="/universal/images/toolbar/justifycenter_inv.png"/><span style="padding-left: 10px" />Center</a></div>' + 
          '<div><a id="format_right" href="#"><img src="/universal/images/toolbar/justifyright_inv.png"/><span style="padding-left: 10px" />Right</a></div>' + 
          '<div><a id="format_full" href="#"><img src="/universal/images/toolbar/justifyfull_inv.png"/><span style="padding-left: 10px" />Full</a></div>' + 
          "</div>");
       
        C.alignmentmenu.show = function()
           {if (C.alignmentmenu.element.style.visibility == "hidden")
               {C.alignmentmenu.cfg.setProperty("context",[D.get("formatMenu"), "tl", "tr"]);
                C.hideFormatSubmenus("alignmentMenu");
                C.alignmentmenu.element.style.visibility = "visible";
               }
           };
       
        C.alignmentmenu.hide = function()
           {if (C.alignmentmenu.element.style.visibility == "visible")
               {C.alignmentmenu.element.style.visibility = "hidden";
               }
           };
        C.alignmentmenu.render(document.body);
        C.alignmentmenu.element.style.visibility = "hidden";
        YAHOO.util.Event.onAvailable("alignmentMenu", function()
           {YAHOO.util.Event.on("alignmentMenu", "click", function(W)
               {var V = YAHOO.util.Event.getTarget(W);
                V = (V.tagName == "A" ? V: D.getAncestorByTagName(V, "A"));
                if (V && V.tagName == "A")
                   {this.fireEvent("ssformatClick",  {formatType: V.id});
                    this.getButtonByValue("ssformat")._menu.hide();
                   }
                YAHOO.util.Event.stopEvent(W);
               }, C, true);
           });
        C.headingmenu = new YAHOO.widget.Overlay("ssheading",  {effect:  {effect: YAHOO.widget.ContainerEffect.FADE, 
          duration: 0.07}, visible: false});
        C.headingmenu.setBody( '<div id="headingMenu" class="ssoverlay ssoverlay-submenu">' + 
          '<div><a id="format_normal" href="#"><img src="/universal/images/toolbar/p.png"/><span style="padding-left: 10px" />Normal (P)</a></div>' + 
          '<div><a id="format_h2" href="#"><img src="/universal/images/toolbar/h2.png"/><span style="padding-left: 10px" />Heading (H2)</a></div>' + 
          '<div><a id="format_h3" href="#"><img src="/universal/images/toolbar/h3.png"/><span style="padding-left: 10px" />Heading (H3)</a></div>' + 
          '<div><a id="format_h4" href="#"><img src="/universal/images/toolbar/h4.png"/><span style="padding-left: 10px" />Heading (H4)</a></div>' + 
          '<div><a id="format_h5" href="#"><img src="/universal/images/toolbar/h5.png"/><span style="padding-left: 10px" />Heading (H5)</a></div>' + 
          '<div><a id="format_h6" href="#"><img src="/universal/images/toolbar/h6.png"/><span style="padding-left: 10px" />Heading (H6)</a></div>' + "</div>");
       
        C.headingmenu.show = function()
           {if (C.headingmenu.element.style.visibility == "hidden")
               {C.headingmenu.cfg.setProperty("context",[D.get("formatMenu"), "tl", "tr"]);
                C.hideFormatSubmenus("headingMenu");
                C.headingmenu.element.style.visibility = "visible";
               }
           };
       
        C.headingmenu.hide = function()
           {if (C.headingmenu.element.style.visibility == "visible")
               {               C.headingmenu.element.style.visibility = "hidden";
               }
           };
        C.headingmenu.render(document.body);
        C.headingmenu.element.style.visibility = "hidden";
        YAHOO.util.Event.onAvailable("headingMenu", function()
           {YAHOO.util.Event.on("headingMenu", "click", function(W)
               {var V = YAHOO.util.Event.getTarget(W);
                V = (V.tagName == "A" ? V: D.getAncestorByTagName(V, "A"));
                if (V && V.tagName == "A")
                   {this.fireEvent("ssformatClick",  {formatType: V.id});
                    this.getButtonByValue("ssformat")._menu.hide();
                   }
                YAHOO.util.Event.stopEvent(W);
               }, C, true);
           });
       
        C.hideFormatSubmenus = function(V)
           {if (V != "fontsizeMenu" && C.fontsizemenu.element.style.visibility == "visible")
               {C.fontsizemenu.hide();
               }
            if (V != "alignmentMenu" && C.alignmentmenu.element.style.visibility == "visible")
               {C.alignmentmenu.hide();
               }
            if (V != "headingMenu" && C.headingmenu.element.style.visibility == "visible")
               {C.headingmenu.hide();
               }
           };
       }
    C.on("ssmodeClick", function(V)
       {var W = (V.mode ? V.mode: "");
        switch (W)
           {case "mode_wysiwyg": 
                switchEditingMode(Squarespace.EDITING_MODE_WYSIWYG);
                break;
            case "mode_html": 
                switchEditingMode(Squarespace.EDITING_MODE_RAW);
                break;
            case "mode_textile": 
                switchEditingMode(Squarespace.EDITING_MODE_TEXTILE);
                break;
            case "mode_markdown": 
                switchEditingMode(Squarespace.EDITING_MODE_MARKDOWN);
                break;
            default: 
                break;
           }
       }, null, true);
    C.on("undoClick", function(V)
       {wysiwygEditor.format("format_undo");
       }, null, true);
    C.on("redoClick", function(V)
       {wysiwygEditor.format("format_redo");
       }, null, true);
    C.on("ssformatClick", function(V)
       {if (V.formatType)
           {var W = V.formatType;
            wysiwygEditor.format(W);
           }
       }, null, true);
   
    wysiwygEditor.format = function(W)
       {if (YAHOO.env.ua.ie)
           {wysiwygEditor.bookmark = wysiwygEditor.selection.getBookmark();
           }
        var V = false;
        switch (W)
           {case "format_bold": 
                wysiwygEditor.execCommand("bold", false);
                V = true;
                break;
            case "format_italic": 
                wysiwygEditor.execCommand("italic", false);
                V = true;
                break;
            case "format_underline": 
                wysiwygEditor.execCommand("underline", false);
                V = true;
                break;
            case "format_quote": 
                wysiwygEditor.execCommand("mceBlockQuote", false);
                V = true;
                break;
            case "format_uno_list": 
                wysiwygEditor.execCommand("insertunorderedlist", false);
                V = true;
                break;
            case "format_o_list": 
                wysiwygEditor.execCommand("insertorderedlist", false);
                V = true;
                break;
            case "format_outdent": 
                wysiwygEditor.execCommand("Outdent", false);
                V = true;
                break;
            case "format_indent": 
                wysiwygEditor.execCommand("Indent", false);
                V = true;
                break;
            case "format_undo": 
                wysiwygEditor.execCommand("Undo", false);
                V = true;
                break;
            case "format_redo": 
                wysiwygEditor.execCommand("Redo", false);
                V = true;
                break;
            case "format_clear": 
                wysiwygEditor.execCommand("RemoveFormat", false);
                K(wysiwygEditor);
                break;
            case "format_normal": 
                wysiwygEditor.execCommand("FormatBlock", false, "P");
                break;
            case "format_h1": 
                wysiwygEditor.execCommand("FormatBlock", false, "H1");
                break;
            case "format_h2": 
                wysiwygEditor.execCommand("FormatBlock", false, "H2");
                break;
            case "format_h3": 
                wysiwygEditor.execCommand("FormatBlock", false, "H3");
                break;
            case "format_h4": 
                wysiwygEditor.execCommand("FormatBlock", false, "H4");
                break;
            case "format_h5": 
                wysiwygEditor.execCommand("FormatBlock", false, "H5");
                break;
            case "format_h6": 
                wysiwygEditor.execCommand("FormatBlock", false, "H6");
                break;
            case "format_strike": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,                 {command: "setstyle", name: "text-decoration", 
                  value: "line-through"});
                break;
            case "format_super": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,  {command: "setstyle", name: "vertical-align", value: "super"});
                break;
            case "format_sub": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,  {command: "setstyle", name: "vertical-align", value: "sub"});
                break;
            case "format_50": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,                 {command: "setstyle", name: "font-size", 
                  value: "50%"});
                break;
            case "format_60": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,                 {command: "setstyle", name: "font-size", 
                  value: "60%"});
                break;
            case "format_70": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,  {command: "setstyle", name: "font-size", value: "70%"});
                break;
            case "format_80": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,  {command: "setstyle", name: "font-size", value: "80%"});
                break;
            case "format_90": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,  {command: "setstyle", name: "font-size", value: "90%"});
                break;
            case "format_100": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,  {command: "setstyle", name: "font-size", value: "100%"}
                  );
                break;
            case "format_110": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,  {command: "setstyle", name: "font-size", value: "110%"}
                  );
                break;
            case "format_120": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,  {command: "setstyle", name: "font-size", value: "120%"});
                break;
            case "format_130": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,  {command: "setstyle", name: "font-size", value: "130%"});
                break;
            case "format_140": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,  {command: "setstyle", name: "font-size", value: "140%"});
                break;
            case "format_150": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,  {command: "setstyle", name: "font-size", value: "150%"}
                  );
                break;
            case "format_200": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,  {command: "setstyle", name: "font-size", value: "200%"}
                  );
                break;
            case "format_250": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,  {command: "setstyle", name: "font-size", value: "250%"});
                break;
            case "format_300": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,  {command: "setstyle", name: "font-size", value: "300%"});
                break;
            case "format_350": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,  {command: "setstyle", name: "font-size", value: "350%"});
                break;
            case "format_400": 
                wysiwygEditor.execCommand("mceSetStyleInfo", false,  {command: "setstyle", name: "font-size", value: "400%"});
                break;
            case "format_left": 
                wysiwygEditor.execCommand("JustifyLeft", false);
                break;
            case "format_center": 
                wysiwygEditor.execCommand("JustifyCenter", false);
                break;
            case "format_right": 
                wysiwygEditor.execCommand("JustifyRight", false);
                break;
            case "format_full": 
                wysiwygEditor.execCommand("JustifyFull", false);
                break;
            default: 
                break;
           }
        if (YAHOO.env.ua.ie)
           {if (V)
               {setTimeout(function()
                   {wysiwygEditor.selection.moveToBookmark(wysiwygEditor.bookmark);
                   }, 10);
               }
            else 
               {wysiwygEditor.selection.moveToBookmark(wysiwygEditor.bookmark);
               }
           }
        else 
           {F();
           }
       };
    C.on("boldClick", function(V)
       {wysiwygEditor.format("format_bold");
       }, null, true);
    C.on("italicClick", function(V)
       {wysiwygEditor.format("format_italic");
       }, null, true);
    C.on("underlineClick", function(V)
       {wysiwygEditor.format("format_underline");
       }, null, true);
    C.on("strikethroughClick", function(V)
       {wysiwygEditor.format("format_strike");
       }, null, true);
    C.on("superscriptClick", function(V)
       {wysiwygEditor.format("format_super");
       }, null, true);
    C.on("subscriptClick", function(V)
       {wysiwygEditor.format("format_sub");
       }, null, true);
    C.on("removeformatClick", function(V)
       {wysiwygEditor.format("format_clear");
       }, null, true);
    C.on("justifyleftClick", function(V)
       {wysiwygEditor.format("format_left", false);
       }, null, true);
    C.on("justifycenterClick", function(V)
       {wysiwygEditor.format("format_center", false);
       }, null, true);
    C.on("justifyrightClick", function(V)
       {wysiwygEditor.format("format_right", false);
       }, null, true);
    C.on("justifyfullClick", function(V)
       {wysiwygEditor.format("format_full", false);
       }, null, true);
    C.on("blockquoteClick", function(V)
       {wysiwygEditor.format("format_quote", false);
       }, null, true);
    C.on("insertunorderedlistClick", function(V)
       {wysiwygEditor.format("format_uno_list", false);
       }, null, true);
    C.on("insertorderedlistClick", function(V)
       {wysiwygEditor.format("format_o_list", false);
       }, null, true);
    C.on("outdentClick", function(V)
       {wysiwygEditor.format("format_outdent", false);
       }, null, true);
    C.on("indentClick", function(V)
       {wysiwygEditor.format("format_indent", false);
       }, null, true);
    C.on("ssdefineexcerptClick", function(W)
       {var V = wysiwygEditor.selection.getContent();
        if (V.length > 0)
           {showDialogNotice("Excerpt Set", 
              "You have set an excerpt for this entry, which can be viewed or removed from the Details &amp; Timed Actions tab of this editor.");
           }
        else 
           {showDialogNotice("Excerpt Cleared", "You have removed the excerpt for this entry.");
           }
        V = wysiwygEditor.togglePlaceholders(V, "placeholder-to-script");
        document.dataform.excerpt.value = V;
        F();
       }, wysiwygEditor, true);
    C.on("ssinsertlinkClick", function(W)
       {var Y = wysiwygEditor.selection, X = Y.getNode();
        if (X.tagName == "SPAN" && X.className && (X.className.indexOf("full-image-") != - 1 || X.className.indexOf("thumbnail-image-") != - 1))
           {wysiwygEditor.editImageDialog("link");
            return;
           }
        var V = wysiwygEditor.dom.getParent(X, "A");
        if (V == null)
           {if (Y.isCollapsed())
               {return;
               }
            wysiwygEditor.execCommand("mceInsertLink", false, T,  {skip_undo: 1});
            tinymce.each(wysiwygEditor.dom.select("a"), function(Z)
               {if (Z.href.indexOf(T) != - 1)
                   {V = Z;
                   }
               });
           }
        H = V;
        wysiwygEditor.editLinkDialog();
       }, null, true);
    C.on("ssinsertimageClick", function(V)
       {wysiwygEditor.ensureImageContainerIntegrity(true);
        wysiwygEditor.execCommand("mceInsertRawHTML", false, 
          '<span class="full-image-block ssNonEditable active-image-container"><span><img src="/universal/images/manager/wysiwyg-image.png"/></span></span>');
        H = D.getElementsByClassName("active-image-container", "span", wysiwygEditor.getDoc())[0];
        wysiwygEditor.selection.select(H);
        wysiwygEditor.editImageDialog();
       }, null, true);
    C.on("ssinsertvideoClick", function(V)
       {wysiwygEditor.ensureImageContainerIntegrity(true); 
        ++ O;
        wysiwygEditor.execCommand("mceInsertRawHTML", false, '<img id="editor-video-' + O + 
          '" class="active-script-container" src="/universal/images/manager/wysiwyg-video.png"/>');
        S[O] = "";
        H = D.getElementsByClassName("active-script-container", "img", wysiwygEditor.getDoc())[0];
        wysiwygEditor.selection.select(H);
        wysiwygEditor.editScriptDialog();
       }, null, true);
    C.on("ssinsertcodeClick", function(V)
       {wysiwygEditor.ensureImageContainerIntegrity(true); 
        ++ O;
        wysiwygEditor.execCommand("mceInsertRawHTML", false, '<img id="editor-script-' + O + 
          '" class="active-script-container" src="/universal/images/manager/wysiwyg-script.png"/>');
        S[O] = "";
        H = D.getElementsByClassName("active-script-container", "img", wysiwygEditor.getDoc())[0];
        wysiwygEditor.selection.select(H);
        wysiwygEditor.editScriptDialog();
       }, null, true);
    C.on("ssspellcheckClick", function(V)
       {wysiwygEditor.execCommand("mceSpellCheck", false);
       }, null, true);
    C.on("sshtmlClick", function(W)
       {if ( ! C.htmlSourceMode || C.htmlSourceMode == false)
           {C.htmlSourceMode = true;
            C.disableAllButtons();
            C.enableButton("sshtml");
            wysiwygEditor.hideFlyout();
            var V = window.confirmPageExit;
            tinyMCE.execCommand("mceToggleEditor", false, wysiwygEditor.id);
            wysiwygEditor.getElement().value = wysiwygEditor.togglePlaceholders(wysiwygEditor.getElement().value, 
              "placeholder-to-script");
            window.confirmPageExit = V;
            wysiwygEditor.getElement().focus();
           }
        else 
           {C.htmlSourceMode = false;
            C.enableAllButtons();
            var V = window.confirmPageExit;
            if (YAHOO.env.ua.ie)
               {wysiwygEditor.getElement().value = wysiwygEditor.togglePlaceholders(wysiwygEditor.getElement().value, 
                  "script-to-placeholder");
               }
            else 
               {wysiwygEditor.setContent(wysiwygEditor.togglePlaceholders(wysiwygEditor.getElement().value, 
                  "script-to-placeholder"));
                wysiwygEditor.save();
               }
            tinyMCE.execCommand("mceToggleEditor", false, wysiwygEditor.id);
            window.confirmPageExit = V;
            F();
           }
       }, null, true);
   
    wysiwygEditor.mouseDownHandler = function(W, Y)
       {if (Squarespace.AnchoredSelectManager.getActiveControl())
           {Squarespace.AnchoredSelectManager.getActiveControl().hide();
           }
        else 
           {if (Squarespace.AnchoredSelectManager.getLastActiveControl())
               {Squarespace.AnchoredSelectManager.getLastActiveControl().hide();
               }
           }
        if (window.parent.Squarespace.FileSelector.isVisible())
           {window.parent.Squarespace.FileSelector.cancel(true);
           }
        if (window.parent.Squarespace.ImageSelector.isVisible())
           {window.parent.Squarespace.ImageSelector.cancel(true);
           }
        if (window.parent.Squarespace.CodeEditor.isVisible())
           {setTimeout(function()
               {window.parent.Squarespace.CodeEditor.cancel(true);
               }, 10);
           }
        if ( ! Squarespace.EDITOR_MINIMAL)
           {var Z = C.getButtonByValue("ssmode")._menu;
            if (Z.element.style.visibility == "visible")
               {Z.hide();
               }
            Z = C.getButtonByValue("ssformat")._menu;
            if (Z.element.style.visibility == "visible")
               {Z.hide();
               }
           }
        var X = null;
        if (Y.target.tagName == "IMG" || (Y.target.tagName == "SPAN" && Y.target.className && Y.target.className.indexOf("thumbnail-caption") != - 1))
           {var V = Y.target.parentNode;
            if (V && V.tagName == "A")
               {V = V.parentNode;
               }
            if (V && V.tagName == "SPAN" && ( ! V.className || (V.className.indexOf("thumbnail-image-") == - 1 && V.className.indexOf("full-image-") == - 1)))
               {if (V.parentNode && V.parentNode.tagName == "SPAN")
                   {V = V.parentNode;
                   }
               }
            if (V && V.className && (V.className.indexOf("thumbnail-image-") != - 1 || V.className.indexOf("full-image-") != 
              - 1))
               {W.selection.select(V);
                H = V;
                X = V;
                if (YAHOO.env.ua.webkit)
                   {tinymce.dom.Event.cancel(Y);
                   }
               }
            else 
               {if (Y.target.id.indexOf("editor-") == - 1)
                   {W.selection.select(Y.target);
                    H = Y.target;
                    X = Y.target;
                    if (YAHOO.env.ua.webkit)
                       {tinymce.dom.Event.cancel(Y);
                       }
                   }
               }
           }
        else 
           {if (Y.target.tagName == "A" && ! window.parent.Squarespace.FileSelector.isVisible())
               {H = Y.target;
                X = Y.target;
               }
           }
        if (X)
           {wysiwygEditor.showFlyout(X);
           }
        else 
           {wysiwygEditor.hideFlyout();
           }
       };
   
    wysiwygEditor.doubleClickHandler = function(W, Y)
       {var X = wysiwygEditor.selection.getNode();
        if (X && X.tagName == "IMG" && X.id && (X.id.startsWith("editor-script-") || X.id.startsWith("editor-video-")))
           {H = X;
            D.addClass(H, "active-script-container");
            wysiwygEditor.editScriptDialog();
           }
        else 
           {if (X && X.tagName == "IMG")
               {var V = X;
                while (V != null && (V.tagName == "SPAN" || V.tagName == "IMG"))
                   {if (V.className && (V.className.startsWith("full-image-") || V.className.startsWith("thumbnail-image-")))
                       {H = V;
                        D.addClass(H, "active-image-container");
                        wysiwygEditor.editImageDialog();
                        break;
                       }
                    V = V.parentNode;
                   }
               }
           }
       };
   
    wysiwygEditor.nodeChangeHandler = function(W, V, X, Z, Y)
       {if ( ! this.flyoutOpen && ! this.flyoutOpening && X.tagName == "A")
           {this.showFlyout(X);
           }
       };
   
    wysiwygEditor.keyDownHandler = function(V, W)
       {if (W.keyCode == 32 || W.keyCode == 8 || W.keyCode == 46 || W.keyCode == 13 || (W.keyCode >= 48 && W.keyCode <= 
          57) || (W.keyCode >= 65 && W.keyCode <= 90) || (W.keyCode >= 186 && W.keyCode <= 192) || (W.keyCode >= 219 && 
          W.keyCode <= 222))
           {wysiwygEditor.hideFlyout();
           }
       };
   
    wysiwygEditor.focusHandler = function(V)
       {tinymce.dom.Event.add( ! tinymce.isGecko ? V.getWin(): V.getDoc(), "focus", function(W)
           {D.setStyle("body_tbl", "border", "2px solid #7F8FA0");
           });
        tinymce.dom.Event.add( ! tinymce.isGecko ? V.getWin(): V.getDoc(), "blur", function(W)
           {D.setStyle("body_tbl", "border", "2px solid #CFCFCF");
           });
       };
   
    wysiwygEditor.showFlyout = function(c)
       {if ( ! this.textFlyout)
           {this.textFlyout = document.createElement("div");
            this.textFlyout.style.position = "absolute";
            this.textFlyout.style.backgroundColor = "#303030";
            this.textFlyout.style.fontSize = "9px";
            this.textFlyout.style.padding = "6px 10px 6px 10px";
            this.textFlyout.style.color = "#eee";
            D.setStyle(this.textFlyout, "-moz-border-radius", "2px");
            D.setStyle(this.textFlyout, "-webkit-border-radius", "2px");
            this.textFlyout.innerHTML = "???";
            document.body.appendChild(this.textFlyout);
            this.flyoutOpen = false;
            this.flyoutOpening = false;
           }
        var e = D.getXY(c), b = D.getXY(D.get("body_ifr")), W = b[1] + D.get("body_ifr").offsetHeight, X = b[0] + D.get("body_ifr").offsetWidth, 
          Z = 23, d = 125;
        if (c.tagName == "A")
           {           var V = Squarespace.URL.removeDirectUrlPrefix(c.href);
            if (V.length < 45)
               {               d += 5 * V.length;
               }
            else 
               {d = 350;
               }
            this.textFlyoutXY =[(e[0] + b[0]), (e[1] + b[1] + c.offsetHeight + 2)];
            this.textFlyout.innerHTML = 
              '<strong>Link</strong>&nbsp;&nbsp;|&nbsp;&nbsp;<a title="Click to test this link in a new window..." href="' + 
              V + '" target="_new">' + (V.length < 45 ? V: V.substring(0, 45) +"...") + 
              '</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:noop();" onclick="tinyMCE.activeEditor.editLinkDialog();return(false);">Edit</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:noop();" onclick="tinyMCE.activeEditor.removeLink();tinyMCE.activeEditor.hideFlyout();return(false);">Remove</a>';
           }
        else 
           {if (c.tagName == "IMG")
               {d = 215;
                this.textFlyoutXY =[(e[0] + b[0] + 4), (e[1] + b[1] + c.offsetHeight - Z - 4)];
                this.textFlyout.innerHTML = 
                  "<strong>Image</strong>&nbsp;&nbsp;|&nbsp;&nbsp;" + 
                  '<a href="javascript:noop();" onclick="tinyMCE.activeEditor.convertImage();return(false);">Add Squarespace Formatting Options</a>';
               }
            else 
               {d = 240;
                this.textFlyoutXY =[(e[0] + b[0] + 4), (e[1] + b[1] + c.offsetHeight - Z - 4)];
                this.textFlyout.innerHTML = 
                  "<strong>Image</strong>&nbsp;&nbsp;|&nbsp;&nbsp;" + 
                  '<a href="javascript:noop();" onclick="tinyMCE.activeEditor.changeImageAlign(\'float-left\');return(false);">Left</a>&nbsp;&nbsp;' + 
                  '<a href="javascript:noop();" onclick="tinyMCE.activeEditor.changeImageAlign(\'inline\');return(false);">Inline</a>&nbsp;&nbsp;' + 
                  '<a href="javascript:noop();" onclick="tinyMCE.activeEditor.changeImageAlign(\'block\');return(false);">Block</a>&nbsp;&nbsp;' + 
                  '<a href="javascript:noop();" onclick="tinyMCE.activeEditor.changeImageAlign(\'float-right\');return(false);">Right</a>' + 
                  '&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:noop();" onclick="tinyMCE.activeEditor.editImageDialog();return(false);">Edit</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:noop();" onclick="tinyMCE.activeEditor.removeImage();return(false);">Remove</a>';
               }
           }
        this.textFlyoutXY[1] -= D.getDocumentScrollTop(wysiwygEditor.getDoc());
        if ((this.textFlyoutXY[1] + Z + 4) > W)
           {this.textFlyoutXY[1] = W - 2;
           }
        if ((this.textFlyoutXY[0] + d + 4) > X)
           {this.textFlyoutXY[0] = X - d;
           }
        if (this.flyoutOpening)
           {return;
           }
        else 
           {if (this.flyoutOpen)
               {D.setXY(this.textFlyout, this.textFlyoutXY);
               }
            else 
               {D.setStyle(this.textFlyout, "opacity", "0");
                D.setStyle(this.textFlyout, "display", "block");
                D.setXY(this.textFlyout,[this.textFlyoutXY[0], this.textFlyoutXY[1] - 5]);
                var Y = new YAHOO.util.Anim(this.textFlyout,  {opacity:  {to: 0.95}, top:  {to: this.textFlyoutXY[1]}}, 
                  0.2, YAHOO.util.Easing.easeOutStrong);
                Y.onComplete.subscribe(function(g, f, h)
                   {h.flyoutOpening = false;
                   }, this);
                Y.animate();
                this.flyoutOpening = true;
                this.flyoutOpen = true;
               }
           }
        this.flyoutTarget = c;
        if (this.linkHideTimeout)
           {window.clearTimeout(this.linkHideTimeout);
            this.linkHideTimeout = null;
           }
       };
   
    wysiwygEditor.moveFlyout = function()
       {if (this.flyoutTarget)
           {var a = D.getXY(this.flyoutTarget), X = D.getXY(D.get("body_ifr")), Y = X[1] + D.get("body_ifr").offsetHeight, V = X[0] + D.get("body_ifr").offsetWidth, Z = 
              23;
            flyoutWidth = 125;
            if (this.flyoutTarget.tagName == "A")
               {var W = Squarespace.URL.removeDirectUrlPrefix(this.flyoutTarget);
                if (W.length < 45)
                   {flyoutWidth += 5 * W.length;
                   }
                else 
                   {flyoutWidth = 350;
                   }
                this.textFlyoutXY =[(a[0] + X[0]), (a[1] + X[1] + targetEl.offsetHeight + 2)];
               }
            else 
               {flyoutWidth = 240;
                this.textFlyoutXY =[(a[0] + X[0] + 4), (a[1] + X[1] + this.flyoutTarget.offsetHeight - Z - 4)];
               }
            this.textFlyoutXY[1] -= D.getDocumentScrollTop(wysiwygEditor.getDoc());
            if ((this.textFlyoutXY[1] + Z + 4) > Y)
               {this.textFlyoutXY[1] = Y - 2;
               }
            if ((this.textFlyoutXY[0] + flyoutWidth + 4) > V)
               {this.textFlyoutXY[0] = V - flyoutWidth;
               }
            new YAHOO.util.Anim(this.textFlyout,  {left:  {to: this.textFlyoutXY[0]}, top:  {to: this.textFlyoutXY[1]}}, 0.1, 
              YAHOO.util.Easing.easeOutStrong).animate();
           }
       };
   
    wysiwygEditor.hideFlyout = function()
       {if (this.textFlyout && this.flyoutOpen)
           {var V = new YAHOO.util.Anim(this.textFlyout,  {opacity:  {to: 0}, top:  {to: this.textFlyoutXY[1] + 5}}, 0.2, YAHOO.util.Easing.easeOutStrong);
            V.onComplete.subscribe(function(X, W, Y)
               {D.setStyle(Y.textFlyout, "display", "none");
                Y.flyoutOpen = false;
                Y.flyoutOpening = false;
               }, this);
            V.animate();
            this.flyoutTarget = false;
           }
       };
   
    wysiwygEditor.editLinkDialog = function()
       {var W = wysiwygEditor.selection;
        var V = (H ? H: wysiwygEditor.dom.getParent(W.getNode(), "A"));
        if (V == null)
           {return;
           }
        var X = I(V);
        wysiwygEditor.hideFlyout();
        C.disableAllButtons();
        wysiwygEditor.bookmark = wysiwygEditor.selection.getBookmark();
        setTimeout(function()
           {window.parent.Squarespace.FileSelector.show( {xy:[X[0], X[1] + 18], title: (V.href.indexOf(T) != - 1 ? 
              "Create Link": "Modify Link Location"), visibleSelectors:["external", "file", "page", "upload", "extended"], 
              data:  {link: ( ! V.href || V.href.indexOf(T) != - 1 ? "": Squarespace.URL.removeDirectUrlPrefix(V.href)), description: ( ! V.title ? "": V.title), 
              newwindow: (V.target && V.target == "_blank"), offsiteindicator: (D.hasClass(V, "offsite-link-inline")), newlink: (V.href.indexOf(T) != 
              - 1 ? true: false)}, actions:  {onAccept: wysiwygEditor.onFileSelectionCompleted, onCancel: wysiwygEditor.onFileSelectionCompleted}});
           }, 100);
       };
   
    wysiwygEditor.onFileSelectionCompleted = function(Y)
       {var X = wysiwygEditor.selection;
        var V = (H ? H: wysiwygEditor.dom.getParent(X.getNode(), "A"));
        var W = V;
        if (Y.newlink)
           {tinymce.each(wysiwygEditor.dom.select("a"), function(Z)
               {if (Z.href.indexOf(T) != - 1)
                   {if (Y.link == "")
                       {wysiwygEditor.selection.select(Z);
                        wysiwygEditor.removeLink();
                        W = null;
                       }
                    else 
                       {G(Z, Y);
                        W = Z;
                       }
                   }
               });
            X.collapse();
           }
        else 
           {if (Y.link == "")
               {wysiwygEditor.selection.select(V);
                wysiwygEditor.removeLink();
                W = null;
               }
            else 
               {G(V, Y);
               }
           }
        if (W != null)
           {wysiwygEditor.selection.select(W);
            setTimeout(function()
               {wysiwygEditor.showFlyout(W);
               }, 100);
           }
        C.enableAllButtons();
        if (YAHOO.env.ua.ie)
           {setTimeout(function()
               {wysiwygEditor.selection.moveToBookmark(wysiwygEditor.bookmark);
               }, 10);
           }
        else 
           {F();
           }
       };
   
    wysiwygEditor.removeLink = function()
       {wysiwygEditor.execCommand("UnLink", false);
       };
   
    wysiwygEditor.editImageDialog = function(c)
       {var X = H;
        var V = X.getElementsByTagName("a");
        var Z = X.getElementsByTagName("img")[0];
        var W = Z.style.width;
        var a = D.getElementsByClassName("thumbnail-caption", "span", X);
        var b = X.className.replace("active-image-container", "").replace("ssNonEditable", "").trim();
        var Y =  {src: Squarespace.URL.removeDirectUrlPrefix(Z.src), linkUrl: (V.length > 0 ? Squarespace.URL.removeDirectUrlPrefix(V[0].href): ""), 
          previewWidth: (W ? W.replace("px", ""): ""), caption: (a.length > 0 ? a[0].innerHTML: ""), align: (b.startsWith("thumbnail-image") ? b.substring(16): b.substring(11)), 
          linkNewWindow: (V.length > 0 && V[0].target ? true: false), thumbnailStyle: (b.startsWith("thumbnail-image") ? true: false), 
          initialSelector: (c ? c: "image"), newimage: (Z.src.indexOf("wysiwyg-image.png") != - 1 ? true: false), newfile: false, captionRefresh: false, 
          linkRefresh: false};
        var d = I(Z);
        C.disableAllButtons();
        wysiwygEditor.hideFlyout();
        wysiwygEditor.bookmark = wysiwygEditor.selection.getBookmark();
        window.parent.Squarespace.ImageSelector.show( {xy:[d[0] + (Z.offsetWidth != 0 ? Z.offsetWidth: 75) + 2, d[1]], title: (Z.src.endsWith("wysiwyg-image.png") ? 
          "Insert Image": "Adjust Image"), visibleSelectors:["image", "upload", "external", "resize", "align", "link"], 
          data: Y, actions:  {onAccept: wysiwygEditor.onImageSelectionCompleted, onChange: wysiwygEditor.onImageSelectionAdjust, onCancel: wysiwygEditor.onImageSelectionCompleted}});
        setTimeout(function()
           {wysiwygEditor.onImageLoad(false);
           }, 100);
       };
   
    wysiwygEditor.onImageSelectionAdjust = function(a)
       {var Y = H;
        var V = Y.getElementsByTagName("img")[0];
        var X = (a.newfile ? "": (a.previewWidth ? a.previewWidth: V.offsetWidth));
        var Z = D.getElementsByClassName("thumbnail-caption", "span", Y)[0];
        var W = Y.getElementsByTagName("a")[0];
        if (a.captionRefresh && a.caption.length > 1 && Z)
           {Z.innerHTML = a.caption;
           }
        else 
           {if (a.linkRefresh && a.linkUrl.length > 1 && W)
               {W.setAttribute("href", a.linkUrl);
                W.setAttribute("mce_href", a.linkUrl);
                if (a.linkNewWindow)
                   {W.setAttribute("target", "_blank");
                   }
                else 
                   {W.removeAttribute("target");
                   }
               }
            else 
               {Y.className = (a.thumbnailStyle ? "thumbnail-image-": "full-image-") + a.align + 
                  " ssNonEditable active-image-container";
                Y.innerHTML = "<span>" + (a.linkUrl.length > 0 ? "<a " + (a.linkNewWindow ? ' target="_blank"': "") + 'href="' + 
                  a.linkUrl + '">': "") + "<img" + (X && a.previewWidth ? ' style="width: ' + X + 'px;"': "") + ' src="' + Squarespace.URL.adjustQueryParameter(a.src, 
                  "__SQUARESPACE_CACHEVERSION", (new Date().getTime())) + '" alt=""/>' + (a.linkUrl.length > 0 ? "</a>": "") + "</span>" + (a.caption.length > 
                  0 ? '<span style="width: ' + X + 'px;" class="thumbnail-caption">' + a.caption + "</span>": "");
               }
           }
        V = Y.getElementsByTagName("img")[0];
        E.addListener(V, "load", function()
           {wysiwygEditor.onImageLoad(true);
           }, null, this);
        E.addListener(V, "error", function()
           {wysiwygEditor.onImageLoad(true);
           }, null, this);
        a.newfile = false;
        a.captionRefresh = false;
        a.linkRefresh = false;
       };
   
    wysiwygEditor.onImageSelectionCompleted = function(X, W)
       {var V = H;
        if (V.innerHTML.indexOf("wysiwyg-image.png") != - 1 || (W && X.newimage))
           {V.parentNode.removeChild(V);
           }
        else 
           {wysiwygEditor.dom.removeClass(V, "active-image-container");
            wysiwygEditor.selection.select(V.getElementsByTagName("img")[0]);
            setTimeout(function()
               {               wysiwygEditor.showFlyout(V);
               }, 150);
           }
        C.enableAllButtons();
        if (YAHOO.env.ua.ie)
           {setTimeout(function()
               {wysiwygEditor.selection.moveToBookmark(wysiwygEditor.bookmark);
               }, 10);
           }
        else 
           {F();
           }
       };
   
    wysiwygEditor.onImageLoad = function(W)
       {var X = H;
        if (X)
           {var V = X.getElementsByTagName("img")[0];
            var Z = I(V);
            if (W || YAHOO.env.ua.ie)
               {window.parent.Squarespace.ImageSelector.move([Z[0] + V.offsetWidth + 2, Z[1]]);
               }
            if ( ! V.style.width)
               {window.parent.Squarespace.ImageSelector.updateImageSize(V.offsetWidth);
               }
            var Y = D.getElementsByClassName("thumbnail-caption", "span", X)[0];
            if (Y)
               {Y.style.width = (V.style.width ? V.style.width: V.offsetWidth) + "px";
               }
           }
       };
   
    wysiwygEditor.changeImageAlign = function(W)
       {var V = H;
        V.className = (V.className.startsWith("thumbnail") ? "thumbnail-image-": "full-image-") + W + " ssNonEditable";
        wysiwygEditor.moveFlyout();
       };
   
    wysiwygEditor.removeImage = function()
       {wysiwygEditor.selection.select(H);
        var V = wysiwygEditor.selection.getBookmark();
        H.parentNode.removeChild(H);
        H = null;
        wysiwygEditor.hideFlyout();
        wysiwygEditor.selection.moveToBookmark(V);
        F();
       };
   
    wysiwygEditor.convertImage = function()
       {var V = wysiwygEditor.getDoc().createElement("SPAN");
        D.addClass(V, "full-image-block ssNonEditable");
        var W = wysiwygEditor.getDoc().createElement("SPAN");
        if (H.parentNode && H.parentNode.tagName == "A")
           {H = H.parentNode;
           }
        H.parentNode.replaceChild(V, H);
        V.appendChild(W);
        W.appendChild(H);
        H = V;
        wysiwygEditor.selection.select(H);
        wysiwygEditor.showFlyout(H);
       };
   
    wysiwygEditor.editScriptDialog = function()
       {var W = H;
        var Z, X, V;
        if (W.id.startsWith("editor-video-"))
           {Z = W.id.substring(13);
            X = S[Z];
            V = "video";
           }
        else 
           {           Z = W.id.substring(14);
            X = S[Z];
            V = "script";
           }
        var Y = I(W);
        C.disableAllButtons();
        wysiwygEditor.hideFlyout();
        setTimeout(function()
           {window.parent.Squarespace.CodeEditor.show( {xy:[Y[0] + 75 + 2, Y[1]], title: ((X.length == 0 ? "Insert": "Edit") + (V == "video" ? 
              " Video": " Script")), data:  {scriptId: Z, code: X}, actions:  {onAccept: wysiwygEditor.onScriptEditingCompleted}});
           }, 100);
       };
   
    wysiwygEditor.onScriptEditingCompleted = function(W)
       {var V = H;
        if (W.code.length == 0)
           {V.parentNode.removeChild(V);
           }
        else 
           {wysiwygEditor.dom.removeClass(V, "active-script-container");
            S[W.scriptId] = W.code;
           }
        C.enableAllButtons();
        H = null;
        if (YAHOO.env.ua.ie)
           {setTimeout(function()
               {wysiwygEditor.selection.moveToBookmark(wysiwygEditor.bookmark);
               }, 10);
           }
        else 
           {F();
           }
       };
   
    wysiwygEditor.replaceScriptsWithPlaceholders = function(X, a, b, Y)
       {var V = - 1;
        while (true)
           {V = X.indexOf(a, V + 1);
            if (V == - 1)
               {break;
               }
            var W = X.indexOf(b, V);
            if (W == - 1)
               {break;
               }
            var Z = X.substring(V, W + b.length); 
            ++ O;
            S[O] = Z;
            X = X.substring(0, V) + '<img id="editor-' + Y + "-" + O + '" src="/universal/images/manager/wysiwyg-' + Y +
              '.png" alt="" />' + X.substring(W + b.length);
            V += 30;
           }
        return X;
       };
   
    wysiwygEditor.replacePlaceholdersWithScripts = function(Z, a, V, Y, b)
       {var e = - 1;
        while (true)
           {e = Z.indexOf(a, e + 1);
            if (e == - 1)
               {break;
               }
            var d = Z.indexOf(V, e + a.length);
            var c = Z.indexOf(Y, d + V.length);
            var f = Z.indexOf( ">", e + 1);
            if (d == - 1 || d > f)
               {continue;
               }
            var W = Z.substring(d + V.length, c);
            var X = S[W];
            if (X)
               {Z = Z.substring(0, e) + X + Z.substring(f + 1);
                e += X.length;
               }
           }
        return Z;
       };
   
    wysiwygEditor.prepareHTML = function()
       {var V = wysiwygEditor.getElement().value;
        V = wysiwygEditor.togglePlaceholders(V, "script-to-placeholder");
        V = V.replace(/class="sizeLess40"/gi, 'style="font-size: 60%;"');
        V = V.replace(/class="sizeLess20"/gi, 'style="font-size: 80%;"');
        V = V.replace(/class="sizeGreater20"/gi, 'style="font-size: 120%;"');
        V = V.replace(/class="sizeGreater40"/gi, 'style="font-size: 140%;"');
        V = V.replace(/class="sizeGreater60"/gi, 'style="font-size: 160%;"');
        V = V.replace(/class="sizeGreater80"/gi, 'style="font-size: 180%;"');
        V = V.replace(/class="sizeGreater100"/gi, 'style="font-size: 200%;"');
        wysiwygEditor.dom.setHTML(wysiwygEditor.getBody(), V);
        window.confirmPageExit = false;
       };
   
    wysiwygEditor.saveHTML = function()
       {if (C.htmlSourceMode == true)
           {C.fireEvent("sshtmlClick");
           }
        P();
        var V = wysiwygEditor.getContent();
        V = wysiwygEditor.togglePlaceholders(V, "placeholder-to-script");
        V = V.replace(/style="font-size: 100%;"/gi, "");
        wysiwygEditor.getElement().value = V;
       };
   
    wysiwygEditor.togglePlaceholders = function(V, W)
       {if (W == "script-to-placeholder")
           {V = wysiwygEditor.replaceScriptsWithPlaceholders(V, "<object ", "</object>", "video");
            V = wysiwygEditor.replaceScriptsWithPlaceholders(V, "<embed ", "</embed>", "video");
            V = wysiwygEditor.replaceScriptsWithPlaceholders(V, "<scr" + "ipt", "</scr" + "ipt>", "script");
            V = wysiwygEditor.replaceScriptsWithPlaceholders(V, "<iframe", "</iframe>", "script");
           }
        else 
           {if (W == "placeholder-to-script")
               {V = wysiwygEditor.replacePlaceholdersWithScripts(V, "<img ", 'id="editor-video-', '"', "video");
                V = wysiwygEditor.replacePlaceholdersWithScripts(V, "<img ", 'id="editor-script-', '"', "script");
               }
           }
        return V;
       };
   
    wysiwygEditor.ensureImageContainerIntegrity = function(Z)
       {var c = wysiwygEditor;
        var Y = c.selection.getNode();
        if (Y.tagName == "IMG")
           {return true;
           }
        if (YAHOO.env.ua.ie)
           {var d = c.dom.getParent(Y, "SPAN");
            if (d)
               {if (d.className.indexOf("thumbnail-image-") == - 1 && d.className.indexOf("full-image-") == - 1)
                   {d = d.parentNode;
                   }
                if (d.className.indexOf("thumbnail-image-") != - 1 || d.className.indexOf("full-image-") != - 1)
                   {var b = c.selection.getRng();
                    if (A(c, d))
                       {if ( ! d.previousSibling || d.previousSibling.nodeType == 1)
                           {var W = b.offsetLeft;
                            var a = b.offsetTop;
                            var X = c.getDoc().createTextNode("\u00a0");
                            X = D.insertBefore(X, d);
                            b = c.getDoc().selection.createRange();
                            b.moveToPoint(W, a);
                            c.selection.setRng(b);
                           }
                        else 
                           {var e = c.getDoc().createElement("IMG");
                            e.height = 1;
                            D.insertBefore(e, d);
                            var W = c.dom.getPos(e).x;
                            var a = b.offsetTop - 5;
                            var X = c.getDoc().createTextNode("\u00a0");
                            c.dom.replace(X, e);
                            b = c.getDoc().selection.createRange();
                            b.moveToPoint(W, a);
                            c.selection.setRng(b);
                           }
                       }
                    else 
                       {                       if ( ! Z)
                           {                           if ( ! d.nextSibling || d.nextSibling.nodeType == 1)
                               {var X = c.getDoc().createTextNode("\u00a0");
                                X = D.insertAfter(X, d);
                                c.selection.select(X);
                               }
                            else 
                               {c.selection.select(d);
                                c.selection.collapse(false);
                               }
                           }
                        else 
                           {var X = c.getDoc().createTextNode("\u00a0");
                            var e = c.getDoc().createElement("IMG");
                            D.insertAfter(X, d);
                            D.insertAfter(e, X);
                            c.selection.select(e);
                           }
                       }
                    return false;
                   }
               }
            else 
               {return false;
               }
           }
        else 
           {if (YAHOO.env.ua.webkit || YAHOO.env.ua.opera)
               {var d = c.dom.getParent(Y, "SPAN");
                if (d)
                   {if (d.className.indexOf("thumbnail-image-") == - 1 && d.className.indexOf("full-image-") == - 1)
                       {d = d.parentNode;
                       }
                    if (d.className.indexOf("thumbnail-image-") != - 1 || d.className.indexOf("full-image-") != - 1)
                       {var b = c.selection.getRng();
                        if (b.startOffset == 0)
                           {if ( ! d.previousSibling || d.previousSibling.nodeType == 1)
                               {var X = c.getDoc().createTextNode("\u00a0");
                                D.insertBefore(X, d);
                                c.selection.select(X);
                               }
                            else 
                               {c.selection.select(d);
                                c.selection.collapse(true);
                               }
                           }
                        else 
                           {if ( ! d.nextSibling || d.nextSibling.nodeType == 1)
                               {var X = c.getDoc().createTextNode("\u00a0");
                                D.insertAfter(X, d);
                                c.selection.select(X);
                               }
                            else 
                               {c.selection.select(d);
                                c.selection.collapse(false);
                               }
                           }
                        c.execCommand("mceInsertContent", false, "");
                        return false;
                       }
                   }
               }
            else 
               {if (YAHOO.env.ua.gecko)
                   {var V = c.dom.getParent(Y, "SPAN");
                    if (V)
                       {if (V.className.indexOf("thumbnail-image-") == - 1 && V.className.indexOf("full-image-") == - 1)
                           {V = V.parentNode;
                           }
                        if (V.className.indexOf("thumbnail-image-") != - 1 || V.className.indexOf("full-image-") != - 1)
                           {var b = c.selection.getRng();
                            if (b.startOffset == 0)
                               {c.selection.select(V);
                                c.selection.collapse(true);
                               }
                            else 
                               {c.selection.select(V);
                                c.selection.collapse(false);
                               }
                            c.execCommand("mceInsertContent", false, "");
                            return false;
                           }
                       }
                   }
               }
           }
        return true;
       };
   
    function A(W, X)
       {var V = W.selection.getRng();
        var Y = W.dom.getPos(X.getElementsByTagName("img")[0]);
        if (V.offsetLeft <= Y.x && V.offsetTop <= Y.y)
           {return true;
           }
        return false;
       }
   
    function F()
       {setTimeout(function()
           {tinyMCE.execCommand("mceFocus", false, wysiwygEditor.id);
           }, 10);
       }
   
    function I(Z)
       {       var Y = D.getXY(Z);
        var W = D.getXY(D.get("body_ifr"));
        var X =[0, 0];
        var V = window.parent.document.getElementById("configuration-container-frame");
        if (V)
           {X = D.getXY(V);
           }
        return ([(Y[0] + W[0] + X[0] - D.getDocumentScrollLeft(wysiwygEditor.getDoc()) - D.getDocumentScrollLeft(window.parent.document)), (Y[1] + 
          W[1] + X[1] - D.getDocumentScrollTop(wysiwygEditor.getDoc()) - D.getDocumentScrollTop(window.parent.document))]);
       }
   
    function G(V, W)
       {V.href = W.link;
        V.setAttribute("mce_href", W.link);
        V.title = W.description;
        if (W.newwindow)
           {V.target = "_blank";
           }
        else 
           {V.removeAttribute("target");
           }
        if (W.offsiteindicator)
           {D.addClass(V, "offsite-link-inline");
           }
        else 
           {D.removeClass(V, "offsite-link-inline");
           }
       }
   
    function P()
       {var W = D.getElementsByClassName("active-image-container", "span", wysiwygEditor.getDoc());
        for (var V = 0;V < W.length;V++)
           {D.removeClass(W[V], "active-image-container");
           }
        W = D.getElementsByClassName("active-script-container", "img", wysiwygEditor.getDoc());
        for (var V = 0;V < W.length;V++)
           {D.removeClass(W[V], "active-script-container");
           }
       }
   
    function K(V)
       {var W = V.selection.getContent( {format: "html"});
        if (W)
           {W = W.replace(new RegExp( '<(\\w[^>]*) style="([^"]*)"([^>]*)', "gi"), "<$1$3");
            W = W.replace( /<\/?font[^>]*>/gi, "");
            V.selection.setContent(W);
           }
       }
   
    function U()
       {       var Z = D.get("body_path_row");
        Z.firstChild.nodeValue = "\u00a0\u00a0\u00a0\u00a0Path: ";
        var W = document.createElement("SPAN");
        W.id = "ss-character-count";
        W.innerHTML = "0";
        D.insertBefore(W, Z.firstChild);
        D.insertBefore(document.createTextNode("\u00a0\u00a0\u00a0\u00a0Characters: "), Z.firstChild);
        var Y = W.cloneNode(true);
        Y.id = "ss-word-count";
        D.insertBefore(Y, Z.firstChild);
        var V = W.cloneNode(false);
        V.id = "ss-word-count-title";
        V.innerHTML = "\u00a0\u00a0\u00a0\u00a0Word Count: ";
        D.insertBefore(V, Z.firstChild);
        var X = W.cloneNode(false);
        X.id = "autoSaveText";
        D.insertBefore(X, Z.firstChild);
       }
   
    wysiwygEditor.wordCount = function()
       {var X = "", W = wysiwygEditor;
        if (W.selection.getContent())
           {X = W.selection.getContent( {format: "text"}).trim();
            D.get("ss-word-count-title").innerHTML = "\u00a0\u00a0\u00a0\u00a0Selection Word Count: ";
           }
        else 
           {X = wysiwygEditor.getBody().innerHTML;
            X = X.replace(/(<([^>]+)>)/ig, "").replace(/\n/ig, " ").replace( /&nbsp;/ig, " ").trim();
            D.get("ss-word-count-title").innerHTML = "\u00a0\u00a0\u00a0\u00a0Word Count: ";
           }
        var V = X.length;
        X = X.replace(/ +/g, " ");
        D.get("ss-word-count").innerHTML = (X == "" ? "0": X.split(" ").length);
        D.get("ss-character-count").innerHTML = V;
       };
   
    function L(W)
       {if (D.getStyle(W, "visibility") == "hidden" || D.getStyle(W, "display") == "none")
           {return false;
           }
        var V = W.parentNode;
        while (V && V.tagName.toLowerCase() != "body")
           {if (D.getStyle(V, "visibility") == "hidden" || D.getStyle(V, "display") == "none")
               {return false;
               }
            V = V.parentNode;
           }
        return true;
       }
   
    wysiwygEditor.initializeTabFocus = function(Y)
       {if ( ! Y)
           {Y = D.get("body").tabIndex;
           }
        if ( ! Y || Y == - 1)
           {Y = D.get("body_ifr").tabIndex;
           }
        var b = null, a = Y, X = null, Z = Y;
        var W = D.getElementsBy(function(c)
           {if (c.tabIndex && c.tabIndex > 0)
               {return true;
               }
           });
        for (var V = 0;V < W.length;V++)
           {if ((a == Y && W[V].tabIndex < Y) || (W[V].tabIndex < Y && W[V].tabIndex > a))
               {if (L(W[V]) && W[V].tabIndex > 0)
                   {a = W[V].tabIndex;
                    b = W[V];
                    if (a == (Y - 1))
                       {break;
                       }
                   }
               }
           }
        for (var V = W.length - 1;V >= 0;V--)
           {if ((Z == Y && W[V].tabIndex > Y) || (W[V].tabIndex > Y && W[V].tabIndex < Z))
               {if (L(W[V]))
                   {Z = W[V].tabIndex;
                    X = W[V];
                    if (Z == (Y + 1))
                       {break;
                       }
                   }
               }
           }
        wysiwygEditor.settings["tab_focus"] = (b != null ? b.id: "body_ifr") +"," + (X != null ? X.id: "body_ifr");
        if (YAHOO.env.ua.webkit)
           {if (wysiwygEditor.tabListener)
               {E.removeListener(D.get(wysiwygEditor.tabListener), "keydown", J);
                wysiwygEditor.tabListener = null;
               }
            if (wysiwygEditor.revTabListener)
               {E.purgeElement(D.get(wysiwygEditor.revTabListener), "keydown", B);
                wysiwygEditor.revTabListener = null;
               }
            if (L(D.get("body_ifr")))
               {if (b != null)
                   {E.addListener(b.id, "keydown", J);
                    wysiwygEditor.tabListener = b.id;
                   }
                if (X != null)
                   {E.addListener(X.id, "keydown", B);
                    wysiwygEditor.revTabListener = X.id;
                   }
               }
           }
       };
   
    function J(V)
       {if (V.keyCode == 9 && ! V.shiftKey)
           {E.stopEvent(V);
            tinyMCE.execCommand("mceFocus", false, wysiwygEditor.id);
           }
        return false;
       }
   
    function B(V)
       {if (V.keyCode == 9 && V.shiftKey)
           {E.stopEvent(V);
            tinyMCE.execCommand("mceFocus", false, wysiwygEditor.id);
           }
        return false;
       }
   }
};

function getEditor()
   {return (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_WYSIWYG ? Squarespace.WysiwygEditor: Squarespace.TextEditor);
   }

function setEditorHeight(B, A)
   {if (Squarespace.EDITOR_MODE == Squarespace.EDITING_MODE_WYSIWYG)
       {D.setStyle("body_tbl", "height", B - 17 + "px");
        D.setStyle("body_ifr", "height", B - 17 + "px");
       }
    D.setStyle("containerTable", "height", (B + A) + "px");
    D.setStyle("editorCell", "height", B + "px");
    D.setStyle("body", "height", B + "px");
   }

function setEditorWidth(A)
   {D.setStyle("containerTable", "width", A + "px");
    D.setStyle("editorCell", "width", A + "px");
   }

function UndoRedo()
   {this.undoIndex = 0;
    this.undoData =[];
    this.undoInterval = 0;
    this.addUndoLevel = A;
    this.getUndo = F;
    this.getRedo = G;
    this.checkUndoRedoData = B;
    this.clearUndo = C;
    this.hasUndo = H;
    this.hasRedo = I;
   
    function A(K)
       {var J, L;
        if (( ! K || K == "") && this.undoIndex > 0)
           {return null;
           }
        L = this.undoData[this.undoIndex > 0 ? this.undoIndex - 1: this.undoIndex];
        if (L && L == K)
           {return null;
           }
        if (this.undoIndex > 30)
           {this.undoIndex--;
            for (J = 1;J < this.undoIndex;J++)
               {this.undoData[J] = this.undoData[J + 1];
               }
           }
        this.undoData.length = this.undoIndex + 1;
        this.undoData[this.undoIndex] = K;
        this.undoIndex++;
        return K;
       }
   
    function F()
       {var J;
        if (this.undoIndex > 0)
           {J = this.undoData[this.undoIndex - 2];
            this.undoIndex--;
           }
        return J;
       }
   
    function G()
       {var J;
        if (this.undoIndex < this.undoData.length)
           {J = this.undoData[this.undoIndex];
            this.undoIndex++;
           }
        return J;
       }
   
    function B(J)
       {var K = this.undoData[this.undoIndex - 1];
        if (K != J)
           {this.undoData[this.undoIndex - 1] = J;
           }
       }
   
    function C()
       {this.undoData =[];
        this.undoIndex = 0;
       }
   
    function H()
       {       return this.undoIndex > 1;
       }
   
    function I()
       {       return this.undoIndex < this.undoData.length;
       }
   }
(function()
   {var B = YAHOO.util.Dom, A = YAHOO.util.Event, C = YAHOO.lang;
    if (YAHOO.widget.Button)
       {YAHOO.widget.ToolbarButtonAdvanced = YAHOO.widget.Button;
        YAHOO.widget.ToolbarButtonAdvanced.prototype.buttonType = "rich";
       
        YAHOO.widget.ToolbarButtonAdvanced.prototype.checkValue = function(H)
           {var G = this.getMenu().getItems();
            if (G.length === 0)
               {this.getMenu()._onBeforeShow();
                G = this.getMenu().getItems();
               }
            for (var F = 0;F < G.length;F++)
               {G[F].cfg.setProperty("checked", false);
                if (G[F].value == H)
                   {G[F].cfg.setProperty("checked", true);
                   }
               }
           };
       }
    else 
       {
       YAHOO.widget.ToolbarButtonAdvanced = function(){};
       }
   
    YAHOO.widget.ToolbarButton = function(G, F)
       {if (C.isObject(arguments[0]) && ! B.get(G).nodeType)
           {F = G;
           }
        var I = (F || {});
        var H =  {element: null, attributes: I};
        if ( ! H.attributes.type)
           {H.attributes.type = "push";
           }
        H.element = document.createElement("span");
        H.element.setAttribute("unselectable", "on");
        H.element.className = "yui-button yui-" + H.attributes.type + "-button";
        H.element.innerHTML = '<span class="first-child"><a href="#">LABEL</a></span>';
        H.element.firstChild.firstChild.tabIndex = "-1";
        H.attributes.id = B.generateId();
        YAHOO.widget.ToolbarButton.superclass.constructor.call(this, H.element, H.attributes);
       };
    YAHOO.extend(YAHOO.widget.ToolbarButton, YAHOO.util.Element, 
    {buttonType: "normal", _handleMouseOver: function()
       {if ( ! this.get("disabled"))
           {this.addClass("yui-button-hover");
           
            this.addClass("yui-" + this.get("type") + "-button-hover");
           }
       }
   , _handleMouseOut: function()
       {this.removeClass("yui-button-hover");
       
        this.removeClass("yui-" + this.get("type") + "-button-hover");
       }
   , checkValue: function(H)
       {if (this.get("type") == "menu")
           {var G = this._button.options;
            for (var F = 0;F < G.length;F++)
               {if (G[F].value == H)
                   {
                   G.selectedIndex = F;
                   }
               }
           }
       }
   , init: function(G, F)
       {YAHOO.widget.ToolbarButton.superclass.init.call(this, G, F);
        this.on("mouseover", this._handleMouseOver, this, true);
       
        this.on("mouseout", this._handleMouseOut, this, true);
       }
   , initAttributes: function(F)
       {YAHOO.widget.ToolbarButton.superclass.initAttributes.call(this, F);
        this.setAttributeConfig("value",  {value: F.value});
        this.setAttributeConfig("menu",  {value: F.menu || false});
        this.setAttributeConfig("type", 
        {value: F.type, writeOnce: true, method: function(J)
           {var I, H;
            if ( ! this._button)
               {this._button = this.get("element").getElementsByTagName("a")[0];
               }
            switch (J)
               {case "select": 
                case "menu": 
                    I = document.createElement("select");
                    var K = this.get("menu");
                    for (var G = 0;G < K.length;G++)
                       {H = document.createElement("option");
                        H.innerHTML = K[G].text;
                        H.value = K[G].value;
                        if (K[G].checked)
                           {H.selected = true;
                           }
                        I.appendChild(H);
                       }
                    this._button.parentNode.replaceChild(I, this._button);
                    A.on(I, "change", this._handleSelect, this, true);
                    this._button = I;
                    break;
               }
           }
       });
        this.setAttributeConfig("disabled",        
        {value: F.disabled || false, method: function(G)
           {if (G)
               {this.addClass("yui-button-disabled");
                this.addClass("yui-" + this.get("type") + "-button-disabled");
                if (this.get("type") == "color")
                   {this.get("menu").hide();
                   }
               }
            else 
               {this.removeClass("yui-button-disabled");
                this.removeClass("yui-" + this.get("type") + "-button-disabled");
               }
            if (this.get("type") == "menu")
               {this._button.disabled = G;
               }
           }
       });
        this.setAttributeConfig("label", 
        {value: F.label, method: function(G)
           {if ( ! this._button)
               {this._button = this.get("element").getElementsByTagName("a")[0];
               }
            if (this.get("type") == "push")
               {this._button.innerHTML = G;
               }
           }
       });
        this.setAttributeConfig("title",  {value: F.title});
        this.setAttributeConfig("container", 
        {value: null, writeOnce: true, method: function(G)
           {
           this.appendTo(G);
           }
       });
       }
   , _handleSelect: function(G)
       {var F = A.getTarget(G);
        var H = F.options[F.selectedIndex].value;
        this.fireEvent("change", 
        {type: "change", value: H});
       }
   , getMenu: function()
       {
       return this.get("menu");
       }
   , destroy: function()
       {A.purgeElement(this.get("element"), true);
        this.get("element").parentNode.removeChild(this.get("element"));
        for (var F in this)
           {if (C.hasOwnProperty(this, F))
               {
               this[F] = null;
               }
           }
       }
   , fireEvent: function(G, F)
       {if (this.DOM_EVENTS[G] && this.get("disabled"))
           {return;
           }
       
        YAHOO.widget.ToolbarButton.superclass.fireEvent.call(this, G, F);
       }
   , toString: function()
       {return "ToolbarButton (" + this.get("id") +")";
       }
   });
   })();
(function()
   {var C = YAHOO.util.Dom, A = YAHOO.util.Event, G = YAHOO.lang;
   
    var B = function(I)
       {var H = I;
        if (G.isString(I))
           {H = this.getButtonById(I);
           }
        if (G.isNumber(I))
           {H = this.getButtonByIndex(I);
           }
        if (( ! (H instanceof YAHOO.widget.ToolbarButton)) && ( ! (H instanceof YAHOO.widget.ToolbarButtonAdvanced)))
           {H = this.getButtonByValue(I);
           }
        if ((H instanceof YAHOO.widget.ToolbarButton) || (H instanceof YAHOO.widget.ToolbarButtonAdvanced))
           {return H;
           }
        return false;
       };
   
    YAHOO.widget.Toolbar = function(L, K)
       {if (G.isObject(arguments[0]) && ! C.get(L).nodeType)
           {K = L;
           }
        var N = (K || {});
        var M =  {element: null, attributes: N};
        if (G.isString(L) && C.get(L))
           {M.element = C.get(L);
           }
        else 
           {if (G.isObject(L) && C.get(L) && C.get(L).nodeType)
               {M.element = C.get(L);
               }
           }
        if ( ! M.element)
           {M.element = document.createElement("DIV");
            M.element.id = C.generateId();
            if (N.container && C.get(N.container))
               {C.get(N.container).appendChild(M.element);
               }
           }
        if ( ! M.element.id)
           {M.element.id = ((G.isString(L)) ? L: C.generateId());
           }
        var I = document.createElement("fieldset");
        var J = document.createElement("legend");
        J.innerHTML = "Toolbar";
        I.appendChild(J);
        var H = document.createElement("DIV");
        M.attributes.cont = H;
        C.addClass(H, "yui-toolbar-subcont");
        I.appendChild(H);
        M.element.appendChild(I);
        M.element.tabIndex = - 1;
        M.attributes.element = M.element;
        M.attributes.id = M.element.id;
        YAHOO.widget.Toolbar.superclass.constructor.call(this, M.element, M.attributes);
       };
   
    function F(K, H, L)
       {C.addClass(this.element, "yui-toolbar-" + L.get("value") + "-menu");
        if (C.hasClass(L._button.parentNode.parentNode, "yui-toolbar-select"))
           {C.addClass(this.element, "yui-toolbar-select-menu");
           }
        var I = this.getItems();
        for (var J = 0;J < I.length;J++)
           {           C.addClass(I[J].element, "yui-toolbar-" + L.get("value") + "-" + ((I[J].value) ? I[J].value.replace(/ /g, 
              "-").toLowerCase(): I[J]._oText.nodeValue.replace(/ /g, "-").toLowerCase()));
            C.addClass(I[J].element, "yui-toolbar-" + L.get("value") + "-" + ((I[J].value) ? I[J].value.replace(/ /g, "-"): I[J]._oText.nodeValue.replace(/ /g, "-")));
           }
       }
    YAHOO.extend(YAHOO.widget.Toolbar, YAHOO.util.Element,  {buttonType: YAHOO.widget.ToolbarButton, 
      dd: null, 
      _colorData:  {"#111111": "Obsidian", 
      "#2D2D2D": "Dark Gray", 
      "#434343": "Shale", 
      "#5B5B5B": "Flint", 
      "#737373": "Gray", 
      "#8B8B8B": "Concrete", 
      "#A2A2A2": "Gray", 
      "#B9B9B9": "Titanium", 
      "#000000": "Black", 
      "#D0D0D0": "Light Gray", 
      "#E6E6E6": "Silver", 
      "#FFFFFF": "White", 
      "#BFBF00": "Pumpkin", 
      "#FFFF00": "Yellow", 
      "#FFFF40": "Banana", 
      "#FFFF80": "Pale Yellow", 
      "#FFFFBF": "Butter", 
      "#525330": "Raw Siena", 
      "#898A49": "Mildew", 
      "#AEA945": "Olive", 
      "#7F7F00": "Paprika", 
      "#C3BE71": "Earth", 
      "#E0DCAA": "Khaki", 
      "#FCFAE1": "Cream", 
      "#60BF00": "Cactus", 
      "#80FF00": "Chartreuse", 
      "#A0FF40": "Green", 
      "#C0FF80": "Pale Lime", 
      "#DFFFBF": "Light Mint", 
      "#3B5738": "Green", 
      "#668F5A": "Lime Gray", 
      "#7F9757": "Yellow", 
      "#407F00": "Clover", 
      "#8A9B55": "Pistachio", 
      "#B7C296": "Light Jade", 
      "#E6EBD5": "Breakwater", 
      "#00BF00": "Spring Frost", 
      "#00FF80": "Pastel Green", 
      "#40FFA0": "Light Emerald", 
      "#80FFC0": "Sea Foam", 
      "#BFFFDF": "Sea Mist", 
      "#033D21": "Dark Forrest", 
      "#438059": "Moss", 
      "#7FA37C": "Medium Green", 
      "#007F40": "Pine", 
      "#8DAE94": "Yellow Gray Green", 
      "#ACC6B5": "Aqua Lung", 
      "#DDEBE2": "Sea Vapor", 
      "#00BFBF": "Fog", 
      "#00FFFF": "Cyan", 
      "#40FFFF": "Turquoise Blue", 
      "#80FFFF": "Light Aqua", 
      "#BFFFFF": "Pale Cyan", 
      "#033D3D": "Dark Teal", 
      "#347D7E": "Gray Turquoise", 
      "#609A9F": "Green Blue", 
      "#007F7F": "Seaweed", 
      "#96BDC4": "Green Gray", 
      "#B5D1D7": "Soapstone", 
      "#E2F1F4": "Light Turquoise", 
      "#0060BF": "Summer Sky", 
      "#0080FF": "Sky Blue", 
      "#40A0FF": "Electric Blue", 
      "#80C0FF": "Light Azure", 
      "#BFDFFF": "Ice Blue", 
      "#1B2C48": "Navy", 
      "#385376": "Biscay", 
      "#57708F": "Dusty Blue", 
      "#00407F": "Sea Blue", 
      "#7792AC": "Sky Blue Gray", 
      "#A8BED1": "Morning Sky", 
      "#DEEBF6": "Vapor", 
      "#0000BF": "Deep Blue", 
      "#0000FF": "Blue", 
      "#4040FF": "Cerulean Blue", 
      "#8080FF": "Evening Blue", 
      "#BFBFFF": "Light Blue", 
      "#212143": "Deep Indigo", 
      "#373E68": "Sea Blue", 
      "#444F75": "Night Blue", 
      "#00007F": "Indigo Blue", 
      "#585E82": "Dockside", 
      "#8687A4": "Blue Gray", 
      "#D2D1E1": "Light Blue Gray", 
      "#6000BF": "Neon Violet", 
      "#8000FF": "Blue Violet", 
      "#A040FF": "Violet Purple", 
      "#C080FF": "Violet Dusk", 
      "#DFBFFF": "Pale Lavender", 
      "#302449": "Cool Shale", 
      "#54466F": "Dark Indigo", 
      "#655A7F": "Dark Violet", 
      "#40007F": "Violet", 
      "#726284": "Smoky Violet", 
      "#9E8FA9": "Slate Gray", 
      "#DCD1DF": "Violet White", 
      "#BF00BF": "Royal Violet", 
      "#FF00FF": "Fuchsia", 
      "#FF40FF": "Magenta", 
      "#FF80FF": "Orchid", 
      "#FFBFFF": "Pale Magenta", 
      "#4A234A": "Dark Purple", 
      "#794A72": "Medium Purple", 
      "#936386": "Cool Granite", 
      "#7F007F": "Purple", 
      "#9D7292": "Purple Moon", 
      "#C0A0B6": "Pale Purple", 
      "#ECDAE5": "Pink Cloud", 
      "#BF005F": "Hot Pink", 
      "#FF007F": "Deep Pink", 
      "#FF409F": "Grape", 
      "#FF80BF": "Electric Pink", 
      "#FFBFDF": "Pink", 
      "#451528": "Purple Red", 
      "#823857": "Purple Dino", 
      "#A94A76": "Purple Gray", 
      "#7F003F": "Rose", 
      "#BC6F95": "Antique Mauve", 
      "#D8A5BB": "Cool Marble", 
      "#F7DDE9": "Pink Granite", 
      "#C00000": "Apple", 
      "#FF0000": "Fire Truck", 
      "#FF4040": "Pale Red", 
      "#FF8080": "Salmon", 
      "#FFC0C0": "Warm Pink", 
      "#441415": "Sepia", 
      "#82393C": "Rust", 
      "#AA4D4E": "Brick", 
      "#800000": "Brick Red", 
      "#BC6E6E": "Mauve", 
      "#D8A3A4": "Shrimp Pink", 
      "#F8DDDD": "Shell Pink", 
      "#BF5F00": "Dark Orange", 
      "#FF7F00": "Orange", 
      "#FF9F40": "Grapefruit", 
      "#FFBF80": "Canteloupe", 
      "#FFDFBF": "Wax", 
      "#482C1B": "Dark Brick", 
      "#855A40": "Dirt", 
      "#B27C51": "Tan", 
      "#7F3F00": "Nutmeg", 
      "#C49B71": "Mustard", 
      "#E1C4A8": "Pale Tan", 
      "#FDEEE0": "Marble"}, 
      _colorPicker: null, 
      STR_COLLAPSE: "Collapse Toolbar", 
      STR_SPIN_LABEL: "Spin Button with value {VALUE}. Use Control Shift Up Arrow and Control Shift Down arrow keys to increase or decrease the value.", 
      STR_SPIN_UP: "Click to increase the value of this input", 
      STR_SPIN_DOWN: "Click to decrease the value of this input", 
      _titlebar: null, 
      browser: YAHOO.env.ua, 
      _buttonList: null, 
      _buttonGroupList: null, 
      _sep: null, 
      _sepCount: null, 
      _dragHandle: null, 
      _toolbarConfigs: 
    {renderer: true}, 
      CLASS_CONTAINER: "yui-toolbar-container", 
      CLASS_DRAGHANDLE: "yui-toolbar-draghandle", 
      CLASS_SEPARATOR: "yui-toolbar-separator", 
      CLASS_DISABLED: "yui-toolbar-disabled", 
      CLASS_PREFIX: "yui-toolbar", 
      init: function(I, 
      H)
       {
       YAHOO.widget.Toolbar.superclass.init.call(this, I, H);
       }
   , 
      initAttributes: function(H)
       {YAHOO.widget.Toolbar.superclass.initAttributes.call(this, H);
        this.addClass(this.CLASS_CONTAINER);
        this.setAttributeConfig("buttonType", 
        {value: H.buttonType || "basic", writeOnce: true, validator: function(I)
           {switch (I)
               {case "advanced": 
                case "basic": 
                    return true;
               }
           
            return false;
           }
       , method: function(I)
           {if (I == "advanced")
               {if (YAHOO.widget.Button)
                   {this.buttonType = YAHOO.widget.ToolbarButtonAdvanced;
                   }
                else 
                   {this.buttonType = YAHOO.widget.ToolbarButton;
                   }
               }
            else 
               {this.buttonType = YAHOO.widget.ToolbarButton;
               }
           }
       });
        this.setAttributeConfig("buttons", 
        {value:[], writeOnce: true, method: function(J)
           {for (var I in J)
               {if (G.hasOwnProperty(J, I))
                   {if (J[I].type == "separator")
                       {this.addSeparator();
                       }
                    else 
                       {if (J[I].group !== undefined)
                           {this.addButtonGroup(J[I]);
                           }
                        else 
                           {this.addButton(J[I]);
                           }
                       }
                   }
               }
           }
       });
        this.setAttributeConfig("disabled", 
        {value: false, method: function(I)
           {if (this.get("disabled") === I)
               {return false;
               }
            if (I)
               {this.addClass(this.CLASS_DISABLED);
                this.set("draggable", false);
                this.disableAllButtons();
               }
            else 
               {this.removeClass(this.CLASS_DISABLED);
                if (this._configs.draggable._initialConfig.value)
                   {this.set("draggable", true);
                   }
                this.resetAllButtons();
               }
           }
       });
        this.setAttributeConfig("cont",  {value: H.cont, readOnly: true});
        this.setAttributeConfig("grouplabels", 
        {value: ((H.grouplabels === false) ? false: true), method: function(I)
           {if (I)
               {C.removeClass(this.get("cont"), (this.CLASS_PREFIX + "-nogrouplabels"));
               }
            else 
               {C.addClass(this.get("cont"), (this.CLASS_PREFIX + "-nogrouplabels"));
               }
           }
       });
        this.setAttributeConfig("titlebar", 
        {value: false, method: function(J)
           {if (J)
               {if (this._titlebar && this._titlebar.parentNode)
                   {this._titlebar.parentNode.removeChild(this._titlebar);
                   }
                this._titlebar = document.createElement("DIV");
                this._titlebar.tabIndex = "-1";
                A.on(this._titlebar, "focus", function()
                   {this._handleFocus();
                   }, this, true);
                C.addClass(this._titlebar, this.CLASS_PREFIX + "-titlebar");
                if (G.isString(J))
                   {var I = document.createElement("h2");
                    I.tabIndex = "-1";
                    I.innerHTML = '<a href="#" tabIndex="0">' + J + "</a>";
                    this._titlebar.appendChild(I);
                    A.on(I.firstChild, "click", function(K)
                       {A.stopEvent(K);
                       });
                    A.on([I, I.firstChild], "focus", function()
                       {this._handleFocus();
                       }, this, true);
                   }
                if (this.get("firstChild"))
                   {this.insertBefore(this._titlebar, this.get("firstChild"));
                   }
                else 
                   {this.appendChild(this._titlebar);
                   }
                if (this.get("collapse"))
                   {this.set("collapse", true);
                   }
               }
            else 
               {if (this._titlebar)
                   {if (this._titlebar && this._titlebar.parentNode)
                       {this._titlebar.parentNode.removeChild(this._titlebar);
                       }
                   }
               }
           }
       });
        this.setAttributeConfig("collapse", 
        {value: false, method: function(K)
           {if (this._titlebar)
               {var J = null;
                var I = C.getElementsByClassName("collapse", "span", this._titlebar);
                if (K)
                   {if (I.length > 0)
                       {return true;
                       }
                    J = document.createElement("SPAN");
                    J.innerHTML = "X";
                    J.title = this.STR_COLLAPSE;
                    C.addClass(J, "collapse");
                    this._titlebar.appendChild(J);
                    A.addListener(J, "click", function()
                       {if (C.hasClass(this.get("cont").parentNode, "yui-toolbar-container-collapsed"))
                           {this.collapse(false);
                           }
                        else 
                           {this.collapse();
                           }
                       }, this, true);
                   }
                else 
                   {J = C.getElementsByClassName("collapse", "span", this._titlebar);
                    if (J[0])
                       {if (C.hasClass(this.get("cont").parentNode, "yui-toolbar-container-collapsed"))
                           {this.collapse(false);
                           }
                        J[0].parentNode.removeChild(J[0]);
                       }
                   }
               }
           }
       });
        this.setAttributeConfig("draggable", 
        {value: (H.draggable || false), method: function(I)
           {if (I && ! this.get("titlebar"))
               {if ( ! this._dragHandle)
                   {this._dragHandle = document.createElement("SPAN");
                    this._dragHandle.innerHTML = "|";
                    this._dragHandle.setAttribute("title", "Click to drag the toolbar");
                    this._dragHandle.id = this.get("id") + "_draghandle";
                    C.addClass(this._dragHandle, this.CLASS_DRAGHANDLE);
                    if (this.get("cont").hasChildNodes())
                       {this.get("cont").insertBefore(this._dragHandle, this.get("cont").firstChild);
                       }
                    else 
                       {this.get("cont").appendChild(this._dragHandle);
                       }
                    this.dd = new YAHOO.util.DD(this.get("id"));
                    this.dd.setHandleElId(this._dragHandle.id);
                   }
               }
            else 
               {if (this._dragHandle)
                   {this._dragHandle.parentNode.removeChild(this._dragHandle);
                    this._dragHandle = null;
                    this.dd = null;
                   }
               }
            if (this._titlebar)
               {if (I)
                   {this.dd = new YAHOO.util.DD(this.get("id"));
                    this.dd.setHandleElId(this._titlebar);
                    C.addClass(this._titlebar, "draggable");
                   }
                else 
                   {C.removeClass(this._titlebar, "draggable");
                    if (this.dd)
                       {this.dd.unreg();
                       
                        this.dd = null;
                       }
                   }
               }
           }
       , validator: function(J)
           {var I = true;
            if ( ! YAHOO.util.DD)
               {I = false;
               }
           
            return I;
           }
       });
       }
   , 
      addButtonGroup: function(L)
       {if ( ! this.get("element"))
           {this._queue[this._queue.length] =["addButtonGroup", arguments];
            return false;
           }
        if ( ! this.hasClass(this.CLASS_PREFIX + "-grouped"))
           {this.addClass(this.CLASS_PREFIX + "-grouped");
           }
        var M = document.createElement("DIV");
        C.addClass(M, this.CLASS_PREFIX + "-group");
        C.addClass(M, this.CLASS_PREFIX + "-group-" + L.group);
        if (L.label)
           {var I = document.createElement("h3");
            I.innerHTML = L.label;
            M.appendChild(I);
           }
        if ( ! this.get("grouplabels"))
           {C.addClass(this.get("cont"), this.CLASS_PREFIX, "-nogrouplabels");
           }
        this.get("cont").appendChild(M);
        var K = document.createElement("ul");
        M.appendChild(K);
        if ( ! this._buttonGroupList)
           {this._buttonGroupList = {};
           }
        this._buttonGroupList[L.group] = K;
        for (var J = 0;J < L.buttons.length;J++)
           {var H = document.createElement("li");
            H.className = this.CLASS_PREFIX + "-groupitem";
            K.appendChild(H);
            if ((L.buttons[J].type !== undefined) && L.buttons[J].type == "separator")
               {this.addSeparator(H);
               }
            else 
               {L.buttons[J].container = H;
               
                this.addButton(L.buttons[J]);
               }
           }
       }
   , 
      addButtonToGroup: function(J, 
      K, 
      L)
       {var I = this._buttonGroupList[K];
        var H = document.createElement("li");
        H.className = this.CLASS_PREFIX + "-groupitem";
        J.container = H;
        this.addButton(J, L);
       
        I.appendChild(H);
       }
   , 
      addButton: function(M, 
      L)
       {if ( ! this.get("element"))
           {this._queue[this._queue.length] =["addButton", arguments];
            return false;
           }
        if ( ! this._buttonList)
           {this._buttonList =[];
           }
        if ( ! M.container)
           {M.container = this.get("cont");
           }
        if ((M.type == "menu") || (M.type == "split") || (M.type == "select"))
           {if (G.isArray(M.menu))
               {for (var S in M.menu)
                   {if (G.hasOwnProperty(M.menu, S))
                       {var Y = 
                        {fn: function(b, Z, a)
                           {if ( ! M.menucmd)
                               {M.menucmd = M.value;
                               }
                            M.value = ((a.value) ? a.value: a._oText.nodeValue);
                           }
                       , scope: this};
                        M.menu[S].onclick = Y;
                       }
                   }
               }
           }
        var T = {}, Q = false;
        for (var O in M)
           {if (G.hasOwnProperty(M, O))
               {               if ( ! this._toolbarConfigs[O])
                   {                   T[O] = M[O];
                   }
               }
           }
        if (M.type == "select")
           {T.type = "menu";
           }
        if (M.type == "spin")
           {T.type = "push";
           }
        if (T.type == "color")
           {if (YAHOO.widget.Overlay)
               {T = this._makeColorButton(T);
               }
            else 
               {Q = true;
               }
           }
        if (T.menu)
           {if ((YAHOO.widget.Overlay) && (M.menu instanceof YAHOO.widget.Overlay))
               {M.menu.showEvent.subscribe(function()
                   {this._button = T;
                   });
               }
            else 
               {for (var R = 0;R < T.menu.length;R++)
                   {if ( ! T.menu[R].value)
                       {T.menu[R].value = T.menu[R].text;
                       }
                   }
                if (this.browser.webkit)
                   {T.focusmenu = false;
                   }
               }
           }
        if (Q)
           {M = false;
           }
        else 
           {this._configs.buttons.value[this._configs.buttons.value.length] = M;
            var W = new this.buttonType(T);
            W.get("element").tabIndex = "-1";
            W.get("element").setAttribute("role", "button");
            W._selected = true;
            if ( ! W.buttonType)
               {W.buttonType = "rich";
               
                W.checkValue = function(b)
                   {var a = this.getMenu().getItems();
                    if (a.length === 0)
                       {this.getMenu()._onBeforeShow();
                        a = this.getMenu().getItems();
                       }
                    for (var Z = 0;Z < a.length;Z++)
                       {a[Z].cfg.setProperty("checked", false);
                        if (a[Z].value == b)
                           {a[Z].cfg.setProperty("checked", true);
                           }
                       }
                   };
               }
            if (this.get("disabled"))
               {W.set("disabled", true);
               }
            if ( ! M.id)
               {M.id = W.get("id");
               }
            if (L)
               {var I = W.get("element");
                var P = null;
                if (L.get)
                   {P = L.get("element").nextSibling;
                   }
                else 
                   {if (L.nextSibling)
                       {P = L.nextSibling;
                       }
                   }
                if (P)
                   {P.parentNode.insertBefore(I, P);
                   }
               }
            W.addClass(this.CLASS_PREFIX + "-" + W.get("value"));
            var V = document.createElement("span");
            V.className = this.CLASS_PREFIX + "-icon";
            W.get("element").insertBefore(V, W.get("firstChild"));
            if (W._button.tagName.toLowerCase() == "button")
               {W.get("element").setAttribute("unselectable", "on");
                var X = document.createElement("a");
                X.innerHTML = W._button.innerHTML;
                X.href = "#";
                X.tabIndex = "-1";
                A.on(X, "click", function(Z)
                   {A.stopEvent(Z);
                   });
                W._button.parentNode.replaceChild(X, W._button);
                W._button = X;
               }
            if (M.type == "select")
               {if (W._button.tagName.toLowerCase() == "select")
                   {V.parentNode.removeChild(V);
                    var J = W._button;
                    var U = W.get("element");
                    U.parentNode.replaceChild(J, U);
                   }
                else 
                   {W.addClass(this.CLASS_PREFIX + "-select");
                   }
               }
            if (M.type == "spin")
               {if ( ! G.isArray(M.range))
                   {M.range =[10, 100];
                   }
                this._makeSpinButton(W, M);
               }
            W.get("element").setAttribute("title", W.get("label"));
            if (M.type != "spin")
               {if ((YAHOO.widget.Overlay) && (T.menu instanceof YAHOO.widget.Overlay))
                   {
                   var K = function(b)
                       {var Z = true;
                        if (b.keyCode && (b.keyCode == 9))
                           {Z = false;
                           }
                        if (Z)
                           {if (this._colorPicker)
                               {this._colorPicker._button = M.value;
                               }
                            var a = W.getMenu().element;
                            if (C.getStyle(a, "visibility") == "hidden")
                               {W.getMenu().show();
                               }
                            else 
                               {W.getMenu().hide();
                               }
                           }
                        YAHOO.util.Event.stopEvent(b);
                       };
                    W.on("mousedown", K, M, this);
                    W.on("keydown", K, M, this);
                   }
                else 
                   {if ((M.type != "menu") && (M.type != "select"))
                       {W.on("keypress", this._buttonClick, M, this);
                        W.on("mousedown", function(Z)
                           {YAHOO.util.Event.stopEvent(Z);
                            this._buttonClick(Z, M);
                           }, M, this);
                        W.on("click", function(Z)
                           {YAHOO.util.Event.stopEvent(Z);
                           });
                       }
                    else 
                       {W.on("mousedown", function(Z)
                           {YAHOO.util.Event.stopEvent(Z);
                           });
                        W.on("click", function(Z)
                           {YAHOO.util.Event.stopEvent(Z);
                           });
                        W.on("change", function(Z)
                           {if ( ! M.menucmd)
                               {M.menucmd = M.value;
                               }
                            M.value = Z.value;
                            this._buttonClick(Z, M);
                           }, this, true);
                        var N = this;
                        if (W.getMenu().mouseDownEvent)
                           {W.getMenu().mouseDownEvent.subscribe(function(b, a)
                               {var Z = a[1];
                                YAHOO.util.Event.stopEvent(a[0]);
                                W._onMenuClick(a[0], W);
                                if ( ! M.menucmd)
                                   {M.menucmd = M.value;
                                   }
                                M.value = ((Z.value) ? Z.value: Z._oText.nodeValue);
                                N._buttonClick.call(N, a[1], M);
                                W._hideMenu();
                                return false;
                               });
                            W.getMenu().clickEvent.subscribe(function(a, Z)
                               {YAHOO.util.Event.stopEvent(Z[0]);
                               });
                            W.getMenu().mouseUpEvent.subscribe(function(a, Z)
                               {YAHOO.util.Event.stopEvent(Z[0]);
                               });
                           }
                       }
                   }
               }
            else 
               {W.on("mousedown", function(Z)
                   {YAHOO.util.Event.stopEvent(Z);
                   });
                W.on("click", function(Z)
                   {YAHOO.util.Event.stopEvent(Z);
                   });
               }
            if (this.browser.ie){}
            if (this.browser.webkit)
               {
               W.hasFocus = function()
                   {return true;
                   };
               }
            this._buttonList[this._buttonList.length] = W;
            if ((M.type == "menu") || (M.type == "split") || (M.type == "select"))
               {if (G.isArray(M.menu))
                   {var H = W.getMenu();
                    if (H.renderEvent)
                       {H.renderEvent.subscribe(F, W);
                        if (M.renderer)
                           {H.renderEvent.subscribe(M.renderer, W);
                           }
                       }
                   }
               }
           }
       
        return M;
       }
   , 
      addSeparator: function(H, 
      K)
       {if ( ! this.get("element"))
           {this._queue[this._queue.length] =["addSeparator", arguments];
            return false;
           }
        var I = ((H) ? H: this.get("cont"));
        if ( ! this.get("element"))
           {this._queue[this._queue.length] =["addSeparator", arguments];
            return false;
           }
        if (this._sepCount === null)
           {this._sepCount = 0;
           }
        if ( ! this._sep)
           {this._sep = document.createElement("SPAN");
            C.addClass(this._sep, this.CLASS_SEPARATOR);
            this._sep.innerHTML = "|";
           }
        var J = this._sep.cloneNode(true);
        this._sepCount++;
        C.addClass(J, this.CLASS_SEPARATOR + "-" + this._sepCount);
        if (K)
           {var L = null;
            if (K.get)
               {L = K.get("element").nextSibling;
               }
            else 
               {if (K.nextSibling)
                   {L = K.nextSibling;
                   }
                else 
                   {L = K;
                   }
               }
            if (L)
               {if (L == K)
                   {L.parentNode.appendChild(J);
                   }
                else 
                   {L.parentNode.insertBefore(J, L);
                   }
               }
           }
        else 
           {I.appendChild(J);
           }
       
        return J;
       }
   , 
      _createColorPicker: function(K)
       {if (C.get(K + "_colors"))
           {C.get(K + "_colors").parentNode.removeChild(C.get(K + "_colors"));
           }
        var H = document.createElement("div");
        H.className = "yui-toolbar-colors";
        H.id = K + "_colors";
        H.style.display = "none";
        A.on(window, "load", function()
           {document.body.appendChild(H);
           }, this, true);
        this._colorPicker = H;
        var J = "";
        for (var I in this._colorData)
           {if (G.hasOwnProperty(this._colorData, I))
               {J += '<a style="background-color: ' + I + '" href="#">' + I.replace("#", "") + "</a>";
               }
           }
        J += "<span><em>X</em><strong></strong></span>";
        window.setTimeout(function()
           {H.innerHTML = J;
           }, 0);
        A.on(H, "mouseover", function(P)
           {var N = this._colorPicker;
            var O = N.getElementsByTagName("em")[0];
            var M = N.getElementsByTagName("strong")[0];
            var L = A.getTarget(P);
            if (L.tagName.toLowerCase() == "a")
               {O.style.backgroundColor = L.style.backgroundColor;
                M.innerHTML = this._colorData["#" + L.innerHTML] + "<br>" + L.innerHTML;
               }
           }, this, true);
        A.on(H, "focus", function(L)
           {A.stopEvent(L);
           });
        A.on(H, "click", function(L)
           {A.stopEvent(L);
           });
        A.on(H, "mousedown", function(M)
           {A.stopEvent(M);
            var L = A.getTarget(M);
            if (L.tagName.toLowerCase() == "a")
               {var O = this.fireEvent("colorPickerClicked",  {type: "colorPickerClicked", target: this, button: this._colorPicker._button, 
                  color: L.innerHTML, colorName: this._colorData["#" + L.innerHTML]});
                if (O !== false)
                   {var N =  {color: L.innerHTML, colorName: this._colorData["#" + L.innerHTML], value: this._colorPicker._button};
                    this.fireEvent("buttonClick",  {type: "buttonClick", target: this.get("element"), button: N});
                   }
               
                this.getButtonByValue(this._colorPicker._button).getMenu().hide();
               }
           }, this, true);
       }
   , 
      _resetColorPicker: function()
       {var I = this._colorPicker.getElementsByTagName("em")[0];
        var H = this._colorPicker.getElementsByTagName("strong")[0];
        I.style.backgroundColor = "transparent";
       
        H.innerHTML = "";
       }
   , 
      _makeColorButton: function(H)
       {if ( ! this._colorPicker)
           {this._createColorPicker(this.get("id"));
           }
        H.type = "color";
        H.menu = new YAHOO.widget.Overlay(this.get("id") + "_" + H.value + "_menu",  {visible: false, position: "absolute", 
          iframe: true});
        H.menu.setBody("");
        H.menu.render(this.get("cont"));
        C.addClass(H.menu.element, "yui-button-menu");
        C.addClass(H.menu.element, "yui-color-button-menu");
        H.menu.beforeShowEvent.subscribe(function()
           {H.menu.cfg.setProperty("zindex", 5);
            H.menu.cfg.setProperty("context",[this.getButtonById(H.id).get("element"), "tl", "bl"]);
            this._resetColorPicker();
            var I = this._colorPicker;
            if (I.parentNode)
               {I.parentNode.removeChild(I);
               }
            H.menu.setBody("");
            H.menu.appendToBody(I);
            this._colorPicker.style.display = "block";
           }, this, true);
       
        return H;
       }
   , 
      _makeSpinButton: function(U, 
      O)
       {U.addClass(this.CLASS_PREFIX + "-spinbutton");
        var V = this, Q = U._button.parentNode.parentNode, L = O.range, K = document.createElement("a"), J = document.createElement("a");
        K.href = "#";
        J.href = "#";
        K.tabIndex = "-1";
        J.tabIndex = "-1";
        K.className = "up";
        K.title = this.STR_SPIN_UP;
        K.innerHTML = this.STR_SPIN_UP;
        J.className = "down";
        J.title = this.STR_SPIN_DOWN;
        J.innerHTML = this.STR_SPIN_DOWN;
        Q.appendChild(K);
        Q.appendChild(J);
        var P = YAHOO.lang.substitute(this.STR_SPIN_LABEL,  {VALUE: U.get("label")});
        U.set("title", P);
       
        var T = function(W)
           {W = ((W < L[0]) ? L[0]: W);
            W = ((W > L[1]) ? L[1]: W);
            return W;
           };
        var S = this.browser;
        var I = false;
        var N = this.STR_SPIN_LABEL;
        if (this._titlebar && this._titlebar.firstChild)
           {I = this._titlebar.firstChild;
           }
       
        var H = function(X)
           {YAHOO.util.Event.stopEvent(X);
            if ( ! U.get("disabled") && (X.keyCode != 9))
               {var Y = parseInt(U.get("label"), 10);
                Y++;
                Y = T(Y);
                U.set("label", "" + Y);
                var W = YAHOO.lang.substitute(N,  {VALUE: U.get("label")});
                U.set("title", W);
                if ( ! S.webkit && I){}
                V._buttonClick(X, O);
               }
           };
       
        var R = function(X)
           {YAHOO.util.Event.stopEvent(X);
            if ( ! U.get("disabled") && (X.keyCode != 9))
               {var Y = parseInt(U.get("label"), 10);
                Y--;
                Y = T(Y);
                U.set("label", "" + Y);
                var W = YAHOO.lang.substitute(N,  {VALUE: U.get("label")});
                U.set("title", W);
                if ( ! S.webkit && I){}
                V._buttonClick(X, O);
               }
           };
       
        var M = function(W)
           {if (W.keyCode == 38)
               {H(W);
               }
            else 
               {if (W.keyCode == 40)
                   {R(W);
                   }
                else 
                   {if (W.keyCode == 107 && W.shiftKey)
                       {H(W);
                       }
                    else 
                       {if (W.keyCode == 109 && W.shiftKey)
                           {R(W);
                           }
                       }
                   }
               }
           };
        U.on("keydown", M, this, true);
        A.on(K, "mousedown", function(W)
           {A.stopEvent(W);
           }, this, true);
        A.on(J, "mousedown", function(W)
           {A.stopEvent(W);
           }, this, true);
        A.on(K, "click", H, this, true);
       
        A.on(J, "click", R, this, true);
       }
   , 
      _buttonClick: function(O, 
      I)
       {var H = true;
        if (O && O.type == "keypress")
           {if (O.keyCode == 9)
               {H = false;
               }
            else 
               {if ((O.keyCode === 13) || (O.keyCode === 0) || (O.keyCode === 32)){}
                else 
                   {H = false;
                   }
               }
           }
        if (H)
           {var Q = true, K = false;
            if (I.value)
               {K = this.fireEvent(I.value + "Click",  {type: I.value + "Click", target: this.get("element"), button: I}
                  );
                if (K === false)
                   {Q = false;
                   }
               }
            if (I.menucmd && Q)
               {K = this.fireEvent(I.menucmd + "Click",  {type: I.menucmd + "Click", target: this.get("element"), button: I});
                if (K === false)
                   {Q = false;
                   }
               }
            if (Q)
               {this.fireEvent("buttonClick",  {type: "buttonClick", target: this.get("element"), button: I});
               }
            if (I.type == "select")
               {var N = this.getButtonById(I.id);
                if (N.buttonType == "rich")
                   {var M = I.value;
                    for (var L = 0;L < I.menu.length;L++)
                       {if (I.menu[L].value == I.value)
                           {M = I.menu[L].text;
                            break;
                           }
                       }
                    N.set("label", '<span class="yui-toolbar-' + I.menucmd + "-" + (I.value).replace(/ /g, "-").toLowerCase() + '">' + M + 
                      "</span>");
                    var P = N.getMenu().getItems();
                    for (var J = 0;J < P.length;J++)
                       {if (P[J].value.toLowerCase() == I.value.toLowerCase())
                           {P[J].cfg.setProperty("checked", true);
                           }
                        else 
                           {P[J].cfg.setProperty("checked", false);
                           }
                       }
                   }
               }
            if (O)
               {
               A.stopEvent(O);
               }
           }
       }
   , 
      _keyNav: null, 
      _navCounter: null, 
      _navigateButtons: function(I)
       {switch (I.keyCode)
           {case 37: 
            case 39: 
                if (I.keyCode == 37)
                   {this._navCounter--;
                   }
                else 
                   {this._navCounter++;
                   }
                if (this._navCounter > (this._buttonList.length - 1))
                   {this._navCounter = 0;
                   }
                if (this._navCounter < 0)
                   {this._navCounter = (this._buttonList.length - 1);
                   }
                var H = this._buttonList[this._navCounter].get("element");
                if (this.browser.ie)
                   {H = this._buttonList[this._navCounter].get("element").getElementsByTagName("a")[0];
                   }
                if (this._buttonList[this._navCounter].get("disabled"))
                   {this._navigateButtons(I);
                   }
                else 
                   {H.focus();
                   }
               
                break;
           }
       }
   , 
      _handleFocus: function()
       {if ( ! this._keyNav)
           {var H = "keypress";
            if (this.browser.ie)
               {H = "keydown";
               }
            A.on(this.get("element"), H, this._navigateButtons, this, true);
            this._keyNav = true;
           
            this._navCounter = - 1;
           }
       }
   , 
      getButtonById: function(J)
       {var H = this._buttonList.length;
        for (var I = 0;I < H;I++)
           {if (this._buttonList[I].get("id") == J)
               {return this._buttonList[I];
               }
           }
       
        return false;
       }
   , 
      getButtonByValue: function(N)
       {var K = this.get("buttons");
        var I = K.length;
        for (var L = 0;L < I;L++)
           {if (K[L].group !== undefined)
               {for (var H = 0;H < K[L].buttons.length;H++)
                   {if ((K[L].buttons[H].value == N) || (K[L].buttons[H].menucmd == N))
                       {return this.getButtonById(K[L].buttons[H].id);
                       }
                    if (K[L].buttons[H].menu)
                       {for (var M = 0;M < K[L].buttons[H].menu.length;M++)
                           {if (K[L].buttons[H].menu[M].value == N)
                               {return this.getButtonById(K[L].buttons[H].id);
                               }
                           }
                       }
                   }
               }
            else 
               {if ((K[L].value == N) || (K[L].menucmd == N))
                   {return this.getButtonById(K[L].id);
                   }
                if (K[L].menu)
                   {for (var J = 0;J < K[L].menu.length;J++)
                       {if (K[L].menu[J].value == N)
                           {return this.getButtonById(K[L].id);
                           }
                       }
                   }
               }
           }
       
        return false;
       }
   , 
      getButtonByIndex: function(H)
       {if (this._buttonList[H])
           {return this._buttonList[H];
           }
        else 
           {
           return false;
           }
       }
   , 
      getButtons: function()
       {
       return this._buttonList;
       }
   , 
      disableButton: function(I)
       {var H = B.call(this, I);
        if (H)
           {H.set("disabled", true);
           }
        else 
           {
           return false;
           }
       }
   , 
      enableButton: function(I)
       {if (this.get("disabled"))
           {return false;
           }
        var H = B.call(this, I);
        if (H)
           {if (H.get("disabled"))
               {H.set("disabled", false);
               }
           }
        else 
           {
           return false;
           }
       }
   , 
      isSelected: function(I)
       {var H = B.call(this, I);
        if (H)
           {return H._selected;
           }
       
        return false;
       }
   , 
      selectButton: function(L, 
      J)
       {var I = B.call(this, L);
        if (I)
           {I.addClass("yui-button-selected");
            I.addClass("yui-button-" + I.get("value") + "-selected");
            I._selected = true;
            if (J)
               {if (I.buttonType == "rich")
                   {var K = I.getMenu().getItems();
                    for (var H = 0;H < K.length;H++)
                       {if (K[H].value == J)
                           {K[H].cfg.setProperty("checked", true);
                            I.set("label", '<span class="yui-toolbar-' + I.get("value") + "-" + (J).replace(/ /g, "-").toLowerCase() + '">' + K[H]._oText.nodeValue + "</span>");
                           }
                        else 
                           {K[H].cfg.setProperty("checked", false);
                           }
                       }
                   }
               }
           }
        else 
           {
           return false;
           }
       }
   , 
      deselectButton: function(I)
       {       var H = B.call(this, I);
        if (H)
           {           H.removeClass("yui-button-selected");
            H.removeClass("yui-button-" + H.get("value") + "-selected");
            H.removeClass("yui-button-hover");
            H._selected = false;
           }
        else 
           {
           return false;
           }
       }
   , 
      deselectAllButtons: function()
       {var H = this._buttonList.length;
        for (var I = 0;I < H;I++)
           {
           this.deselectButton(this._buttonList[I]);
           }
       }
   , 
      disableAllButtons: function()
       {if (this.get("disabled"))
           {return false;
           }
        var H = this._buttonList.length;
        for (var I = 0;I < H;I++)
           {
           this.disableButton(this._buttonList[I]);
           }
       }
   , 
      enableAllButtons: function()
       {if (this.get("disabled"))
           {return false;
           }
        var H = this._buttonList.length;
        for (var I = 0;I < H;I++)
           {
           this.enableButton(this._buttonList[I]);
           }
       }
   , 
      resetAllButtons: function(L)
       {if ( ! G.isObject(L))
           {L = {};
           }
        if (this.get("disabled"))
           {return false;
           }
        var H = this._buttonList.length;
        for (var I = 0;I < H;I++)
           {var K = this._buttonList[I];
            var J = K._configs.disabled._initialConfig.value;
            if (L[K.get("id")])
               {this.enableButton(K);
                this.selectButton(K);
               }
            else 
               {if (J)
                   {this.disableButton(K);
                   }
                else 
                   {this.enableButton(K);
                   }
               
                this.deselectButton(K);
               }
           }
       }
   , 
      destroyButton: function(L)
       {var J = B.call(this, L);
        if (J)
           {var K = J.get("id");
            J.destroy();
            var H = this._buttonList.length;
            for (var I = 0;I < H;I++)
               {               if (this._buttonList[I].get("id") == K)
                   {this._buttonList[I] = null;
                   }
               }
           }
        else 
           {
           return false;
           }
       }
   , 
      destroy: function()
       {this.get("element").innerHTML = "";
        this.get("element").className = "";
        for (var H in this)
           {if (G.hasOwnProperty(this, H))
               {this[H] = null;
               }
           }
       
        return true;
       }
   , 
      collapse: function(I)
       {var H = C.getElementsByClassName("collapse", "span", this._titlebar);
        if (I === false)
           {C.removeClass(this.get("cont").parentNode, "yui-toolbar-container-collapsed");
            if (H[0])
               {C.removeClass(H[0], "collapsed");
               }
            this.fireEvent("toolbarExpanded",  {type: "toolbarExpanded", target: this});
           }
        else 
           {if (H[0])
               {C.addClass(H[0], "collapsed");
               }
            C.addClass(this.get("cont").parentNode, "yui-toolbar-container-collapsed");
            this.fireEvent("toolbarCollapsed", 
            {type: "toolbarCollapsed", target: this});
           }
       }
   , 
      toString: function()
       {return "Toolbar (#" + this.get("element").id +") with " + this._buttonList.length + " buttons.";
       }
   });
   })();