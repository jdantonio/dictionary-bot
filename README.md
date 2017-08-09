# wordsmith-bot

Spelling, dictionary, and thesaurus bot.

Inspired by a recent capstone project done by students at [Tech Elevator](http://www.techelevator.com/), a bootcamp I occasionally mentor at. It's just a fun way to experiment with [Microsoft Bot Framework](https://dev.botframework.com/). It is not intended to be used in production anywhere. For any reason.

## Usage

Run the bot following the instructions in the Bot Framework docs. Basically, use node.js to run `app.js` then connect to it using Microsoft's emulator.

## Commands

`spell <word>`

Tells you if your spelling is correct, offers suggestions if it isn't.

`define <word>`

Guves you a definition if it can find one. If not, suggests words you may be thinking of.

`synonym <word>`

Not implemented yet, but you can probably guess what this is going to do.
