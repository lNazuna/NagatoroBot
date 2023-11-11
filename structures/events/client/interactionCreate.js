const { PermissionsBitField } = require("discord.js");
const client = require("../../Client");
const { developers } = require("../../configuration/index")

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    try {
        const command = client.slashCommands.get(interaction.commandName)

        const player = client.riffy.players.get(interaction.guildId);
        const memberChannel = interaction.member.voice.channelId
        const clientChannel = interaction.guild.members.me.voice.channelId;

        if (!command) {
            return interaction.reply({
                content: `${interaction.commandName} não é um comando válido`,
                ephemeral: true,
            });
        }

        if (command.developerOnly) {
            if (!developers.includes(interaction.user.id)) {
                return interaction.reply({
                    content: `${interaction.commandName} é um comando exclusivo para desenvolvedores`,
                    ephemeral: true,
                });
            }
        }

        if (command.userPermissions) {
            if (!interaction.channel.permissionsFor(interaction.member).has(PermissionsBitField.resolve(command.userPermissions || []))) {
                return interaction.reply({
                    content: `Você não tem as permissões necessárias para usar este comando. Você precisa das seguintes permissões: ${command.userPermissions.join(", ")}`,
                    ephemeral: true,
                });
            }
        }

        if (command.clientPermissions) {
            console.log(command.clientPermissions)
            if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.resolve(command.clientPermissions || []))) {
                return interaction.reply({
                    content: `Não tenho as permissões necessárias para usar este comando. Preciso das seguintes permissões: ${command.clientPermissions.join(", ")}`,
                    ephemeral: true,
                });
            }
        }

        if (command.guildOnly && !interaction.guildId) {
            return interaction.reply({
                content: `${interaction.commandName} é um comando exclusivo do servidor do meu criador`,
                ephemeral: true,
            });
        }

        if (command.inVoice && !memberChannel) {
            if (!memberChannel) {
                return interaction.reply({
                    content: `:x: Você deve estar em um canal de voz para usar este comando.`,
                    ephemeral: true,
                });
            }
        }

        if (command.sameVoice && memberChannel !== clientChannel) {
            return interaction.reply({
                content: `:x: Você deve estar no mesmo canal de voz que eu para usar este comando.`,
                ephemeral: true,
            });
        }

        if (command.player && !player) {
            return interaction.reply({
                content: `:x: Nenhuma música está sendo reproduzida no momento.`,
                ephemeral: true,
            });
        }

        if (command.current && !player.current) {
            return interaction.reply({
                content: `:x: Não estou tocando nada agora.`,
                ephemeral: true,
            });
        }

        await command.run(client, interaction, interaction.options);
    } catch (err) {
        console.log("\n🟥 Ocorreu um erro ao processar um Slash Command:");
        console.log(err);

        return interaction.reply({
            content: `:x: Ocorreu um erro ao processar um Slash Command: ${err}`,
            ephemeral: true,
        });
    }
});