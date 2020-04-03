const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
    name: [{ any: Array }],
    teacher: [{ any: Array }],
    day: String,
    time: [{ any: Array }]
});

module.exports = mongoose.model('class', courseSchema);