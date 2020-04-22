const mongoose = require('mongoose');
const teacher = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: true},
    password: {type: String, require: true},
    name: {type: String, require: true},
    course: {type: Array, required: true},
})
module.exports = mongoose.model('teacher', teacher);