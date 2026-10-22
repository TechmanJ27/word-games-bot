import { Colors, EmbedBuilder, Events } from "discord.js";
import { getWordChainChannel, getLastCachedWordChainLetter } from "../database.js";
function getWordCount(str) {
    if (!str || str.trim() === "")
        return 0;
    return str.trim().split(/\s+/).length;
}
function getFirstLetter(content) {
}
export default {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot)
            return;
        if (message.inGuild()) {
            if (message.channelId == getWordChainChannel(message.guildId)) {
                const lastCached = getLastCachedWordChainLetter(message.guildId);
                const warningEmbed = new EmbedBuilder()
                    .setTitle('Warning')
                    .setColor(Colors.Red);
                if (getWordCount(message.content) !== 1) {
                    await message.channel.send({ embeds: [warningEmbed] });
                }
                else if (getFirstLetter(message.content) !== ) { }
            }
        }
    },
};
//# sourceMappingURL=messageCreate.js.map