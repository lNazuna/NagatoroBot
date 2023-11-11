const {model, Schema} = require('mongoose');

let MemberCountSchema = new Schema({
    Guild: String,
    MemberChannel: String,
});

module.exports = model('membercount', MemberCountSchema); 