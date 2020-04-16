const mongoose = require('mongoose');
const listSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    classID: {type: String, required: true},
    marjor: {type: String, require: true},
    grade: {type: String, require: true},
    stu_id: {type: String, required: true},
    stu_name: {type: String, required: true},
})

module.exports = mongoose.model('listSchema', listSchema);