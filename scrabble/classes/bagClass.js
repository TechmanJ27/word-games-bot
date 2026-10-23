import fs from 'node:fs';
import path from 'node:path';

export default class ScrabbleBag () {
  constructor(lang) {
    return getFile(lang).letters;
  }
}

function getFile(lang) {
  const tilesetFile = path.join(meta.import.dirname, /tilesets/ + lang + '.json');
  fs.readFile(tilesetFile, (callback) => {
     return JSON.parse();
  });
  
}
