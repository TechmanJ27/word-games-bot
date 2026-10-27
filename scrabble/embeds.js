import { EmbedBuilder } from "discord.js";
export default class ScrabbleEmbedBuilder extends EmbedBuilder {
    constructor(hostId) {
        super();
        this.setDescription(`Scrabble Game hosted by <@${hostId}>`);
        this.setImage('attachment://board.png');
    }
}
//# sourceMappingURL=embeds.js.map