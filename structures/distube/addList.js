const { Client, EmbedBuilder } = require("discord.js")

module.exports = (client, queue, playlist) => {

    const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filtro: \`${queue.filters.names.join(", ") || "Off"}\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? "Filas" : "Esta canção") : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

    const embed = new EmbedBuilder()
    .setTitle(":ballot_box_with_check: | Adicionada a lista")
    .setDescription(`🎶 Adicionada \`${playlist.name}\` playlist (${playlist.songs.length} músicas) para fila\n${status(queue)}`)
    .setColor("#c5a0c1")
    .setTimestamp()

  queue.textChannel.send({ embeds: [embed]})
}