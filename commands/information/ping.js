const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js")
const { reply } = require("../../systems/reply")
const { CustomClient } = require("../../structures/classes/CustomClient")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Mostra a latência atual do bot"),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {CustomClient} client
     */
    execute(interaction, client) {

        const { ws } = client

        reply(interaction, "⏳", `A latência atual do Websocket é: \`${ws.ping} ms\``)

    }
}