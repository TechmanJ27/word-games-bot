import playerData from "./playerClass.js";
import Board from "./boardClass.js";
export default class newGame {
    constructor(host, players = 4, ...playerUsers) {
        return ({
            metadata: {
                host: host,
                startedAt: new Date(),
                players: players
            },
            playerData: new playerData(players, playerUsers),
            boardState: new Board()
        });
    }
}
//# sourceMappingURL=gameClass.js.map