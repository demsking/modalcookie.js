# ModalCookie.js
A fork of cookiechoices.js to show modal on a page one time with cookie.

You can use it to add a cookie consent function to your website or just show a message to your visitor once time.

## Installation
Just `bower install --save modalcookie.js` or `npm install --save modalcookie.js`.

## Prototype

### Constructor

```
ModalCookie([cookieName[, cookieExpireDay=365]])
```

### Methods

```
ModalCookie.showDialog(message[, dismissText[, linkText[, linkHref]]])
ModalCookie.showBar(message[, dismissText[, linkText[, linkHref]]])
```

## Usage
Include the `modalcookie.min.js` in your HTML and just call `ModalCookie().showDialog(message)`:

```html
<script src="/path/to/modalcookie.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function(event) {
    ModalCookie().showDialog("We use cookies to personalise content and ads, to provide social media features and to analyse our traffic.",
        'OK', 'Know more', 'http://example.com/privacy-policy');
});
</script>
```
### Multiple calls
You can show sequentially multiple ModalCookie by adding the `cookieName` argument to the constructor:

```javascript
ModalCookie('welcome').showDialog("Welcome to our website!", 'Thanks', 'About us', 'http://example.com/about');
ModalCookie('newsletter').showDialog("Subscribe to our newsletter", 'Thanks', 'Subscribe now', 'http://example.com/newsletter');
```

The second one will be displaying after the closing of the first one.

### ModalCookie Bar
You can also use the `showBar(message)` function to display your message at the top page:

```javascript
ModalCookie('welcome').showBar("Welcome to our website!", 'Clone');
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