const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { editReply } = require("../../systems/editReply")
const { CustomClient } = require("../../structures/classes/CustomClient")
const Kandaraku = require("kandaraku");
const kand = new Kandaraku();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("chat")
        .setDescription("fale com o nagatoro bot")
        .addStringOption(option => 
            option.setName("mensagem")
            .setDescription("escreva a sua mensagem")
            .setRequired(true)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {CustomClient} client
     */
    async execute(interaction, client) {

        const { options } = interaction;

        await interaction.deferReply()

        const message = options.getString('mensagem');

        kand.conversationAnimeBotChat({ message: `${message}` }).then((response) => {

            const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(response.content)

            interaction.editReply({ embeds: [embed] })

        })

    }
}