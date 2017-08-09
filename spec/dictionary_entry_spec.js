const DictionaryEntry = require('../src/dictionary_entry');

describe('DictionaryEntry', () => {

  it('parses an empty entry_list', () => {
    var word = 'ljskdhklfhaklfkfd';
    var xml = `
<?xml version="1.0" encoding="utf-8" ?>
<entry_list version="1.0">
</entry_list>
    `;
    var actual = new DictionaryEntry(word, xml);

    expect(actual.word).toEqual(word);

    expect(actual.isEmpty).toBeTruthy();
    expect(actual.hasSuggestions).toBeFalsy();
    expect(actual.hasEntry).toBeFalsy();

    expect(actual.entry).toBeFalsy();
    expect(actual.suggestions).toEqual([]);
  });

  it('parses an entry_list with suggestions', () => {
    var word = 'lks';
    var xml = `
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
    `;

    var suggestions = [
      'LCS',
      'LDS',
      'LTS',
      'lx',
      'Lacs',
      'lats',
      'legs',
      'lots',
      'lax',
      'lex',
      'lox',
      'lux',
      'Lakes',
      'Leeds',
      'Leics',
      'luxe',
      'Lodz',
      'lutz',
      'Leix',
      'Wolds'
    ];

    var actual = new DictionaryEntry(word, xml);

    expect(actual.word).toEqual(word);

    expect(actual.isEmpty).toBeFalsy();
    expect(actual.hasSuggestions).toBeTruthy();
    expect(actual.hasEntry).toBeFalsy();

    expect(actual.entry).toBeFalsy();
    expect(actual.suggestions).toEqual(suggestions);
  });

  it('parses an entry_list with one entry', () => {
    var word = 'hypocrite';
    var xml = `
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
    `;

    var entry = {
      id: 'hypocrite',
      hw: 'hyp\u2022o\u2022crite',
      sound: 'http://media.merriam-webster.com/soundc11/h/hypocr02.wav',
      pr: 'ˈhi-pə-ˌkrit',
      fl: 'noun',
      date: '13th century',
      definitions: [
        'a person who puts on a false appearance of virtue or religion',
        'a person who acts in contradiction to his or her stated beliefs or feelings'
      ]
    };

    var actual = new DictionaryEntry(word, xml);

    expect(actual.word).toEqual(word);

    expect(actual.isEmpty).toBeFalsy();
    expect(actual.hasSuggestions).toBeFalsy();
    expect(actual.hasEntry).toBeTruthy();

    expect(actual.suggestions).toEqual([]);
    expect(actual.entry).toEqual(entry);
  });

  it('parses an entry_list with multiple entries', () => {
    var word = 'atom';
    var xml = `
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
    `;

    var entry = {
      id: 'atom',
      hw: 'at\u2022om',
      sound: 'http://media.merriam-webster.com/soundc11/a/atom0001.wav',
      pr: 'ˈa-təm',
      fl: 'noun',
      date: '15th century',
      definitions: [
        'one of the minute indivisible particles of which according to ancient materialism the universe is composed',
        'a tiny particle : bit',
        'the smallest particle of an element that can exist either alone or in combination',
        'the atom considered as a source of vast potential energy'
      ]
    };

    var actual = new DictionaryEntry(word, xml);

    expect(actual.word).toEqual(word);

    expect(actual.isEmpty).toBeFalsy();
    expect(actual.hasSuggestions).toBeFalsy();
    expect(actual.hasEntry).toBeTruthy();

    expect(actual.suggestions).toEqual([]);
    expect(actual.entry).toEqual(entry);
  });
});