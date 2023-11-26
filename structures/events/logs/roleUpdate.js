const client = require("../../Client");
const { EmbedBuilder } = require("discord.js");
const { logsGeral } = require("../../configuration/index")

client.on("roleUpdate", async (oldRole, newRole) => {

    const { guild } = newRole

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
                    .setTitle("<:discordchat:1084189534125834301> | Cargo Atualizado")
                    .setDescription("Um cargo foi atualizado")
                    .setColor("#c5a0c1")
                    .addFields({ name: "Cargo", value: `<@&${oldRole.id}>`, inline: false})
                    .addFields({ name: "Antigo Nome", value: `${oldRole.name}`, inline: false})
                    .addFields({ name: "Novo nome", value: `${newRole.name}`, inline: false})
                    .addFields({ name: "Cor Antiga", value: `${oldRole.hexColor}`, inline: false})
                    .addFields({ name: "Nova Cor", value: `${newRole.hexColor}`, inline: false})
                    .setThumbnail(guild.iconURL())
                    .setFooter({ text: "Logged by Nazuna" })
                    .setTimestamp()
            ]
        });

})