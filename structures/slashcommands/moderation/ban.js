const { Client, CommandInteraction, ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const ms = require("ms")
const { editReply } = require("../../systems/editReply")
const { logsMod } = require("../../configuration/index")

module.exports = {
    name: 'banir',
    description: 'Bane permanentemente um membro do servidor',
    userPermissions: ["BanMembers"],
    options: [
        {
            name: "usuário",
            description: "Selecione o usuário a ser banido",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "razão",
            description: "Forneça o motivo do banimento",
            type: ApplicationCommandOptionType.String,
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

        const member = options.getMember("usuário")
        const reason = options.getString("razão") || "Nenhuma razão fornecida"

        if (member.id === user.id) return editReply(interaction, "❌", "Você não pode se banir")
        
        if (guild.ownerId === member.id) return editReply(interaction, "❌", "Você não pode banir o dono do servidor!")

        if (guild.members.me.roles.highest.position <= member.roles.highest.position) return editReply(interaction, "❌", "Você não pode banir um membro do seu cargo ou superior!")

        if (interaction.member.roles.highest.position <= member.roles.highest.position) return editReply(interaction, "❌", "Não consigo executar este comando, por favor, mova-me mais alto do que os outros membros em \`CARGOS\`!")

        const Embed = new EmbedBuilder()
            .setColor("#c5a0c1")

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("ban-yes")
                .setLabel("Sim"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("ban-no")
                .setLabel("Não")

        )

        const Page = await interaction.editReply({

            embeds: [
                Embed.setDescription("**⚠ | Você realmente quer banir este membro?**")
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

                case "ban-yes": {

                    member.ban({ 
                      reason: reason,
                      deleteMessageSeconds: 86400,
                     })

                    interaction.editReply({
                        embeds: [
                            Embed
                            .setDescription(`‼ | ${member.user.username} foi banido`)
                            .addFields(
                                { name: "Usuário", value: `${member.user.username}`, inline: true },
                                { name: "Razão", value: `\`\`\`${reason || "Nenhuma razão fornecida"}\`\`\``, inline: false },
                            )
                        ],
                        components: []
                    })

                    console.log(`${user.tag} (${user.id}) has banned ${member.user.tag} (${member.user.id}) from ${guild.name} (${guild.id})`)

                    if (!logsMod) return

                    if (logsMod &&
                      interaction.guild.members.me
                        .permissionsIn(logsMod)
                        .has(["EmbedLinks", "SendMessages", "ViewChannel"])) {
                      const channel = interaction.guild.channels.cache.get(logsMod);
              
                      if (channel) {
                        channel.send({
                          embeds: [
                            new EmbedBuilder()
                              .setColor("Red")
                              .setThumbnail(guild.iconURL())
                              .setTitle(`${member.user.username} foi banido!`)
                              .addFields(
                                { name: "Usuário Banido", value: `${member.user.tag}`, inline: true },
                                { name: "ID do Usuário Banido", value: `${member.user.id}`, inline: true },
                                { name: "Banido por", value: `${user.tag}`, inline: true },
                                { name: "Banido em", value: new Date().toLocaleString(), inline: true },
                                { name: "Razão", value: `\`\`\`${reason || "Nenhuma razão fornecida"}\`\`\``, inline: false },
                            )
                          ],
                        });
                      }
                    }

                }
                    break;

                case "ban-no": {

                    interaction.editReply({
                        embeds: [
                            Embed.setDescription("<a:right:1021723073487052810> | Pedido de ban cancelado")
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