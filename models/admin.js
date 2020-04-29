const mongoose = require('mongoose');
const admin = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sid: {type: String, required: true},
    name: {type: String, require: true},
})
module.exports = mongoose.model('admin', admin);