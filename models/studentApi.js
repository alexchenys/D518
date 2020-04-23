const mongoose = require('mongoose')
const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    stu_name: {type: String, required: true},
    stu_id: {type: String, required: true},
    day: {type: String, required: true},
    class: {type: String, required: true},
    picd : {type: String, required: true},
    date: { type: String, required: true }
})

module.exports = mongoose.model('stuSignIn', studentSchema);