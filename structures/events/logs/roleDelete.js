const client = require("../../Client");
const { EmbedBuilder } = require("discord.js");
const { logsGeral } = require("../../configuration/index")

client.on("roleDelete", async (role) => {

    const { guild, name, id, hexColor } = role

    if (!logsGeral) {
        return; 
    }

    const logsChannel = logsGeral;

    const Channel = await guild.channels.cache.get(logsChannel)
    if (!Channel) return

    return Channel.send({
        embeds: [
            new EmbedBuilder()
                .setColor("#c5a0c1")
                .setTitle("<:discordchat:1084189534125834301> | Cargo Deletado")
                .setDescription("Um cargo foi deletado")
                .addFields({ name: "Nome do Cargo", value: `${name}`, inline: false})
                .addFields({ name: "ID do Cargo", value: `${id}`, inline: false})
                .addFields({ name: "Cor do Cargo", value: `${hexColor}`, inline: false})
                .setThumbnail(guild.iconURL())
                .setFooter({ text: "Logged by Nazuna" })
                .setTimestamp()
        ]
    })

})