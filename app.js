require('dotenv').config()

const restify = require('restify');
const builder = require('botbuilder');

const dictionary = require('dictionary-en-us');
const nspell = require('nspell');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {

  dictionary((err, dict) => {
    if (err) {
      session.send("Error: %s", err.message);
    }

    var spell = nspell(dict);
    var suggestions = spell.suggest(session.message.text);
    // var correct = spell.correct(session.message.text); // boolean

    if (suggestions.length === 0) {
      session.send("Correct: %s", session.message.text);
    } else {
      session.send("Suggestions: %s", suggestions.join(', '));
    }
  });

  // session.send("You said: %s", session.message.text);
});