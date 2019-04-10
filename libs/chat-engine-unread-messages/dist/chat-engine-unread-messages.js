(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {

    const package = require('../package.json');
    window.ChatEngineCore.plugin[package.name] = require('../src/plugin.js');

})();

},{"../package.json":2,"../src/plugin.js":3}],2:[function(require,module,exports){
module.exports={
  "author": "Ian Jennings",
  "name": "chat-engine-unread-messages",
  "version": "0.0.8",
  "main": "src/plugin.js",
  "dependencies": {
    "chat-engine": "^0.8.0"
  }
}

},{}],3:[function(require,module,exports){
/**
* Emits the ```$unread``` event on a {@link Chat} when a ```message``` event is received and the Chat is not marked as active.
* @module chat-engine-unread-messages
* @requires {@link ChatEngine}
*/

/**
* @function
* @example
* chat.plugin(ChatEngineCore.plugin['chat-engine-unread-messages']());
*
* // focused on the chatroom
* chat.unreadMessages.active();
*
* // looking at any other chatroom
* chat.unreadMessages.inactive();
*
* // unread count
* chat.unread;
* // 4
*
* chat.on('$unread', (payload) => {
*     console.log(payload.user, "sent a message you havn't seen in ", payload.chat, "the full event is", payload.event);
* });
*/
module.exports = () => {

    class extension {

        construct(data) {

            /**
            * Adds the property Chat.isActive to the applied Chat.
            * @member unreadMessages"."isActive
            * @ceextends Chat
            */
            this.parent.isActive = false;

            /**
            * Adds the property Chat.unreadCount to the applied Chat.
            * @member unreadMessages"."unreadCount
            * @ceextends Chat
            */
            this.parent.unreadCount = 0;

            this.parent.on('message', (event) => {

                if(!this.isActive) {

                    this.parent.unreadCount++;

                    /**
                    * @ceextends Chat
                    * @event $unread
                    * @param {Object} payload
                    * @param {Chat} chat This chat
                    * @param {User} sender The sender of the unread message
                    * @param {Object} event The raw ```message``` event.
                    */
                    this.parent.trigger('$unread', {
                        chat: this.parent,
                        sender: event.sender.uuid,
                        event: event
                    });

                }

            });

        }

        /**
        * Indicate that this {@link Chat} is visible to the user.
        * The property unreadCount is set to 0 and will not increment until inactive() is called.
        * @method unreadMessages"."active
        * @ceextends Chat
        */
        active() {

            /**
            @member unreadCount
            @ceextends Chat
            */
            this.isActive = true;
            this.parent.unreadCount = 0;
        }

        /**
        * Indicate that the chat is in the background and unread messages should increment.
        * @method unreadMessages"."active
        * @ceextends Chat
        */
        inactive() {
            this.isActive = false;
        }

    };

    // attach methods to Chat
    return {
        namespace: 'unreadMessages',
        extends: {
            Chat: extension
        }
    }

}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92Ni4xMS40L2xpYi9ub2RlX21vZHVsZXMvY2hhdC1lbmdpbmUtcGx1Z2luL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIudG1wL3dyYXAuanMiLCJwYWNrYWdlLmpzb24iLCJzcmMvcGx1Z2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbigpIHtcblxuICAgIGNvbnN0IHBhY2thZ2UgPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKTtcbiAgICB3aW5kb3cuQ2hhdEVuZ2luZUNvcmUucGx1Z2luW3BhY2thZ2UubmFtZV0gPSByZXF1aXJlKCcuLi9zcmMvcGx1Z2luLmpzJyk7XG5cbn0pKCk7XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwiYXV0aG9yXCI6IFwiSWFuIEplbm5pbmdzXCIsXG4gIFwibmFtZVwiOiBcImNoYXQtZW5naW5lLXVucmVhZC1tZXNzYWdlc1wiLFxuICBcInZlcnNpb25cIjogXCIwLjAuOFwiLFxuICBcIm1haW5cIjogXCJzcmMvcGx1Z2luLmpzXCIsXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImNoYXQtZW5naW5lXCI6IFwiXjAuOC4wXCJcbiAgfVxufVxuIiwiLyoqXG4qIEVtaXRzIHRoZSBgYGAkdW5yZWFkYGBgIGV2ZW50IG9uIGEge0BsaW5rIENoYXR9IHdoZW4gYSBgYGBtZXNzYWdlYGBgIGV2ZW50IGlzIHJlY2VpdmVkIGFuZCB0aGUgQ2hhdCBpcyBub3QgbWFya2VkIGFzIGFjdGl2ZS5cbiogQG1vZHVsZSBjaGF0LWVuZ2luZS11bnJlYWQtbWVzc2FnZXNcbiogQHJlcXVpcmVzIHtAbGluayBDaGF0RW5naW5lfVxuKi9cblxuLyoqXG4qIEBmdW5jdGlvblxuKiBAZXhhbXBsZVxuKiBjaGF0LnBsdWdpbihDaGF0RW5naW5lQ29yZS5wbHVnaW5bJ2NoYXQtZW5naW5lLXVucmVhZC1tZXNzYWdlcyddKCkpO1xuKlxuKiAvLyBmb2N1c2VkIG9uIHRoZSBjaGF0cm9vbVxuKiBjaGF0LnVucmVhZE1lc3NhZ2VzLmFjdGl2ZSgpO1xuKlxuKiAvLyBsb29raW5nIGF0IGFueSBvdGhlciBjaGF0cm9vbVxuKiBjaGF0LnVucmVhZE1lc3NhZ2VzLmluYWN0aXZlKCk7XG4qXG4qIC8vIHVucmVhZCBjb3VudFxuKiBjaGF0LnVucmVhZDtcbiogLy8gNFxuKlxuKiBjaGF0Lm9uKCckdW5yZWFkJywgKHBheWxvYWQpID0+IHtcbiogICAgIGNvbnNvbGUubG9nKHBheWxvYWQudXNlciwgXCJzZW50IGEgbWVzc2FnZSB5b3UgaGF2bid0IHNlZW4gaW4gXCIsIHBheWxvYWQuY2hhdCwgXCJ0aGUgZnVsbCBldmVudCBpc1wiLCBwYXlsb2FkLmV2ZW50KTtcbiogfSk7XG4qL1xubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG5cbiAgICBjbGFzcyBleHRlbnNpb24ge1xuXG4gICAgICAgIGNvbnN0cnVjdChkYXRhKSB7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiBBZGRzIHRoZSBwcm9wZXJ0eSBDaGF0LmlzQWN0aXZlIHRvIHRoZSBhcHBsaWVkIENoYXQuXG4gICAgICAgICAgICAqIEBtZW1iZXIgdW5yZWFkTWVzc2FnZXNcIi5cImlzQWN0aXZlXG4gICAgICAgICAgICAqIEBjZWV4dGVuZHMgQ2hhdFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMucGFyZW50LmlzQWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiBBZGRzIHRoZSBwcm9wZXJ0eSBDaGF0LnVucmVhZENvdW50IHRvIHRoZSBhcHBsaWVkIENoYXQuXG4gICAgICAgICAgICAqIEBtZW1iZXIgdW5yZWFkTWVzc2FnZXNcIi5cInVucmVhZENvdW50XG4gICAgICAgICAgICAqIEBjZWV4dGVuZHMgQ2hhdFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMucGFyZW50LnVucmVhZENvdW50ID0gMDtcblxuICAgICAgICAgICAgdGhpcy5wYXJlbnQub24oJ21lc3NhZ2UnLCAoZXZlbnQpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmlzQWN0aXZlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQudW5yZWFkQ291bnQrKztcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgKiBAY2VleHRlbmRzIENoYXRcbiAgICAgICAgICAgICAgICAgICAgKiBAZXZlbnQgJHVucmVhZFxuICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkXG4gICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtDaGF0fSBjaGF0IFRoaXMgY2hhdFxuICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7VXNlcn0gc2VuZGVyIFRoZSBzZW5kZXIgb2YgdGhlIHVucmVhZCBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IFRoZSByYXcgYGBgbWVzc2FnZWBgYCBldmVudC5cbiAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQudHJpZ2dlcignJHVucmVhZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXQ6IHRoaXMucGFyZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VuZGVyOiBldmVudC5zZW5kZXIudXVpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50OiBldmVudFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIEluZGljYXRlIHRoYXQgdGhpcyB7QGxpbmsgQ2hhdH0gaXMgdmlzaWJsZSB0byB0aGUgdXNlci5cbiAgICAgICAgKiBUaGUgcHJvcGVydHkgdW5yZWFkQ291bnQgaXMgc2V0IHRvIDAgYW5kIHdpbGwgbm90IGluY3JlbWVudCB1bnRpbCBpbmFjdGl2ZSgpIGlzIGNhbGxlZC5cbiAgICAgICAgKiBAbWV0aG9kIHVucmVhZE1lc3NhZ2VzXCIuXCJhY3RpdmVcbiAgICAgICAgKiBAY2VleHRlbmRzIENoYXRcbiAgICAgICAgKi9cbiAgICAgICAgYWN0aXZlKCkge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgIEBtZW1iZXIgdW5yZWFkQ291bnRcbiAgICAgICAgICAgIEBjZWV4dGVuZHMgQ2hhdFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQudW5yZWFkQ291bnQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICogSW5kaWNhdGUgdGhhdCB0aGUgY2hhdCBpcyBpbiB0aGUgYmFja2dyb3VuZCBhbmQgdW5yZWFkIG1lc3NhZ2VzIHNob3VsZCBpbmNyZW1lbnQuXG4gICAgICAgICogQG1ldGhvZCB1bnJlYWRNZXNzYWdlc1wiLlwiYWN0aXZlXG4gICAgICAgICogQGNlZXh0ZW5kcyBDaGF0XG4gICAgICAgICovXG4gICAgICAgIGluYWN0aXZlKCkge1xuICAgICAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgLy8gYXR0YWNoIG1ldGhvZHMgdG8gQ2hhdFxuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWVzcGFjZTogJ3VucmVhZE1lc3NhZ2VzJyxcbiAgICAgICAgZXh0ZW5kczoge1xuICAgICAgICAgICAgQ2hhdDogZXh0ZW5zaW9uXG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdfQ==
