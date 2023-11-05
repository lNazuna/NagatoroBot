const { SlashCommandBuilder, EmbedBuilder } = require ('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('waifu')
    .setDescription('Veja sua waifu')
    .addStringOption(option =>
        option.setName('categoria') 
        .setDescription('Escolha sua categoria')
        .setRequired(true)
        .addChoices(
            { name: 'Waifu', value: 'waifu' },
            { name: 'Maid', value: 'maid' },
            { name: 'Marin Kitagawa', value: 'marin-kitagawa' },
            { name: 'Mori Calliopea', value: 'mori-calliope' },
            { name: 'Raiden Shogun', value: 'raiden-shogun' },
            { name: 'Oppai', value: 'oppai' },
            { name: 'Selfies', value: 'selfies' },
            { name: 'Uniform', value: 'uniform' },
        )
    ),

    async execute(interaction, client) {

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

    }
}