import { AttachmentBuilder, ChannelType, InteractionContextType, SlashCommandBuilder } from "discord.js";
import Game from "../../scrabble/classes/gameClass.js";
import * as util from "node:util";
import { updateBoard } from "../../scrabble/classes/boardClass.js";
import ScrabbleEmbedBuilder from "../../scrabble/embeds.js";
import { getScrabbleGameById, newScrabbleGame, updateScrabbleGame } from "../../sqlite/scrabbleDatabase.js";
import { sendTiles } from "../../scrabble/eachTurn/startTurn.js";
export default {
    data: new SlashCommandBuilder()
        .setName("dev")
        .setDescription('A bunch of dev commands for testing')
        .setContexts(InteractionContextType.PrivateChannel, InteractionContextType.Guild, InteractionContextType.BotDM)
        .addSubcommandGroup(subcommandGroup => subcommandGroup
        .setName('scrabble')
        .setDescription('Scrabble tests')
        .addSubcommand(subcommand => subcommand
        .setName('board-gen')
        .setDescription('Generate scrabble board'))
        .addSubcommand(subcommand => subcommand
        .setName('draw-word')
        .setDescription('Draw a word to a specific scrabble board')
        .addStringOption(option => option.setName('word').setDescription('Word').setRequired(true))
        .addIntegerOption(option => option.setName('x').setDescription('x').setRequired(true))
        .addIntegerOption(option => option.setName('y').setDescription('y').setRequired(true))
        .addStringOption(option => option.setName('id').setDescription('Id').setRequired(true)))
        .addSubcommand(subcommand => subcommand
        .setName('send-tiles')
        .setDescription('Send a user a tile table')
        .addStringOption(option => option.setName('tiles').setDescription('An array of tiles').setRequired(true))
        .addUserOption(option => option.setName('user').setDescription('The user to send a table to').setRequired(true)))),
    async execute(interaction) {
        await interaction.deferReply();
        const subcommandGroup = interaction.options.getSubcommandGroup();
        if (!subcommandGroup)
            return await interaction.editReply({ content: "Missing subcommand group." });
        const subcommand = interaction.options.getSubcommand();
        switch (subcommandGroup) {
            case "scrabble":
                switch (subcommand) {
                    case "board-gen": {
                        const game = new Game(interaction.user, 1, {}, interaction.user);
                        console.log(util.inspect(game, { showHidden: false, depth: null, colors: true }));
                        if (!game.boardState.imageURL) {
                            await interaction.editReply({ content: "Error: Could not generate the game board." });
                            break;
                        }
                        await sendScrabbleEmbed(interaction, game);
                        newScrabbleGame(game.metadata.id, game);
                        break;
                    }
                    case "draw-word": {
                        const text = interaction.options.getString("word") ?? '';
                        const x = interaction.options.getInteger("x") ?? 0;
                        const y = interaction.options.getInteger("y") ?? 0;
                        const gameId = interaction.options.getString("id");
                        if (!gameId) {
                            await interaction.editReply({ content: "Error: Game ID is required." });
                            return;
                        }
                        const game = getScrabbleGameById(gameId);
                        if (!game) {
                            await interaction.editReply({ content: "Error: Game not found." });
                            return;
                        }
                        game.boardState.imageURL = await updateBoard(game.boardState, text, x, y);
                        await sendScrabbleEmbed(interaction, game);
                        updateScrabbleGame(gameId, game);
                        break;
                    }
                    case "send-tiles": {
                        const user = interaction.options.getUser("user");
                        const tileArray = interaction.options.getString("tiles");
                        if (!user || !tileArray) {
                            await interaction.editReply({ content: "Error: Missing parameters." });
                            return;
                        }
                        if (!interaction.channel || interaction.channel.type !== ChannelType.GuildText) {
                            await interaction.editReply({ content: "Error: This command can only be used in a text channel." });
                            return;
                        }
                        try {
                            const parsedTiles = tileArray.includes(',') ? tileArray.split(',') : tileArray.split('');
                            await sendTiles(user, interaction.channel, parsedTiles);
                            await interaction.editReply({ content: `Successfully sent tiles to ${user.tag}.` });
                        }
                        catch (e) {
                            console.error(e);
                            await interaction.editReply({ content: "Failed to send tiles. Check console for details." });
                        }
                        break;
                    }
                }
                break;
        }
    }
};
async function sendScrabbleEmbed(interaction, game) {
    const base64Data = game.boardState.imageURL.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    const file = new AttachmentBuilder(buffer, { name: 'board.png' });
    const embed = new ScrabbleEmbedBuilder(game.metadata.host.id).setFooter({ text: game.metadata.id });
    await interaction.editReply({ embeds: [embed], files: [file] });
}
//# sourceMappingURL=test.js.map