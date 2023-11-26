const { EmbedBuilder, ModalSubmitInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const client = require("../../Client");
const ms = require("ms");
const DB = require("../../database/models/GiveawayDB");
const { endGiveaway } = require("../../systems/GiveawayFunctions");


client.on("interactionCreate", async (interaction) => {

     /**
     * @param {ModalSubmitInteraction} interaction 
     */

    if (!interaction.isModalSubmit()) return;
    if (interaction.customId !== "giveaway-options") return;

    const embed = new EmbedBuilder();

    const prize = interaction.fields.getTextInputValue("giveaway-prize").slice(0, 256);
    const winners = Math.round(parseFloat(interaction.fields.getTextInputValue("giveaway-winners")));
    const duration = ms(interaction.fields.getTextInputValue("giveaway-duration"));

    if (isNaN(winners) || !isFinite(winners) || winners < 1) {
        embed
            .setColor("Red")
            .setDescription("Forneça um numero de vencedores válida");
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (duration === undefined) {
        embed
            .setColor("Red")
            .setDescription("Forneça uma duração válida");
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const formattedDuration = parseInt((Date.now() + duration) / 1000);

    const giveawayEmbed = new EmbedBuilder()
        .setColor("#156789")
        .setTitle(prize)
        .setDescription(`**Hospedado por**: ${interaction.member}\n**Vencedores**: ${winners}\n**Termina em**: <t:${formattedDuration}:R> (<t:${formattedDuration}>)`)
        .setTimestamp(parseInt(Date.now() + duration));

    const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("giveaway-join")
            .setEmoji("🎉")
            .setStyle(ButtonStyle.Success)
            .setLabel("Junte-se aqui")
    );

    interaction.reply({ content: "🎉 **Sorteio iniciado** 🎉", embeds: [giveawayEmbed], components: [button], fetchReply: true }).then(async (message) => {
        await DB.create({
            GuildID: interaction.guild.id,
            ChannelID: interaction.channel.id,
            EndTime: formattedDuration,
            Ended: false,
            HostedBy: interaction.user.id,
            Prize: prize,
            Winners: winners,
            Paused: false,
            MessageID: message.id,
            Entered: []
        }).then((data) => {
            setTimeout(async () => {
                if (!data.Ended) endGiveaway(message);
            }, duration);
        });
    });

});