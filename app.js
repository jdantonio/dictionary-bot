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
// var bot = new builder.UniversalBot(connector, function (session) {
//   session.send("You said: %s", session.message.text);
// });

var bot = new builder.UniversalBot(connector);

var spellRecognizer = new builder.RegExpRecognizer('Spell', /^(sp|spell|spelling)\s(.*)/i);
var intent = new builder.IntentDialog({ recognizers: [ spellRecognizer ], recognizeOrder: 'series' });

intent.matches('Spell', (session, args) => {
  suggestSpelling(session, args);
});

bot.dialog('/', intent).onDefault(session => session.send("Sorry, but I don't understand what you're asking."));

function suggestSpelling(session, args) {
  dictionary((err, dict) => {
    if (err) {
      session.send("Oops! Something went wrong: %s", err.message);
    }

    var word = args.matched[2];

    var spell = nspell(dict);
    var suggestions = spell.suggest(word);
    // var correct = spell.correct(word); // boolean

    if (suggestions.length === 0) {
      session.send("Good job! '%s' is the correct spelling.", word);
    } else if (suggestions.length === 1) {
      session.send("Did you mean '%s'?", suggestions[0]);
    } else {
      session.send("Perhaps you're looking for one of these? %s", suggestions.join(', '));
    }
  });
}