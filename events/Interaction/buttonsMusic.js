const { ChatInputCommandInteraction, Events } = require("discord.js")
const { CustomClient } = require("../../structures/classes/CustomClient")
  
  module.exports = {
    name: Events.InteractionCreate,
  
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {CustomClient} client
     */

    async execute(interaction, client) {

        if (!interaction.isButton()) return;

        const filter = (i) => ["pause", "resume", "skip", "stop", "volumeUp", "volumeDown", "shuffle", "repeat"].includes(i.customId) && i.user.id === interaction.user.id;
      
        if (filter(interaction)) {
          const queue = client.distube.getQueue(interaction.guildId);
          if (!queue) return;
      
          if (interaction.customId === "pause") {
            try {
                await client.distube.pause(interaction.guild);
                await interaction.update({ content: "⏸ Música pausada." });
            } catch {
                await interaction.update({ content: "⏸ A música já foi pausada." });
            } 
          } else if (interaction.customId === "resume") {
            try {
                client.distube.resume(interaction.guild);
                await interaction.update({ content: "▶️ Música retomada." });
            } catch {
                await interaction.update({ content: "▶️ A música não está pausada.", ephemeral: true });
            }
          } else if (interaction.customId === "skip") {
            if (queue.songs.length <= 1) {
              await interaction.update({ content: "⚠️ Não há músicas suficientes na fila para pular.", ephemeral: true });
            } else {
              client.distube.skip(interaction.guild);
              await interaction.update({ content: "⏭️ Música pulada." });
            }
          } else if (interaction.customId === "stop") {
            client.distube.stop(interaction.guild);
            await interaction.update({ content: "⏹️ A música parou." });
          } else if (interaction.customId === "volumeUp") {
            if (queue.volume >= 100) {
              await interaction.update({ content: "🔊 O volume já está no máximo (100%)" });
            } else {
              const newVolume = Math.min(queue.volume + 10, 100);
              client.distube.setVolume(interaction.guild, newVolume);
              await interaction.update({ content: `🔊 O volume aumentou para ${newVolume}%` });
            }
          } else if (interaction.customId === "volumeDown") {
            if (queue.volume <= 0) {
              await interaction.update({ content: "🔉 O volume já está no mínimo (0%)" });
            } else {
              const newVolume = Math.max(queue.volume - 10, 0);
              client.distube.setVolume(interaction.guild, newVolume);
              await interaction.update({ content: `🔉 O volume diminuiu para ${newVolume}%` });
            }
          } else if (interaction.customId === "shuffle") {
            if (!queue.songs.length || queue.songs.length === 1) {
              await interaction.update({ content: "⚠️ Não há músicas suficientes na fila para embaralhar" });
            } else {
              client.distube.shuffle(interaction.guild);
              await interaction.update({ content: "🔀 Fila embaralhada." });
            }
          } else if (interaction.customId === "repeat") {
            if (!queue.songs.length) {
              await interaction.update({ content: "⚠️ Não há músicas na fila para repetir." });
            } else {
              const repeatMode = queue.repeatMode;
              client.distube.setRepeatMode(interaction.guild, repeatMode === 0 ? 1 : 0);
              await interaction.update({ content: `🔁 Modo de repetição definido como ${repeatMode === 0 ? "queue" : "off"}` });
            }
          }
        }

    },
  };