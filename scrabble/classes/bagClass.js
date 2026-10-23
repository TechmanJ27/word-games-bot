export default class ScrabbleBag () {
  constructor(lang) {
    return getFile(lang).letters;
  }
}

function getFile(lang) {
  const tilesetFile = path.join(meta.import.dirname, lang + '.tileset.json');
  return JSON.parse(readSync(tilesetFile));
}
