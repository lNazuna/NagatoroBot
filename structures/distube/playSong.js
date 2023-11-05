const { Client, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder, ButtonStyle } = require("discord.js")
const { musicCard } = require("musicard");
const fs = require("fs");

module.exports = async (client, queue, song) => {

    if (queue.currentMessage) {
        queue.currentMessage.delete().catch(console.error);
        queue.currentMessage = undefined;
      }

      const card = new musicCard()
      .setName(song.name)
      .setAuthor(`By ${song.user.username}`)
      .setColor("auto")
      .setTheme("classic")
      .setBrightness(50)
      .setThumbnail(song.thumbnail)
      .setProgress(10)
      .setStartTime("0:00")
      .setEndTime(song.formattedDuration);
  
    const cardBuffer = await card.build();
    fs.writeFileSync(`musicard.png`, cardBuffer);
  
    const pauseButton = new ButtonBuilder()
      .setCustomId("pause")
      .setLabel("Pausar")
      .setStyle(ButtonStyle.Secondary);
  
    const resumeButton = new ButtonBuilder()
      .setCustomId("resume")
      .setLabel("Retomar")
      .setStyle(ButtonStyle.Secondary);
  
    const skipButton = new ButtonBuilder()
      .setCustomId("skip")
      .setLabel("Pular")
      .setStyle(ButtonStyle.Danger);
  
    const stopButton = new ButtonBuilder()
      .setCustomId("stop")
      .setLabel("Parar")
      .setStyle(ButtonStyle.Primary);
  
    const volumeUpButton = new ButtonBuilder()
      .setCustomId("volumeUp")
      .setLabel("Volume Up")
      .setStyle(ButtonStyle.Success);
  
    const volumeDownButton = new ButtonBuilder()
      .setCustomId("volumeDown")
      .setLabel("Volume Down")
      .setStyle(ButtonStyle.Danger);
  
    const repeat = new ButtonBuilder()
      .setCustomId("repeat")
      .setLabel("Repetir")
      .setStyle(ButtonStyle.Danger);
  
    const shuffle = new ButtonBuilder()
      .setCustomId("shuffle")
      .setLabel("Embaralhar")
      .setStyle(ButtonStyle.Danger);
  
    const row1 = new ActionRowBuilder()
      .addComponents(pauseButton, resumeButton, skipButton, stopButton);
  
    const row2 = new ActionRowBuilder()
      .addComponents(volumeUpButton, volumeDownButton, shuffle, repeat);
  
    queue.textChannel.send({
      //content: `🎶 Tocando agora: ${song.name}Solicitado por:  ${song.user.username}`,
      components: [row1, row2],
      files: [`musicard.png`], 
    }).then((message) => {
      queue.currentMessage = message;
    });

}