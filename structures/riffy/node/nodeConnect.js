const client = require("../../Client")
const { EmbedBuilder } = require("discord.js");
const { logsNode } = require("../../configuration/index");

client.riffy.on("nodeConnect", async (node) => {
    console.log(`\n🟩 Node ${node.name} conectado.`)

    const logsChannelId = logsNode

    client.channels.fetch(logsChannelId).then(channel => {

        if (!channel) return

        channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor(`Green`)
                .setTitle("Node Status")
                .setDescription(`**🟩 Node \`${node.name}\` foi conectado**`)
            ]
        })

    })

})