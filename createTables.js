import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
const dbPath = path.join(import.meta.dirname, 'database.db');
const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON;');
db.exec(`
    CREATE TABLE IF NOT EXISTS wordChainConfig (
        guild_id TEXT PRIMARY KEY NOT NULL,
        word_chain_channel TEXT,
        word_chain_delete INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS wordChainCache (
        guild_id TEXT PRIMARY KEY NOT NULL,
        last_letter TEXT,
        last_user TEXT,
        count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS wordChainWord (
        guild_id TEXT NOT NULL,
        word TEXT NOT NULL,
        PRIMARY KEY (guild_id, word),
        FOREIGN KEY (guild_id) REFERENCES wordChainCache(guild_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS scrabbleGames (
        game_id PRIMARY KEY NOT NULL,
        game_object TEXT NOT NULL
    );
`);
//# sourceMappingURL=createTables.js.map