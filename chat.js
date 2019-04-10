const now = new Date().getTime();
const username = ['user', now].join('-');
const textInput = document.getElementById('chat-input');
const textOutput = document.getElementById('chat-output');

let sendChat = function() {}; // will be filled in when ChatEngine connects

const ChatEngine = ChatEngineCore.create({
    publishKey: 'pub-c-bdb40805-5585-42c4-9735-49394e39fc75',
    subscribeKey: 'sub-c-de16ffd6-557b-11e9-b63d-361a0ea3785d',
    autoNetworkDetection: true
}, {
    globalChannel: 'chat-engine-demo-js',
    debug: true
});

ChatEngine.onAny((a) => {
    // console.log(a)
});

ChatEngine.connect(username, {
    signedOnTime: now
}, 'auth-key' + new Date().getTime());

ChatEngine.on('$.ready', (data) => {

    data.me.direct.onAny((a) => {
        console.log(a)
    })

    sendChat = function(e) {

        ChatEngine.global.emit('message', {
            text: textInput.value
        });

        textInput.value = '';

        return false;

    };

    checkSubmit = function(e) {

        if (e.keyCode == 13) {
            sendChat();
        }
    }

    ChatEngine.global.on('message', (payload) => {

        let div = document.createElement("p");
        div.innerHTML = payload.sender.uuid + ': ' + payload.data.text;
        textOutput.appendChild(div);

    });
});
