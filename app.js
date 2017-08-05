require('dotenv').config()

const restify = require('restify');
const builder = require('botbuilder');

const spelling = require('./spelling');

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
// var bot = new builder.UniversalBot(connector, function (session) {
//   session.send("You said: %s", session.message.text);
// });

var bot = new builder.UniversalBot(connector);

var spellRecognizer = new builder.RegExpRecognizer('Spell', /^(sp|spell|spelling)\s(.*)/i);
var intent = new builder.IntentDialog({ recognizers: [ spellRecognizer ], recognizeOrder: 'series' });

intent.matches('Spell', (session, args) => {
  spelling.suggest(session, args);
});

bot.dialog('/', intent).onDefault(session => session.send("Sorry, but I don't understand what you're asking."));