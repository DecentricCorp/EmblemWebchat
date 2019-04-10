var ChatEngine
// create a bucket to store our ChatEngine Chat object
var myChat;
    
// create a bucket to store 
var me;

// compile handlebars templates and store them for use later
var peopleTemplate = Handlebars.compile($("#person-template").html())
var meTemplate = Handlebars.compile($("#message-template").html())
var userTemplate = Handlebars.compile($("#message-response-template").html())

var newPerson

$( document ).ready(()=>{
    $("button").click(sendMessage)
    $("#message-to-send").on('keyup', checkSubmit)
    initChat()
})


function initChat() {
    if (!keys[0]) {
       return setTimeout(()=>{
                return initChat()
            }, 500)
    } else {

    ChatEngine = ChatEngineCore.create({
        publishKey: 'pub-c-bdb40805-5585-42c4-9735-49394e39fc75',
        subscribeKey: 'sub-c-de16ffd6-557b-11e9-b63d-361a0ea3785d',
        autoNetworkDetection: true
    });
    
    
        // use a helper function to generate a new profile
        //var newPerson = generatePerson(true)/* keys[0].address *///generatePerson(true);
        //newPerson.address = keys[0].address
        
        if (!keys[0].person) {
            keys[0].person = generatePerson(true)
            keys[0].person.address = keys[0].address
            localStorage.setItem(storageLocation, JSON.stringify(keys))
            newPerson = keys[0].person
        } else {
            newPerson = keys[0].person
        }

        //const source_language = "en";
        //const target_language = "es";
    
        // this is our main function that starts our chat app
        const init = () => {
    
            // connect to ChatEngine with our generated user
            ChatEngine.connect(newPerson.uuid, newPerson);
    
            // when ChatEngine is booted, it returns your new User as `data.me`
            ChatEngine.on('$.ready', function (data) {
    
                // store my new user as `me`
                me = data.me;
    
                // create a new ChatEngine Chat
                myChat = new ChatEngine.Chat('emblemvault-demo3');
    
                // when we recieve messages in this chat, render them
                myChat.on('message', message => {
                    renderMessage(message);
                });
    
                // when a user comes online, render them in the online list
                myChat.on('$.online.*', data => {
                    getIdBalance(data.user.state.address, (balance)=>{
                        data.user.state.id_tokens = balance
                        $('#people-list ul').append(peopleTemplate(data.user));
                    })                
                })
    
                // when a user goes offline, remove them from the online list
                myChat.on('$.offline.*', data => {
                    $('#people-list ul').find('#' + data.user.uuid).remove();
                });
    
                // wait for our chat to be connected to the internet
                myChat.on('$.connected', () => {
    
                    // search for 50 old `message` events
                    myChat.search({
                        event: 'message',
                        limit: 20
                    }).
                        on('message', data => {
    
                            console.log(data)
    
                            // when messages are returned, render them like normal messages
                            renderMessage(data, true);
    
                        });
    
                });
    
                // bind our "send" button and return key to send message
                $('#sendMessage').on('submit', sendMessage);
    
            });
    
        };
    
        //generate event when user comes online and reconnect to chat
        ChatEngine.on('$.network.up.online', payload => {
            //console.log("ChatEngine online: ", event, payload);
            ChatEngine.reconnect();
        });
    
        //generate event when user goes offline
        ChatEngine.on('$.network.down.offline', payload => {
            //console.log("ChatEngine offline: ", event, payload);
        });
    
        
    
        // boot the app
        init();
    }
}
// send a message to the Chat
const sendMessage = () => {
    
    // get the message text from the text input
    let message = $('#message-to-send').val().trim();

    // if the message isn't empty
    if (message.length) {

        // emit the `message` event to everyone in the Chat
        myChat.emit('message', {
            text: message
            /*translate: {
            text: message,
            source: source_language,
            target: target_language
            }*/ });


        // clear out the text input
        $('#message-to-send').val('');
    }

    // stop form submit from bubbling
    return false;

};

// render messages in the list
const renderMessage = (message, isHistory = false) => {

    // use the generic user template by default
    let template = userTemplate;

    // if I happened to send the message, use the special template for myself
    if (message.sender.uuid == me.uuid) {
        template = meTemplate;
    }

    var user = message.sender.state
    getIdBalance(user.address, (balance)=>{
        //user.id_tokens = balance

        let el = template({
            messageOutput: message.data.text,
            time: getCurrentTime(),
            user: user,/* message.sender.state */
            id_tokens: balance
        });


        // render the message
        if (!isHistory) {
            $('.chat-history ul').append(el);
        } else {
            $('.chat-history ul').prepend(el);
        }

        // scroll to the bottom of the chat
        scrollToBottom();
    })

};

// scroll to the bottom of the window
const scrollToBottom = () => {
    $('.chat-history').scrollTop($('.chat-history')[0].scrollHeight)
    $(window).scrollTop($('.chat-history')[0].scrollHeight)
};

// get the current time in a nice format
const getCurrentTime = () => {
    return new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
};

const checkSubmit = function(e) {

    if (e.keyCode == 13) {
        sendMessage()
    }
}
//# sourceURL=pen.js