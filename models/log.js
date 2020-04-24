const mongoose = require('mongoose');
const log = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: {type: String, require: true},
    time: {type: String, require: true},
    username: {type: String, required: true},
    ip: {type: String, require: true},
    status: {type: String, require: true},
})
module.exports = mongoose.model('log', log);