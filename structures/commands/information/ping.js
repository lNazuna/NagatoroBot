const { Client, Message } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Obtenha o ping do bot",
    aliases: ["p"],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */
    run: async (client, message) => {
        return message.reply(`Pong! ${client.ws.ping}ms`)
    }
}