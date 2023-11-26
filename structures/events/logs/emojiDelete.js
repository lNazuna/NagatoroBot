const client = require("../../Client");
const { EmbedBuilder } = require("discord.js");
const { logsGeral } = require("../../configuration/index")

client.on("emojiDelete", async (emoji) => {

    const { guild, id } = emoji

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
                .setTitle("<:discordchat:1084189534125834301> | Emoji Deletado")
                .setDescription("Um emoji foi removido do servidor")
                .addFields({ name: "Nome do Emoji", value: `${emoji.name}`, inline: false})
                .addFields({ name: "ID do Emoji", value: `${id}`, inline: false})
                .setThumbnail(emoji.imageURL())
                .setFooter({ text: "Logged by Nazuna" })
                .setTimestamp()
        ]
    })

})