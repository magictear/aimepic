const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')
const User = new Schema({
    username: String,
    password: String,
    gender: Boolean//可随意添加字段
});
User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User)