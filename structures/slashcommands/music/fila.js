const { EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'fila',
    description: 'Mostra a fila atual',
    inVoice: true,
    sameVoice: true,
    player: true,

    run: (client, interaction) => {
        const player = client.riffy.players.get(interaction.guild.id);

        const queue = player.queue.length > 9 ? player.queue.slice(0, 9) : player.queue;

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('Tocando Agora')
            .setThumbnail(player.current.info.thumbnail)
            .setDescription(`[${player.current.info.title}](${player.current.info.uri}) [${ms(player.current.info.length)}]`)
            .setFooter({ text: `Filas: ${player.queue.length} músicas` });

        if (queue.length)
            embed.addFields([
                {
                    name: 'A seguir',
                    value: queue
                        .map(
                            (track, index) =>
                                `**${index + 1}.** [${track.info.title}](${track.info.uri})`,
                        )
                        .join('\n'),
                },
            ]);

        return interaction.reply({ embeds: [embed] });
    },
};