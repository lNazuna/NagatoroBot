const { ChatInputCommandInteraction, Events } = require("discord.js")
const { reply } = require("../../systems/reply")
const { CustomClient } = require("../../structures/classes/CustomClient")

module.exports = {
    name: Events.InteractionCreate,

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {CustomClient} client
     */
    execute(interaction, client) {

        if (!interaction.isChatInputCommand()) return

        const { commandName, guild, user } = interaction
        const { commands, config } = client

        if (!guild) return

        const command = commands.get(commandName)
        if (!command) return reply(interaction, "❌", `O comando que você está tentando executar não existe!`) && commands.delete(commandName)

        if (command.owner && !config.developers.includes(user.id)) return reply(interaction, "❌", `Este comando é classificado!`)

        command.execute(interaction, client)

    }
}