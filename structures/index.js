const { GatewayIntentBits, Partials } = require("discord.js")
const { CustomClient } = require("./classes/CustomClient")

const { DisTube } = require("distube");
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const client = new CustomClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction
    ]
})

let { readdirSync } = require('fs');
client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: false,
    emitAddSongWhenCreatingQueue: false,
    plugins: [
        new SoundCloudPlugin(),
        new YtDlpPlugin({ update: true })
      ],
  })

  for(const file of readdirSync('structures/distube/')){
    if(file.endsWith('.js')){
      let fileName = file.substring(0, file.length - 3)
      let fileContents = require(`../structures/distube/${file}`)
      client.distube.on(fileName, fileContents.bind(null, client))
    }
  }

client.setMaxListeners(0);
client.start()