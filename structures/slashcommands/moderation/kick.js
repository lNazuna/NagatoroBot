const { Client, CommandInteraction, ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const ms = require("ms")
const { editReply } = require("../../systems/editReply")
const { logsMod } = require("../../configuration/index")

module.exports = {
    name: 'expulsar',
    description: 'Expulsa um membro do servidor',
    userPermissions: ["KickMembers"],
    options: [
        {
            name: "usuário",
            description: "Selecione o usuário a ser expulso",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "razão",
            description: "Forneça o motivo de ter expulso o usuário",
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

        if (member.id === user.id) return editReply(interaction, "❌", "Você não pode expulsar a si mesmo!")

        if (guild.ownerId === member.id) return editReply(interaction, "❌", "Você não pode expulsar o dono do servidor!")
        
        if (guild.members.me.roles.highest.position <= member.roles.highest.position) return editReply(interaction, "❌", "Você não pode expulsar um membro do seu mesmo nível ou superior!")

        if (interaction.member.roles.highest.position <= member.roles.highest.position) return editReply(interaction, "❌", "Não consigo executar este comando, por favor, mova-me mais alto do que os outros membros em \`CARGOS\`!")

        const Embed = new EmbedBuilder()
            .setColor("#c5a0c1")

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("kick-yes")
                .setLabel("Sim"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("kick-no")
                .setLabel("Não")

        )

        const Page = await interaction.editReply({

            embeds: [
                Embed.setDescription("**⚠ | Você realmente quer expulsar este membro?**")
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

                case "kick-yes": {

                    member.kick({ reason })

                    interaction.editReply({
                        embeds: [
                            Embed
                            .setDescription(`‼ | ${member.user.username} foi expulso!`)
                            .addFields(
                                { name: "User", value: `${member.user.username}`, inline: true },
                                { name: "Razão", value: `\`\`\`${reason || "Nenhuma razão fornecida"}\`\`\``, inline: false },
                            )
                        ],
                        components: []
                    })
                    

                    console.log(`${user.tag} (${user.id}) has kicked ${member.user.tag} (${member.user.id}) from ${guild.name} (${guild.id})`)

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
                                .setTitle(`${member.user.username} foi expulso!`)
                                .addFields(
                                  { name: "Usuário Expulso", value: `${member.user.tag}`, inline: true },
                                  { name: "ID do Usuário Expulso", value: `${member.user.id}`, inline: true },
                                  { name: "Expulso por", value: `${user.tag}`, inline: true },
                                  { name: "Expulso em", value: new Date().toLocaleString(), inline: true },
                                  { name: "Razão", value: `\`\`\`${reason || "ma razão fornecida"}\`\`\``, inline: false },
                              )
                            ],
                          });
                        }
                      }

                }
                    break;

                case "kick-no": {

                    interaction.editReply({
                        embeds: [
                            Embed.setDescription("<a:right:1021723073487052810> | Solicitação de expulsar cancelada")
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