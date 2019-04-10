# Unread Messages Plugin

Adds the ability to count unread messages in a ChatEngine Chat

### Quick Start

0. Have ChatEngine instantiated and connected, and have a channel you want to count unread messages on
```js
const ChatEngine = ChatEngineCore.create({
    publishKey: 'pub-key-here',
    subscribeKey: 'sub-key-here',
});

ChatEngine.connect('Username');
ChatEngine.on('$.ready', () => { ... });
```

1. Attach this plugin to the channel you want, in this case global
```js
ChatEngine.global.plugin(ChatEngineCore.plugin['chat-engine-unread-messages']());
```

2. The plugin needs to be notified when the user is considered active or inactive to properly count messages
```js
// sets unreadCount to 0, stops counting unread messages and stops emitting events
ChatEngine.global.unreadMessages.active();
```
```js
// starts counting unread messages and starts emitting events - default state
ChatEngine.global.unreadMessages.inactive();
```

3. Listen for the `$unread` events that emit whenever your channel recieves a message while it is marked as inactive
```js
ChatEngine.global.on('$unread', () => {
    console.log(ChatEngine.global.unreadCount);
});
```
