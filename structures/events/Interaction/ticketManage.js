const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const client = require("../../Client");
const TicketSchema = require('../../database/models/TicketDB');

client.on("interactionCreate", async (interaction) => {

    const {guild, member, customId, channel } = interaction;

    const {ManageChannels, SendMessages} = PermissionFlagsBits;
    
    if(!['ticket-manage-menu'].includes(customId)) return;
    await interaction.deferUpdate();
    await interaction.deleteReply();
    const embed = new EmbedBuilder()
    const data = await TicketSchema.findOne({GuildID: guild.id, ChannelID: channel.id})
        if (!data) return interaction.reply({embeds: [embed.setColor('Red').setDescription("Algo deu errado, tente novamente mais tarde.")], ephemeral: true}).catch(error => {return});
        const findMembers = await TicketSchema.findOne({GuildID: guild.id, ChannelID: channel.id, MembersID: interaction.values[0]});
        if(!findMembers) {
        data.MembersID.push(interaction.values[0]);
        channel.permissionOverwrites.edit(interaction.values[0], {
            SendMessages: true,
            ViewChannel: true,
            ReadMessageHistory: true
        }).catch(error => {return});
        interaction.channel.send({embeds: [embed.setColor('Green').setDescription('<@' + interaction.values[0] + '>' + ' ' + "foi adicionado ao ticket")]}).catch(error => {return});
        data.save();
        }else {
        data.MembersID.remove(interaction.values[0]);
        channel.permissionOverwrites.delete(interaction.values[0]).catch(error => {return});
        interaction.channel.send({embeds: [embed.setColor('Green').setDescription('<@' + interaction.values[0] + '>' + ' ' + "ofi removido para o ticket")]}).catch(error => {return});
        data.save();
        }

});