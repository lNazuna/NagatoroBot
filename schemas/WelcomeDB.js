const {model, Schema} = require('mongoose');

let WelcomeSchema = new Schema({
    guildid: String,
    channel: String,
    message: String,
});

module.exports = model('Welcome', WelcomeSchema); 