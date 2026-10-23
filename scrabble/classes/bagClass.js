import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from "node:url";
export default class ScrabbleBag {
    constructor(lang) {
        getTileset(lang).then((data) => {
            return data;
        }).catch((err) => { console.log(err); return null; });
    }
}
function getTileset(lang) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const tilesetFile = path.join(__dirname, '..', 'tilesets', lang, '.json');
    return new Promise((resolve, reject) => {
        fs.readFile(tilesetFile, 'utf8', (err, data) => {
            err ? reject(err) : resolve(JSON.parse(data));
        });
    });
}
//# sourceMappingURL=bagClass.js.map