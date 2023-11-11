const { Client, CommandInteraction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Kandaraku = require("kandaraku");
const kand = new Kandaraku();

module.exports = {
    name: 'imagem',
    description: 'fale com o nagatoro bot',
    options: [
        {
            name: 'descrição',
            description: 'descreva de como quer a imagem',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     * @returns 
     */
    run: async (client, interaction, args) => {

        const { options } = interaction;

        await interaction.deferReply()

        const description = options.getString('descrição');

        kand.generatorAnimeBotImage({ prompt: `${description}` }).then((response) => {

            const embed = new EmbedBuilder()
            .setColor("Random")
            .setImage(response.content)

            interaction.editReply({ embeds: [embed] })

        })

    },
};