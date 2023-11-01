const { EmbedBuilder, CommandInteraction, Colors } = require("discord.js")

/**
 * @param {CommandInteraction} interaction - client interaction from Command Interaction
 * @param {String} emoji - emoji for the reply
 * @param {String} description - description for the reply
 * @param {Boolean} type - type of reply, ephemeral true or false
 */
function reply(interaction, emoji, description, type) {

    interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor(Colors.Blue)
                .setDescription(`\`${emoji}\` | ${description}`)
        ],
        ephemeral: type || true
    })

}

module.exports = { reply }