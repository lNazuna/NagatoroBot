const { Client, EmbedBuilder } = require("discord.js")

module.exports = (client, queue, query) => {

    const embed = new EmbedBuilder()
    .setTitle(":ballot_box_with_check: | Sem Resultado")
    .setDescription(`⛔ Nenhum resultado encontrado para \`${query}\`!`)
    .setColor("#c5a0c1")
    .setTimestamp()

  queue.textChannel.send({ embeds: [embed]})
}