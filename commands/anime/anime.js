const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { editReply } = require("../../systems/editReply")
const { CustomClient } = require("../../structures/classes/CustomClient")
const Kandaraku = require("kandaraku");
const kand = new Kandaraku();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anime")
        .setDescription("veja as informações do anime")
        .addStringOption(option => 
            option.setName("anime-url")
            .setDescription("insira o url do anime (apenas funciona com url pode procurar aqui https://myanimelist.net)")
            .setRequired(true)
            ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {CustomClient} client
     */
    async execute(interaction, client) {

        const { options } = interaction;

        await interaction.deferReply()

        const url = options.getString('anime-url');

        kand.getAnimeSerieInfo({ mal_url: `${url}` }).then((response) => {

            if(response.content.error){

                editReply(interaction, "❌", response.content.error)

            } else {

                const embed = new EmbedBuilder()
                .setTitle(`${response.content.AnimeEnglishTitle} | ${response.content.AnimeJapaneseTitle}`)
                .setColor("Random")
                .setDescription(`**Sinopse** \n\n ${response.content.AnimeSynopsis}`)
                .addFields(
                    {
                        name: "Anime ID",
                        value: `${response.content.AnimeId}`,
                        inline: true
                    },
                    {
                        name: "Tipo",
                        value: `${response.content.AnimeType}`,
                        inline: true
                    },
                    {
                        name: "Status",
                        value: `${response.content.AnimeStatus}`,
                        inline: true
                    },
                    {
                        name: "Transmissão",
                        value: `${response.content.AnimeBroadcast}`,
                        inline: true
                    },
                    {
                        name: "Exibição",
                        value: `${response.content.AnimeAired}`,
                        inline: true
                    },
                    {
                        name: "Temporada de Estreia",
                        value: `${response.content.AnimePremieredSeasonYear}`,
                        inline: true
                    },
                    {
                        name: "Episódios",
                        value: `${response.content.AnimeEpisodes}`,
                        inline: true
                    },
                    {
                        name: "Duração de Episodio",
                        value: `${response.content.AnimeEpisodeDuration}`,
                        inline: true
                    },
                    {
                        name: "Gêneros",
                        value: `${response.content.AnimeGenres}`,
                        inline: true
                    },
                    {
                        name: "Pontuação",
                        value: `${response.content.AnimeScore}`,
                        inline: true
                    },
                    {
                        name: "Estúdio",
                        value: `${response.content.AnimeStudios}`,
                        inline: true
                    },
                    {
                        name: "Produtores",
                        value: `${response.content.AnimeProducers}`,
                        inline: true
                    }
                )
                .setThumbnail(response.content.AnimePoster)
                .setTimestamp()
    
                const row = new ActionRowBuilder().addComponents(
    
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL(response.content.AnimeUrl)
                    .setLabel("Pagina do Anime"),
        
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL(response.content.AnimeTrailer)
                    .setLabel("Trailer"),
        
                )
    
                interaction.editReply({ embeds: [embed] , components: [row]}).catch((error) => {
                    interaction.editReply("Output excede o limite de caracteres")
                })

            }

        })

    }
}