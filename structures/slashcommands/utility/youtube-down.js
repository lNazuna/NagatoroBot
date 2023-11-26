const { Client, CommandInteraction, ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios')
const { editReply } = require("../../systems/editReply")
const { youtubeDownnloadKey } = require("../../configuration/index")

module.exports = {
    name: 'youtube-mp4',
    description: 'Baixe vídeos do youtube',
    options: [
        {
            name: "video-id",
            description: "O ID do vídeo do YouTube para download",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     * @returns 
     */
    run: async (client, interaction, args) => {

        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const vidId = options.getString('video-id')

        const input = {
            method: "GET",
            url: "https://youtube-video-download-info.p.rapidapi.com/dl",
            params: { id: vidId },
            headers: {
                'X-RapidAPI-Key': youtubeDownnloadKey,
                'X-RapidAPI-Host': 'youtube-video-download-info.p.rapidapi.com'
            }
        };

        try {
            const output = await axios.request(input);
            const link = output.data.link[22];

            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel("📩 Baixar MP4")
                .setStyle(ButtonStyle.Link)
                .setURL(link[0])
            );

            const embed = new EmbedBuilder()
            .setColor("Aqua")
            .setDescription(`📹 Baixe a versão mp4 de  \`${output.data.title}\` abaixo!`)
            
            await interaction.editReply({ embeds: [embed], components: [button] })
        } catch (e) {
            console.log(e)
            await editReply(interaction, "⚠️", "Esse ID do vídeo não é válido! Vá para o URL e copie o ID no final do link!")
        }

    },
};