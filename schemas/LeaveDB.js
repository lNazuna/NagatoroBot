const {model, Schema} = require('mongoose');

let LeaveSchema = new Schema({
    guildid: String,
    channel: String,
    message: String,
});

module.exports = model('Leave', LeaveSchema); 