/*
 * @Author: AngelaDaddy 
 * @Date: 2018-02-03 13:20:04 
 * @Last Modified by: AngelaDaddy
 * @Last Modified time: 2018-02-03 13:46:49
 * @Description: Theme领域类

  */


const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Theme = new Schema({
    name: String,
    image: String,
    username: String,   
    description: String,//可随意添加字段
    classification: String,
    price: Number
});

module.exports = mongoose.model('Theme', Theme)



