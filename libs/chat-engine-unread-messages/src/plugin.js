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
