const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { editReply } = require("../../systems/editReply")
const { CustomClient } = require("../../structures/classes/CustomClient")
const Kandaraku = require("kandaraku");
const kand = new Kandaraku();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anime")
        .setDescription("veja as informações do anime")
        .addSubcommand(subcommand =>
            subcommand.setName('procurar')
            .setDescription('obtenha as informações do anime')
            .addStringOption(option => 
                option.setName("nome")
                .setDescription("insira o nome do anime")
                .setRequired(true)
            ),
        )
        .addSubcommand(subcommand =>
            subcommand.setName('procurar-filme')
            .setDescription('obtenha as informações do filme de anime')
            .addStringOption(option => 
                option.setName("nome")
                .setDescription("insira o nome do filme de anime")
                .setRequired(true)
            ),
        )
        .addSubcommand(subcommand =>
            subcommand.setName('procurar-temporada')
            .setDescription('obtenha as informações da temporada do anime')
            .addStringOption(option => 
                option.setName("nome")
                .setDescription("insira o nome do anime")
                .setRequired(true)
            )
            .addIntegerOption(option => 
                option.setName("temporada")
                .setDescription("insira o numero da temporada")
                .setRequired(true)
            ),
        )
        .addSubcommand(subcommand =>
            subcommand.setName('assistir')
            .setDescription('obtenha as informações do anime que deseja')
            .addStringOption(option => 
                option.setName("nome")
                .setDescription("insira o nome do anime")
                .setRequired(true)
            )
            .addIntegerOption(option => 
                option.setName("temporada")
                .setDescription("insira o numero da temporada")
                .setRequired(true)
            )
            .addIntegerOption(option => 
                option.setName("episódio")
                .setDescription("insira o numero do episodio")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('assistir-filme')
            .setDescription('obtenha as informações de um filme de anime')
            .addStringOption(option => 
                option.setName("nome")
                .setDescription("insira o nome do filme de anime")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('adicionar')
            .setDescription('Adicione anime a base de dados')
            .addStringOption(option => 
                option.setName("anime-url")
                .setDescription("insira o url do anime para adicionar na base de dados, pode ver aqui https://myanimelist.net/")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('adicionar-temporada')
            .setDescription('Adicione a temporada a base de dados')
            .addIntegerOption(option => 
                option.setName("id")
                .setDescription("insira o id da temporada para adicionar na base de dados, pode ver aqui https://myanimelist.net/")
                .setRequired(true)
            )
            .addIntegerOption(option => 
                option.setName("número")
                .setDescription("insira o número da temporada para adicionar na base de dados")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('adicionar-episódio')
            .setDescription('Adicione episódios a base de dados')
            .addIntegerOption(option => 
                option.setName("anime-id")
                .setDescription("insira o id do anime, pode ver aqui https://myanimelist.net/")
                .setRequired(true)
            )
            .addIntegerOption(option => 
                option.setName("temporada-numero")
                .setDescription("insira o número da temporada para adicionar na base de dados")
                .setRequired(true)
            )
            .addIntegerOption(option => 
                option.setName("episódio-numero")
                .setDescription("insira o número do episódio para adicionar na base de dados")
                .setRequired(true)
            )
            .addStringOption(option => 
                option.setName("upload-episódio")
                .setDescription("insira o url do episódio para adicionar na base de dados (tem de ser .mp4)")
                .setRequired(true)
            )
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {CustomClient} client
     */
    async execute(interaction, client) {

        const { options } = interaction;

        await interaction.deferReply()

        if (options.getSubcommand() === "procurar") {

            const name = options.getString('nome');

            kand.getAnimeSerieInfo({ mal_name: `${name}` }).then((response) => {

                var animeURL = response.content.AnimeUrl
                var AnimeURLReplace = animeURL.replace(/( )/g,"%");
    
                if(response[0]){
    
                    editReply(interaction, "❌", response.error)
    
                } else {
    
                    const embed = new EmbedBuilder()
                    .setTitle(`${response.content.AnimeName} | ${response.content.AnimeJapaneseTitle}`)
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
                        .setURL(AnimeURLReplace)
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
        } if (options.getSubcommand() === "procurar-filme") {

            const name = options.getString('nome');

            kand.getAnimeMovieInfo({ mal_name: `${name}` }).then((response) => {

                var movie = response.content.MovieUrl
                var movieReplace = movie.replace(/( )/g,"%");

                if(response.error){
    
                    editReply(interaction, "❌", response.error)
    
                } else {
    
                    const embed = new EmbedBuilder()
                    .setTitle(`${response.content.MovieName} | ${response.content.MovieJapaneseTitle}`)
                    .setColor("Random")
                    .setDescription(`**Sinopse** \n\n ${response.content.MovieSynopsis}`)
                    .addFields(
                        {
                            name: "Filme ID",
                            value: `${response.content.MovieId}`,
                            inline: true
                        },
                        {
                            name: "Tipo",
                            value: `${response.content.MovieType}`,
                            inline: true
                        },
                        {
                            name: "Exibição",
                            value: `${response.content.MovieAired}`,
                            inline: true
                        },
                        {
                            name: "Duração do Filme",
                            value: `${response.content.MovieEpisodeDuration}`,
                            inline: true
                        },
                        {
                            name: "Gêneros",
                            value: `${response.content.MovieGenres}`,
                            inline: true
                        },
                        {
                            name: "Pontuação",
                            value: `${response.content.MovieScore}`,
                            inline: true
                        },
                        {
                            name: "Estúdio",
                            value: `${response.content.MovieStudios}`,
                            inline: true
                        },
                        {
                            name: "Produtores",
                            value: `${response.content.MovieProducers}`,
                            inline: true
                        }
                    )
                    .setThumbnail(response.content.MoviePoster)
                    .setTimestamp()
        
                    const row = new ActionRowBuilder().addComponents(
        
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(movieReplace)
                        .setLabel("Pagina do Filme"),
            
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(response.content.MovieTrailer)
                        .setLabel("Trailer"),
            
                    )
        
                    interaction.editReply({ embeds: [embed] , components: [row]}).catch((error) => {
                        interaction.editReply("Output excede o limite de caracteres")
                    })
    
                }

            })

        } if (options.getSubcommand() === "procurar-temporada") {

            const anime = options.getString('nome');
            const seasonNumber = options.getInteger('temporada');

            kand.getAnimeSeasonInfo({ mal_name: `${anime}`, season_number: `${seasonNumber}` }).then((response) => {

                if(response.error){
    
                    editReply(interaction, "❌", response.error)
    
                } else {

                    const embed = new EmbedBuilder()
                    .setTitle(`${response.content.SeasonName}`)
                    .setColor("Random")
                    .setDescription(`**Descrição** \n ${response.content.SeasonDescription}`)
                    .addFields(
                        {
                            name: "ID da Temporada",
                            value: `${response.content.SeasonId}`,
                            inline: true
                        },
                        {
                            name: "Temporada",
                            value: `${response.content.SeasonNumber}`,
                            inline: true
                        },
                        {
                            name: "Transmissão",
                            value: `${response.content.SeasonAirDate}`,
                            inline: true
                        },
                        {
                            name: "Nº de Episodios da Temporada",
                            value: `${response.content.SeasonEpisodes}`,
                            inline: true
                        }
                    )
                    .setThumbnail(response.content.SeasonPoster)
                    .setTimestamp()

                    interaction.editReply({ embeds: [embed] }).catch((error) => {
                        interaction.editReply("Output excede o limite de caracteres")
                    }) 

                }

            })

        } if (options.getSubcommand() === "assistir") {

            const anime = options.getString('nome');
            const seasonNumber = options.getInteger('temporada');
            const episodeNumber = options.getInteger('episódio');

            kand.getAnimeEpisodeInfo({ mal_name: `${anime}`, season_number: `${seasonNumber}`, episode_number: `${episodeNumber}` }).then((response) => {

                console.log(response)


                if(response.error){
    
                    editReply(interaction, "❌", response.error)
    
                } else {

                    var download = response.content.EpisodeInfo[0].EpisodeDownload
                    var downloadReplace = download.replace(/( )/g,"%");
    
                    const embed = new EmbedBuilder()
                    .setTitle(`${response.content.EpisodeName}`)
                    .setColor("Random")
                    .setDescription(`**Sinopse** \n ${response.content.EpisodeSynopsis}`)
                    .addFields(
                        {
                            name: "Episódio",
                            value: `${response.content.EpisodeNumber}`,
                            inline: true
                        },
                        {
                            name: "Temporada",
                            value: `${response.content.SeasonNumber}`,
                            inline: true
                        },
                        {
                            name: "ID do Episódio",
                            value: `${response.content.EpisodeId}`,
                            inline: true
                        }
                    )
                    .setThumbnail(response.content.EpisodeInfo[0].EpisodeThumbnail)
                    .setTimestamp()
        
                    const row = new ActionRowBuilder().addComponents(
        
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(response.content.EpisodeInfo[0].EpisodePlayer)
                        .setLabel("Assistir"),

                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(downloadReplace)
                        .setLabel("Download"),
            
                    )
        
                    interaction.editReply({ embeds: [embed] , components: [row]}).catch((error) => {
                        interaction.editReply("Output excede o limite de caracteres")
                    })
    
                }

            })

        } if (options.getSubcommand() === "assistir-filme") {

            const anime = options.getString('nome');

            kand.getAnimeMovieInfo({ mal_name: `${anime}` }).then((response) => {

                var download = response.content.MovieInfo[0].MovieDownload
                var downloadReplace = download.replace(/( )/g,"%");
                
                if(response.error){
    
                    editReply(interaction, "❌", response.error)
    
                } else {
    
                    const embed = new EmbedBuilder()
                    .setTitle(`${response.content.MovieName}`)
                    .setColor("Random")
                    .setDescription(`**Sinopse** \n ${response.content.MovieSynopsis}`)
                    .addFields(
                        {
                            name: "ID do Filme",
                            value: `${response.content.MovieId}`,
                            inline: true
                        },
                        {
                            name: "Duração do Filme",
                            value: `${response.content.MovieEpisodeDuration}`,
                            inline: true
                        }
                    )
                    .setThumbnail(response.content.MovieInfo[0].MovieThumbnail)
                    .setTimestamp()
        
                    const row = new ActionRowBuilder().addComponents(
        
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(response.content.MovieInfo[0].MoviePlayer)
                        .setLabel("Assistir"),

                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(downloadReplace)
                        .setLabel("Download"),
            
                    )
        
                    interaction.editReply({ embeds: [embed] , components: [row]}).catch((error) => {
                        interaction.editReply("Output excede o limite de caracteres")
                    })
    
                }

            })
            
        } if (options.getSubcommand() === "adicionar") {

            const url = options.getString('anime-url');

            kand.addAnimeSerieInfo({ mal_url: `${url}` }).then(response => {

                if(response.error){
    
                    editReply(interaction, "❌", response.error)
    
                } else {

                    editReply(interaction, "✅", response.content.sucess)

                }

            })

        } if (options.getSubcommand() === "adicionar-temporada") {

            const animeID = options.getInteger('id');
            const seasonNumber = options.getInteger('número');

            kand.addAnimeSeasonInfo({ mal_id: `${animeID}`, season_number: `${seasonNumber}` }).then(response => {

                if(response[0]){
    
                    editReply(interaction, "❌", response.error)
    
                } else {

                    editReply(interaction, "✅", response.content.sucess)

                }

            })

        } if (options.getSubcommand() === "adicionar-episódio") {

            const animeID = options.getInteger('anime-id');
            const seasonNumber = options.getInteger('temporada-numero');
            const episodeNumber = options.getInteger('episódio-numero');
            const uploadEpisode = options.getString('upload-episódio');

            kand.addAnimeEpisodeInfo({ mal_id: `${animeID}`, season_number: `${seasonNumber}`, episode_number: `${episodeNumber}`, download_uploader_videomp4_url: `${uploadEpisode}` }).then(response => {

                console.log(response)

                if(response[0]){
    
                    editReply(interaction, "❌", response.error)
    
                } else {

                    editReply(interaction, "✅", response.content.sucess)

                }

            })

        }

    }
}