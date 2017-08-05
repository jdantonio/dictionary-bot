const builder = require('botbuilder');

const dictionary = require('dictionary-en-us');
const nspell = require('nspell');

function suggestSpelling(session, args) {
  dictionary((err, dict) => {
    if (err) {
      session.send("Oops! Something went wrong: %s", err.message);
    }

    var word = args.matched[2];

    var spell = nspell(dict);
    var suggestions = spell.suggest(word);
    // var correct = spell.correct(word); // boolean

    var title = word;
    var subtitle;
    var text = suggestions.join(', ');

    if (suggestions.length === 0) {
      subtitle = 'Correct!';
    } else if (suggestions.length === 1) {
      subtitle = "Is this what you're looking for?";
    } else {
      subtitle = "Perhaps you're looking for one of these?";
    }

    var card = new builder.ThumbnailCard(session)
      .title(title)
      .subtitle(subtitle)
      .text(text);

    session.send(new builder.Message(session).addAttachment(card));
  });
}

module.exports.suggest = suggestSpelling;