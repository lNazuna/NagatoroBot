const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { editReply } = require("../../systems/editReply")
const { CustomClient } = require("../../structures/classes/CustomClient")
const Kandaraku = require("kandaraku");
const kand = new Kandaraku();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("imagem")
        .setDescription("fale com o nagatoro bot")
        .addStringOption(option => 
            option.setName("descrição")
            .setDescription("descreva de como quer a imagem")
            .setRequired(true)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {CustomClient} client
     */
    async execute(interaction, client) {

        const { options } = interaction;

        await interaction.deferReply()

        const description = options.getString('descrição');

        kand.generatorAnimeBotImage({ prompt: `${description}` }).then((response) => {

            const embed = new EmbedBuilder()
            .setColor("Random")
            //.setDescription(response.content)
            .setImage(response.content)

            interaction.editReply({ embeds: [embed] })

        })

    }
}