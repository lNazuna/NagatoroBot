const client = require("../../Client");
const { EmbedBuilder } = require("discord.js");
const { logsGeral } = require("../../configuration/index")

client.on("channelUpdate", async (newChannel, oldChannel) => {

    const { guild } = newChannel

    if (!logsGeral) {
        return; 
    }

    const logsChannel = logsGeral;

    const Channel = await guild.channels.cache.get(logsChannel)
    if (!Channel) return

    if (oldChannel.name !== newChannel.name) {
        Channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("#c5a0c1")
                    .setTitle("<:discordchat:1084189534125834301> | Nome do Channel Atualizado")
                    .setDescription("Um channel foi Atalizado")
                    .setThumbnail(newChannel.guild.iconURL({ dynamic: true }))
                    .addFields(
                        {
                            name: "Channel",
                            value: `<#${newChannel.id}>`
                        },
                        {
                            name: "Antigo Nome",
                            value: oldChannel.name || "None"
                        },
                        {
                            name: "Novo Nome:",
                            value: newChannel.name || "None"
                        }
                    )
                    .setThumbnail(guild.iconURL())
                    .setFooter({ text: "Logged by Nazuna" })
                    .setTimestamp()
            ]
        });
    } else if (oldChannel.nsfw !== newChannel.nsfw) {
        Channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("#c5a0c1")
                    .setTitle("<:discordchat:1084189534125834301> | Channel NSFW Atualizado")
                    .setDescription("Um channel foi Atalizado")
                    .setThumbnail(newChannel.guild.iconURL({ dynamic: true }))
                    .addFields(
                        {
                            name: "Channel:",
                            value: `<#${newChannel.id}>`,
                        },
                        {
                            name: "Status:",
                            value: newChannel.nsfw ? "Desativado" : "Ativado",
                        }
                    )
                    .setThumbnail(guild.iconURL())
                    .setFooter({ text: "Logged by Nazuna" })
                    .setTimestamp()
            ]
        });
    }

})