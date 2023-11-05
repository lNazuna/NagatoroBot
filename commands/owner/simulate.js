const { ChatInputCommandInteraction, SlashCommandBuilder, Events, EmbedBuilder } = require("discord.js")
const { CustomClient } = require("../../structures/classes/CustomClient")

module.exports = {
    owner: true,
    data: new SlashCommandBuilder()
        .setName("simular")
        .setDescription("Simular evento de entrada ou saída")
        .addStringOption(option =>
            option.setName('options')
            .setDescription('Escolha se deseja entrar ou sair')
            .setRequired(true)
            .addChoices(
                { name: 'Entradas', value: 'join' },
                { name: 'Saídas', value: 'leave' },
            )
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {CustomClient} client
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { options, member } = interaction

        const Options = options.getString("options")

        switch (Options) {

            case "join": {

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`<a:right:1021723073487052810> | Simulação do evento de entrada concluído`)
                        .setColor("#c5a0c1")
                    ], 
                })

                client.emit(Events.GuildMemberAdd, member)

            }
                break;

            case "leave": {

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`<a:right:1021723073487052810> | Simulação do evento de saída concluído`)
                        .setColor("#c5a0c1")
                    ], 
                })

                client.emit(Events.GuildMemberRemove, member)

            }
                break;

        }

    }
}