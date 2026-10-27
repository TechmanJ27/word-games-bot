export function updateRound(game) {
    game.gameState.turn++;
    if (game.gameState.turn % 4 === 0) {
        game.gameState.round++;
    }
    let currentIndex = -1;
    const totalPlayers = game.metadata.players;
    for (let i = 1; i <= totalPlayers; i++) {
        const playerKey = 'player' + i;
        if (game.playerData.players[playerKey]?.id === game.gameState.currentPlayer) {
            currentIndex = i;
            break;
        }
    }
    if (currentIndex !== -1) {
        const nextPlayerIndex = (currentIndex % totalPlayers) + 1;
        const nextPlayerKey = 'player' + nextPlayerIndex;
        const nextPlayer = game.playerData.players[nextPlayerKey];
        if (nextPlayer) {
            game.gameState.currentPlayer = nextPlayer.id;
        }
    }
}
//# sourceMappingURL=nextTurn.js.map