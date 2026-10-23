import fs from 'node:fs';
import path from 'node:path';

export default class ScrabbleBag () {
  constructor(lang) {
    getFile(lang).then((data) => return data).catch((err) => {console.log(err); return null;});
  }
}

function getFile(lang: string): object {
  const tilesetFile = path.join(meta.import.dirname, /tilesets/ + lang + '.json');
  return new Promise((resolve, reject) => {
    fs.readFile(tilesetFile, 'utf8', (err, data) => {
    err ? reject(err) : resolve(JSON.parse(data));
  });
}
