const { loadFiles } = require("./fileLoader")

async function loadCommands(client) {

    const { commands, config, application, guilds } = client

    commands.clear()

    let loaded = 0
    let failed = 0
    let commandsArray = []

    const files = await loadFiles("commands")

    files.forEach(file => {

        const command = require(file)
        if (!command.data.name) return failed++

        commands.set(command.data.name, command)
        commandsArray.push(command.data.toJSON())

        loaded++

    })

    if (loaded !== 0) client.logger.info("System", "Comandos Carregados: " + client.logger.highlight(loaded))
    if (failed !== 0) client.logger.info("System", "Falha ao carregar comandos: " + client.logger.highlight(failed))

    if (config.devBotEnabled === false) {

        application.commands.set(commandsArray)

    } else {

        config.guilds.dev.forEach((guildId) => {

            const guild = guilds.cache.get(guildId)
            if (!guild) return

            guild.commands.set(commandsArray)

        })

    }

}

module.exports = { loadCommands }