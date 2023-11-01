const { loadFiles } = require("./fileLoader")

async function loadEvents(client) {

    let loaded = 0
    let failed = 0

    const files = await loadFiles("events")

    files.forEach(file => {

        const event = require(file)
        if (!event.name) return failed++

        if (event.once) client.once(event.name, (...args) => event.execute(...args, client))
        else client.on(event.name, (...args) => event.execute(...args, client))

        loaded++

    })

    if (loaded !== 0) client.logger.info("System", "Eventos Carregados: " + client.logger.highlight(loaded))
    if (failed !== 0) client.logger.info("System", "Falha ao carregar eventos: " + client.logger.highlight(failed))

}

module.exports = { loadEvents }