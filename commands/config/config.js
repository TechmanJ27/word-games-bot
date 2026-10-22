import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
export default {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configure bot settings')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommandGroup(subcommandGroup => subcommandGroup
        .setName('server')
        .setDescription('Server config')
        .addSubcommand(subcommand => subcommand
        .setName('game-channel')
        .setDescription('Set the channel for a particular game')
        .addStringOption(option => option
        .setName('game')
        .setDescription('The game to set the channel for')
        .addChoices({ name: 'Word Chain', value: 'word_chain_channel' })
        .setRequired(true))
        .addChannelOption(option => option
        .setName('channel')
        .setDescription('The channel to use for the game')
        .setRequired(true)))),
    async execute(interaction) {
        await interaction.deferReply();
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();
        if (!subcommandGroup)
            return;
        switch (subcommandGroup) {
            case 'server':
                switch (subcommand) {
                    case 'word_chain_channel':
                }
        }
    }
};
//# sourceMappingURL=config.js.map