import { PermissionFlagsBits, SlashCommandBuilder, InteractionContextType } from 'discord.js';
import { setWordChainChannel } from '../../database.js';
export default {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configure bot settings')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setContexts(InteractionContextType.Guild)
        .addSubcommandGroup(subcommandGroup => subcommandGroup
        .setName('server')
        .setDescription('Server config')
        .addSubcommand(subcommand => subcommand
        .setName('game-channel')
        .setDescription('Set the channel for a particular game')
        .addStringOption(option => option
        .setName('game')
        .setDescription('The game to set the channel for')
        .addChoices({ name: 'Word Chain', value: 'word_chain' })
        .setRequired(true))
        .addChannelOption(option => option
        .setName('channel')
        .setDescription('The channel to use for the game')
        .setRequired(true)))),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();
        const game = interaction.options.getString('game', true);
        const channel = interaction.options.getChannel('channel', true);
        if (subcommandGroup === 'server' && subcommand === 'game-channel') {
            if (game === 'word_chain') {
                setWordChainChannel(interaction.guildId, channel.id);
                return interaction.editReply({ content: `Word Chain channel has been set to ${channel}.` });
            }
        }
        await interaction.editReply({ content: 'Config updated.' });
    }
};
//# sourceMappingURL=config.js.map