# ModalCookie.js
A fork of cookiechoices.js to show modal on a page one time with cookie.

You can use it to add a cookie consent function to your website or just show a message to your visitor once time.

## Installation
Just `bower install --save modalcookie.js` or `npm install --save modalcookie.js`.

## API

### Constructor

```
ModalCookie([cookieName[, cookieExpireDay=365]])
```

### Methods

```javascript
ModalCookie.showDialog(message[, actionButtons])
ModalCookie.showTopBar(message[, actionButtons])
ModalCookie.showBottomBar(message[, actionButtons])
ModalCookie.close()
ModalCookie.preference.reset()
ModalCookie.preference.save()
ModalCookie.preference.setCookieExpireHours(cookieExpireHours)

```

### Events

```
ModalCookie.on(event, callback)
```

Where:
- event is `open` or `close`
- callback is a function with the prototype `callback(element)`. See below for an example.

## Usage
Include the `modalcookie.min.js` in your HTML and just call `ModalCookie().showDialog(message)`:

```html
<script src="/path/to/modalcookie.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function(event) {
    ModalCookie()
        .showDialog("Welcome to our website!", 'Thanks');
});
</script>
```
### Multiple calls
You can show sequentially multiple ModalCookie by adding the `cookieName` argument to the constructor:

```javascript
ModalCookie('welcome').showDialog("Welcome to our website!", 'Thanks');
ModalCookie('social').showDialog("Dont forget to join us on Facebook!", 'OK');
```

The second one will be displaying after the closing of the first one.

### ModalCookie Bar
You can also use `showTopBar(message)` and `showBottomBar(message)` to display your message at the top page:

```javascript
ModalCookie('welcome').showTopBar("Welcome to our website!", 'Thanks');
ModalCookie('social').showBottomBar("Dont forget to join us on Facebook!", 'OK');
```

### Multiple actions button

```javascript
var buttons = {
    idBtnOk: 'OK',
    idBtnCancel: 'Cancel'
};

ModalCookie().showDialog("Dont forget to join us on Facebook!", buttons);
```

### Events

```javascript
var message = 'Send us your feedback';
var buttons = {
    idBtnOk: 'OK',
    idBtnCancel: 'Cancel'
};

var modal = ModalCookie();

modal
    .on('open', function(element) {
        document.getElementById('idBtnCancel').addEventListener('click', function(e) {
            modal.preference.save();
            modal.close();
            
            window.location.href = 'http://example.com/feedback';
            
            e.preventDefault();
        });
        
        document.getElementById('buttonId').addEventListener('click', function(e) {
            modal.preference.setCookieExpireHours(1); // 1 hour
            modal.preference.save();
            modal.close();
        });
        
        return false; // Disable the default events
    })
    .showDialog(message, buttons);
});
```

## License
This project is a fork of cookieChoices, on of the more projects of Google, published under the Apache License, Version 2.0.

Copyright 2016 Sébastien Demanou

Copyright 2014 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.