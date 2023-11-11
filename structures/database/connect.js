const mongoose = require('mongoose');
const { mongodbURL } = require("../configuration/index");

async function connect() {
    mongoose.set('strictQuery', true)

    mongoose.connect(mongodbURL);

    mongoose.connection.once("open", () => {
        console.log("🟩 Conectado ao mongoose");
    });

    mongoose.connection.on("error", (error) => {
        console.log(`🟥 Erro de conexão do MongoDB: ${error}`);
    })

    return;
}

module.exports = { connect };