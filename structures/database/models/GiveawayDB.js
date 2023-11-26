const { Schema, model } = require("mongoose");

const GiveawayDatabase = new Schema({
    GuildID: String,
    ChannelID: String,
    MessageID: String,
    Winners: Number,
    Level: Number,
    Prize: String,
    EndTime: String,
    Paused: Boolean,
    Ended: Boolean,
    HostedBy: String,
    Entered: [String]
});

module.exports = model("Giveaway", GiveawayDatabase);