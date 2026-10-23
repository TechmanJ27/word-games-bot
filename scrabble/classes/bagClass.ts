import fs from 'node:fs';
import path from 'node:path';

export default class ScrabbleBag () {
  constructor(lang) {
    return getFile(lang).letters;
  }
}

function getFile(lang) {
  const tilesetFile = path.join(meta.import.dirname, /tilesets/ + lang + '.json');
  const data: Object;
  fs.readFile(tilesetFile, 'utf8', (err, data) => {
    if (err) {
      console.log(err)
      return;
    }
    return JSON.parse(data);
  });
  
}
