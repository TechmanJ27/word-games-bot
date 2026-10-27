import Board from "./boardClass.js";
import PlayerData from "./playerClass.js";
export default class Game {
    metadata;
    playerData;
    boardState;
    options;
    gameState;
    constructor(host, players, options = {}, ...playerUsers) {
        this.metadata = {
            host: host,
            startedAt: new Date(),
            players: players,
            id: crypto.randomUUID()
        };
        this.playerData = new PlayerData(players, playerUsers);
        this.boardState = new Board();
        this.options = options;
        this.gameState = {
            round: 1,
            turn: 1,
            tilesInBag: 100,
            currentPlayer: host.id,
        };
    }
    static fromJSON(data) {
        const game = Object.create(Game.prototype);
        game.metadata = data.metadata;
        game.options = data.options;
        game.gameState = data.gameState;
        game.boardState = Object.assign(Object.create(Board.prototype), data.boardState);
        game.playerData = Object.assign(Object.create(PlayerData.prototype), data.playerData);
        return game;
    }
}
//# sourceMappingURL=gameClass.js.map