const { Client, EmbedBuilder } = require("discord.js")

module.exports = (client, queue, song) => {

    const embed = new EmbedBuilder()
    .setDescription(":x: | O canal está vazio. Saindo do canal!")
    .setColor("#c5a0c1")
    queue.textChannel.send({ embeds: [embed] })
}