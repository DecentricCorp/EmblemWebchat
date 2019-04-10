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
