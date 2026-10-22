import { Events, MessageFlags, Collection } from "discord.js";
export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);
            await command?.autocomplete?.(interaction);
            return;
        }
        if (!interaction.isChatInputCommand())
            return;
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            const { cooldowns } = interaction.client;
            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }
            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldownDuration = 0;
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;
            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1_000);
                    return interaction.reply({
                        content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
                        flags: MessageFlags.Ephemeral,
                    });
                }
            }
            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            try {
                await command.execute(interaction);
            }
            catch (error) {
                console.error(`Error executing command ${interaction.commandName}:`, error);
                const errorPayload = {
                    content: 'There was an error while executing this command!',
                    flags: 64
                };
                try {
                    if (interaction.deferred || interaction.replied) {
                        await interaction.editReply(errorPayload);
                    }
                    else {
                        await interaction.reply(errorPayload);
                    }
                }
                catch (apiError) {
                    console.error("Failed to send error message back to Discord channel:", apiError.message);
                }
            }
        }
    }
};
//# sourceMappingURL=interactionCreate.js.map