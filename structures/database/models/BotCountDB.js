const {model, Schema} = require('mongoose');

let BotCountSchema = new Schema({
    Guild: String,
    BotChannel: String,
});

module.exports = model('botcount', BotCountSchema); 