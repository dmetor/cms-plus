
// For use here and in other places (see index.html)

var WidgetOptions = {
  behaviour : {
    useCookies : true
  },
  effects : {
    effectDuration : 100,
    widgetShow : 'fade',
    widgetHide : 'slide',
    widgetClose : 'slide',
    widgetExtend : 'slide',
    widgetCollapse : 'slide',
    widgetOpenEdit : 'slide',
    widgetCloseEdit : 'slide',
    widgetCancelEdit : 'slide'
  },
	i18n : {
	  editText : '<img src="css/images/edit.png" alt="Settings" width="16" height="16" />',
	  closeText : '<img src="css/images/close.png" alt="Close" width="16" height="16" />',
	  collapseText : '<img src="css/images/collapse.png" alt="Close" width="16" height="16" />',
	  cancelEditText: '<img src="css/images/edit.png" alt="Settings" width="16" height="16" />',
	  extendText : '<img src="css/images/extend.png" alt="Close" width="16" height="16" />'
	}
}

// DOM ready!

$(function() {
    // Use the cookie plugin
    $.fn.EasyWidgets(WidgetOptions);
    DisableWidgets();
});

