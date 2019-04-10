(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function() {

    const pkg = require('../package.json');
    window.ChatEngineCore.plugin[pkg.name] = require('../src/plugin.js');

})();

},{"../package.json":2,"../src/plugin.js":3}],2:[function(require,module,exports){
module.exports={
  "name": "chat-engine-desktop-notifications",
  "version": "0.0.7",
  "author": "Ian Jennings",
  "main": "src/plugin.js",
  "dependencies": {
    "chat-engine": "^0.9.21"
  }
}

},{}],3:[function(require,module,exports){
/**
* @overview Desktop notifications ensure that a message is never missed, even when the app is not in focus. This plugin enables you to fire a desktop notification whenever a message is received in a chat object.
* Fires a Notification via the [Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/notification)
* whenever a message is received in the supplied {@link Chat}.
* @module chat-engine-desktop-notifications
*/

const defaults = {timeout: 1000};

/**
* @function
* @ceplugin
* @param {Object} config The config object
* @param {String} [config.event="message"] The event that will trigger a desktop notification
* @param {module:chat-engine-desktop-notifications~title} config.title A function that returns title of the notification.
* @param {module:chat-engine-desktop-notifications~message} config.message A function that returns the notification message.
* @param {module:chat-engine-desktop-notifications~icon} config.icon A function that returns link to an image to use for the notification icon.
* @param {module:chat-engine-desktop-notifications~callback} config.callback A function to call when the notification is clicked.
* @example
* room.chat.plugin(ChatEngineCore.plugin['chat-engine-desktop-notifications']({
*     title: (event) => {
*         return 'Message In ' + room.name
*     },
*     message: (event) => {
*         return event.data.text;
*     },
*     icon: (event) => {
*         return '/examples/flowtron/logo@2x.png';
*     },
*     callback: (event) => {
*         window.focus();
*     }
* }));
*/
module.exports = (config = {}) => {

    // request permission on page load
    document.addEventListener('DOMContentLoaded', function () {
      if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
      }

      if (Notification.permission !== "granted")
        Notification.requestPermission();
    });

    let lastNotification = false;

    function notifyMe(title, icon, body, callback) {

      if(lastNotification) {

        lastNotification.close();
        lastNotification = false;

      }

      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      } else {

        lastNotification = new Notification(title || 'Notification title', {
          icon: icon || 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
          body: body || "Hey there! You've been notified!",
        });


      /**
       * Fired when the desktop notification is clicked on by the user.
       * @callback callback
       * @param {Object} event
       */
        lastNotification.onclick = callback;

      }

    }

    // Set the name of the hidden property and the change event for visibility
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    let defaultTitle = (event) => {
        return 'New Message In ' + event.chat.channel;
    };

    let defaultIcon = (event) => {
        return false
    };

    let defaultMessage = (event) => {
        return JSON.stringify(event.data);
    };

    let defaultCallback = (event) => {
      window.focus();
      return false;
    };

    config.event = config.event || 'message';
    config.title = config.title || defaultTitle;
    config.icon = config.icon || defaultIcon;
    config.message = config.message || defaultMessage;
    config.callback = config.callback || defaultCallback;

    let isVisible = true;

    function handleVisibilityChange() {
      if (document[hidden]) {
        isVisible = false;
      } else {
        isVisible = true;
      }
    }

    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
      console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
    } else {
      // Handle page visibility change
      document.addEventListener(visibilityChange, handleVisibilityChange, false);
    }

    class extension {

        construct() {

            this.parent.on(config.event, (event) => {

                if(!isVisible) {

                /**
                 * Provides a template function to generate a notification title.
                 * @callback title
                 * @param {Object} title
                 */

                /**
                 * Provides a template function to generate a notification icon.
                 * @callback icon
                 * @param {Object} event
                 */

                /**
                 * Provides a template function to generate a notification message.
                 * @callback message
                 * @param {Object} event
                 */
                  notifyMe(config.title(event), config.icon(event), config.message(event), config.callback);
                }

            });

        }

    };

    // attach methods to Chat
    return {
        namespace: 'desktop-notifications',
        extends: {
            Chat: extension
        }
    }

}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92Ni4xNC4xL2xpYi9ub2RlX21vZHVsZXMvY2hhdC1lbmdpbmUtcGx1Z2luL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIudG1wL3dyYXAuanMiLCJwYWNrYWdlLmpzb24iLCJzcmMvcGx1Z2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgY29uc3QgcGtnID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJyk7XG4gICAgd2luZG93LkNoYXRFbmdpbmVDb3JlLnBsdWdpbltwa2cubmFtZV0gPSByZXF1aXJlKCcuLi9zcmMvcGx1Z2luLmpzJyk7XG5cbn0pKCk7XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwibmFtZVwiOiBcImNoYXQtZW5naW5lLWRlc2t0b3Atbm90aWZpY2F0aW9uc1wiLFxuICBcInZlcnNpb25cIjogXCIwLjAuN1wiLFxuICBcImF1dGhvclwiOiBcIklhbiBKZW5uaW5nc1wiLFxuICBcIm1haW5cIjogXCJzcmMvcGx1Z2luLmpzXCIsXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImNoYXQtZW5naW5lXCI6IFwiXjAuOS4yMVwiXG4gIH1cbn1cbiIsIi8qKlxuKiBAb3ZlcnZpZXcgRGVza3RvcCBub3RpZmljYXRpb25zIGVuc3VyZSB0aGF0IGEgbWVzc2FnZSBpcyBuZXZlciBtaXNzZWQsIGV2ZW4gd2hlbiB0aGUgYXBwIGlzIG5vdCBpbiBmb2N1cy4gVGhpcyBwbHVnaW4gZW5hYmxlcyB5b3UgdG8gZmlyZSBhIGRlc2t0b3Agbm90aWZpY2F0aW9uIHdoZW5ldmVyIGEgbWVzc2FnZSBpcyByZWNlaXZlZCBpbiBhIGNoYXQgb2JqZWN0LlxuKiBGaXJlcyBhIE5vdGlmaWNhdGlvbiB2aWEgdGhlIFtXZWIgTm90aWZpY2F0aW9ucyBBUEldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9ub3RpZmljYXRpb24pXG4qIHdoZW5ldmVyIGEgbWVzc2FnZSBpcyByZWNlaXZlZCBpbiB0aGUgc3VwcGxpZWQge0BsaW5rIENoYXR9LlxuKiBAbW9kdWxlIGNoYXQtZW5naW5lLWRlc2t0b3Atbm90aWZpY2F0aW9uc1xuKi9cblxuY29uc3QgZGVmYXVsdHMgPSB7dGltZW91dDogMTAwMH07XG5cbi8qKlxuKiBAZnVuY3Rpb25cbiogQGNlcGx1Z2luXG4qIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBvYmplY3RcbiogQHBhcmFtIHtTdHJpbmd9IFtjb25maWcuZXZlbnQ9XCJtZXNzYWdlXCJdIFRoZSBldmVudCB0aGF0IHdpbGwgdHJpZ2dlciBhIGRlc2t0b3Agbm90aWZpY2F0aW9uXG4qIEBwYXJhbSB7bW9kdWxlOmNoYXQtZW5naW5lLWRlc2t0b3Atbm90aWZpY2F0aW9uc350aXRsZX0gY29uZmlnLnRpdGxlIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRpdGxlIG9mIHRoZSBub3RpZmljYXRpb24uXG4qIEBwYXJhbSB7bW9kdWxlOmNoYXQtZW5naW5lLWRlc2t0b3Atbm90aWZpY2F0aW9uc35tZXNzYWdlfSBjb25maWcubWVzc2FnZSBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgbm90aWZpY2F0aW9uIG1lc3NhZ2UuXG4qIEBwYXJhbSB7bW9kdWxlOmNoYXQtZW5naW5lLWRlc2t0b3Atbm90aWZpY2F0aW9uc35pY29ufSBjb25maWcuaWNvbiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBsaW5rIHRvIGFuIGltYWdlIHRvIHVzZSBmb3IgdGhlIG5vdGlmaWNhdGlvbiBpY29uLlxuKiBAcGFyYW0ge21vZHVsZTpjaGF0LWVuZ2luZS1kZXNrdG9wLW5vdGlmaWNhdGlvbnN+Y2FsbGJhY2t9IGNvbmZpZy5jYWxsYmFjayBBIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgbm90aWZpY2F0aW9uIGlzIGNsaWNrZWQuXG4qIEBleGFtcGxlXG4qIHJvb20uY2hhdC5wbHVnaW4oQ2hhdEVuZ2luZUNvcmUucGx1Z2luWydjaGF0LWVuZ2luZS1kZXNrdG9wLW5vdGlmaWNhdGlvbnMnXSh7XG4qICAgICB0aXRsZTogKGV2ZW50KSA9PiB7XG4qICAgICAgICAgcmV0dXJuICdNZXNzYWdlIEluICcgKyByb29tLm5hbWVcbiogICAgIH0sXG4qICAgICBtZXNzYWdlOiAoZXZlbnQpID0+IHtcbiogICAgICAgICByZXR1cm4gZXZlbnQuZGF0YS50ZXh0O1xuKiAgICAgfSxcbiogICAgIGljb246IChldmVudCkgPT4ge1xuKiAgICAgICAgIHJldHVybiAnL2V4YW1wbGVzL2Zsb3d0cm9uL2xvZ29AMngucG5nJztcbiogICAgIH0sXG4qICAgICBjYWxsYmFjazogKGV2ZW50KSA9PiB7XG4qICAgICAgICAgd2luZG93LmZvY3VzKCk7XG4qICAgICB9XG4qIH0pKTtcbiovXG5tb2R1bGUuZXhwb3J0cyA9IChjb25maWcgPSB7fSkgPT4ge1xuXG4gICAgLy8gcmVxdWVzdCBwZXJtaXNzaW9uIG9uIHBhZ2UgbG9hZFxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIU5vdGlmaWNhdGlvbikge1xuICAgICAgICBhbGVydCgnRGVza3RvcCBub3RpZmljYXRpb25zIG5vdCBhdmFpbGFibGUgaW4geW91ciBicm93c2VyLiBUcnkgQ2hyb21pdW0uJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKE5vdGlmaWNhdGlvbi5wZXJtaXNzaW9uICE9PSBcImdyYW50ZWRcIilcbiAgICAgICAgTm90aWZpY2F0aW9uLnJlcXVlc3RQZXJtaXNzaW9uKCk7XG4gICAgfSk7XG5cbiAgICBsZXQgbGFzdE5vdGlmaWNhdGlvbiA9IGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gbm90aWZ5TWUodGl0bGUsIGljb24sIGJvZHksIGNhbGxiYWNrKSB7XG5cbiAgICAgIGlmKGxhc3ROb3RpZmljYXRpb24pIHtcblxuICAgICAgICBsYXN0Tm90aWZpY2F0aW9uLmNsb3NlKCk7XG4gICAgICAgIGxhc3ROb3RpZmljYXRpb24gPSBmYWxzZTtcblxuICAgICAgfVxuXG4gICAgICBpZiAoTm90aWZpY2F0aW9uLnBlcm1pc3Npb24gIT09IFwiZ3JhbnRlZFwiKSB7XG4gICAgICAgIE5vdGlmaWNhdGlvbi5yZXF1ZXN0UGVybWlzc2lvbigpO1xuICAgICAgfSBlbHNlIHtcblxuICAgICAgICBsYXN0Tm90aWZpY2F0aW9uID0gbmV3IE5vdGlmaWNhdGlvbih0aXRsZSB8fCAnTm90aWZpY2F0aW9uIHRpdGxlJywge1xuICAgICAgICAgIGljb246IGljb24gfHwgJ2h0dHA6Ly9jZG4uc3N0YXRpYy5uZXQvc3RhY2tleGNoYW5nZS9pbWcvbG9nb3Mvc28vc28taWNvbi5wbmcnLFxuICAgICAgICAgIGJvZHk6IGJvZHkgfHwgXCJIZXkgdGhlcmUhIFlvdSd2ZSBiZWVuIG5vdGlmaWVkIVwiLFxuICAgICAgICB9KTtcblxuXG4gICAgICAvKipcbiAgICAgICAqIEZpcmVkIHdoZW4gdGhlIGRlc2t0b3Agbm90aWZpY2F0aW9uIGlzIGNsaWNrZWQgb24gYnkgdGhlIHVzZXIuXG4gICAgICAgKiBAY2FsbGJhY2sgY2FsbGJhY2tcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudFxuICAgICAgICovXG4gICAgICAgIGxhc3ROb3RpZmljYXRpb24ub25jbGljayA9IGNhbGxiYWNrO1xuXG4gICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIG5hbWUgb2YgdGhlIGhpZGRlbiBwcm9wZXJ0eSBhbmQgdGhlIGNoYW5nZSBldmVudCBmb3IgdmlzaWJpbGl0eVxuICAgIHZhciBoaWRkZW4sIHZpc2liaWxpdHlDaGFuZ2U7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudC5oaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHsgLy8gT3BlcmEgMTIuMTAgYW5kIEZpcmVmb3ggMTggYW5kIGxhdGVyIHN1cHBvcnRcbiAgICAgIGhpZGRlbiA9IFwiaGlkZGVuXCI7XG4gICAgICB2aXNpYmlsaXR5Q2hhbmdlID0gXCJ2aXNpYmlsaXR5Y2hhbmdlXCI7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQubXNIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGhpZGRlbiA9IFwibXNIaWRkZW5cIjtcbiAgICAgIHZpc2liaWxpdHlDaGFuZ2UgPSBcIm1zdmlzaWJpbGl0eWNoYW5nZVwiO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50LndlYmtpdEhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgaGlkZGVuID0gXCJ3ZWJraXRIaWRkZW5cIjtcbiAgICAgIHZpc2liaWxpdHlDaGFuZ2UgPSBcIndlYmtpdHZpc2liaWxpdHljaGFuZ2VcIjtcbiAgICB9XG5cbiAgICBsZXQgZGVmYXVsdFRpdGxlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJldHVybiAnTmV3IE1lc3NhZ2UgSW4gJyArIGV2ZW50LmNoYXQuY2hhbm5lbDtcbiAgICB9O1xuXG4gICAgbGV0IGRlZmF1bHRJY29uID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH07XG5cbiAgICBsZXQgZGVmYXVsdE1lc3NhZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGV2ZW50LmRhdGEpO1xuICAgIH07XG5cbiAgICBsZXQgZGVmYXVsdENhbGxiYWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICB3aW5kb3cuZm9jdXMoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgY29uZmlnLmV2ZW50ID0gY29uZmlnLmV2ZW50IHx8ICdtZXNzYWdlJztcbiAgICBjb25maWcudGl0bGUgPSBjb25maWcudGl0bGUgfHwgZGVmYXVsdFRpdGxlO1xuICAgIGNvbmZpZy5pY29uID0gY29uZmlnLmljb24gfHwgZGVmYXVsdEljb247XG4gICAgY29uZmlnLm1lc3NhZ2UgPSBjb25maWcubWVzc2FnZSB8fCBkZWZhdWx0TWVzc2FnZTtcbiAgICBjb25maWcuY2FsbGJhY2sgPSBjb25maWcuY2FsbGJhY2sgfHwgZGVmYXVsdENhbGxiYWNrO1xuXG4gICAgbGV0IGlzVmlzaWJsZSA9IHRydWU7XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlKCkge1xuICAgICAgaWYgKGRvY3VtZW50W2hpZGRlbl0pIHtcbiAgICAgICAgaXNWaXNpYmxlID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpc1Zpc2libGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdhcm4gaWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IGFkZEV2ZW50TGlzdGVuZXIgb3IgdGhlIFBhZ2UgVmlzaWJpbGl0eSBBUElcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPT09IFwidW5kZWZpbmVkXCIgfHwgdHlwZW9mIGRvY3VtZW50W2hpZGRlbl0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiVGhpcyBkZW1vIHJlcXVpcmVzIGEgYnJvd3Nlciwgc3VjaCBhcyBHb29nbGUgQ2hyb21lIG9yIEZpcmVmb3gsIHRoYXQgc3VwcG9ydHMgdGhlIFBhZ2UgVmlzaWJpbGl0eSBBUEkuXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBIYW5kbGUgcGFnZSB2aXNpYmlsaXR5IGNoYW5nZVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih2aXNpYmlsaXR5Q2hhbmdlLCBoYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgY2xhc3MgZXh0ZW5zaW9uIHtcblxuICAgICAgICBjb25zdHJ1Y3QoKSB7XG5cbiAgICAgICAgICAgIHRoaXMucGFyZW50Lm9uKGNvbmZpZy5ldmVudCwgKGV2ZW50KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZighaXNWaXNpYmxlKSB7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBQcm92aWRlcyBhIHRlbXBsYXRlIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGEgbm90aWZpY2F0aW9uIHRpdGxlLlxuICAgICAgICAgICAgICAgICAqIEBjYWxsYmFjayB0aXRsZVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0aXRsZVxuICAgICAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUHJvdmlkZXMgYSB0ZW1wbGF0ZSBmdW5jdGlvbiB0byBnZW5lcmF0ZSBhIG5vdGlmaWNhdGlvbiBpY29uLlxuICAgICAgICAgICAgICAgICAqIEBjYWxsYmFjayBpY29uXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50XG4gICAgICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBQcm92aWRlcyBhIHRlbXBsYXRlIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGEgbm90aWZpY2F0aW9uIG1lc3NhZ2UuXG4gICAgICAgICAgICAgICAgICogQGNhbGxiYWNrIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgIG5vdGlmeU1lKGNvbmZpZy50aXRsZShldmVudCksIGNvbmZpZy5pY29uKGV2ZW50KSwgY29uZmlnLm1lc3NhZ2UoZXZlbnQpLCBjb25maWcuY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8vIGF0dGFjaCBtZXRob2RzIHRvIENoYXRcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lc3BhY2U6ICdkZXNrdG9wLW5vdGlmaWNhdGlvbnMnLFxuICAgICAgICBleHRlbmRzOiB7XG4gICAgICAgICAgICBDaGF0OiBleHRlbnNpb25cbiAgICAgICAgfVxuICAgIH1cblxufVxuIl19
