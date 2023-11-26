const { ButtonInteraction, EmbedBuilder } = require("discord.js");
const client = require("../../Client");
const DB = require("../../database/models/GiveawayDB");

client.on("interactionCreate", async (interaction) => {

     /**
     * @param {ButtonInteraction} interaction
     */

    if (!interaction.isButton()) return;
    if (interaction.customId !== "giveaway-join") return;

    const embed = new EmbedBuilder();
    const data = await DB.findOne({
        GuildID: interaction.guild.id,
        ChannelID: interaction.channel.id,
        MessageID: interaction.message.id
    });

    if (!data) {
        embed
            .setColor("Red")
            .setDescription("Não há dados no banco de dados");
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (data.Entered.includes(interaction.user.id)) {
        embed
            .setColor("Red")
            .setDescription("Você já participou do sorteio");
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (data.Paused === true) {
        embed
            .setColor("Red")
            .setDescription("Este sorteio está pausado");
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (data.Ended === true) {
        embed
            .setColor("Red")
            .setDescription("ste sorteio terminou");
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await DB.findOneAndUpdate({
        GuildID: interaction.guild.id,
        ChannelID: interaction.channel.id,
        MessageID: interaction.message.id
    }, {
        $push: { Entered: interaction.user.id }
    }).then(() => {
        embed
            .setColor("Green")
            .setDescription("Você se juntou ao sorteio");
        return interaction.reply({ embeds: [embed], ephemeral: true });
    });

});