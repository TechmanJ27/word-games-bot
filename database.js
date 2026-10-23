import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
const db = new DatabaseSync(path.join(import.meta.dirname, 'database.db'));
db.exec('PRAGMA foreign_keys = ON;');
const stmtInitializeConfig = db.prepare(`
    INSERT INTO wordChainConfig (guild_id) VALUES (?) ON CONFLICT(guild_id) DO NOTHING;
`);
const stmtInitializeGame = db.prepare(`
    INSERT INTO wordChainCache (guild_id) VALUES (?) ON CONFLICT(guild_id) DO NOTHING;
`);
const stmtGetWordChainChannel = db.prepare(`
    SELECT word_chain_channel FROM wordChainConfig WHERE guild_id = ?
`);
const stmtSetWordChainChannel = db.prepare(`
    INSERT INTO wordChainConfig (guild_id, word_chain_channel) VALUES (?, ?)
    ON CONFLICT(guild_id) DO UPDATE SET word_chain_channel = excluded.word_chain_channel;
`);
const stmtGetWordChainDelete = db.prepare(`
    SELECT word_chain_delete FROM wordChainConfig WHERE guild_id = ?
`);
const stmtSetWordChainDelete = db.prepare(`
    INSERT INTO wordChainConfig (guild_id, word_chain_delete) VALUES (?, ?)
    ON CONFLICT(guild_id) DO UPDATE SET word_chain_delete = excluded.word_chain_delete;
`);
const stmtGetLastWordChainLetter = db.prepare(`
    SELECT last_letter FROM wordChainCache WHERE guild_id = ?
`);
const stmtGetLastUserChainLetter = db.prepare(`
    SELECT last_user FROM wordChainCache WHERE guild_id = ?
`);
const stmtGetCount = db.prepare(`
    SELECT count FROM wordChainCache WHERE guild_id = ?
`);
const stmtUpdateLastWordChainLetter = db.prepare(`
    INSERT INTO wordChainCache (guild_id, last_letter) VALUES (?, ?)
    ON CONFLICT(guild_id) DO UPDATE SET last_letter = excluded.last_letter;
`);
const stmtUpdateLastWordChainUser = db.prepare(`
    INSERT INTO wordChainCache (guild_id, last_user) VALUES (?, ?)
    ON CONFLICT(guild_id) DO UPDATE SET last_user = excluded.last_user;
`);
const stmtIncrementWordChainCount = db.prepare(`
    INSERT INTO wordChainCache (guild_id, count) VALUES (?, 1)
    ON CONFLICT(guild_id) DO UPDATE SET count = count + 1;
`);
const stmtWordChainCheckWord = db.prepare(`
    SELECT word FROM wordChainWord WHERE guild_id = ? AND word = ?
`);
const stmtWordChainAddWord = db.prepare(`
    INSERT INTO wordChainWord (guild_id, word) VALUES (?, ?);
`);
const stmtResetWordChainGame = db.prepare(`
    UPDATE wordChainCache SET last_letter = NULL, count = 0 WHERE guild_id = ?;
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
            console.error('Rollback failed:', rollbackErr);
        }
        throw err;
    }
}
export function initializeConfigTables(guildId) {
    stmtInitializeConfig.run(guildId);
}
export function initializeGameTables(guildId) {
    stmtInitializeGame.run(guildId);
}
export function getWordChainChannel(guildId) {
    const row = stmtGetWordChainChannel.get(guildId);
    return row ? row.word_chain_channel : null;
}
export function setWordChainChannel(guildId, channelId) {
    stmtSetWordChainChannel.run(guildId, channelId);
}
export function getWordChainDelete(guildId) {
    const row = stmtGetWordChainChannel.get(guildId);
    if (row) {
        let boolState = false;
        const state = row.word_chain_delete;
        if (state == 1)
            boolState = true;
        return boolState;
    }
    else {
        return null;
    }
}
export function setWordChainDelete(guildId, toggle) {
    let toggleNum = 0;
    if (toggle)
        toggleNum++;
    stmtSetWordChainChannel.run(guildId, toggleNum);
}
export function getLastCachedWordChainLetter(guildId) {
    const row = stmtGetLastWordChainLetter.get(guildId);
    return row ? row.last_letter : null;
}
export function getLastCachedWordChainUser(guildId) {
    const row = stmtGetLastUserChainLetter.get(guildId);
    return row ? row.last_user : null;
}
export function getWordChainCount(guildId) {
    const row = stmtGetCount.get(guildId);
    return row ? row.count : 0;
}
export function updateLastCachedWordChainLetter(guildId, lastLetter) {
    stmtUpdateLastWordChainLetter.run(guildId, lastLetter);
}
export function updateLastCachedWordChainUser(guildId, user) {
    stmtUpdateLastWordChainUser.run(guildId, user);
}
export function updateCountWordChain(guildId) {
    stmtIncrementWordChainCount.run(guildId);
}
export function checkIfValidWordWordChain(guildId, word) {
    const row = stmtWordChainCheckWord.get(guildId, word.toLowerCase().trim());
    return row ? row.word : null;
}
export function addWordToChain(guildId, word) {
    stmtInitializeGame.run(guildId);
    stmtWordChainAddWord.run(guildId, word.toLowerCase().trim());
}
export function resetWordChainGame(guildId) {
    transaction(() => {
        stmtResetWordChainGame.run(guildId);
        db.prepare('DELETE FROM wordChainWord WHERE guild_id = ?').run(guildId);
    });
}
//# sourceMappingURL=database.js.map