const builder = require('botbuilder');
const parseString = require('xml2js').parseString;
const http = require('http');

const MW_SOUND_BASE = 'http://media.merriam-webster.com/soundc11';

function findDefintion(session, args) {
    var word = args.matched[2];

    getDefinition(word).then((data) => {
      // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      // console.log(JSON.stringify(data));
      // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

      // short-circuit if the word isn't found
      if (!data.entry_list.hasOwnProperty('entry')) {
        session.send(`Interesting. I couldn't find a definition for '${word}'`);
        return;
      }

      var entry = data.entry_list.entry[0];

      var title = entry.ew;
      var subtitle = `${entry.fl[0]} | ${entry.hw[0]} | \\${entry.pr[0]}\\`;
      var text = 'definition';

      var card = new builder.ThumbnailCard(session)
        .title(title)
        .subtitle(subtitle)
        .text(text)
        .images([
          new builder.CardImage(session)
            .url('https://www.dictionaryapi.com/images/info/branding-guidelines/mw-logo-light-background-50x50.png')
            .alt('Merriam-Webster Inc.'),
          new builder.CardImage(session)
            .url(soundToImage(data))
        ]);

      session.send(new builder.Message(session).addAttachment(card));
    }).catch((err) => {
      session.send("Oops! Something went wrong: %s", err.message);
    });
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
          parseString(data, function (err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        } else {
          reject(new Error(response.statusMessage));
        }
      });
    }

    http.request(options, callback).on('error', (err) => {
      reject(err);
    }).end();
  });
}

function soundToImage(data) {
  // http://media.merriam-webster.com/soundc11/h/heart001.wav

  var sounds = data.entry_list.entry[0].sound;
  if (sounds.length > 0) {
    var file = sounds[0];
    var sound = sounds[0].wav[0];
    return `${MW_SOUND_BASE}/${sound.charAt(0)}/${sounds}`; 
  } 
}

module.exports.find = findDefintion;

/*
{"entry_list":{"$":{"version":"1.0"}}}

{
   "entry_list": {
      "$": {
         "version": "1.0"
      },
      "entry": [
         {
            "$": {
               "id": "hypocrite"
            },
            "ew": [
               "hypocrite"
            ],
            "hw": [
               "hyp*o*crite"
            ],
            "sound": [
               {
                  "wav": [
                     "hypocr02.wav"
                  ]
               }
            ],
            "pr": [
               "ˈhi-pə-ˌkrit"
            ],
            "fl": [
               "noun"
            ],
            "et": [
               {
                  "_": "Middle English  from Anglo-French, from Late Latin  from Greek  actor, hypocrite, from ",
                  "it": [
                     "ypocrite,",
                     "hypocrita,",
                     "hypokritēs",
                     "hypokrinesthai"
                  ]
               }
            ],
            "def": [
               {
                  "date": [
                     "13th century"
                  ],
                  "sn": [
                     "1",
                     "2"
                  ],
                  "dt": [
                     {
                        "_": ":a person who puts on a false appearance of  or religion",
                        "d_link": [
                           "virtue"
                        ]
                     },
                     ":a person who acts in contradiction to his or her stated beliefs or feelings"
                  ]
               }
            ],
            "uro": [
               {
                  "ure": [
                     "hypocrite"
                  ],
                  "fl": [
                     "adjective"
                  ]
               }
            ]
         }
      ]
   }
}

{
   "entry_list": {
      "$": {
         "version": "1.0"
      },
      "entry": [
         {
            "$": {
               "id": "atom"
            },
            "ew": [
               "atom"
            ],
            "subj": [
               "CH-3#PY-3#PY-4#PH-1#EN-4"
            ],
            "hw": [
               "at*om"
            ],
            "sound": [
               {
                  "wav": [
                     "atom0001.wav"
                  ],
                  "wpr": [
                     "!a-tum"
                  ]
               }
            ],
            "pr": [
               "ˈa-təm"
            ],
            "fl": [
               "noun"
            ],
            "et": [
               {
                  "_": "Middle English, from Latin  from Greek  from  indivisible, from  +  to cut",
                  "it": [
                     "atomus,",
                     "atomos,",
                     "atomos",
                     "a-",
                     "temnein"
                  ]
               }
            ],
            "def": [
               {
                  "date": [
                     "15th century"
                  ],
                  "sn": [
                     "1",
                     "2",
                     "3",
                     "4"
                  ],
                  "dt": [
                     ":one of the minute indivisible particles of which according to ancient materialism the universe is composed",
                     {
                        "_": ":a tiny particle :",
                        "sx": [
                           "bit"
                        ]
                     },
                     ":the smallest particle of an element that can exist either alone or in combination",
                     ":the atom considered as a source of vast potential energy"
                  ]
               }
            ]
         },
         {
            "$": {
               "id": "atom smasher"
            },
            "ew": [
               "atom smasher"
            ],
            "subj": [
               "PY"
            ],
            "hw": [
               "atom smasher"
            ],
            "fl": [
               "noun"
            ],
            "def": [
               {
                  "date": [
                     "1937"
                  ],
                  "dt": [
                     {
                        "_": ":",
                        "sx": [
                           {
                              "_": "accelerator ",
                              "sxn": [
                                 "d"
                              ]
                           }
                        ]
                     }
                  ]
               }
            ]
         },
         {
            "$": {
               "id": "atomic bomb"
            },
            "ew": [
               "atomic bomb"
            ],
            "subj": [
               "PY#WX"
            ],
            "hw": [
               "atomic bomb"
            ],
            "fl": [
               "noun"
            ],
            "def": [
               {
                  "date": [
                     "1917"
                  ],
                  "sn": [
                     "1",
                     "2"
                  ],
                  "dt": [
                     {
                        "_": ":a bomb whose violent explosive power is due to the sudden release of energy resulting from the splitting of nuclei of a heavy chemical element (as plutonium or uranium) by neutrons in a very rapid chain reaction ",
                        "ca": [
                           {
                              "_": "called also ",
                              "cat": [
                                 "atom bomb"
                              ]
                           }
                        ]
                     },
                     ":a nuclear weapon (as a hydrogen bomb)"
                  ]
               }
            ]
         },
         {
            "$": {
               "id": "gram-atomic weight"
            },
            "ew": [
               "gram-atomic weight"
            ],
            "subj": [
               "CH"
            ],
            "hw": [
               "gram–atomic weight"
            ],
            "fl": [
               "noun"
            ],
            "def": [
               {
                  "date": [
                     "1927"
                  ],
                  "dt": [
                     {
                        "_": ":the mass of one mole of an element equal in grams to the atomic weight ",
                        "ca": [
                           {
                              "_": "called also ",
                              "cat": [
                                 "gram-atom"
                              ]
                           }
                        ]
                     }
                  ]
               }
            ]
         }
      ]
   }
}
*/
