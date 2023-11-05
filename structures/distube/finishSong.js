const { Client, EmbedBuilder } = require("discord.js")

module.exports = (client, queue, song) => {

    const embed = new EmbedBuilder()
    .setDescription(`:white_check_mark: | Música finalizada \`${song.name}\``)
    .setColor("#c5a0c1")
    queue.textChannel.send({ embeds: [embed] })
}