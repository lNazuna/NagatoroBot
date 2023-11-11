const client = require("../../Client");
const { PermissionsBitField } = require("discord.js");
const { clientPrefix, developers } = require("../../configuration/index")

client.on("messageCreate", async (message) => {
    try {
        if (message.author.bot || !message.guild || !message.content.startsWith(clientPrefix)) {
            return;
        }

        const args = message.content.slice(clientPrefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) return;

        let command = client.commands.get(cmd)

        const player = client.riffy.players.get(message.guild.id);
        const memberChannel = message.member.voice.channelId
        const clientChannel = message.guild.members.me.voice.channelId;

        if (!command) command = client.commands.get(client.aliases.get(cmd))

        if (command) {
            if (command.developerOnly) {
                if (!developers.includes(message.author.id)) {
                    return message.channel.send(`:x: ${command.name} é um comando exclusivo para desenvolvedores`)
                }
            }

            if (command.userPermissions) {
                if (!message.channel.permissionsFor(message.member).has(PermissionsBitField.resolve(command.userPermissions || []))) {
                    return message.channel.send(`:x: Você não tem as permissões necessárias para usar este comando. Você precisa das seguintes permissões: ${command.userPermissions.join(", ")}`)
                }
            }

            if (command.clientPermissions) {
                if (!message.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.resolve(command.clientPermissions || []))) {
                    return message.channel.send(`:x: Não tenho as permissões necessárias para usar este comando. Eu preciso das seguintes permissões: ${command.clientPermissions.join(", ")}`)
                }
            }

            if (command.guildOnly && !message.guildId) {
                return message.channel.send(`:x: ${command.name} é um comando exclusivo do servidor do meu criador`)
            }

            if (command.inVoice && !memberChannel) {
                if (!memberChannel) {
                    return message.channel.send(`:x: Você deve estar em um canal de voz para usar este comando.`)
                }
            }

            if (command.sameVoice && memberChannel !== clientChannel) {
                return message.channel.send(`:x: Você deve estar no mesmo canal de voz que eu para usar este comando.`)
            }

            if (command.player && !player) {
                return message.channel.send(`:x: Nenhuma música está sendo reproduzida no momento.`)
            }

            if (command.current && !player.current) {
                return message.channel.send(`:x: Não estou tocando nada agora.`)
            }

            if (command) command.run(client, message, args);
        }
    } catch (err) {
        console.log(`🟥 Ocorreu um erro ao executar o evento messageCreate:`)
        console.log(err)

        return message.channel.send(`:x: Ocorreu um erro ao executar o evento messageCreate:\n${err}`)
    }
})