const builder = require('botbuilder');
const http = require('http');
const DOMParser = require('xmldom').DOMParser;

const MW_SOUND_BASE = 'http://media.merriam-webster.com/soundc11';

function decorate(session, result) {
}

function getDefinition(session, args) {
    var word = args.matched[2];

    lookupWord(word).then((data) => {
      // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      // console.log(data);
      // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

      session.send(data);

      var doc = new DOMParser().parseFromString(data);
      var entry = doc.getElementsByTagName('entry');
      var suggestion = doc.getElementsByTagName('suggestion');

      // console.log('=========>', entry);
      // console.log('=========>', entry.length);
      // console.log('=========>', suggestion);
      // console.log('=========>', suggestion.length);

      // var entry = getEntry(data);
      // short-circuit if the word isn't found
      if (entry.length === 0 && suggestion.length === 0) {
        session.send(`Interesting. I couldn't find a definition for '${word}'`);
        return;
      }

      // var title = entry.ew;
      // var subtitle = `${entry.fl[0]} | ${entry.hw[0].replace(/\*/g, BULLET)} | \\${entry.pr[0]}\\`;
      // var text = 'definition';

      // var card = new builder.ThumbnailCard(session)
      //   .title(title)
      //   .subtitle(subtitle)
      //   .text(text)
      //   .images([
      //     new builder.CardImage(session)
      //       .url('https://www.dictionaryapi.com/images/info/branding-guidelines/mw-logo-light-background-50x50.png')
      //       .alt('Merriam-Webster Inc.'),
      //     new builder.CardImage(session)
      //       .url(soundToImage(data))
      //   ]);

      // session.send(new builder.Message(session).addAttachment(card));
    }).catch((err) => {
      session.send("Oops! Something went wrong: %s", err.message);
    });
}

function lookupWord(word) {

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
            resolve(data);
          } catch (e) {
            reject(e);
          }
        }
      });
    }

    http.request(options, callback).on('error', (err) => {
      reject(err);
    }).end();
  });
}

function parseXml(xml) {
  var doc = new DOMParser().parseFromString(xml);
  var entries = doc.getElementsByTagName('entry');
  var suggestions = doc.getElementsByTagName('suggestion');

  var result = {
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
      hw: textFromEntry('hw', entry).replace(/\*/g, '\u2022'),
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
      for (var i = 0; i < dts.length; i++) {
        var dt = dts.item(i);
        result.entry.definitions.push(
          dt.textContent.replace(/\s+/g, ' ').trim().replace(/^:/, '')
        );
      }
    }
  }

  return result;
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
    return `${MW_SOUND_BASE}/${file.charAt(0)}/${file}`; 
  }
}

module.exports = {
  getDefinition
}

