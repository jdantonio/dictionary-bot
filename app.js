require('dotenv').config()

const restify = require('restify');
const builder = require('botbuilder');

const spelling = require('./src/spelling');
const definition = require('./src/definition');

/* eslint no-console: "off" */

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

var connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen());

// var bot = new builder.UniversalBot(connector, function (session) {
//   session.send("You said: %s", session.message.text);
// });

var bot = new builder.UniversalBot(connector);

var spellRecognizer = new builder.RegExpRecognizer('Spell', /^(sp|spell|spelling)\s(.*)/i);
var defineRecognizer = new builder.RegExpRecognizer('Define', /^(define)\s(.*)/i);

var intent = new builder.IntentDialog({ recognizers: [ spellRecognizer, defineRecognizer ] });

intent.matches('Spell', (session, args) => {
  var result = spelling.getSuggestions(args.matched[2]).then((result) => {
    if (result instanceof Error) {
      session.send(formatError(result));
    } else {
      session.send(spelling.decorate(session, result));
    }
  });
});

intent.matches('Define', (session, args) => {
  definition.getDefinition(session, args);
});

bot.dialog('/', intent).onDefault(session => session.send("Sorry, but I don't understand what you're asking."));

function formatError(err) {
  return `Oops! Something went wrong: ${err.message}`;
}