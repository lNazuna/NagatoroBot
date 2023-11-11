const client = require("../../Client")
const { EmbedBuilder } = require("discord.js");
const { logsNode } = require("../../configuration/index");

client.riffy.on("nodeError", async (node, error) => {
    console.log(`🟥 Node ${node.name} encontrou um erro: ${error.message}`)

    const logsChannelId = logsNode

    client.channels.fetch(logsChannelId).then(channel => {

        if (!channel) return

        channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor(`Red`)
                .setTitle("Node Status")
                .setDescription(`**🟥 Node \`${node.name}\` obteve um erro: \`${error.message}\`**`)
            ]
        })

    })

})