import wordList from './en_dictionary.json' with { type: 'json' };
const scrabbleDictionary = new Set(wordList.map((w) => w.toLowerCase()));
export default isValidWord = (word) => return scrabbleDictionary.has(word.trim().toLowerCase());
//# sourceMappingURL=wordValidation.js.map
