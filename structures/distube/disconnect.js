const { Client, EmbedBuilder } = require("discord.js")

module.exports = (client, queue) => {

    if (queue.currentMessage) {
        queue.currentMessage.delete().catch(console.error);
        queue.currentMessage = undefined;
      }

    const embed = new EmbedBuilder()
    .setDescription(":x: | Desconectado do canal de voz")
    .setColor("#c5a0c1")
    queue.textChannel.send({ embeds: [embed] }).then((message) => {
        queue.currentMessage = message;
      });
}