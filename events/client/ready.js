const { Events, ActivityType } = require("discord.js")
const { CustomClient } = require("../../structures/classes/CustomClient")
const ms = require("ms")

module.exports = {
    name: Events.ClientReady,

    /**
    * @param {CustomClient} client
    */
    execute(client) {

        const { user } = client

        setInterval(() => {

            user.setActivity({
                name: `Ping : ${client.ws.ping} ms`,
                type: ActivityType.Watching
            })

        }, ms("15s"))

    }
}