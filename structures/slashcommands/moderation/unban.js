const { Client, CommandInteraction, ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const ms = require("ms")
const { editReply } = require("../../systems/editReply")

module.exports = {
    name: 'desbanir',
    description: 'Remove o banimento de um membro',
    userPermissions: ["BanMembers"],
    options: [
        {
            name: "usuário-id",
            description: "Forneça um ID de usuário",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     * @returns 
     */
    run: async (client, interaction, args) => {

        await interaction.deferReply({ ephemeral: true })

        const { options, user, guild } = interaction

        const id = options.getString("usuário-id")
        if (isNaN(id)) return editReply(interaction, "❌", "Forneça um ID válido em números!")

        const bannedMembers = await guild.bans.fetch()
        if (!bannedMembers.find(x => x.user.id === id)) return editReply(interaction, "❌", "Este usuário não foi banido!")

        const Embed = new EmbedBuilder()
            .setColor("#c5a0c1")

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("unbanyes")
                .setLabel("Sim"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("unbanno")
                .setLabel("Não")

        )

        const Page = await interaction.editReply({

            embeds: [
                Embed.setDescription("**⚠️ | Você realmente deseja desbanir este membro?**")
            ],
            components: [row]

        })

        const col = await Page.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: ms("15s"),
        })

        col.on("collect", i => {

            if (i.user.id !== user.id) return

            switch (i.customId) {

                case "unbanyes": {

                    guild.members.unban(id)

                    interaction.editReply({
                        embeds: [
                            Embed.setDescription("‼ | O usuário foi desbanido")
                        ],
                        components: []
                    })

                    console.log(`${user.tag} (${user.id}) has unbanned ${id} from ${guild.name} (${guild.id})`)

                }
                    break;

                case "unbanno": {

                    interaction.editReply({
                        embeds: [
                            Embed.setDescription("<a:right:1021723073487052810> | Pedido de desbanimento cancelado")
                        ],
                        components: []
                    })

                }
                    break;

            }

        })

        col.on("end", (collected) => {

            if (collected.size > 0) return

            interaction.editReply({
                embeds: [
                    Embed.setDescription("\`❌\` | Você não respondeu a tempo!")
                ],
                components: []
            })

        })

    },
};