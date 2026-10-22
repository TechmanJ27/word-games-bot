import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
export const db = new DatabaseSync(fileURLToPath(new URL('../database.db', import.meta.url)));
db.exec('PRAGMA foreign_keys = ON;');
export function transaction(fn) {
    db.exec('BEGIN TRANSACTION');
    try {
        const result = fn();
        db.exec('COMMIT');
        return result;
    }
    catch (err) {
        try {
            db.exec('ROLLBACK');
        }
        catch (rollbackErr) {
            console.error('Rollback failed:', rollbackErr);
        }
        throw err;
    }
}
export function createTables() {
    db.exec(` 
        CREATE TABLE IF NOT EXISTS channelConfigs (
            guild_id NOT NULL UNIQUE,
            word_chain_channel TEXT UNIQUE
        )
    `);
    db.exec(` 
        CREATE TABLE IF NOT EXISTS wordChainCache (
            guild_id NOT NULL UNIQUE,
            last_letter TEXT
        )
    `);
}
export function initializeConfigTables(guildId) {
    db.prepare(`INSERT INTO channelConfigs (guild_id) VALUES (?)`).run(guildId);
}
export function initializeGameTables(guildId) {
}
export function getWordChainChannel(guildId) {
    const row = db.prepare('SELECT word_chain_channel FROM channelConfigs WHERE guild_id = ?').get(guildId);
    return row ? row.channel_id : null;
}
export function setWordChainChannel(guildId, channelId) { }
export function getLastCachedWordChainLetter(guildId) {
    const row = db.prepare(`SELECT last_letter FROM wordChainCache WHERE guild_id = ?`).get(guildId);
    return row ? row.last_letter : null;
}
//# sourceMappingURL=database.js.map