const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { reply } = require("../../systems/reply")
const { CustomClient } = require("../../structures/classes/CustomClient")
const TicketSetup = require('../../schemas/TicketSetupDB');
const Ticket = require('../../schemas/TicketDB');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('tickets')
    .setDescription('Opções e configuração de tickets')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
        subcommand.setName('setup')
        .setDescription('Configuração do sistema de ticket')
        .addChannelOption(option =>
            option.setName('canal')
            .setDescription('Selecione o canal onde os tickets devem ser criados')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('categoria')
            .setDescription('Selecione a categoria onde os tickets devem ser criados..')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('transcripts')
            .setDescription('Selecione o canal para onde as transcrições devem ser enviadas.')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('cargo-de-suporte')
            .setDescription('Cargo de suporte para o ticket.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('nome-do-botão')
            .setDescription('Nome do botão')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('emoji')
            .setDescription('coloque o emoji para botão')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('descrição')
            .setDescription('O texto a ser enviado com o painel de tickets')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName('excluir-usuários')
        .setDescription('Exclua os tickets dos usuários (use este comando somente se você removeu o ticket manualmente)')
    )
    .addSubcommand(subcommand =>
        subcommand.setName('excluir-setup')
        .setDescription('Excluir o sistema de tickets (painel)')
    ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {CustomClient} client
     */
    async execute (interaction, client) {

        const { guild, options } = interaction;

        if (interaction.options.getSubcommand() === "setup") {
            const channel = options.getChannel('canal');
            const category = options.getChannel('categoria');
            const transcripts = options.getChannel('transcripts');
            const handlers = options.getRole('cargo-de-suporte');
            const description = options.getString('descrição');
            const button = options.getString('nome-do-botão');
            const emoji = options.getString('emoji');
            await TicketSetup.findOneAndUpdate(
              { GuildID: guild.id },
              {
                Channel: channel.id,
                Category: category.id,
                Transcripts: transcripts.id,
                Handlers: handlers.id,
                Description: description,
                //Button: [button[0]],
              },
              {
                new: true,
                upsert: true,
              }
            ).catch((err) => console.log(err));
    
            interaction
            .reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Sistema de Tickets")
                  .setDescription("Sistema de tickets configurado com sucesso!")
                  .setColor('Green')
                  .addFields(
                    {
                      name: "<:channel:1056715573242892338> Channel",
                      value: `<:icon_reply:1088996218283229184>  <#${channel.id}>`,
                      inline: true,
                    },
                    {
                      name: `<:orangenwand:1056716503921205301> Cargo de suporte`,
                      value: `<:icon_reply:1088996218283229184>  <@&${handlers.id}>`,
                      inline: true,
                    },
                    {
                      name: `<:Discussions:1056716758611939348> Descrição do painel`,
                      value: `<:icon_reply:1088996218283229184>  ${description}`,
                      inline: true,
                    },
                    {
                      name: "Ticket Logs",
                      value: `<#${transcripts.id}>`,
                    }
                  ),
              ],
              ephemeral: true,
            })
            .catch(async (err) => {
              console.log(err);
              await reply(interaction, "❌", `Ocorreu um erro...`)
            });
      
            const sampleMessage = `Bem-vindo ao ticket! Clique no botão **"${button}"** para criar um ticket e a equipe de suporte entrará em contato com você!`;
      
            const embed = new EmbedBuilder()
              .setTitle("Sistema de Tickets")
              .setDescription(description == null ? sampleMessage : description)
              .setColor("Aqua")
              .setImage("https://i.imgur.com/MVWa8pZ.png")
      
            const buttonshow = new ButtonBuilder()
              .setCustomId('createTicket')
              .setLabel(button)
              .setEmoji(emoji)
              .setStyle(ButtonStyle.Primary);
      
            await guild.channels.cache.get(channel.id).send({
              embeds: [embed],
              components: [new ActionRowBuilder().addComponents(buttonshow)],
            }).catch(error => {return});
        } 
        if (interaction.options.getSubcommand() === "excluir-usuários") {
    
          const ticketData = await TicketSetup.findOne({
            GuildID: interaction.guild.id,
          });
    
          if (!ticketData) {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Sistema de Tickets")
                  .setDescription("Já excluiu todos os tickets abertos por usuários no banco de dados!")
                  .addFields(
                    {
                      name: `<:Slash:1088996088712794162> "IMPORTANTE"`,
                      value: "<:icon_reply:1088996218283229184> **SE TIVER TICKETS ABERTOS DEPOIS DE USAR ESTE COMANDO TERÁ QUE REMOVÊ-LOS MANUALMENTE**",
                      inline: true,
                    },
                  ),
              ],
              ephemeral: true,
            });
          }
    
          Ticket
            .findOneAndDelete({
              GuildID: interaction.guild.id,
            })
            .catch((err) => console.log(err));
    
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Sistema de Tickets")
                .setColor("Green")
                .setDescription("Excluído com sucesso o sistema de tickets")
                .addFields(
                  {
                    name: "IMPORTANTE",
                    value: "<:icon_reply:1088996218283229184> **SE TIVER TICKETS ABERTOS DEPOIS DE USAR ESTE COMANDO TERÁ QUE REMOVÊ-LOS MANUALMENTE**",
                  }
                ),
            ],
            ephemeral: true,
          });
        }
    
        if (interaction.options.getSubcommand() === "excluir-setup") {
          const ticketData = await TicketSetup.findOne({
            GuildID: interaction.guild.id,
          });
    
          if (!ticketData) {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Sistema de Tickets")
                  .setDescription("Seu painel de tickets já foi excluído!")
                  .addFields(
                    {
                      name: `<:Slash:1088996088712794162> "Usar!"`,
                      value: "<:icon_reply:1088996218283229184>  /tickets setup",
                      inline: true,
                    },
                  ),
              ],
              ephemeral: true,
            });
          }
    
          TicketSetup
            .findOneAndDelete({
              GuildID: interaction.guild.id,
            })
            .catch((err) => console.log(err));
    
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Sistema de Tickets")
                .setDescription("Excluído com sucesso o sistema de tickets!"),
            ],
            ephemeral: true,
          });
        }

    }
}