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

  var ModalCookie = function(cookieName, cookieExpireHours) {
    var cookieName = cookieName ? (cookieName + 'NameModalCookie') : 'nameModalCookie';
    var modalId = cookieName ? (cookieName + 'InfoModalCookie') : 'infoModalCookie';
    var cookieExpireHour = cookieExpireHours ? cookieExpireHours : 365 * 24;
    var dismissLinkId = cookieName ? (cookieName + 'DismissModalCookie') : 'dismissModalCookie';

    function _createHeaderElement(cookieText, dismissText, linkText, linkHref) {
      var butterBarStyles = 'position:fixed;width:100%;background-color:#eee;' +
          'margin:0; left:0; top:0;padding:4px;z-index:1000;text-align:center;';

      var modalElement = document.createElement('div');
      modalElement.id = modalId;
      modalElement.style.cssText = butterBarStyles;
      modalElement.appendChild(_createModalText(cookieText));

      if (!!linkText && !!linkHref) {
        modalElement.appendChild(_createInformationLink(linkText, linkHref));
      }
      modalElement.appendChild(_createDismissLink(dismissText));
      return modalElement;
    }

    function _createDialogElement(cookieText, dismissText, linkText, linkHref) {
      var glassStyle = 'position:fixed;width:100%;height:100%;z-index:999;' +
          'top:0;left:0;opacity:0.5;filter:alpha(opacity=50);' +
          'background-color:#ccc;';
      var dialogStyle = 'z-index:1000;position:fixed;left:50%;top:50%';
      var contentStyle = 'position:relative;left:-50%;margin-top:-25%;' +
          'background-color:#fff;padding:20px;box-shadow:4px 4px 25px #888;';

      var modalElement = document.createElement('div');
      modalElement.id = modalId;

      var glassPanel = document.createElement('div');
      glassPanel.style.cssText = glassStyle;

      var content = document.createElement('div');
      content.style.cssText = contentStyle;

      var dialog = document.createElement('div');
      dialog.style.cssText = dialogStyle;

      var dismissLink = _createDismissLink(dismissText);
      dismissLink.style.display = 'block';
      dismissLink.style.textAlign = 'right';
      dismissLink.style.marginTop = '8px';

      content.appendChild(_createModalText(cookieText));
      if (!!linkText && !!linkHref) {
        content.appendChild(_createInformationLink(linkText, linkHref));
      }
      content.appendChild(dismissLink);
      dialog.appendChild(content);
      modalElement.appendChild(glassPanel);
      modalElement.appendChild(dialog);
      return modalElement;
    }

    function _setElementText(element, text) {
      element.innerHTML = text;
    }

    function _createModalText(cookieText) {
      var consentText = document.createElement('div');
      _setElementText(consentText, cookieText);
      return consentText;
    }

    function _createDismissLink(dismissText) {
      var dismissLink = document.createElement('a');
      _setElementText(dismissLink, dismissText);
      dismissLink.id = dismissLinkId;
      dismissLink.href = '#';
      dismissLink.style.marginLeft = '24px';
      return dismissLink;
    }

    function _createInformationLink(linkText, linkHref) {
      var infoLink = document.createElement('a');
      _setElementText(infoLink, linkText);
      infoLink.href = linkHref;
      infoLink.target = '_blank';
      infoLink.style.marginLeft = '8px';
      return infoLink;
    }

    function _dismissLinkClick() {
      _saveUserPreference();
      _removeModal();
      return false;
    }

    function _show(cookieText, dismissText, linkText, linkHref, isDialog, queued) {
        if (_shouldDisplayConsent()) {
          if (!queued) {
            var args = Array.prototype.slice.call(arguments);
            
            args.push(true);
            
            messageList.push(args);
            
            if (messageList.length > 1) {
              return;
            }
          }
          
          //_removeModal();
          var modalElement = (isDialog) 
                             ? _createDialogElement(cookieText, dismissText, linkText, linkHref) 
                             : _createHeaderElement(cookieText, dismissText, linkText, linkHref);
              
          var fragment = document.createDocumentFragment();
          fragment.appendChild(modalElement);
          document.body.appendChild(fragment.cloneNode(true));
          document.getElementById(dismissLinkId).onclick = _dismissLinkClick;
        }
    }

    function showBar(cookieText, dismissText, linkText, linkHref) {
      _show(cookieText, dismissText, linkText, linkHref, false);
    }

    function showDialog(cookieText, dismissText, linkText, linkHref) {
      _show(cookieText, dismissText, linkText, linkHref, true);
    }

    function _removeModal() {
      var cookieChoiceElement = document.getElementById(modalId);
      if (cookieChoiceElement != null) {
        cookieChoiceElement.parentNode.removeChild(cookieChoiceElement);
      }
      if (messageList.length) {
        messageList.shift();
        
        if (messageList.length) {
          _show.apply(this, messageList[0]);
        }
      }
    }

    function _saveUserPreference() {
      // Set the cookie expiry to cookieExpireHour hours after now.
      var expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + cookieExpireHour);
      document.cookie = cookieName + '=y; expires=' + expiryDate.toGMTString();
    }

    function _shouldDisplayConsent() {
      // Display the header only if the cookie has not been set.
      return !document.cookie.match(new RegExp(cookieName + '=([^;]+)'));
    }

    var exports = {};
    exports.showBar = showBar;
    exports.showDialog = showDialog;
    return exports;
  };

  window.ModalCookie = ModalCookie;
  return ModalCookie;
})(this);
