const { Client, CommandInteraction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Kandaraku = require("kandaraku");
const kand = new Kandaraku();

module.exports = {
    name: 'chat',
    description: 'Fale com o bot',
    options: [
        {
            name: 'mensagem',
            description: 'escreva a sua mensagem',
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

        const message = options.getString('mensagem');

        kand.conversationAnimeBotChat({ message: `${message}` }).then((response) => {

            const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(response.content)

            interaction.editReply({ embeds: [embed] })

        })

    },
};