const { Client, CommandInteraction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const axios = require('axios')
const { reply } = require("../../systems/reply")

module.exports = {
    name: 'addemoji',
    description: 'Adiciona um determinado emoji ao servidor',
    userPermissions: ["Administrator"],
    options: [
        {
            name: "emoji",
            description: "O emoji que você gostaria de adicionar ao servidor.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "nome",
            description: "o nome do seu emoji.",
            type: ApplicationCommandOptionType.String,
            required: true,
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

        let emoji = interaction.options.getString('emoji')?.trim();
        const name = interaction.options.getString('nome');

        if (emoji.startsWith("<") && emoji.endsWith(">")) {
            const id = emoji.match(/\d{15,}/g)[0];

            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
            .then(image => {
                if (image) return "gif"
                else return "png"
            }).catch(err => {
                return "png"
            })

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
        }

        if (!emoji.startsWith("http")) {
            return await reply(interaction, "❌", "Você não pode adicionar emojis padrão do discord", true)
        }

        if (!emoji.startsWith("https")) {
            return await reply(interaction, "❌", "Você não pode adicionar emojis padrão do discord", true)
        }
        
        interaction.guild.emojis.create({ attachment: `${emoji}`, name: `${name}`})
        .then(emoji => {
            const embed = new EmbedBuilder()
            .setColor('Blue')
            .setDescription(`Adicionei este ${emoji} com o nome ${name}`)
            
            return interaction.reply({embeds: [embed]})
        }).catch(err => {
            interaction.reply({ content: "Você está no limite máximo de emojis do servidor, não consigo adicionar este emoji", ephemeral: true})
        })

    },
};