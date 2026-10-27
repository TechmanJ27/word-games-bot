import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import Game from "../scrabble/classes/gameClass.js";
const db = new DatabaseSync(path.join(import.meta.dirname, '..', 'database.db'));
db.exec('PRAGMA foreign_keys = ON;');
const stmtNewScrabbleGame = db.prepare(`
    INSERT INTO scrabbleGames (game_id, game_object)
    VALUES (?, ?);
`);
const stmtUpdateScrabbleGame = db.prepare(`
    UPDATE scrabbleGames
    SET game_object = ?
    WHERE game_id = ?;
`);
const stmtGetScrabbleGameById = db.prepare(`
    SELECT game_object FROM scrabbleGames WHERE game_id = ?;
`);
export function transaction(fn) {
    db.exec('BEGIN TRANSACTION;');
    try {
        const result = fn();
        db.exec('COMMIT;');
        return result;
    }
    catch (err) {
        try {
            db.exec('ROLLBACK;');
        }
        catch (rollbackErr) {
            console.error('Critical: SQLite Rollback failed:', rollbackErr);
        }
        throw err;
    }
}
export function getScrabbleGameById(gameId) {
    const gameData = stmtGetScrabbleGameById.get(gameId);
    if (!gameData)
        return null;
    const plainObject = JSON.parse(gameData.game_object);
    return Game.fromJSON(plainObject);
}
export function newScrabbleGame(gameId, game) {
    stmtNewScrabbleGame.run(gameId, JSON.stringify(game));
}
export function updateScrabbleGame(gameId, game) {
    stmtUpdateScrabbleGame.run(JSON.stringify(game), gameId);
}
//# sourceMappingURL=scrabbleDatabase.js.map