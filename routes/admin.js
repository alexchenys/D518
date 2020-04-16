const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const mongoose = require('mongoose')

const classInfo = require('../models/classInfo.js')
const studentList = require('../models/studentList.js')
router.get('/',function(req, res){
    res.render('admin/index')
})

router.post('/',urlencodedParser, function(req, res){
    console.log('trigger');
    const class_info = new classInfo({
        _id: new mongoose.Types.ObjectId(),
        classId: "CS0450 ",
        className: "行動網路實務",
        classInstruter: "陳信北",
        day: "Mon",
        //time1: "13:00:00",
        //time2: "15:45:00"
    })

    class_info.save().catch(err => console.log(err))
})
router.post('/studentList', urlencodedParser, function(req, res){
    console.log('trigger studentList');
    const student_List = new studentList({
        _id: new mongoose.Types.ObjectId(),
        classID: 'CS0337',
        marjor: "資工系",
        grade: "三年級",
        stu_id: "b10613001",
        stu_name: "魯大德"
    })

    student_List.save().catch(err => console.log(err))
})



module.exports = router