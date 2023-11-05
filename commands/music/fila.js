const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { CustomClient } = require("../../structures/classes/CustomClient")
const paginationEmbed = require("../../functions/paginationEmbed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fila")
        .setDescription("Veja a fila da música."),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {CustomClient} client
     */
    async execute(interaction, client) {

        await interaction.deferReply();
        const queue = client.distube.getQueue(interaction.guild.id);
        if (!queue?.songs?.length) {
            return interaction.editReply({embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: "| Sem música", iconURL: client.user.avatarURL() })
                    .setDescription("Não há música para mostrar a fila")
                    .setColor("#c5a0c1")
            ]});
        }
    
        const numberOfPages = Math.ceil(queue.songs.length / 10);
        const songs = queue.songs.map((song, index) => {
            return `\`${index + 1}.\` \`${song.name}\` \`${song.formattedDuration} left\` \`${song.user.tag}\``;
        });
    
        const embeds = [];
        for (let i = 0; i < numberOfPages; i++) {
            embeds.push(
                new EmbedBuilder()
                    .setAuthor({ name: `${interaction.guild.name}'s Queue`, iconURL: client.user.avatarURL() })
                    .setDescription(songs.slice(i * 10, i * 10 + 10).join("\n"))
                    .setFooter({text: `Página ${i + 1}/${numberOfPages}`})
                    .setColor("#c5a0c1")
            );
        }
    
        paginationEmbed(interaction, embeds);

    }
}