const { Client, CommandInteraction, ApplicationCommandOptionType, Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'simular',
    description: 'Simular evento de entrada ou saída',
    options: [
        {
            name: 'options',
            description: 'Escolha se deseja entrar ou sair',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Entradas', value: 'join' },
                { name: 'Saídas', value: 'leave' },
            ]
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

    },
};