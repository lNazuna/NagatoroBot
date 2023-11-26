const { Client, CommandInteraction, ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType, ActionRowBuilder } = require('discord.js');
const { reply } = require("../../systems/reply")
const { editReply } = require("../../systems/editReply")
const ms = require("ms");

module.exports = {
    name: 'nuke',
    description: 'Exclui um canal e depois o clona novamente (não é um comando raid).',
    userPermissions: ["ManageChannels"],
    options: [
        {
            name: 'canal',
            description: 'iO canal para excluir',
            type: ApplicationCommandOptionType.Channel,
            channel_types: [0, 2, 5],
            required: true,
        },
        {
            name: 'razão',
            description: 'O motivo para destruir o canal',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'tipo',
            description: 'specifique o tipo de canal',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: `Canal de texto`, value: `texto` },
                { name: `Canal de voz`, value: `voz` },
                { name: `Canal de anúncios`, value: `anúncios` },
            ]
        },
        {
            name: 'mensagem',
            description: 'Enviar ou não mensagem no novo canal',
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     * @returns 
     */
    run: async (client, interaction) => {


        const { options, guild } = interaction;
        const channel = options.getChannel("canal");
        const Reason = options.getString("razão");
        const type = options.getString("tipo");

        const sendMSG = options.getBoolean("mensagem");

        const channelID = await guild.channels.cache.get(channel.id);

        if (!channel) return reply(interaction, "⚠️", "**•** O canal especificado não existe.", true)

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("nukeConfirm")
                    .setLabel("Confirmar")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId("nukeCancel")
                    .setLabel("Cancelar")
                    .setStyle(ButtonStyle.Danger)
            );

        const disabledRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("nukeConfirm")
                    .setLabel("Confirmar")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),

                new ButtonBuilder()
                    .setCustomId("nukeCancel")
                    .setLabel("Cancelar")
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
            );

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(`\`⚠️\` **•** Você está prestes a destruir o canal <#${channel.id}> e todos os dados serão excluídos. Por favor, tome uma decisão abaixo.`)
            .addFields(
                { name: `Razão`, value: `${Reason}`, inline: true },
                { name: `Tipo`, value: `Canal de ${type}`, inline: true },
                { name: `Enviar Mensagen`, value: `${sendMSG}`, inline: true },
            )

        const message = await interaction.reply({
            embeds: [embed],
            components: [row],
        });

        const collector = message.createMessageComponentCollector({
            time: ms("10m"),
        });

        collector.on("collect", async (c) => {
            if (c.customId === "nukeConfirm") {
                if (c.user.id !== interaction.user.id) {
                    return await c.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`\`⚠️\` **•** Apenas o ${interaction.user.tag} pode interagir com estes botões.`)
                                .setColor("Red")
                        ], ephemeral: true
                    })
                }

                await guild.channels.delete(channelID)

                if (type === "texto") {
                    const newChannel = await guild.channels.create({
                        name: channel.name,
                        type: ChannelType.GuildText,
                        topic: channel.topic || null,
                        parent: channel.parent,
                    }).catch(err => {
                        reply(interaction, "⚠️", "**•** Não consigo destruir o canal; certifique-se de que tenho a permissão *ManageChannels*.", true)
                    });

                    const channelembed = new EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`\`✔️\` **•** O canal **#${channel.name}** foi excluído pelo motivo **${Reason}**. O novo canal é **<#${newChannel.id}>**.`)

                    await c.update({ embeds: [channelembed], components: [disabledRow] });

                    if (sendMSG === false) return;
                    else {
                        await newChannel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Aqua")
                                    .setDescription(`\`💣\` **•** Esse canal foi destruído por ${interaction.user}.`)
                                    .setImage("https://i.pinimg.com/originals/74/91/5b/74915b26a2b2dcf1a3ccde6a70400bd5.gif")
                                    .setTimestamp(),
                            ],
                        })
                    }
                }

                if (type === "voz") {
                    const newChannel = await guild.channels.create({
                        name: channel.name,
                        type: ChannelType.GuildVoice,
                        parent: channel.parent,
                    }).catch(err => {
                        reply(interaction, "⚠️", "**•** Não consigo destruir o canal; certifique-se de que tenho a permissão *ManageChannels*.", true)
                    });

                    const channelembed = new EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`\`✔️\` **•** O canal **#${channel.name}** foi excluído pelo motivo ${Reason}. O novo canal é <#${newChannel.id}>.`)

                    await c.update({ embeds: [channelembed], components: [disabledRow] });

                    if (sendMSG === false) return;
                    else {
                        await newChannel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Aqua")
                                    .setDescription(`\`💣\` **•** Esse canal foi destruído por ${interaction.user}.`)
                            ]
                        })
                    }
                }

                if (type === "anúncios") {
                    const newChannel = await guild.channels.create({
                        name: channel.name,
                        type: ChannelType.GuildAnnouncement,
                        topic: channel.topic || null,
                        parent: channel.parent,
                    }).catch(err => {
                        editReply(interaction, "⚠️", "**•** Não consigo destruir o canal; certifique-se de que tenho a permissão *ManageChannels*.", true)
                    });

                    const channelembed = new EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`\`✔️\` **•** O canal **#${channel.name}** foi excluído pelo motivo ${Reason}. O novo canal é <#${newChannel.id}>.`)

                    await c.update({ embeds: [channelembed], components: [disabledRow] })

                    if (sendMSG === false) return;
                    else {
                        await newChannel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Aqua")
                                    .setDescription(`\`💣\` **•** Esse canal foi destruído por ${interaction.user}.`)
                                    .setImage("https://i.pinimg.com/originals/74/91/5b/74915b26a2b2dcf1a3ccde6a70400bd5.gif")
                                    .setTimestamp(),
                            ]
                        })
                    }
                }
            }

            if (c.customId === "nukeCancel") {
                if (c.user.id !== interaction.user.id) {
                    return await c.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`\`⚠️\` **•** Apenas ${interaction.user.tag} pode interagir com esses botões.`)
                                .setColor("Red")
                        ], ephemeral: true
                    })
                }

                const message = await c.update({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setDescription(`\`✔️\` **•** O pedido de destruír o canal foi cancelado com sucesso.`)
                    ],
                    components: [disabledRow],
                    fetchReply: true,
                });
            }
        });
        
        collector.on(`end`, async (collected) => {
            await interaction.editReply({
                embeds: [
                    embed.setFooter({
                        text: `Seu tempo expirou. Se necessário, execute novamente o comando.`
                    })
                ],
                components: [disabledRow],
            });
        });

    },
};