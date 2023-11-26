const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { clientId } = require("../../configuration/index")

module.exports = {
    name: 'ajuda',
    description: 'Comando de ajuda',
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     * @returns 
     */
    run: async (client, interaction, args) => {

      const { guild } = interaction

      let embed_painel = new EmbedBuilder()
      .setThumbnail(guild.iconURL())
      .setTitle('<:IconStatusWebDND:1177767858558742539> Meus comandos')
      .setDescription(`Algumas coisas básicas que você deve saber!

      O <@${clientId}> é um bot de **animes, diversão, utilidades, música entre outros** e contém diversas mecânicas bem interativas! Veja a lista completa de comandos
      
          > **Quer Assistir animes?** use o comando \`/anime\`
          > **Quer ouvir música?**: use o comando \`/play\`
          
          Leia mais sobre as funcionalidades selecionando uma opção abaixo.`)
      .setColor(`Red`)
      .setFooter({ text: guild.name, iconURL: guild.iconURL() })

//embed_administration

  let embed_administration = new EmbedBuilder()
              .setAuthor({ name: 'Meus Comandos de Administração', iconURL: guild.iconURL() })
              .setDescription("Este aqui são os meus comandos de administração") 
              .setFooter({ text: guild.name, iconURL: guild.iconURL() })
              .setColor("Red")
              .addFields(
                  {name: "<:announce:1177767382475882506>│ /addemoji", value: "<:dots:1177767475543294103>│ **Adiciona um determinado emoji ao servido**", inline: false},
                  {name: "<:announce:1177767382475882506>│ /setup", value: "<:dots:1177767475543294103>│ **Opções e configuração do servidor**", inline: false},
                  {name: "<:announce:1177767382475882506>│ /ticket", value: "<:dots:1177767475543294103>│ **Opções e configuração de tickets**", inline: false},

              )
          
//embed_anime

  let embed_anime = new EmbedBuilder()
              .setAuthor({ name: 'Meus Comandos de Anime', iconURL: guild.iconURL() })
              .setDescription("Este aqui são os meus comandos de Anime")
              .setFooter({ text: guild.name, iconURL: guild.iconURL() })
              .setColor("Red")
              .addFields(
                  {name: "<:announce:1177767382475882506>│ /anime", value: "<:dots:1177767475543294103>│ **Adicione ou veja animes**", inline: false},
              )

//embed_chatgpt

  let embed_chatgpt = new EmbedBuilder()
              .setAuthor({ name: 'Meus Comandos de ChatGPT', iconURL: guild.iconURL() })
              .setDescription("Este aqui são os meus comandos de ChatGPT")
              .setFooter({ text: guild.name, iconURL: guild.iconURL() })
              .setColor("Red")
              .addFields(
                  {name: "<:announce:1177767382475882506>│ /chat", value: "<:dots:1177767475543294103>│ **Fale com o bot**", inline: false},
                  {name: "<:announce:1177767382475882506>│ /imagem", value: "<:dots:1177767475543294103>│ **peça ao bot para gerar uma imagem**", inline: false},

              
              )
              
//embed_fun

  let embed_fun = new EmbedBuilder()
              .setAuthor({ name: 'Meus Comandos', iconURL: guild.iconURL() })
              .setDescription("Este aqui são os meus comandos de info") 
              .setFooter({ text: guild.name, iconURL: guild.iconURL() }) 
              .setColor("Red")
              .addFields(
                  {name: "<:announce:1177767382475882506>│ /ship", value: "<:dots:1177767475543294103>│ **Descubra o quanto 2 pessoas se amam!**", inline: false},
                  {name: "<:announce:1177767382475882506>│ /waifu", value: "<:dots:1177767475543294103>│ **Veja sua waifu!**", inline: false},

              )
              
//embed_moderation

  let embed_moderation = new EmbedBuilder()
              .setAuthor({ name: 'Meus Comandos', iconURL: guild.iconURL() })
              .setDescription("Este aqui são os meus comandos de Moderação") 
              .setFooter({ text: guild.name, iconURL: guild.iconURL() }) 
              .setColor("Red")
              .addFields(
                  {name: "<:announce:1177767382475882506>│ /banir", value: "<:dots:1177767475543294103>│ **Bane permanentemente um membro do servidor**", inline: false},
                  {name: "<:announce:1177767382475882506>│ /expulsar", value: "<:dots:1177767475543294103>│ **Expulsa um membro do servidor**", inline: false},
                  {name: "<:announce:1177767382475882506>│ /limpar", value: "<:dots:1177767475543294103>│ **limpe as menssagens do canal ou de um user**", inline: false},
                  {name: "<:announce:1177767382475882506>│ /nuke", value: "<:dots:1177767475543294103>│ **Exclui um canal e depois o clona novamente**", inline: false},
                  {name: "<:announce:1177767382475882506>│ /desbanir", value: "<:dots:1177767475543294103>│ **Remove o banimento de um membro**", inline: false},

              )

//embed_music

  let embed_music = new EmbedBuilder()
              .setAuthor({ name: 'Meus Comandos', iconURL: guild.iconURL() })
              .setDescription("Este aqui são os meus comandos de Música") 
              .setFooter({ text: guild.name, iconURL: guild.iconURL() }) 
              .setColor("Red")
              .addFields(
                  {name: "<:announce:1177767382475882506>│ /fila", value: "<:dots:1177767475543294103>│ **Mostra a fila atua**", inline: false},
                  {name: "<:announce:1177767382475882506>│ /play", value: "<:dots:1177767475543294103>│ **reproduzir uma música**", inline: false},
                  {name: "<:announce:1177767382475882506>│ /volume", value: "<:dots:1177767475543294103>│ **Aumente ou reduza o volume**", inline: false},

              )

//embed_utility

  let embed_utility = new EmbedBuilder()
              .setAuthor({ name: 'Meus Comandos', iconURL: guild.iconURL() })
              .setDescription("Este aqui são os meus comandos de Utilidade") 
              .setFooter({ text: guild.name, iconURL: guild.iconURL() }) 
              .setColor("Red")
              .addFields(
                  {name: "<:announce:1177767382475882506>│ /ajuda", value: "<:dots:1177767475543294103>│ **Comando de ajuda**", inline: false},
                  {name: "<:announce:1177767382475882506>│ /youtube-mp4", value: "<:dots:1177767475543294103>│ **Baixe vídeos do youtube**", inline: false},

              )

  let painel = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
          .setCustomId("painel_help")
          .setPlaceholder("Clique aqui!")
          .addOptions(
              {
                  label: "Painel Inicial",
                  emoji: "<:pagIni:1178066723010773064>",
                  value: "painel"
              },
              {
                  label: "Administração",
                  description: "Veja meus comandos de Administração.",
                  emoji: "<:Adm:1178069524872970304>",
                  value: "administration"
              },
              {
                  label: "Anime",
                  description: "Veja meus comandos de anime.",
                  emoji: "<:anime:1178066715817541745>",
                  value: "anime"
              },
              {
                  label: "ChatGPT",
                  description: "Veja meus comandos de ChatGPT.",
                  emoji: "<:ChapGPT:1178068344939753552>",
                  value: "chatgpt"
              },
              {
                  label: "Diversão",
                  description: "Veja meus comandos de diversão.",
                  emoji: "<:fun:1178066718183149588>",
                  value: "fun"
              },
              {
                  label: "Moderação",
                  description: "Veja meus comandos de moderação.",
                  emoji: "<:mod:1178066719529500682>",
                  value: "moderation"
              },
              {
                  label: "Música",
                  description: "Veja meus comandos de música.",
                  emoji: "<:music:1178066720737464431>",
                  value: "music"
              },
              {
                  label: "Utilidade",
                  description: "Veja meus comandos de utilidade.",
                  emoji: "<:utilidade:1178066724512333934>",
                  value: "utility"
              }
          )
  )

  interaction.reply({ embeds: [embed_painel], components: [painel], ephemeral: true }).then( () => {
      interaction.channel.createMessageComponentCollector().on("collect", (c) => {
          let valor = c.values[0];

          if (valor === "painel") {
              c.deferUpdate()
              interaction.editReply({ embeds: [embed_painel] })
          } else if (valor === "administration") {
              c.deferUpdate()
              interaction.editReply({ embeds: [embed_administration] })
          } else if (valor === "anime") {
              c.deferUpdate()
              interaction.editReply({ embeds: [embed_anime] })
          } else if (valor === "chatgpt") {
              c.deferUpdate()
              interaction.editReply({ embeds: [embed_chatgpt] })
          } else if (valor === "fun") {
              c.deferUpdate()
              interaction.editReply({ embeds: [embed_fun] })
          } else if (valor === "moderation") {
            c.deferUpdate()
            interaction.editReply({ embeds: [embed_moderation] })
          } else if (valor === "music") {
            c.deferUpdate()
            interaction.editReply({ embeds: [embed_music] })
          } else if (valor === "utility") {
            c.deferUpdate()
            interaction.editReply({ embeds: [embed_utility] })
          }

      })
  })

    },
};