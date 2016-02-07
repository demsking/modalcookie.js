/*
 ModalCookie.js
 https://github.com/demsking/modalcookie.js
 Copyright 2016 Sébastien Demanou
 */

(function(window) {

  if (!!window.ModalCookie) {
    return window.ModalCookie;
  }

  var document = window.document;
  var messageList = [];
  // IE8 does not support textContent, so we should fallback to innerText.
  var supportsTextContent = 'textContent' in document.body;

  var ModalCookie = function(cookieName, cookieExpireDay) {
    var cookieName = cookieName ? (cookieName + 'Name') : 'displayModal';
    var cookieConsentId = cookieName ? (cookieName + 'Info') : 'cookieChoiceInfo';
    var cookieExpireDay = cookieExpireDay ? cookieExpireDay : 365;
    var dismissLinkId = cookieName ? (cookieName + 'Dismiss') : 'cookieChoiceDismiss';

    function _createHeaderElement(cookieText, dismissText, linkText, linkHref) {
      var butterBarStyles = 'position:fixed;width:100%;background-color:#eee;' +
          'margin:0; left:0; top:0;padding:4px;z-index:1000;text-align:center;';

      var cookieConsentElement = document.createElement('div');
      cookieConsentElement.id = cookieConsentId;
      cookieConsentElement.style.cssText = butterBarStyles;
      cookieConsentElement.appendChild(_createConsentText(cookieText));

      if (!!linkText && !!linkHref) {
        cookieConsentElement.appendChild(_createInformationLink(linkText, linkHref));
      }
      cookieConsentElement.appendChild(_createDismissLink(dismissText));
      return cookieConsentElement;
    }

    function _createDialogElement(cookieText, dismissText, linkText, linkHref) {
      var glassStyle = 'position:fixed;width:100%;height:100%;z-index:999;' +
          'top:0;left:0;opacity:0.5;filter:alpha(opacity=50);' +
          'background-color:#ccc;';
      var dialogStyle = 'z-index:1000;position:fixed;left:50%;top:50%';
      var contentStyle = 'position:relative;left:-50%;margin-top:-25%;' +
          'background-color:#fff;padding:20px;box-shadow:4px 4px 25px #888;';

      var cookieConsentElement = document.createElement('div');
      cookieConsentElement.id = cookieConsentId;

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

      content.appendChild(_createConsentText(cookieText));
      if (!!linkText && !!linkHref) {
        content.appendChild(_createInformationLink(linkText, linkHref));
      }
      content.appendChild(dismissLink);
      dialog.appendChild(content);
      cookieConsentElement.appendChild(glassPanel);
      cookieConsentElement.appendChild(dialog);
      return cookieConsentElement;
    }

    function _setElementText(element, text) {
      if (supportsTextContent) {
        element.textContent = text;
      } else {
        element.innerText = text;
      }
    }

    function _createConsentText(cookieText) {
      var consentText = document.createElement('span');
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
            console.log(queued)
            console.log(messageList.length)
          }
          
          //_removeModal();
          var consentElement = (isDialog) 
                             ? _createDialogElement(cookieText, dismissText, linkText, linkHref) 
                             : _createHeaderElement(cookieText, dismissText, linkText, linkHref);
              
          var fragment = document.createDocumentFragment();
          fragment.appendChild(consentElement);
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
      var cookieChoiceElement = document.getElementById(cookieConsentId);
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
      // Set the cookie expiry to cookieExpireDay day after today.
      var expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + cookieExpireDay);
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
