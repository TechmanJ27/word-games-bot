import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from "node:url";
export default class ScrabbleBag {
    tileset;
    constructor(lang) {
        this.tileset = getTilesetSync(lang);
    }
}
function getTilesetSync(lang) {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const tilesetFile = path.join(__dirname, '..', 'tilesets', `${lang}.json`);
        const data = fs.readFileSync(tilesetFile, 'utf8');
        return JSON.parse(data);
    }
    catch (err) {
        console.error(`Failed to load tileset for language: ${lang}`, err);
        return null;
    }
}
//# sourceMappingURL=bagClass.js.map