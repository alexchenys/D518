const mongoose = require('mongoose');
const report = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id:{type: String, required: true},
    date: {type: String, require: true},
    name: {type: String, required: true},
    report: {type: String, required: true},
    pcid: {type: String, required: true}
})
module.exports = mongoose.model('report', report);