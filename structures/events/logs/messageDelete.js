const client = require("../../Client");
const { EmbedBuilder } = require("discord.js");
const { logsGeral } = require("../../configuration/index")

client.on("messageDelete", async (message) => {

    try {
 
        const { guild } = message
    
        const mes = message.cleanContent.slice(0,1018);

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
                    .setTitle("<:discordchat:1084189534125834301> | Mensagem Deletada")
                    .setDescription("Uma mensagem foi excluída")
                    .addFields({ name: "Conteúdo da Mensagem", value: `${mes || "None!"}`, inline: false})
                    .addFields({ name: "Channel da Mensagem", value: `${message.channel}`, inline: false})
                    .addFields({ name: "Autor da Mensagem", value: `${message.author || "None!"}`, inline: false})
                    .setThumbnail(guild.iconURL())
                    .setFooter({ text: "Logged by Nazuna" })
                    .setTimestamp()
            ]
        })
 
    } catch (err) {
        return
    }

})