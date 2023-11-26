const { Client, CommandInteraction, ApplicationCommandOptionType, EmbedBuilder, TextInputBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputStyle } = require("discord.js");
const DB = require("../../database/models/GiveawayDB");
const { endGiveaway } = require("../../systems/GiveawayFunctions");

module.exports = {
    name: "giveaway",
    description: "Crie ou gerencie um sorteio",
    UserPerms: ["ManageGuild"],
    BotPerms: ["SendMessages"],
    category: "Giveaway",
    options: [
        {
            name: "criar",
            description: "rie um sorteio",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "gerenciar",
            description: "Gerenciar um sorteio",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "opções",
                    description: "Fornecer uma opção para gerenciar",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: "Fim", value: "end" },
                        { name: "Pausar", value: "pause" },
                        { name: "Retomar", value: "unpause" },
                        { name: "Novo Vencedor", value: "reroll" },
                        { name: "Excluir", value: "delete" },
                    ]
                },
                {
                    name: "mensagem_id",
                    description: "Forneça o ID da mensagem do sorteio",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     * @returns 
     */

    run: async(client, interaction) => {

        const { guild, options } = interaction;

        if (options.getSubcommand() === "criar") {

            const prize = new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("giveaway-prize")
                    .setLabel("Prêmio")
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(256)
                    .setRequired(true)
            );

            const winners = new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("giveaway-winners")
                    .setLabel("Vencedores")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            );

            const duration = new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("giveaway-duration")
                    .setLabel("Duração")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Exemplo: 1 day")
                    .setRequired(true)
            );
            
            const modal = new ModalBuilder()
                .setCustomId("giveaway-options")
                .setTitle("Crie um Sorteio")
                .setComponents(prize, winners, duration);

            await interaction.showModal(modal);

        }
        if (options.getSubcommand() === "gerenciar") {

            const embed = new EmbedBuilder();
            const messageId = interaction.options.getString("mensagem_id");
            const toggle = interaction.options.getString("opções");

            const data = await DB.findOne({
                GuildID: interaction.guild.id,
                MessageID: messageId
            });
            if (!data) {
                embed
                    .setColor("Red")
                    .setDescription("Não foi possível encontrar nenhum sorteio com esse ID de mensagem");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const message = (await interaction.guild.channels.cache.get(data.ChannelID).messages.fetch(messageId));
            if (!message) {
                embed
                    .setColor("Red")
                    .setDescription("Esse sorteio não existe");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (["end", "reroll"].includes(toggle)) {
                if (data.Ended === (toggle === "end" ? true : false)) {
                    embed
                        .setColor("Red")
                        .setDescription(`Este sorteio ${toggle === "end" ? "já terminou" : "não terminou"}`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                if (toggle === "end" && data.Paused === true) {
                    embed
                        .setColor("Red")
                        .setDescription("Este sorteio está pausado. Retome antes de encerrar o sorteio");
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                endGiveaway(message, (toggle === "end" ? false : true));

                embed
                    .setColor("Green")
                    .setDescription(`Este sorteio ${toggle === "end" ? "terminou" : "foi lançado novo vencedor"}`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (["pause", "unpause"].includes(toggle)) {
                if (data.Ended) {
                    embed
                        .setColor("Red")
                        .setDescription("Este sorteio já terminou");
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                if (data.Paused === (toggle === "pause" ? true : false)) {
                    embed
                        .setColor("Red")
                        .setDescription(`Este sorteio já ${toggle === "pause" ? "pausado" : "foi retomado"}`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                const button = ActionRowBuilder.from(message.components[0]).setComponents(ButtonBuilder.from(message.components[0].components[0]).setDisabled(toggle === "pause" ? true : false));

                const giveawayEmbed = EmbedBuilder.from(message.embeds[0]).setColor(toggle === "pause" ? "Yellow" : "#156789");

                await DB.findOneAndUpdate({
                    GuildID: interaction.guild.id,
                    MessageID: message.id
                }, { Paused: toggle === "pause" ? true : false });
                
                await message.edit({ content: `🎉 **Sorteio ${toggle === "pause" ? "Pausado" : "Iniciado"}** 🎉`, embeds: [giveawayEmbed], components: [button] });

                embed
                    .setColor("Green")
                    .setDescription(`O sorteio foi ${toggle === "pause" ? "pausado" : "retomado"}`);
                interaction.reply({ embeds: [embed], ephemeral: true });

                if (toggle === "unpause" && (data.EndTime * 1000) < Date.now()) endGiveaway(message);
            }

            if (toggle === "delete") {
                await DB.deleteOne({
                    GuildID: interaction.guild.id,
                    MessageID: message.id
                });

                await message.delete();
                embed
                    .setColor("Green")
                    .setDescription("O sorteio foi excluído");
                interaction.reply({ embeds: [embed], ephemeral: true });
            }

        }

    }
}