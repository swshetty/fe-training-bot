var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const axios = require('axios');

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded


// index
app.get('/', function (req, res) {
  res.send('hello world i am a secret bot')
})


//This is the route the API will call
app.post('/new-message', function(req, res) {
  //console.log("req == "+JSON.stringify(req));
  const {message} = req.body
  console.log("req == "+JSON.stringify(message));

  //Each message contains "text" and a "chat" object, which has an "id" which is the chat id
  if (!message || message.text.toLowerCase().indexOf('marco') <0) {
    // In case a message is not present, or if our message does not have the word marco in it, do nothing and return an empty response
    return res.end()
  }

  // If we've gotten this far, it means that we have received a message containing the word "marco".
  // Respond by hitting the telegram bot API and responding to the approprite chat_id with the word "Polo!!"
  // Remember to use your own API toked instead of the one below  "https://api.telegram.org/bot<your_api_token>/sendMessage"
  sendMessage(message.chat.id, 'Polo!!', res);

});

function sendMessage(chatID, responseMsg, resObj){
  axios.post('https://api.telegram.org/bot553303104:AAEVsFhPt0fa8Yw2jJIEcvOOMd7RAmqWjaE/sendMessage', {
      chat_id: chatID,
      text: responseMsg
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