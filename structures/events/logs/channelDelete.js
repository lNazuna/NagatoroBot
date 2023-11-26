const client = require("../../Client");
const { EmbedBuilder } = require("discord.js");
const { logsGeral } = require("../../configuration/index")

client.on("channelDelete", async (channel) => {

    const { guild } = channel

    if (!logsGeral) {
        return; 
    }
    
    let type = channel.type
 
    if (type == 0) type = 'Texto'
    if (type == 2) type = 'Voz'
    if (type == 13) type = 'Stage'
    if (type == 15) type = 'Forum'
    if (type == 5) type = 'Anúncio'
    if (type == 4) type = 'Categoria'

    const logsChannel = logsGeral;

    const Channel = await guild.channels.cache.get(logsChannel)
    if (!Channel) return

    return Channel.send({
        embeds: [
            new EmbedBuilder()
            .setColor("#c5a0c1")
            .setTitle("<:discordchat:1084189534125834301> | Channel Deletado")
            .setDescription("Um Channel foi excluído")
            .addFields({ name: "Nome do Channel", value: `${channel.name}`, inline: false})
            .addFields({ name: "Tipo de Channel", value: `${type}`, inline: false})
            .addFields({ name: "ID do Channel", value: `${channel.id}`, inline: false})
            .setThumbnail(guild.iconURL())
            .setFooter({ text: "Logged by Nazuna" })
            .setTimestamp()
        ]
    })

})