/*
entry_list
{
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

definition
{
  priority: 0,
  date: '',
  dt: ''
}


//define 'ljskdhklfhaklfkfd'

<?xml version="1.0" encoding="utf-8" ?>
<entry_list version="1.0">
</entry_list>

// define 'lks'

<?xml version="1.0" encoding="utf-8" ?>
<entry_list version="1.0">
	<suggestion>LCS</suggestion>
	<suggestion>LDS</suggestion>
	<suggestion>LTS</suggestion>
	<suggestion>lx</suggestion>
	<suggestion>Lacs</suggestion>
	<suggestion>lats</suggestion>
	<suggestion>legs</suggestion>
	<suggestion>lots</suggestion>
	<suggestion>lax</suggestion>
	<suggestion>lex</suggestion>
	<suggestion>lox</suggestion>
	<suggestion>lux</suggestion>
	<suggestion>Lakes</suggestion>
	<suggestion>Leeds</suggestion>
	<suggestion>Leics</suggestion>
	<suggestion>luxe</suggestion>
	<suggestion>Lodz</suggestion>
	<suggestion>lutz</suggestion>
	<suggestion>Leix</suggestion>
	<suggestion>Wolds</suggestion>
</entry_list>

// define 'hypocrite'

<?xml version="1.0" encoding="UTF-8"?>
<entry_list version="1.0">
   <entry id="hypocrite">
      <ew>hypocrite</ew>
      <hw>hyp*o*crite</hw>
      <sound>
         <wav>hypocr02.wav</wav>
      </sound>
      <pr>ˈhi-pə-ˌkrit</pr>
      <fl>noun</fl>
      <et>
         Middle English
         <it>ypocrite,</it>
         from Anglo-French, from Late Latin
         <it>hypocrita,</it>
         from Greek
         <it>hypokritēs</it>
         actor, hypocrite, from
         <it>hypokrinesthai</it>
      </et>
      <def>
         <date>13th century</date>
         <sn>1</sn>
         <dt>
            :a person who puts on a false appearance of
            <d_link>virtue</d_link>
            or religion
         </dt>
         <sn>2</sn>
         <dt>:a person who acts in contradiction to his or her stated beliefs or feelings</dt>
      </def>
      <uro>
         <ure>hypocrite</ure>
         <fl>adjective</fl>
      </uro>
   </entry>
</entry_list>

// define 'atom'

<?xml version="1.0" encoding="UTF-8"?>
<entry_list version="1.0">
   <entry id="atom">
      <ew>atom</ew>
      <subj>CH-3#PY-3#PY-4#PH-1#EN-4</subj>
      <hw>at*om</hw>
      <sound>
         <wav>atom0001.wav</wav>
         <wpr>!a-tum</wpr>
      </sound>
      <pr>ˈa-təm</pr>
      <fl>noun</fl>
      <et>
         Middle English, from Latin
         <it>atomus,</it>
         from Greek
         <it>atomos,</it>
         from
         <it>atomos</it>
         indivisible, from
         <it>a-</it>
         +
         <it>temnein</it>
         to cut
      </et>
      <def>
         <date>15th century</date>
         <sn>1</sn>
         <dt>:one of the minute indivisible particles of which according to ancient materialism the universe is composed</dt>
         <sn>2</sn>
         <dt>
            :a tiny particle :
            <sx>bit</sx>
         </dt>
         <sn>3</sn>
         <dt>:the smallest particle of an element that can exist either alone or in combination</dt>
         <sn>4</sn>
         <dt>:the atom considered as a source of vast potential energy</dt>
      </def>
   </entry>
   <entry id="atom smasher">
      <ew>atom smasher</ew>
      <subj>PY</subj>
      <hw>atom smasher</hw>
      <fl>noun</fl>
      <def>
         <date>1937</date>
         <dt>
            :
            <sx>
               accelerator
               <sxn>d</sxn>
            </sx>
         </dt>
      </def>
   </entry>
   <entry id="atomic bomb">
      <ew>atomic bomb</ew>
      <subj>PY#WX</subj>
      <hw>atomic bomb</hw>
      <fl>noun</fl>
      <def>
         <date>1917</date>
         <sn>1</sn>
         <dt>
            :a bomb whose violent explosive power is due to the sudden release of energy resulting from the splitting of nuclei of a heavy chemical element (as plutonium or uranium) by neutrons in a very rapid chain reaction
            <ca>
               called also
               <cat>atom bomb</cat>
            </ca>
         </dt>
         <sn>2</sn>
         <dt>:a nuclear weapon (as a hydrogen bomb)</dt>
      </def>
   </entry>
   <entry id="gram-atomic weight">
      <ew>gram-atomic weight</ew>
      <subj>CH</subj>
      <hw>gram–atomic weight</hw>
      <fl>noun</fl>
      <def>
         <date>1927</date>
         <dt>
            :the mass of one mole of an element equal in grams to the atomic weight
            <ca>
               called also
               <cat>gram-atom</cat>
            </ca>
         </dt>
      </def>
   </entry>
</entry_list>
*/
