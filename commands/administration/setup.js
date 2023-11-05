const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { reply } = require("../../systems/reply")
const { CustomClient } = require("../../structures/classes/CustomClient")
const welcomeSchema = require('../../schemas/WelcomeDB');
const leaveSchema = require('../../schemas/LeaveDB');
const memberCountSchema = require('../../schemas/MemberCountDB');
const botCountSchema = require('../../schemas/BotCountDB');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Opções e configuração do servidor ')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
        subcommand.setName('entradas')
        .setDescription('Definir ou substituir o canal de mensagens de boas-vindas')
        .addChannelOption(option =>
            option.setName('canal')
            .setDescription('Canal para o qual enviar a mensagem.')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mensagem')
            .setDescription('A mensagem a enviar')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName('remover-entradas')
        .setDescription('exclui o sistema de boas-vindas')
    )
    .addSubcommand(subcommand =>
        subcommand.setName('saídas')
        .setDescription('Defina ou substitua o canal de mensagem de saída.')
        .addChannelOption(option =>
            option.setName('canal')
            .setDescription('Canal para o qual enviar a mensagem.')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mensagem')
            .setDescription('A mensagem a enviar')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName('remover-saídas')
        .setDescription('exclui o sistema de saídas')
    )
    .addSubcommand(subcommand =>
        subcommand.setName('contador-membros')
        .setDescription('Define o canal de voz do total de membros')
        .addChannelOption(option =>
            option.setName('canal')
            .setDescription('O canal de voz especificado será o canal de voz total dos membros.')
            .addChannelTypes(ChannelType.GuildVoice)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName('remover-contador-membros')
        .setDescription('Remove o total de membros VC.')
    )
    .addSubcommand(subcommand =>
        subcommand.setName('contador-bots')
        .setDescription('Define o canal de voz do total de bots')
        .addChannelOption(option =>
            option.setName('canal')
            .setDescription('O canal de voz especificado será o canal de voz total dos bots.')
            .addChannelTypes(ChannelType.GuildVoice)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName('remover-contador-bots')
        .setDescription('Remove o total de bots VC.')
    ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {CustomClient} client
     */
    async execute (interaction, client) {

        const { guild, options } = interaction;

        if (options.getSubcommand() === "entradas") {

            const data = await welcomeSchema.findOne({
                guildid: guild.id,
            })
            if(data) {
                const channel = options.getChannel('canal');
                const message = options.getChannel('mensagem');

                await welcomeSchema.findOneAndUpdate({
                    guildid: guild.id,
                    channel: channel.id,
                    message: message,
                })



                await data.save();

                const embed1 = new EmbedBuilder()
                .setColor(`#00FFFF`)
                .setTitle("Sistema de Boas-Vindas")
                .setDescription(`A mensagem de boas-vindas foi atualizada para ${message} no channel ${channel}`)
                .setTimestamp()


                await interaction.reply({ embeds: [embed1] });

            }

            if (!data) {
                const channel = options.getChannel('canal');
                const message = options.getChannel('mensagem');

                const data = await welcomeSchema.create({
                    guildid: guild.id,
                    channel: channel.id,
                    message: message,
                })

                await data.save();

                const embed = new EmbedBuilder()
                .setColor(`#00FFFF`)
                .setTitle("Sistema de Boas-Vindas")
                .setDescription(`A mensagem de boas-vindas está definida como ${message} no channel ${channel}`)
                .setTimestamp()

                await interaction.reply({ embeds: [embed] });

            }

        } 
        if (options.getSubcommand() === "remover-entradas") {
    
            const data = await welcomeSchema.findOne({
                guildid: guild.id,
            })

            if (!data) {
                await interaction.reply({ content: "Nenhuma mensagem de boas-vindas encontrada!", ephemeral: true })
            }
            else {
            await welcomeSchema.findOneAndDelete({
                guildid: guild.id,
            })

            const embed3 = new EmbedBuilder()
            .setColor(`Aqua`)
            .setTitle("Sistema de Boas-Vindas")
            .setDescription("Mensagem de boas-vindas excluída")

            await interaction.reply({ embeds: [embed3] });
        } 

        }
    
        if (options.getSubcommand() === "saídas") {

            const data = await leaveSchema.findOne({
                guildid: guild.id,
            })
            if(data) {
                const channel = options.getChannel('canal');
                const message = options.getString('mensagem');

                await leaveSchema.findOneAndUpdate({
                    guildid: guild.id,
                    channel: channel.id,
                    message: message,
                })



                await data.save();

                const embed1 = new EmbedBuilder()
                .setColor(`#00FFFF`)
                .setTitle("Sistema de Saídas")
                .setDescription(`A mensagem de saídas foi atualizada para ${message} no channel ${channel}`)
                .setTimestamp()


                await interaction.reply({ embeds: [embed1] });

            }

            if (!data) {
                const channel = options.getChannel('canal');
                const message = options.getString('mensagem');
                const data = await leaveSchema.create({
                    guildid: guild.id,
                    channel: channel.id,
                    message: message,
                })

                


                await data.save();

                const embed = new EmbedBuilder()
                .setColor(`#00FFFF`)
                .setTitle("Sistema de Saídas")
                .setDescription(`A mensagem de saídas está definida como ${message} no channel ${channel}`)
                .setTimestamp()

                await interaction.reply({ embeds: [embed] });

            }

        } if (options.getSubcommand() === "remover-saídas") {

            const data = await leaveSchema.findOne({
                guildid: guild.id,
            })

            if (!data) {
                await interaction.reply({ content: "Nenhuma mensagem de saidas encontrada!", ephemeral: true })
            }
            else {
            await leaveSchema.findOneAndDelete({
                guildid: guild.id,
            })

            const embed3 = new EmbedBuilder()
            .setColor(`Aqua`)
            .setTitle("Sistema de Saídas")
            .setDescription("Sistema de saídas deletado")

            await interaction.reply({ embeds: [embed3] });
        }

        } if (options.getSubcommand() === "contador-membros") {

            const voicedata = await memberCountSchema.findOne({ Guild: guild.id });
            const voicechannel = options.getChannel('canal');
            const memberTotalChannel = await guild.channels.cache.get(voicechannel.id);

            if (!voicedata) {

                await memberCountSchema.create({
                    Guild: guild.id,
                    MemberChannel: voicechannel.id
                })

                memberTotalChannel.setName(`• Total de Membros: ${guild.members.cache.filter(member => !member.user.bot).size}`);

                const voiceembed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setThumbnail(guild.iconURL())
                .setAuthor({ name: `🔊 Ferramenta de voz para membros`})
                .setTimestamp()
                .setTitle('> O canal Total de membros foi \n> configurado')
                .addFields({ name: `• O canal foi configurado`, value: `> O seu canal (${voicechannel}) foi configurado \n> para ser o canal de voz do total de membros \n> ! Ele agora exibirá seu \n> total de membros de acordo o configurado`})
                .setFooter({ text: `🔊 total de membros configurado`})

                await interaction.reply({ embeds: [voiceembed]})

            } else {
                await reply(interaction, "❌", "Você **já** configurou um VC de **total de membros** neste servidor!", true)
            }

        } if (options.getSubcommand() === "remover-contador-membros") {

            const memberRemoveData = await memberCountSchema.findOne({ Guild: guild.id });

            if (!memberRemoveData) return await reply(interaction, "❌", "Você **não** configurou um VC de **total de membros** ainda, não pode excluir **nada**.", true)
            else {

                const removeChannel = await guild.channels.cache.get(memberRemoveData.MemberChannel);

                if (!removeChannel) {

                    await memberCountSchema.deleteMany({ Guild: guild.id });
                    await interaction.reply({ content: `Seu **membro total** VC parece estar corrompido ou inexistente, nós o **desativamos** de qualquer maneira!`, ephemeral: true});

                } else {

                    await removeChannel.delete().catch(err => {
                        memberCountSchema.deleteMany({ Guild: guild.id });
                        return interaction.reply({ content: `**Não foi possível** excluir seu VC, mas **ainda** desativamos seu **total de membros** VC!`, ephemeral: true})
                    });

                    await memberCountSchema.deleteMany({ Guild: guild.id });
                    await interaction.reply({ content: `O seu **total de membros** VC foi **desativado com sucesso**!`, ephemeral: true});
                }

            }

        } if (options.getSubcommand() === "contador-bots") {

            const voicedata = await botCountSchema.findOne({ Guild: guild.id });
            const voicechannel = options.getChannel('canal');
            const voiceBotChannel = await guild.channels.cache.get(voicechannel.id);

            if (!voicedata) {

                await botCountSchema.create({
                    Guild: guild.id,
                    BotChannel: voicechannel.id
                })

                voiceBotChannel.setName(`• Total de Bots: ${guild.members.cache.filter(member => member.user.bot).size}`);

                const voiceembed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setThumbnail(guild.iconURL())
                .setAuthor({ name: `🔊 Ferramenta de voz para bots`})
                .setTimestamp()
                .setTitle('> O canal Total de bots foi \n> configurado')
                .addFields({ name: `• O canal foi configurado`, value: `> O seu canal (${voicechannel}) foi configurado \n> para ser o canal de voz do total de bots \n> ! Ele agora exibirá seu \n> total de bots de acordo o configurado`})
                .setFooter({ text: `🔊 total de bots configurado`})

                await interaction.reply({ embeds: [voiceembed]})

            } else {
                await reply(interaction, "❌", "Você **já** configurou um VC de **total de bots** neste servidor!", true)
            }

        } if (options.getSubcommand() === "remover-contador-bots") {

            const botRemoveData = await botCountSchema.findOne({ Guild: guild.id });

            if (!botRemoveData) return await reply(interaction, "❌", "Você **não** configurou um VC de **total de bots** ainda, não pode excluir **nada**.", true)
            else {

                const removeChannel = await guild.channels.cache.get(botRemoveData.BotChannel);

                if (!removeChannel) {

                    await botCountSchema.deleteMany({ Guild: guild.id });
                    await interaction.reply({ content: `Seu **bots total** VC parece estar corrompido ou inexistente, nós o **desativamos** de qualquer maneira!`, ephemeral: true});

                } else {

                    await removeChannel.delete().catch(err => {
                        botCountSchema.deleteMany({ Guild: guild.id });
                        return interaction.reply({ content: `**Não foi possível** excluir seu VC, mas **ainda** desativamos seu **total de bots** VC!`, ephemeral: true})
                    });

                    await botCountSchema.deleteMany({ Guild: guild.id });
                    await interaction.reply({ content: `O seu **total de bots** VC foi **desativado com sucesso**!`, ephemeral: true});
                }

            }

        }

    }
}