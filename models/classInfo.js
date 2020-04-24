const mongoose = require('mongoose')
const classSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    classId: {type: String, required: true},
    className: {type: String, required: true},
    classInstruter: {type: String, required: true},
    year: {type: String, required: true},
    day: {type: String, required: true},
    class1: {type: String, require: true},
    class2: {type: String, require: true},
    time1: {type: String, require: true},
    time2: {type: String, require: true},
    garde: {type: String, require: true},
})

module.exports = mongoose.model('classInfo', classSchema);