export default class playerData {
    constructor(players, playerUsers) {
        let playerObj = {};
        for (let i = 0; i < players; i++) {
            playerObj['player' + (i + 1)] = new player(playerUsers[i]);
        }
        return playerObj;
    }
}
class player {
    constructor(user) {
        return ({});
    }
}
//# sourceMappingURL=playerClass.js.map