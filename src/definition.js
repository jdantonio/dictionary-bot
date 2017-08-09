const builder = require('botbuilder');
const http = require('http');

const DictionaryEntry = require('./dictionary_entry');

const BULLET = '\u2022';

function decorate(session, result) {
  var title = result.word;
  var subtitle = '';
  var text = '';

  var images = [
    new builder.CardImage(session)
      .url('https://www.dictionaryapi.com/images/info/branding-guidelines/mw-logo-light-background-50x50.png')
      .alt('Merriam-Webster Inc.')
  ];

  if (result.isEmpty) {
    subtitle = "Interesting. That word isn't recognized.";
  } else if (result.hasSuggestions) {
    subtitle = "Perhaps you're looking for one of these?";
    result.suggestions.forEach((suggestion) => {
      text += `${BULLET} ${suggestion}\n`;
    });
  } else {
    subtitle = `${result.entry.fl} | ${result.entry.hw} | \\${result.entry.pr}\\`;
    result.entry.definitions.forEach((definition) => {
      text += `${BULLET} ${definition}\n`;
    });
  }

  if (result.hasEntry && result.entry.sound) {
    images.push(new builder.CardImage(session).url(result.entry.sound));
  }

  var card = new builder.ThumbnailCard(session)
    .title(title)
    .subtitle(subtitle)
    .text(text)
    .images(images);

  return new builder.Message(session).addAttachment(card);
}

function getDefinition(word) {

  var options = {
    hostname: 'www.dictionaryapi.com',
    path: `/api/v1/references/collegiate/xml/${encodeURI(word)}?key=${process.env.DICTIONARY_API_KEY}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/xml',
      'Accept': 'application/xml'
    }
  }

  return new Promise((resolve, reject) => {
    var callback = (response) => {
      var data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        if (response.statusCode === 200) {
          try {
            resolve(new DictionaryEntry(word, data));
          } catch (err) {
            reject(err);
          }
        }
      });
    }

    http.request(options, callback)
      .on('error', (err) => {
        reject(err);
      })
      .end();
  });
}

module.exports = {
  decorate,
  getDefinition
}