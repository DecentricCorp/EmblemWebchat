const now = new Date().getTime();
const username = ['user', now].join('-');

const onlineOutput = document.getElementById('online-list');

const ChatEngine = ChatEngineCore.create({
    publishKey: 'pub-c-bdb40805-5585-42c4-9735-49394e39fc75',
        subscribeKey: 'sub-c-de16ffd6-557b-11e9-b63d-361a0ea3785d'
}, {
    debug: true,
    globalChannel: 'emblemvault-demo3'
});

ChatEngine.on('$.ready', () => {

    let onlineEvents = 0;

    ChatEngine.global.on('$.online.*', (payload) => {

        let div = document.createElement("li");
        div.innerHTML = payload.user.uuid;
        div.className += " list-group-item";
        onlineOutput.appendChild(div);

        onlineEvents++;

    });

    setInterval(function() {
        console.log('users online', ChatEngine.global.users);
    }, 1000);

});

ChatEngine.connect(username, {
    signedOnTime: now
}, 'auth-key');
