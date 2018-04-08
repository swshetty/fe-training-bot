var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
const axios = require('axios');

app.set('port', (process.env.PORT || 5000))

app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded


var sess;
// index
app.get('/', function (req, res) {
  res.send('hello world i am a secret bot')
})


//This is the route the API will call
app.post('/new-message', function(req, res) {
  //console.log("req == "+JSON.stringify(req));
  const {message} = req.body;
  const {callback_query} = req.body;

  

  if(message){
    console.log("message == "+JSON.stringify(message));
    parseMessage(message, res);  
  }else if(callback_query){
    console.log("callback_query == "+JSON.stringify(callback_query));
    parseCallback(callback_query, res);
  }
  

  

  // If we've gotten this far, it means that we have received a message containing the word "marco".
  // Respond by hitting the telegram bot API and responding to the approprite chat_id with the word "Polo!!"
  // Remember to use your own API toked instead of the one below  "https://api.telegram.org/bot<your_api_token>/sendMessage"
  //sendMessage(message.chat.id, 'Polo!!', res);

});

function parseMessage(message, resObj){
  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id
  if(!message){
    return resObj.end();
  }

  if(message.entities && message.entities[0].type == "bot_command"){
    if(message.text && message.text.toLowerCase() == "/start"){
      sess = req.session;

      var inlineKeyboardMarkup = JSON.stringify(
                              {
                                inline_keyboard: [
                                                [{text: "Upload My Certificate", callback_data: "upload"}],
                                                [{text: "View My Uploaded Certificates", callback_data: "view"}]
                                              ]
                              }
                            );

      sendMessage(message.chat.id, "hey there! I can help with the following requests today:", resObj, inlineKeyboardMarkup);
    }else{
      sendMessage(message.chat.id, "Sorry, i dont understand that message", resObj);
    }
  }else if(message.entities && message.entities[0].type == "mention"){
    if (sess.action == "view"){
      sendMessage(message.chat.id, "Cool. Will fetch from mondoDB", resObj);  
    }
    if (sess.action == "upload"){
      sendMessage(message.chat.id, "Cool. TBD - Show list of certificates", resObj);  
    }
  }else{
    sendMessage(message.chat.id, "Sorry, i dont understand that message", resObj);
  }

};

function parseCallback(callbackObj, resObj){
  if(!callbackObj){
    return resObj.end();
  }

  if(callbackObj.data && callbackObj.data.toLowerCase() == "upload"){
    sess.action = "upload";
    showUploadCertificate(callbackObj, resObj);
  }

  if(callbackObj.data && callbackObj.data.toLowerCase() == "view"){
    sess.action = "view";
    showViewCertificates(callbackObj, resObj);
  }
};

function showUploadCertificate(){

};

function showViewCertificates(callbackObj, resObj){
    var forceReply = JSON.stringify(
                          {force_reply:true}
                        );

    sendMessage(callbackObj.message.chat.id, "Absolutely! Just tell me your outlook id without @deloitte.com:", resObj, forceReply);
};

function sendMessage(chatID, responseMsg, resObj, inlineKeyboardMarkup=''){
  
  axios.post('https://api.telegram.org/bot553303104:AAEVsFhPt0fa8Yw2jJIEcvOOMd7RAmqWjaE/sendMessage', {
      chat_id: chatID,
      text: responseMsg,
      reply_markup: inlineKeyboardMarkup
    })
    .then(response => {
      // We get here if the message was successfully posted
      console.log('Message posted');
      resObj.end('ok');
    })
    .catch(err => {
      // ...and here if it was not
      console.log('Error :', err)
      resObj.end('Error :' + err)
    })
};

// Finally, start our server
app.listen(app.get('port'), function() {
  console.log('Telegram app listening on port ', app.get('port'));
});