const { Client, CommandInteraction, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { reply } = require("../../systems/reply")
const TicketSetup = require('../../database/models/TicketSetupDB');
const Ticket = require('../../database/models/TicketDB');

module.exports = {
    name: 'tickets',
    description: 'Opções e configuração de tickets',
    userPermissions: ["Administrator"],
    options: [
        {
            name: "setup",
            description: "Configuração do sistema de ticket",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "canal",
                    description: "Selecione o canal onde os tickets devem ser criados",
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [0],
                    required: true,
                },
                {
                    name: "categoria",
                    description: "Selecione a categoria onde os tickets devem ser criados.",
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [4],
                    required: true,
                },
                {
                    name: "transcripts",
                    description: "Selecione o canal para onde as transcrições devem ser enviadas.",
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [0],
                    required: true,
                },
                {
                    name: "cargo-de-suporte",
                    description: "Cargo de suporte para o ticket.",
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                },
                {
                    name: "nome-do-botão",
                    description: "Nome do botão",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "emoji",
                    description: "coloque o emoji para botão",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "descrição",
                    description: "O texto a ser enviado com o painel de tickets",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                }
            ],
        },
        {
            name: "excluir-usuários",
            description: "Exclua os tickets dos usuários (use este comando somente se você removeu o ticket manualmente)",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "excluir-setup",
            description: "Excluir o sistema de tickets (painel",
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     * @returns 
     */
    run: async (client, interaction, args) => {


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
              .setImage("https://i.imgur.com/N1LljMM.gif")
      
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

    },
};