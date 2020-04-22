const mongoose = require('mongoose')
const news = mongoose.Schema({
    id:{type: String, required: true},
    author: {type: String, required: true},
    title: {type: String, required: true},
    text: {type: String, required: true},
    day: {type: String, required: true},
})

module.exports = mongoose.model('newDB', news);