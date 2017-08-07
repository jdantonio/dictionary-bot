const spelling = require('../src/spelling');

describe('getSuggestions', () => {

  it('returns true and an empty list when correct', (done) => {
    subject = 'atom';
    spelling.getSuggestions(subject).then((result) => {
      expect(result.word).toEqual(subject);
      expect(result.correct).toBeTruthy();
      expect(result.suggestions.length).toEqual(0);
      done();
    });
  });

  it('returns false and an empty list when word is bogus', (done) => {
    subject = 'kdlashfkjdhsdkjfhdg';
    spelling.getSuggestions(subject).then((result) => {
      expect(result.word).toEqual(subject);
      expect(result.correct).toBeFalsy();
      expect(result.suggestions.length).toEqual(0);
      done();
    });
  });

  it('returns false and one suggestion when common misspelling', (done) => {
    subject = 'heirarchy';
    spelling.getSuggestions(subject).then((result) => {
      expect(result.word).toEqual(subject);
      expect(result.correct).toBeFalsy();
      expect(result.suggestions.length).toEqual(1);
      expect(result.suggestions[0]).toEqual('hierarchy');
      done();
    });
  });

  it('returns false and many suggestions when guessing', (done) => {
    subject = 'ther';
    spelling.getSuggestions(subject).then((result) => {
      expect(result.word).toEqual(subject);
      expect(result.correct).toBeFalsy();
      expect(result.suggestions.length).toBeGreaterThan(0);
      done();
    });
  });
});
