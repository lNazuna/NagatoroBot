const { Client, CommandInteraction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'waifu',
    description: 'Veja sua waifu!',
    options: [
        {
            name: 'categoria',
            description: 'Escolha sua categoria',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Waifu', value: 'waifu' },
                { name: 'Maid', value: 'maid' },
                { name: 'Marin Kitagawa', value: 'marin-kitagawa' },
                { name: 'Mori Calliopea', value: 'mori-calliope' },
                { name: 'Raiden Shogun', value: 'raiden-shogun' },
                { name: 'Oppai', value: 'oppai' },
                { name: 'Selfies', value: 'selfies' },
                { name: 'Uniform', value: 'uniform' },
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

        const type  = interaction.options.getString("categoria")

        const body = await fetch(`https://api.waifu.im/search/?included_tags=${type}`).then((res) => res.json());

        const embed = new EmbedBuilder()
        .setTitle("Olá sou sua waifu ♥️")
        .setColor("Random")
        .setFooter({text: interaction.user.username, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
        .setTimestamp()
        .setImage(body.images[0].url)

        interaction.reply({ embeds: [embed]})

        const message = await interaction.fetchReply()
        await message.react("👍")
        await message.react("👎")

    },
};