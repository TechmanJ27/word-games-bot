export default class PlayerData {
    players = {};
    constructor(playerCount, playerUsers) {
        for (let i = 0; i < playerCount; i++) {
            const user = playerUsers[i];
            if (user) {
                this.players['player' + (i + 1)] = new Player(user);
            }
        }
    }
}
class Player {
    username;
    id;
    points = 0;
    tiles = [];
    constructor(user) {
        this.username = user.username;
        this.id = user.id;
    }
}
//# sourceMappingURL=playerClass.js.map