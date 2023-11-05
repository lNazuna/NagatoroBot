const { Client, EmbedBuilder } = require("discord.js")

module.exports = (client, queue, song) => {

    const embed = new EmbedBuilder()
    .setTitle(":ballot_box_with_check: | Música adicionada à fila")
    .setDescription(`🎶 Adicionada ${song.name} - \`${song.formattedDuration}\` para a fila por ${song.user}`)
    .setColor("#c5a0c1")
    .setTimestamp()

  queue.textChannel.send({ embeds: [embed]})
}