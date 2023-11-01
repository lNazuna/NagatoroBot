const { Client, Collection } = require("discord.js")
const configuration = require("../../config.js")
const { catchErrors } = require("../functions/catchError.js")
const { loadEvents } = require("../functions/eventLoader.js")
const { loadCommands } = require("../functions/commandLoader.js")
const { Logger } = require("./Logger.js")
const mongoose = require("mongoose")

class CustomClient extends Client {

    config = configuration
    commands = new Collection()
    logger = new Logger()

    start() {

        catchErrors(this)
        loadEvents(this)

        const token = this.config.devBotEnabled ? this.config.dev.token : this.config.prod.token
        const databaseURL = this.config.devBotEnabled ? this.config.dev.db : this.config.prod.db

        this.login(token)
            .then(() => {

                this.logger.info("System", `Logado com sucesso em : ${this.logger.highlight(this.user.tag)}`)

                loadCommands(this)

                mongoose.set("strictQuery", false)

                mongoose.connect(databaseURL)
                    .then(data => {
                        this.logger.info("Database", "Conectado a: " + this.logger.highlight(data.connection.name))
                    })
                    .catch(err => {
                        this.logger.error("Database", "Erro ao conectar ao banco de dados!")
                    })

            })
            .catch(err =>
                this.logger.error("System", "Erro ao registrar no bot: " + this.logger.highlight(err))
            )

    }

}

module.exports = { CustomClient }