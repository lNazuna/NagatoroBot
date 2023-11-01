const { EmbedBuilder, CommandInteraction, Colors } = require("discord.js")

/**
 * @param {CommandInteraction} interaction - client interaction from Command Interaction
 * @param {String} emoji - emoji for the reply
 * @param {String} description - description for the reply
 */
function editReply(interaction, emoji, description) {

    interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setColor(Colors.Blue)
                .setDescription(`\`${emoji}\` | ${description}`)
        ]
    })

}

module.exports = { editReply }