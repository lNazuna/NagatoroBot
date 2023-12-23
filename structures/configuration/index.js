module.exports = {
    clientToken: "", //token do bot
    clientId: "", // id do bot
    clientPrefix: "", // prefix
    mongodbURL: "", // https://account.mongodb.com/account/login
    logsGeral: "", // adicionar id do canal para onde o bot vai enviar as logs caso que queira que o bot envie logs pode deixar esse campo em branco
    logsMod: "", // adicionar id do canal para onde o bot vai enviar as logs de Mderação caso que queira que o bot envie logs pode deixar esse campo em branco
    logsError: "", // id do canal para onde o bot enviar as logs de erros
    logsNode: "", // id do canal para onde o bot envia as logs do node (Lavalink)
    youtubeDownnloadKey: "", // Key para poder fazer download dos videos em mp4 do yotube. para obter a key acesse aqui https://rapidapi.com/ytjar/api/youtube-video-download-info/
    developers: [""], // id do owner
    spotifyID: "", // https://developer.spotify.com/
    SpotifySecret: "", // https://developer.spotify.com/
    nodes: [
        {
            host: "193.70.81.163",
            port: 50010,
            name: 'LavaLink 1',
            password: "nagatoroLavaLink#@#@",
            secure: false
        }
    ],
    database: true, // marcar true para ativar a database / marcar false para desativar a database
}