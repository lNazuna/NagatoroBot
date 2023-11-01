const { EmbedBuilder, Colors } = require("discord.js")

function catchErrors(client) {

    const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTimestamp()

    const logsChannelId = client.config.devBotEnabled ? client.config.dev.logs : client.config.prod.logs

    process
        .on("uncaughtException", async (err) => {

            client.logger.error("System", `Uncaught Exception : ${err}`);

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

            client.logger.error("System", `Uncaught Exception (Monitor) : ${err}`);

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

            client.logger.error("System", `Unhandled Rejection/Catch : ${reason}`);

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

module.exports = { catchErrors }