const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js")
const { reply } = require("../../systems/reply")
const { CustomClient } = require("../../structures/classes/CustomClient")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Mostra a latência atual do bot")
        .addStringOption(option =>
            option.setName("query")
              .setDescription("Forneça o nome ou URL da música.")
              .setRequired(true)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {CustomClient} client
     */
    execute(interaction, client) {

        const { options, member, guild, channel } = interaction;

        const query = options.getString("query");
        const voiceChannel = member.voice.channel;
    
        if (!voiceChannel) {
          reply(interaction, "❌", "Você deve estar em um canal de voz para executar comandos musicais.", true)
        }
    
        if (!member.voice.channelId == guild.members.me.voice.channelId) {
          reply(interaction, "❌", `Você não pode usar o bot de música porque ele já está ativo no <#${guild.members.me.voice.channelId}>`, true)
        }
    
        try {
          client.distube.play(voiceChannel, query, { textChannel: channel, member: member });
    
          interaction.reply({ content: "🎶 Pedido recebido. Certifique-se de que o bot tenha as permissões necessárias.", ephemeral: true });
    
        } catch (err) {
          console.log(err);
    
          return reply(interaction, "⛔", "Algo deu errado...", true)
        }

    }
}