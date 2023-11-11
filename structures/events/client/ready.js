const { ActivityType } = require("discord.js");
const client = require("../../Client");

client.on("ready", async () => {
    console.log(`\n🟩 ${client.user.tag} está online!`);

    client.user.setPresence({
        activities: [
            {
                name: "/ajuda",
                type: ActivityType.Watching
            }
        ],
        status: "online"
    })

    client.riffy.init(client.user.id); 
})