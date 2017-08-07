const builder = require('botbuilder');

const dictionary = require('dictionary-en-us');
const nspell = require('nspell');

function decorate(session, result) {
  var subtitle;
  if (result.correct) {
    subtitle = 'Correct!';
  } else if (result.suggestions.length === 0) {
    subtitle = "Interesting. That word isn't recognized.";
  } else if (result.suggestions.length === 1) {
    subtitle = "Is this what you're looking for?";
  } else {
    subtitle = "Perhaps you're looking for one of these?";
  }

  var card = new builder.ThumbnailCard(session)
    .title(result.word)
    .subtitle(subtitle)
    .text(result.suggestions.join(', '));

  return new builder.Message(session).addAttachment(card);
}

function getSuggestions(word) {
  return new Promise((resolve, reject) => {
    dictionary((err, dict) => {
      if (err) {
        reject(err);
      }

      var spell = nspell(dict);

      var result = {
        correct: spell.correct(word),
        suggestions: spell.suggest(word),
        word
      };

      return resolve(result);
    });
  });
}

module.exports = {
  decorate,
  getSuggestions
}