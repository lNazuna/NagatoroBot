const client = require("../../Client")
const { EmbedBuilder } = require("discord.js");
const { logsNode } = require("../../configuration/index");

client.riffy.on("nodeDisconnect", async (node, reason) => {
    console.log(`🟥 Node ${node.name} desconectado por: ${reason.message}`)

    const logsChannelId = logsNode

    client.channels.fetch(logsChannelId).then(channel => {

        if (!channel) return

        channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor(`Red`)
                .setTitle("Node Status")
                .setDescription(`**🟥 Node \`${node.name}\` foi desconectado por: \`${reason.message}\`**`)
            ]
        })

    })

})