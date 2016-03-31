var express = require('express');
var Skyweb = require('skyweb');
var username = process.argv[2];
var password = process.argv[3];
if (!username || !password) {
    throw new Error('Username and password should be provided as commandline arguments!');
}
var skyweb = new Skyweb();
var app = express();
skyweb.login(username, password).then(function (skypeAccount) {
    console.log('Skyweb is initialized now');
    console.log('Here is some info about you:' + JSON.stringify(skyweb.skypeAccount.selfInfo, null, 2));
    console.log("skyweb.sendMessage:", skyweb.sendMessage('8:luandro', 'Testando API do Skype web. Não se apavore...', 'RichText', 'text'))
    // console.log('Your contacts : ' + JSON.stringify(skyweb.contactsService.contacts, null, 2));
    // console.log('Going incognito.');
    // skyweb.setStatus('Hidden');
});

app.use('/message', function(req, res) {
    console.log("req:", req)
})

skyweb.authRequestCallback = function (requests) {
    requests.forEach(function (request) {
        skyweb.acceptAuthRequest(request.sender);
        skyweb.sendMessage("8:" + request.sender, "I accepted you!");
    });
};
skyweb.messagesCallback = function (messages) {
    messages.forEach(function (message) {
        console.log("messages:", messages)
        if (message.resource.from.indexOf(username) === -1 && message.resource.messagetype !== 'Control/Typing' && message.resource.messagetype !== 'Control/ClearTyping') {
            var conversationLink = message.resource.conversationLink;
            var conversationId = conversationLink.substring(conversationLink.lastIndexOf('/') + 1);
            skyweb.sendMessage(conversationId, message.resource.content + '. Testando API do Skype com a finalidade de dominação mundial');
        }
    });
};
app.listen(6660, function() {
    console.log("http:localhost:6660")
})