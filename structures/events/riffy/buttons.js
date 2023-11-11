const client = require("../../Client");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const player = client.riffy.players.get(interaction.guild.id);

    if (interaction.customId === 'pause') {

        if (!player) return interaction.reply({ content: `O player de música não existe`, ephemeral: true });

        player.pause(true);
        await interaction.update({ content: "⏸ Música pausada." });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('disconnect')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏺'),

                new ButtonBuilder()
                    .setCustomId('play')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('▶'),

                new ButtonBuilder()
                    .setCustomId('skip')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏭'),

                new ButtonBuilder()
                    .setCustomId('loop')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔁'),
            );

        return await interaction.message.edit({
            components: [row]
        })
    } else if (interaction.customId === 'play') {

        if (!player) return interaction.update({ content: `O player de música não existe`, ephemeral: true });

        player.pause(false);

        await interaction.update({ content: "▶️ Música retomada." });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('disconnect')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏺'),

                new ButtonBuilder()
                    .setCustomId('pause')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏸'),

                new ButtonBuilder()
                    .setCustomId('skip')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏭'),

                new ButtonBuilder()
                    .setCustomId('noneloop')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔁'),
            )

        return await interaction.message.edit({
            components: [row]
        })

    } else if (interaction.customId === 'loop') {

        if (!player) return interaction.reply({ content: `O player de música não existe`, ephemeral: true });

        player.setLoop("queue")

        await interaction.update({ content: "🔂 Música está em loop." });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('disconnect')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏺'),

                new ButtonBuilder()
                    .setCustomId('play')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('▶'),

                new ButtonBuilder()
                    .setCustomId('skip')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏭'),

                new ButtonBuilder()
                    .setCustomId('noneloop')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔁'),
            )

        return await interaction.message.edit({
            components: [row]
        })
    } else if (interaction.customId === 'noneloop') {

        if (!player) return interaction.reply({ content: `O player de música não existe`, ephemeral: true });

        player.setLoop("none")

        await interaction.update({ content: "🔂 Música não está em loop." });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('disconnect')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏺'),

                new ButtonBuilder()
                    .setCustomId('play')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('▶'),

                new ButtonBuilder()
                    .setCustomId('skip')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏭'),

                new ButtonBuilder()
                    .setCustomId('loop')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔁'),
            )

        return await interaction.message.edit({
            components: [row]
        })
    } else if (interaction.customId === 'skip') {
        await interaction.deferUpdate();

        if (!player) return interaction.followUp({ content: `O player de música não existe`, ephemeral: true });
        player.stop();

        const rowDisabled = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('disconnect')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏺')
                    .setDisabled(true),

                new ButtonBuilder()
                    .setCustomId('pause')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏸')
                    .setDisabled(true),

                new ButtonBuilder()
                    .setCustomId('skip')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏭')
                    .setDisabled(true),

                new ButtonBuilder()
                    .setCustomId('noneloop')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔁')
                    .setDisabled(true),

                new ButtonBuilder()
                    .setCustomId('skiped')
                    .setStyle(ButtonStyle.Success)
                    .setLabel('Pulada')
                    .setDisabled(true)
            );

        return await interaction.message.edit({
            components: [rowDisabled]
        })
    } else if (interaction.customId === 'disconnect') {
        await interaction.deferUpdate();

        if (!player) return interaction.followUp({ content: `O player de música não existe`, ephemeral: true });
        player.destroy();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('disconnect')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏺')
                    .setDisabled(true),

                new ButtonBuilder()
                    .setCustomId('play')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('▶')
                    .setDisabled(true),

                new ButtonBuilder()
                    .setCustomId('skip')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏭')
                    .setDisabled(true),

                new ButtonBuilder()
                    .setCustomId('loop')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔁')
                    .setDisabled(true),

                new ButtonBuilder()
                    .setCustomId('skiped')
                    .setStyle(ButtonStyle.Danger)
                    .setLabel('Desconectado')
                    .setDisabled(true)
            )

        return await interaction.message.edit({
            components: [row]
        })
    }
});