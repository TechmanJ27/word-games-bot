import { Colors, EmbedBuilder, Events } from 'discord.js';
import { getWordChainChannel, getLastCachedWordChainLetter, checkIfValidWordWordChain, resetWordChainGame, addWordToChain, updateCountWordChain, updateLastCachedWordChainLetter, getWordChainCount, initializeGameTables, getLastCachedWordChainUser, updateLastCachedWordChainUser, getWordChainDelete } from '../database.js';
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
        return message.delete();
    }
    else {
        return;
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
        if (getWordCount(message.content) !== 1)
            resolveDelete(message);
        if (message.content.length <= 3)
            resolveDelete(message);
        initializeGameTables(message.guildId);
        const lastCached = getLastCachedWordChainLetter(message.guildId);
        const currentWord = message.content.toLowerCase().trim();
        const lastUser = getLastCachedWordChainUser(message.guildId);
        if (message.author.id === lastUser)
            resolveDelete(message);
        if (!isValidWord(message.content))
            resolveDelete(message);
        const failEmbed = new EmbedBuilder()
            .setTitle(`<@${message.author.id}> triggered a game reset`)
            .setColor(Colors.Red);
        if (!getWordChainCount(message.guildId)) {
            await message.react('✅');
            addWordToChain(message.guildId, currentWord);
            updateCountWordChain(message.guildId);
            updateLastCachedWordChainLetter(message.guildId, getLastLetter(currentWord));
            updateLastCachedWordChainUser(message.guildId, message.author.id);
            return;
        }
        if (lastCached && getFirstLetter(currentWord) !== lastCached.toLowerCase()) {
            await message.react('❌');
            failEmbed.setDescription(`The next letter was: ${lastCached.toUpperCase()}\nYour word started with: ${getFirstLetter(currentWord).toUpperCase()}\n${getWordChainCount(message.guildId)} words were said during this round`);
            await message.channel.send({ embeds: [failEmbed] });
            resetWordChainGame(message.guildId);
            return;
        }
        if (checkIfValidWordWordChain(message.guildId, currentWord)) {
            await message.react('❌');
            failEmbed.setDescription(`The word "${message.content}" was already used during this round\n${getWordChainCount(message.guildId)} words were said during this round`);
            await message.channel.send({ embeds: [failEmbed] });
            resetWordChainGame(message.guildId);
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