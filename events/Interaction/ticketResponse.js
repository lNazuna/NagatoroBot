const { ChatInputCommandInteraction, Events, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js")
const { reply } = require("../../systems/reply")
const { CustomClient } = require("../../structures/classes/CustomClient")
const TicketSchema = require('../../schemas/TicketDB');
const TicketSetup = require('../../schemas/TicketSetupDB');
  
  module.exports = {
    name: Events.InteractionCreate,
  
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {CustomClient} client
     */

    async execute(interaction, client) {

        const {guild, member, customId, channel} = interaction;

        switch (customId) {
            case "createTicket":
    
        const {ViewChannel, SendMessages, ManageChannels, ReadMessageHistory} = PermissionFlagsBits;
        const ticketId = Math.floor(Math.random() * 9000) + 10000;
        if (!interaction.isButton()) return;
        const data = await TicketSetup.findOne({GuildID: guild.id});
        if (!data)
        return await interaction.reply({
          embeds: [
              new EmbedBuilder()
                .setTitle("Sistema de Tickets")
                .setColor("Red")
                .setDescription("Você ainda não configurou o sistema de tickets.")
                .addFields(
                  {
                    name: "<:Slash:1088996088712794162> Usar",
                    value: "<:icon_reply:1088996218283229184>  /tickets setup",
                    inline: true,
                  },
                ),
            ],
            ephemeral: true,
      });
        if (!data) return;
        const alreadyticketEmbed = new EmbedBuilder().setDescription("Desculpe, mas você já tem um ticket aberto").setColor('Red')
        const findTicket = await TicketSchema.findOne({GuildID: guild.id, OwnerID: member.id});
        if (findTicket) return interaction.reply({embeds: [alreadyticketEmbed], ephemeral: true}).catch(error => {return});
        if (!guild.members.me.permissions.has(ManageChannels)) return interaction.reply({content: "Desculpe, eu não tenho permissões.", ephemeral: true}).catch(error => {return});
    
        try {
            await guild.channels.create({
                name: `🎫・ticket┋${interaction.user.tag}┋` + ticketId,
                type: ChannelType.GuildText,
                topic: interaction.user.id,
                parent: data.Category,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                    {
                        id: data.Handlers,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory, ManageChannels],
                    },
                    {
                        id: member.id,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                ],
            }).catch(error => {return}).then(async (channel) => {
                await TicketSchema.create({
                    GuildID: guild.id,
                    OwnerID: member.id,
                    MemberID: member.id,
                    TicketID: ticketId,
                    ChannelID: channel.id,
                    Locked: false,
                    Claimed: false,
                });
                await channel.setTopic("🌿 Ticket aberto por" + ' <@' + member.id + '>').catch(error => {return});
                const embed = new EmbedBuilder().setTitle("Bem-vindo, obrigado por abrir um ticket.").setDescription("Em breve, um membro da nossa equipe de moderação cuidará do seu pedido.\nObrigado por aguardar com calma e bom humor")
                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('ticket-close').setLabel("Fechar").setStyle(ButtonStyle.Danger).setEmoji('📪'),
                    new ButtonBuilder().setCustomId('ticket-lock').setLabel("Bloquear").setStyle(ButtonStyle.Secondary).setEmoji('🔒'),
                    new ButtonBuilder().setCustomId('ticket-unlock').setLabel("Desbloquear").setStyle(ButtonStyle.Secondary).setEmoji('🔓'),
                    new ButtonBuilder().setCustomId('ticket-manage').setLabel("Membros").setStyle(ButtonStyle.Secondary).setEmoji('➕'),
                    new ButtonBuilder().setCustomId('ticket-claim').setLabel("Reivindicar").setStyle(ButtonStyle.Primary).setEmoji('👋'),
                );
                channel.send({embeds: ([embed]),components: [button]}).catch(error => {return});
                const handlersmention = await channel.send({content : '<@&' + data.Handlers + '>'});
                handlersmention.delete().catch(error => {return});
                const ticketmessage = new EmbedBuilder().setDescription("✅ O seu ticket foi criado" + ' <#' + channel.id + '>').setColor('Green');
                interaction.reply({embeds: [ticketmessage], ephemeral: true}).catch(error => {return});
            })
        } catch (err) {
            return console.log(err);
        }
    }

    },
  };