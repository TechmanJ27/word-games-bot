import wordList from './wordlists/en.json' with { type: 'json' };
const scrabbleDictionary = new Set(wordList.map((w) => w.toLowerCase()));
export default function isValidWord(word, lang) {
    return scrabbleDictionary.has(word.trim().toLowerCase());
}
//# sourceMappingURL=wordValidation.js.map