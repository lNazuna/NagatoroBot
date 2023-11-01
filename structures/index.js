const { GatewayIntentBits, Partials } = require("discord.js")
const { CustomClient } = require("./classes/CustomClient")

const client = new CustomClient({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction
    ]
})

client.start()