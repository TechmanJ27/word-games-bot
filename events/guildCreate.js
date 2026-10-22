import { initializeConfigTables } from "../database.js";
import { Events } from "discord.js";
export default {
    name: Events.GuildCreate,
    async execute(guild) {
        console.log(`Added to new guild  with name ${guild.name} and id ${guild.id}`);
        initializeConfigTables(guild.id);
        console.log(`Initialized config for guild with name ${guild.name} and id ${guild.id}`);
    },
};
//# sourceMappingURL=guildCreate.js.map