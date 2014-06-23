var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    userid: ObjectId,
    name: String,
    password: String
});

module.exports = mongoose.model('User', UserSchema);