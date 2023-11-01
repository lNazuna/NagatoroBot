const { ChatInputCommandInteraction, Events, EmbedBuilder, PermissionFlagsBits, UserSelectMenuBuilder, ActionRowBuilder } = require("discord.js")
const { CustomClient } = require("../../structures/classes/CustomClient")
const {createTranscript} = require('discord-html-transcripts');
const TicketSetup = require('../../schemas/TicketSetupDB');
const TicketSchema = require('../../schemas/TicketDB');
  
  module.exports = {
    name: Events.InteractionCreate,
  
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {CustomClient} client
     */

    async execute(interaction, client) {

        const {guild, member, customId, channel } = interaction;

        const {ManageChannels, SendMessages} = PermissionFlagsBits;
        if(!interaction.isButton()) return;
        if(!['ticket-close', 'ticket-lock', 'ticket-unlock', 'ticket-manage', 'ticket-claim'].includes(customId)) return;
        const docs = await TicketSetup.findOne({GuildID: guild.id});
        if (!docs) return;
        const errorEmbed = new EmbedBuilder().setColor('Red').setDescription("Algo deu errado, tente novamente mais tarde!");
        if (!guild.members.me.permissions.has((r) => r.id === docs.Handlers)) return interaction.reply({embeds: [errorEmbed], ephemeral: true}).catch(error => {return});
        const executeEmbed = new EmbedBuilder().setColor('Aqua');
        const nopermissionsEmbed = new EmbedBuilder().setColor('Red').setDescription("Desculpe, mas você não tem permissão para fazer isso");
        const alreadyEmbed = new EmbedBuilder().setColor('Orange');
        const data = await TicketSchema.findOne({GuildID: guild.id, ChannelID: channel.id})
            if (!data) return;
            await guild.members.cache.get(data.MemberID);
            await guild.members.cache.get(data.OwnerID);
            switch (customId) {
                case 'ticket-close':
                    if ((!member.permissions.has(ManageChannels)) & (!member.roles.cache.has(docs.Handlers))) return interaction.reply({embeds: [nopermissionsEmbed], ephemeral: true}).catch(error => {return});
                    const transcript = await createTranscript(channel, {
                        limit: -1,
                        returnType: 'attachment',
                        saveImages: true,
                        poweredBy: false,
                        filename: `ticket-${interaction.user.tag}-` + data.TicketID + '.html',
                    }).catch(error => {return});
                    let claimed = undefined;
                    if (data.Claimed === true) {
                        claimed = '\✅'
                    }
                    if (data.Claimed === false) {
                        claimed = '\❌'
                    }
                    if (data.ClaimedBy === undefined) {
                        data.ClaimedBy = '\❌'
                    }else {
                        data.ClaimedBy = '<@' + data.ClaimedBy + '>'
                    }
                    const transcriptTimestamp = Math.round(Date.now() / 1000)
                    const transcriptEmbed = new EmbedBuilder()
                    .setDescription(`Member: <@${data.OwnerID}>\n Ticket: ${data.TicketID}\n Claimed: ${claimed}\n Moderator: ${data.ClaimedBy}\n Time: <t:${transcriptTimestamp}:R> (<t:${transcriptTimestamp}:F>)`)
                    const closingTicket = new EmbedBuilder().setTitle("O ticket está sendo fechado no momento...").setDescription("O ticket será fechado em 5 segundos.").setColor('Red')
                    await guild.channels.cache.get(docs.Transcripts).send({
                        embeds: [transcriptEmbed],
                        files: [transcript],
                    }).catch(error => {return});
                    interaction.deferUpdate().catch(error => {return});
                    channel.send({embeds: [closingTicket]}).catch(error => {return});
                    await TicketSchema.findOneAndDelete({GuildID: guild.id, ChannelID: channel.id});
                    setTimeout(() => {channel.delete().catch(error => {return});}, 5000);
                break;

                case 'ticket-lock':
                    if ((!member.permissions.has(ManageChannels)) & (!member.roles.cache.has(docs.Handlers))) return interaction.reply({embeds: [nopermissionsEmbed], ephemeral: true}).catch(error => {return});
                    alreadyEmbed.setDescription("Este ticket já está bloqueado.");
                    if (data.Locked == true) return interaction.reply({embeds: [alreadyEmbed], ephemeral: true}).catch(error => {return});
                    await TicketSchema.updateOne({ChannelID: channel.id}, {Locked: true});
                    executeEmbed.setDescription("O ticket foi bloqueado com sucesso.");
                    data.MembersID.forEach((m) => {channel.permissionOverwrites.edit(m, {SendMessages: false}).catch(error => {return})})
                    channel.permissionOverwrites.edit(data.OwnerID, {SendMessages: false}).catch(error => {return});
                    interaction.deferUpdate().catch(error => {return});
                    return interaction.channel.send({embeds: [executeEmbed]}).catch(error => {return});

                case 'ticket-unlock':
                    if ((!member.permissions.has(ManageChannels)) & (!member.roles.cache.has(docs.Handlers))) return interaction.reply({embeds: [nopermissionsEmbed], ephemeral: true}).catch(error => {return});
                    alreadyEmbed.setDescription("Este ticket já está desbloqueado");
                    if (data.Locked == false) return interaction.reply({embeds: [alreadyEmbed], ephemeral: true}).catch(error => {return});
                    await TicketSchema.updateOne({ChannelID: channel.id}, {Locked: false});
                    executeEmbed.setDescription("O ticket foi desbloqueado com sucesso.");
                    data.MembersID.forEach((m) => {channel.permissionOverwrites.edit(m, {SendMessages: true}).catch(error => {return})});
                    channel.permissionOverwrites.edit(data.OwnerID, {SendMessages: true}).catch(error => {return});
                    interaction.deferUpdate().catch(error => {return});
                    return interaction.channel.send({embeds: [executeEmbed]}).catch(error => {return});

                case 'ticket-manage':
                    if ((!member.permissions.has(ManageChannels)) & (!member.roles.cache.has(docs.Handlers))) return interaction.reply({embeds: [nopermissionsEmbed], ephemeral: true}).catch(error => {return});
                    const menu = new UserSelectMenuBuilder()
                    .setCustomId('ticket-manage-menu')
                    .setPlaceholder('❔' + "Escolha um membro.")
                    .setMinValues(1)
                    .setMaxValues(1)
                    return interaction.reply({components: [new ActionRowBuilder().addComponents(menu)], ephemeral: true}).catch(error => {return});
                    
                case 'ticket-claim':
                    if ((!member.permissions.has(ManageChannels)) & (!member.roles.cache.has(docs.Handlers))) return interaction.reply({embeds: [nopermissionsEmbed], ephemeral: true}).catch(error => {return});
                    alreadyEmbed.setDescription("O ticket já foi reivindicado por" + ' <@' + data.ClaimedBy + '>.');
                    if (data.Claimed == true) return interaction.reply({embeds: [alreadyEmbed], ephemeral: true}).catch(error => {return});
                    await TicketSchema.updateOne({ChannelID: channel.id}, {Claimed: true, ClaimedBy: member.id});
                    let lastinfos = channel;
                    await channel.edit({name: '👋' + '・' + lastinfos.name, topic: lastinfos.topic + ", foi reivindicado por" + '<@' + member.id + '>.'}).catch(error => {return});
                    executeEmbed.setDescription("O ticket foi reivindicado com sucesso por" + ' <@' + member.id + '>.');
                    interaction.deferUpdate().catch(error => {return});
                    interaction.channel.send({embeds: [executeEmbed]}).catch(error => {return});
                    break;
            }
  

    },
  };