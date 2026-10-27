import { PermissionFlagsBits, SlashCommandBuilder, InteractionContextType, ChannelType, PermissionsBitField } from 'discord.js';
import { setWordChainChannel, setWordChainDelete } from '../../sqlite/wordChainDatabase.js';
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
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText))))
        .addSubcommand(subcommand => subcommand
        .setName('word-chain')
        .setDescription('Adjust word chain settings')
        .addBooleanOption(option => option
        .setName('delete')
        .setDescription('Toggle deletion of unrelated messages')
        .setRequired(true))),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const memberPermissions = interaction.memberPermissions;
        if (!memberPermissions || !memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.editReply({
                content: 'You do not have permission to use this command.'
            });
        }
        const subcommandGroup = interaction.options.getSubcommandGroup(false);
        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guildId;
        if (subcommandGroup === 'server') {
            if (subcommand === 'game-channel') {
                const game = interaction.options.getString('game', true);
                const channel = interaction.options.getChannel('channel', true);
                if (game === 'word_chain') {
                    setWordChainChannel(guildId, channel.id);
                    return interaction.editReply({ content: `Word Chain channel has been set to ${channel}.` });
                }
            }
        }
        if (subcommand === 'word-chain') {
            const newState = interaction.options.getBoolean('delete', true);
            setWordChainDelete(guildId, newState);
            return interaction.editReply({ content: `Word Chain message deletion is now set to **${newState}**.` });
        }
        await interaction.editReply({ content: 'Config updated.' });
    }
};
//# sourceMappingURL=config.js.map