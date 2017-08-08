const builder = require('botbuilder');
const http = require('http');
const DOMParser = require('xmldom').DOMParser;

const BULLET = '\u2022';
const MW_SOUND_BASE = 'http://media.merriam-webster.com/soundc11';

/*
entry_list
{
  word: ''
  isEmpty: true,
  hasSuggestions: false,
  hasEntry: false,
  suggestions: [],
  entry: {}
}

entry
{
  id: '',
  hw: '',
  sound: '',
  pr: '',
  fl: '',
  definitions: []
}
*/

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

function textFromEntry(name, entry) {
  var result;
  var elements = entry.getElementsByTagName(name);

  if (elements.length > 0) {
    result = elements.item(0).textContent;
  }

  return result;
}

function soundToLink(entry) {
  // http://media.merriam-webster.com/soundc11/h/heart001.wav
  var file = textFromEntry('wav', entry);
  if (file) {
    file = `${MW_SOUND_BASE}/${file.charAt(0)}/${file}`; 
  }

  return file;
}

function parseXml(word, xml) {
  var doc = new DOMParser().parseFromString(xml);
  var entries = doc.getElementsByTagName('entry');
  var suggestions = doc.getElementsByTagName('suggestion');

  var result = {
    word,
    entry: null,
    suggestions: []
  }

  result.hasEntry = entries.length > 0;
  result.hasSuggestions = suggestions.length;
  result.isEmpty = !(result.hasEntry || result.hasSuggestions);

  for (var i = 0; i < suggestions.length; i++) {
    result.suggestions.push(suggestions.item(i).textContent);
  }

  if (entries.length > 0) {
    var entry = entries[0];
    result.entry = {
      id: entry.getAttribute('id'),
      hw: textFromEntry('hw', entry).replace(/\*/g, BULLET),
      pr: textFromEntry('pr', entry),
      fl: textFromEntry('fl', entry),
      sound: soundToLink(entry),
      definitions: []
    };

    var definitions = entry.getElementsByTagName('def');

    if (definitions.length > 0) {
      var definition = definitions.item(0);
      result.entry.date = textFromEntry('date', definition);

      var dts = definition.getElementsByTagName('dt');
      for (i = 0; i < dts.length; i++) {
        var dt = dts.item(i);
        result.entry.definitions.push(
          dt.textContent
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/^:/, '')
        );
      }
    }
  }

  return result;
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
            resolve(parseXml(word, data));
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