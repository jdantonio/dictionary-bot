const DOMParser = require('xmldom').DOMParser;

const BULLET = '\u2022';
const MW_SOUND_BASE = 'http://media.merriam-webster.com/soundc11';

// private helper
function textFromEntry(name, entry) {
  var result;
  var elements = entry.getElementsByTagName(name);

  if (elements.length > 0) {
    result = elements.item(0).textContent;
  }

  return result;
}

// private helper
function soundToLink(entry) {
  // http://media.merriam-webster.com/soundc11/h/heart001.wav
  var file = textFromEntry('wav', entry);
  if (file) {
    file = `${MW_SOUND_BASE}/${file.charAt(0)}/${file}`; 
  }

  return file;
}

/**
  DictionaryEntry
  {
    word: ''
    isEmpty: true,
    hasSuggestions: false,
    hasEntry: false,
    suggestions: [],
    entry: {
      id: '',
      hw: '',
      sound: '',
      pr: '',
      fl: '',
      definitions: []
    }
  }
*/
class DictionaryEntry {

  get word() {
    return this.id || '';
  }

  get isEmpty() {
    return !(this.hasEntry || this.hasSuggestions);
  }

  get hasSuggestions() {
    return this.suggestions.length > 0;
  }

  get hasEntry() {
    return Boolean(this.dictEntry);
  }

  get suggestions() {
    return this.suggestionList;
  }

  get entry() {
    return this.dictEntry;
  }

  constructor(word, xml) {
    this.id = word;
    this.dictEntry = null;
    this.suggestionList = [];

    var doc = new DOMParser().parseFromString(xml);
    var entries = doc.getElementsByTagName('entry');
    var suggestions = doc.getElementsByTagName('suggestion');

    for (var i = 0; i < suggestions.length; i++) {
      this.suggestionList.push(suggestions.item(i).textContent);
    }

    if (entries.length > 0) {
      var entry = entries[0];
      this.dictEntry = {
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
        this.dictEntry.date = textFromEntry('date', definition);

        var dts = definition.getElementsByTagName('dt');
        for (i = 0; i < dts.length; i++) {
          var dt = dts.item(i);
          this.dictEntry.definitions.push(
            dt.textContent
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/^:/, '')
          );
        }
      }
    }
  }
}

module.exports = DictionaryEntry;