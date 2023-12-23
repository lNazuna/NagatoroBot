const { readdirSync } = require("fs");
const { REST, Routes, Client, Collection, EmbedBuilder, Colors } = require('discord.js');
const { clientId, clientToken, nodes, spotifyID, SpotifySecret, logsError, database } = require("./configuration/index");
const { Riffy } = require("riffy")
const { Spotify } = require("riffy-spotify")

const client = new Client({
    intents: [
        "Guilds",
        "GuildMembers",
        "GuildMessages",
        "MessageContent",
        "GuildVoiceStates",
        "GuildModeration",
        "GuildEmojisAndStickers",
        "GuildIntegrations",
        "GuildWebhooks",
        "GuildInvites",
        "GuildPresences",
        "GuildMessageReactions",
        "GuildMessageTyping",
        "DirectMessages",
        "DirectMessageReactions",
        "DirectMessageTyping"
    ],
    partials: [
        "Channel",
        "Message",
        "Reaction"
    ]
});

client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();

const spotify = new Spotify({
    clientId: spotifyID,
    clientSecret: SpotifySecret
});

client.riffy = new Riffy(client, nodes, {
    send: (payload) => {
        const guild = client.guilds.cache.get(payload.d.guild_id);
        if (guild) guild.shard.send(payload);
    },
    defaultSearchPlatform: "ytmsearch",
    restVersion: "v4",
    plugins: [spotify]
});

module.exports = client;

if (database) {
    require("./database/connect").connect()
}

(async () => {
    await loadCommands();
    await loadEvents();
    await loadSlashCommands();
    await catchErrors();
    await loadRiffy();
})()

client.login(clientToken).catch((error) => {
    console.log("\n🟥 Não foi possível fazer login no bot. Por favor, verifique o arquivo de configuração.")
    console.log(error)
    return process.exit()
})

async function loadRiffy() {
    console.log("\n🟦 Carregando eventos de riffy...")

    readdirSync('./structures/riffy/').forEach(async dir => {
        const lavalink = readdirSync(`./structures/riffy/${dir}`).filter(file => file.endsWith('.js'));

        for (let file of lavalink) {
            try {
                let pull = require(`./riffy/${dir}/${file}`);

                if (pull.name && typeof pull.name !== 'string') {
                    console.log(`🟥 Não foi possível carregar o evento riffy ${file}, erro: o evento de propriedade deveria ser string.`)
                    continue;
                }

                pull.name = pull.name || file.replace('.js', '');

                console.log(`🟩 Evento de riffy carregado: ${pull.name}`)
            } catch (err) {
                console.log(`🟥 Não foi possível carregar o evento riffy ${file}, erro: ${err}`)
                console.log(err)
                continue;
            }
        }
    })
}

async function loadCommands() {
    console.log("🟦 arregando comandos...")

    readdirSync('./structures/commands/').forEach(dir => {
        const commands = readdirSync(`./structures/commands/${dir}`).filter(file => file.endsWith('.js'));

        for (const file of commands) {
            const pull = require(`./commands/${dir}/${file}`);

            try {
                if (!pull.name || !pull.description) {
                    console.log(`🟥 Não foi possível carregar o comando ${file}, erro: falta um name, description ou function`)
                    continue;
                }

                pull.category = dir;
                client.commands.set(pull.name, pull);

                console.log(`🟩 Comando carregado : ${pull.name}`);
            } catch (err) {
                console.log(`🟥 ão foi possível carregar o comando ${file}, erro: ${err}`)
                continue;
            }


            if (pull.aliases && Array.isArray(pull.aliases)) {
                pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
            }
        }
    })
}

async function loadEvents() {
    console.log("\n🟦 Carregando eventos...")

    readdirSync('./structures/events/').forEach(async (dir) => {
        const events = readdirSync(`./structures/events/${dir}`).filter((file) => file.endsWith(".js"));

        for (const file of events) {
            const pull = require(`./events/${dir}/${file}`);

            try {
                if (pull.name && typeof pull.name !== 'string') {
                    console.log(`🟥 Não foi possível carregar o evento lavalink ${file}, erro: o evento de propriedade deveria ser string.`)
                    continue;
                }

                pull.name = pull.name || file.replace('.js', '');

                console.log(`🟩 Evento carregado: ${pull.name}`);
            } catch (err) {
                console.log(`🟥 Não foi possível carregar o evento  ${file}, error: ${err}`)
                continue;
            }
        }
    });
}

async function loadSlashCommands() {
    console.log("\n🟦 Carregando Slash Commands ...")
    const slash = [];

    readdirSync('./structures/slashcommands/').forEach(async (dir) => {
        const commands = readdirSync(`./structures/slashcommands/${dir}`).filter((file) => file.endsWith(".js"));

        for (const file of commands) {
            const pull = require(`./slashcommands/${dir}/${file}`);

            try {
                if (!pull.name || !pull.description) {
                    console.log(`🟥 Não foi possível carregar Slash Commands ${file}, erro: falta um name, description ou function.`)
                    continue;
                }

                const data = {};
                for (const key in pull) {
                    data[key.toLowerCase()] = pull[key];
                }

                slash.push(data);

                pull.category = dir;
                client.slashCommands.set(pull.name, pull);

                console.log(`🟩 Slash Command carregado: ${pull.name}`);
            } catch (err) {
                console.log(`🟥 Não foi possível carregar Slash Commands ${file}, erro: ${err}`)
                continue;
            }
        }
    })

    if (!clientId) {
        console.log("🟥 Não foi possível encontrar o clientID no arquivo de configuração")
        return process.exit()
    }

    const rest = new REST({ version: '10' }).setToken(clientToken);

    try {
        await rest.put(Routes.applicationCommands(clientId), { body: slash }).then(() => {
            console.log("\n🟩 Comandos de aplicativo registrados com sucesso.")
        })
    } catch (error) {
        console.log("\n🟥 Não foi possível registrar comandos do aplicativo.")
        console.log(error);
    }
}

function catchErrors() {

    const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTimestamp()

    const logsChannelId = logsError

    process
        .on("uncaughtException", async (err) => {

            console.log(`\n🟥 Uncaught Exception : ${err}`)

            client.channels.fetch(logsChannelId).then(channel => {

                if (!channel) return

                channel.send({
                    embeds: [
                        embed
                            .setTitle("`⚠` | Uncaught Exception/Catch")
                            .setDescription([
                                "```" + err.stack + "```"
                            ].join("\n"))
                    ]
                })

            }).catch(err => { return })

        })
        .on("uncaughtExceptionMonitor", async (err) => {

            console.log(`\n🟥 Uncaught Exception (Monitor) : ${err}`)

            client.channels.fetch(logsChannelId).then(channel => {

                if (!channel) return

                channel.send({
                    embeds: [
                        embed
                            .setTitle("`⚠` | Uncaught Exception/Catch (MONITOR)")
                            .setDescription([
                                "```" + err.stack + "```"
                            ].join("\n"))
                    ]
                })

            }).catch(err => { return })

        })
        .on("unhandledRejection", async (reason) => {

            console.log(`\n🟥 Unhandled Rejection/Catch : ${reason}`)

            client.channels.fetch(logsChannelId).then(channel => {

                if (!channel) return

                channel.send({
                    embeds: [
                        embed
                            .setTitle("`⚠` | Unhandled Rejection/Catch")
                            .setDescription([
                                "```" + reason.stack + "```"
                            ].join("\n"))
                    ]
                })

            }).catch(err => { return })

        })

}