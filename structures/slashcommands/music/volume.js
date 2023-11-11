const { Client, CommandInteraction, ApplicationCommandOptionType } = require('discord.js');
const { reply } = require("../../systems/reply")

module.exports = {
    name: 'volume',
    description: 'Aumente ou reduza o volume',
    inVoice: true,
    sameVoice: true,
    player: true,
    options: [
        {
            name: 'tempo',
            description: 'insira um numero de 0 a 100',
            type: ApplicationCommandOptionType.Integer,
            maxValue: 100,
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
    run: (client, interaction) => {
        const time = interaction.options.getInteger('tempo');

        if(time > "100") {

            return reply(interaction, "❌", "Insira um número válido entre 0 a 100")

        } else {

            const player = client.riffy.players.get(interaction.guild.id);
            player.setVolume(time);
    
            return interaction.reply(`📶 O Volume foi defenido para ${time}.`);

        }

    },
};