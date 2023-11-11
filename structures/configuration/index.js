module.exports = {
    clientToken: "", //token do bot
    clientId: "", // id do bot
    clientPrefix: "!", // prefix
    mongodbURL: "", // https://account.mongodb.com/account/login
    logsError: "", // id do canal para onde o bot enviar as logs de erros
    logsNode: "", // id do canal para onde o bot envia as logs do node (Lavalink)
    developers: [""], // id do owner
    spotifyID: "", // https://developer.spotify.com/
    SpotifySecret: "", // https://developer.spotify.com/
    nodes: [
        {
            host: "n1.ll.darrennathanael.com",
            port: 2269,
            name: 'LavaLink 1',
            password: "glasshost1984",
            secure: false
        }
    ],
    database: true, // marcar true para aticar a database / marcar false para desativar a database
}