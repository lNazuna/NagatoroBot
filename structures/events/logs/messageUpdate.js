const client = require("../../Client");
const { EmbedBuilder } = require("discord.js");
const { logsGeral } = require("../../configuration/index")

client.on("messageUpdate", async (oldMessage, newMessage) => {

    try {
 
        const { guild } = newMessage

        if (!logsGeral) {
            return; 
        }
    
        const logsChannel = logsGeral;

        const Channel = await guild.channels.cache.get(logsChannel)
        if (!Channel) return

            Channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#c5a0c1")
                        .setTitle("<:discordchat:1084189534125834301> | Mensagem Editada")
                        .setDescription("Uma mensagem foi editada")
                        .setColor("#c5a0c1")
                        .addFields({ name: "Autor", value: `${oldMessage.author} \`[${oldMessage.author}]\``, inline: false})
                        .addFields({ name: "Channel", value: `<#${oldMessage.channel.id}> [[Click Here]](${newMessage.url})`, inline: false})
                        .addFields({ name: "Mensagem Antiga", value: "```" + oldMessage.cleanContent.slice(0, 1018) + "```", inline: false})
                        .addFields({ name: "Nova mensagem", value: "```" + newMessage.cleanContent.slice(0, 1018) + "```", inline: false})
                        .setThumbnail(guild.iconURL())
                        .setFooter({ text: "Logged by Nazuna" })
                        .setTimestamp()
                ]
            });
 
    } catch (err) {
        return
    }

})