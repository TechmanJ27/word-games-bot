export function formatTiles(player, tiles) {
    const gridWidth = tiles.length * 4 + 1;
    const innerContentWidth = Math.max(player.username.length, gridWidth - 4);
    const totalBoxWidth = innerContentWidth + 4;
    const topBorder = `╔${"═".repeat(totalBoxWidth - 2)}╗`;
    const paddedUsername = player.username.padEnd(innerContentWidth, " ");
    const usernameRow = `║ ${paddedUsername} ║`;
    let separator = `╠${tiles.map(() => "═══").join("╦")}`;
    if (separator.length < totalBoxWidth - 1) {
        separator = separator.padEnd(totalBoxWidth - 2, "═");
    }
    separator += "╣";
    let tileRow = "";
    for (const tile of tiles) {
        const tileChar = tile.length === 1 ? tile : (tile[0] || " ");
        tileRow += `║ ${tileChar} `;
    }
    if (tileRow.length < totalBoxWidth - 1) {
        tileRow = tileRow.padEnd(totalBoxWidth - 2, " ");
    }
    tileRow += "║";
    let bottomBorder = `╚${tiles.map(() => "═══").join("╩")}`;
    if (bottomBorder.length < totalBoxWidth - 1) {
        bottomBorder = bottomBorder.padEnd(totalBoxWidth - 2, "═");
    }
    bottomBorder += "╝";
    return `\n${topBorder}\n${usernameRow}\n${separator}\n${tileRow}\n${bottomBorder}\n`;
}
export async function sendTiles(player, gameChannel, tiles) {
    try {
        await player.send(formatTiles(player, tiles));
    }
    catch (e) {
        console.error(e);
        return gameChannel.send(`<@${player.id}> needs to enable DMs from members in this server.`);
    }
}
//# sourceMappingURL=startTurn.js.map