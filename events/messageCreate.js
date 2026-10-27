import { Colors, EmbedBuilder, Events } from 'discord.js';
import { getWordChainChannel, getLastCachedWordChainLetter, checkIfValidWordWordChain, resetWordChainGame, addWordToChain, updateCountWordChain, updateLastCachedWordChainLetter, getWordChainCount, initializeGameTables, getLastCachedWordChainUser, updateLastCachedWordChainUser, getWordChainDelete } from '../sqlite/wordChainDatabase.js';
import isValidWord from "../wordValidation.js";
function getWordCount(str) {
    if (!str || str.trim() === '')
        return 0;
    return str.trim().split(/\s+/).length;
}
function getFirstLetter(content) {
    return content.trim().charAt(0).toLowerCase();
}
function getLastLetter(content) {
    return content.trim().slice(-1).toLowerCase();
}
function resolveDelete(message) {
    if (getWordChainDelete(message.guildId)) {
        return message.delete().catch(() => { });
    }
}
export default {
    name: Events.MessageCreate,
    async execute(message) {
        if (!message.inGuild())
            return;
        if (message.channelId !== getWordChainChannel(message.guildId))
            return;
        if (message.author.bot)
            return;
        const currentWord = message.content.toLowerCase().trim();
        if (getWordCount(message.content) !== 1)
            return resolveDelete(message);
        if (currentWord.length <= 3)
            return resolveDelete(message);
        if (!isValidWord(message.content, "en"))
            return resolveDelete(message);
        initializeGameTables(message.guildId);
        const wordCount = getWordChainCount(message.guildId);
        const lastUser = getLastCachedWordChainUser(message.guildId);
        if (wordCount > 0 && message.author.id === lastUser) {
            return resolveDelete(message);
        }
        const failEmbed = new EmbedBuilder()
            .setTitle(`${message.author.displayName} (${message.author.username}) triggered a game reset`)
            .setColor(Colors.Red);
        const handleGameReset = async (descriptionText) => {
            await message.react('❌');
            failEmbed.setDescription(descriptionText);
            await message.channel.send({ embeds: [failEmbed] });
            resetWordChainGame(message.guildId);
            updateLastCachedWordChainLetter(message.guildId, '');
            updateLastCachedWordChainUser(message.guildId, '');
        };
        if (!wordCount || wordCount === 0) {
            await message.react('✅');
            addWordToChain(message.guildId, currentWord);
            updateCountWordChain(message.guildId);
            updateLastCachedWordChainLetter(message.guildId, getLastLetter(currentWord));
            updateLastCachedWordChainUser(message.guildId, message.author.id);
            return;
        }
        const lastCached = getLastCachedWordChainLetter(message.guildId);
        if (lastCached && getFirstLetter(currentWord) !== lastCached.toLowerCase()) {
            const desc = `The next letter was: ${lastCached.toUpperCase()}\nYour word started with: ${getFirstLetter(currentWord).toUpperCase()}\n${wordCount} words were said during this round`;
            await handleGameReset(desc);
            return;
        }
        if (checkIfValidWordWordChain(message.guildId, currentWord)) {
            const desc = `The word "${message.content}" was already used during this round\n${wordCount} words were said during this round`;
            await handleGameReset(desc);
            return;
        }
        await message.react('✅');
        addWordToChain(message.guildId, currentWord);
        updateCountWordChain(message.guildId);
        updateLastCachedWordChainLetter(message.guildId, getLastLetter(currentWord));
        updateLastCachedWordChainUser(message.guildId, message.author.id);
    },
};
//# sourceMappingURL=messageCreate.js.map