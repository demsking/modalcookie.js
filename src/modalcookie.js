/*
 ModalCookie.js (https://github.com/demsking/modalcookie.js)
 Copyright 2016 Sébastien Demanou
 Apache License, Version 2.0
 */

(function(window) {

  if (!!window.ModalCookie) {
    return window.ModalCookie;
  }

  var document = window.document;
  var messageList = [];

  var ModalCookie = function(id, cookieExpireHours) {
    var defaultCookieName = 'nameModalCookie';
    var cookieName = id ? (id + 'NameModalCookie') : defaultCookieName;
    var modalId = id ? (id + 'InfoModalCookie') : 'infoModalCookie';
    var cookieExpireHour = cookieExpireHours ? cookieExpireHours : 365 * 24;
    var actionLinkId = id ? (id + 'DismissModalCookie') : 'dismissModalCookie';
    
    var modalElementClass = 'modal-cookie-overlay';
    var contentDialogClass = 'modal-cookie-dialog'
    var contentHeaderClass = 'modal-cookie-header'
    var contentFooterClass = 'modal-cookie-footer'
    var actionLinkClass = 'modal-cookie-action'
    
    var onOpen = function(element) {
      var actionsElement = element.querySelectorAll('.' + actionLinkClass);
      
      for (var i in actionsElement) {
        actionsElement[i].onclick = _actionLinkClick;
      }
    };
    
    var onClose = new Function();

    function _createActionElement(actionText, actionId, i, n) {
      var actionLink = document.createElement('a');
      
      _setElementText(actionLink, actionText);
      
      actionLink.id = actionId || 'action' + (Math.floor(Math.random() * 6) + 1 ) + 'ModalCookie';
      actionLink.href = '#';
      actionLink.className = actionLinkClass;
      actionLink.style.display = 'inline-block';
      actionLink.style.marginLeft = '15px';
      
      if (i == (n - 1)) {
        actionLink.style.marginRight = actionLink.style.marginLeft;
      }
      
      return actionLink;
    }
    
    function _createActionsElement(actions) {
      var actionsElement = document.createElement('div');
      
      if (actions) {
        switch (typeof actions) {
          case 'string':
            var _tmp_actions = {};
            
            _tmp_actions[actionLinkId + (Math.floor(Math.random() * 99) + 1 )] = actions;
            
            actions = _tmp_actions;
            break;
            
          case 'object':
            if (actions instanceof Array) {
              var _tmp_actions = {};
              
              for (var id in actions) {
                _tmp_actions[actionLinkId + id] = actions[id];
              }
              
              actions = _tmp_actions;
            }
            break;
        }
        
        var i = 0;
        var n = 0;
        
        for (var id in actions) {
          n++;
        }
        
        actionsElement.style.display = 'block';
        actionsElement.style.textAlign = 'center';
        actionsElement.style.marginTop = '20px';
        
        for (var id in actions) {
          actionsElement.appendChild(_createActionElement(actions[id], id, i++, n));
        }
      }
      
      return actionsElement;
    }

    function _createHeaderElement(modalText, modalActions) {
      var butterBarStyles = 'position:fixed;width:100%;background-color:#fff;box-shadow:-1px 2px 13px 1px rgba(0,0,0,0.1);' +
          'margin:0; left:0; top:0;padding:1em 2em;z-index:1000;text-align:center;';

      var modalElement = document.createElement('div');
      var actionsElement = _createActionsElement(modalActions);
      
      modalElement.id = modalId;
      modalElement.className = contentHeaderClass;
      modalElement.style.cssText = butterBarStyles;
      modalElement.appendChild(_createModalText(modalText));
      modalElement.appendChild(actionsElement);
      
      return modalElement;
    }

    function _createFooterElement(modalText, modalActions) {
      var butterBarStyles = 'position:fixed;width:100%;background-color:#fff;box-shadow:-1px 2px 13px 1px rgba(0,0,0,0.1);' +
          'margin:0; left:0; bottom:0;padding:1em 2em;;z-index:1000;text-align:center;';

      var modalElement = document.createElement('div');
      var actionsElement = _createActionsElement(modalActions);
      
      modalElement.id = modalId;
      modalElement.className = contentFooterClass;
      modalElement.style.cssText = butterBarStyles;
      modalElement.appendChild(_createModalText(modalText));
      modalElement.appendChild(actionsElement);
      
      return modalElement;
    }

    function _createDialogElement(modalText, modalActions) {
      var glassStyle = 'position:fixed;width:100%;height:100%;z-index:999;' +
          'top:0;left:0;opacity:0.9;filter:alpha(opacity=90);' +
          'background-color:#C2CFE1;';
      var dialogStyle = 'z-index:1000;position:fixed;left:50%;top:50%';
      var contentStyle = 'position:relative;left:-50%;margin-top:-25%;text-align:center;' +
          'background-color:#fff;padding:2em 4em;box-shadow:-1px 2px 13px 1px rgba(0,0,0,0.07)';

      var modalElement = document.createElement('div');
      modalElement.id = modalId;
      modalElement.className = modalElementClass;

      var glassPanel = document.createElement('div');
      glassPanel.style.cssText = glassStyle;

      var content = document.createElement('div');
      content.style.cssText = contentStyle;
      content.className = contentDialogClass;

      var dialog = document.createElement('div');
      dialog.style.cssText = dialogStyle;

      content.appendChild(_createModalText(modalText));
      content.appendChild(_createActionsElement(modalActions));
      
      dialog.appendChild(content);
      
      modalElement.appendChild(glassPanel);
      modalElement.appendChild(dialog);
      
      return modalElement;
    }

    function _setElementText(element, text) {
      element.innerHTML = text;
    }

    function _createModalText(modalText) {
      var consentText = document.createElement('div');
      _setElementText(consentText, modalText);
      return consentText;
    }

    function _actionLinkClick() {
      _saveUserPreference();
      _removeModal();
      return false;
    }

    function _show(modalText, modalActions, modalType, queued) {
        if (_shouldDisplay()) {
          if (!queued) {
            var args = Array.prototype.slice.call(arguments);
            
            args.push(true);
            
            messageList.push(args);
            
            if (messageList.length > 1) {
              return;
            }
          }
          
          var modalElement;
          
          switch (modalType) {
            case 'dialog':
              modalElement = _createDialogElement(modalText, modalActions);
              break;
              
            case 'header':
              modalElement = _createHeaderElement(modalText, modalActions);
              break;
              
            case 'footer':
              modalElement = _createFooterElement(modalText, modalActions);
              break;
          }
          
          var fragment = document.createDocumentFragment();
          fragment.appendChild(modalElement);
          document.body.appendChild(fragment);
          
          onOpen(modalElement);
        }
    }

    function showTopBar(modalText, modalActions) {
      _show(modalText, modalActions, 'header');
      
      return exports;
    }

    function showBottomBar(modalText, modalActions) {
      _show(modalText, modalActions, 'footer');
      
      return exports;
    }

    function showDialog(modalText, modalActions) {
      _show(modalText, modalActions, 'dialog');
      
      return exports;
    }

    function _removeModal() {
      var modalElement = document.getElementById(modalId);
      
      if (modalElement != null) {
        modalElement.parentNode.removeChild(modalElement);
      }
      
      if (messageList.length) {
        messageList.shift();
        
        if (messageList.length) {
          _show.apply(this, messageList[0]);
        }
      }
      
      onClose(modalElement);
    }

    function _saveUserPreference() {
      // Set the cookie expiry to cookieExpireHour hours after now.
      var expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + cookieExpireHour);
      document.cookie = cookieName + '=y; expires=' + expiryDate.toGMTString();
    }

    function _deleteUserPreference() {
      // Set the cookie expiry to cookieExpireHour hours after now.
      var expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() - 1);
      document.cookie = cookieName + '=y; expires=' + expiryDate.toGMTString() + '; path=/';
    }

    function _shouldDisplay() {
      // Display the header only if the cookie has not been set.
      return !document.cookie.match(new RegExp(cookieName + '=([^;]+)'));
    }

    function _triggerEvent(trigger, fn) {
      return (function(defaultFn) {
        return function(element) {
          if (fn(element) !== false) {
            defaultFn(element);
          }
        };
      })(trigger);
    }
    
    // Exports
    var exports = {
      showTopBar: showTopBar,
      showBottomBar: showBottomBar,
      showDialog: showDialog,
      close: function() {
        _removeModal();
        
        return this;
      },
      on: function(triggerName, fn) {
          switch (triggerName) {
            case 'open':
              onOpen = _triggerEvent(onOpen, fn);
              break;
              
            case 'close':
              onClose = _triggerEvent(onClose, fn);
              break;
          }
          
          return this;
      },
      preference: {
        reset: function() {
          _deleteUserPreference();
          
          return exports;
        },
        save: function() {
          _saveUserPreference();
          
          return exports;
        },
        setCookieExpireHours: function(cookieExpireHours) {
          cookieExpireHour = cookieExpireHours;
          
          return exports;
        },
      },
    };
    
    return exports;
  };

  window.ModalCookie = ModalCookie;
  return ModalCookie;
})(this);
