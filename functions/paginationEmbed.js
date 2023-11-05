const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ComponentType, ButtonStyle } = require("discord.js");
const ms = require("ms");

/**
 * 
 * @param {import("discord.js").CommandInteraction} interaction 
 * @param {EmbedBuilder[]} embeds 
 * @param {string} timeout 
 * @param {boolean} ephemeral 
 * @param {"reply" | "followUp" | "editReply"} type? 
 * @returns {void}
 */
module.exports = async (interaction, embeds, timeout = "60s", ephemeral = false, type = "followUp") => {
	if (!embeds.length) {
		return interaction[type]({
			embeds: [
				new EmbedBuilder()
					.setTitle("No embeds detected.")
					.setDescription("We have not found any embed to show you, if you think it is an error, contact the developer.")
					.setColor("Red")
			],
			ephemeral
		});
	}

	if (embeds.length === 1) {
		return interaction[type]({ embeds, ephemeral });
	}

	let current = 0;
	const emojis = ["⏪", "Previous", "Next", "⏩"];
	const row = (state) => [
		new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setEmoji(emojis[0])
				.setDisabled(state)
				.setStyle(ButtonStyle.Secondary)
				.setCustomId("btn1"),
			new ButtonBuilder()
				.setLabel(emojis[1])
				.setDisabled(state)
				.setStyle(ButtonStyle.Primary)
				.setCustomId("btn2"),
			new ButtonBuilder()
				.setLabel("Delete")
				.setDisabled(state)
				.setStyle(ButtonStyle.Danger)
				.setCustomId("btnx"),
			new ButtonBuilder()
				.setLabel(emojis[2])
				.setDisabled(state)
				.setStyle(ButtonStyle.Primary)
				.setCustomId("btn3"),
			new ButtonBuilder()
				.setEmoji(emojis[3])
				.setDisabled(state)
				.setStyle(ButtonStyle.Secondary)
				.setCustomId("btn4")
		)
	];

	const curPage = await interaction[type]({
		embeds: [embeds[current]],
		components: row(false),
		fetchReply: true,
		ephemeral,
	}).catch((x) => { throw x; });

	const collector = curPage.createMessageComponentCollector({
		filter: (m) => m.user.id === interaction.member.id,
		componentType: ComponentType.Button,
		time: ms(timeout)
	});

	collector.on("collect", async (collected) => {
		collector.resetTimer();
		if (collected.customId === "btn1") current = 0;
		else if (collected.customId === "btn2") current--;
		else if (collected.customId === "btn3") current++;
		else if (collected.customId === "btn4") current = embeds.length - 1;
		else if (collected.customId === "btnx") collector.stop();

		if (current < 0) current = 0;
		if (current >= embeds.length) current = embeds.length - 1;

		const data = {
			embeds: [embeds[current]],
			ephemeral
		};
		if (ephemeral) interaction.editReply(data).catch(() => { });
		else curPage.edit(data).catch(() => { });

		collected.deferUpdate();
	});

	collector.on("end", async () => {
		const data = {
			embeds: [embeds[current].setColor("Red")],
			components: row(true),
			ephemeral
		};

		if (ephemeral) interaction.editReply(data).catch(() => { });
		else curPage.edit(data).catch(() => { });
	});
};