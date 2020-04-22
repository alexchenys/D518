const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const mongoose = require('mongoose')
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var url = "mongodb://127.0.0.1:27017/lab_system";
const classInfo = require('../models/classInfo.js')
const studentList = require('../models/studentList.js')
const news = require('../models/new.js');
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

router.get('/',function(req, res){
    res.render('admin/login',{layout: 'layouts/dev_layout.ejs'})
})
router.post('/', urlencodedParser, function(req, res){
    if (req.body.username === 'admin' && req.body.password === '123') {
        res.redirect('admin/dashboard/home')
    }
})
router.get('/dashboard/home', function(req, res){
    res.render('admin/index',{layout: 'layouts/admin_layout.ejs'})
})
router.get('/dashboard/info', function(req, res){
    res.render('admin/info',{layout: 'layouts/admin_layout.ejs'})
})
router.post('/dashboard/info', function(req, res){
    var name = req.body.name
    var id = req.body.id
    var classList = []
    var className =  Object.values(req.body)
    console.log(className)
    for (let i = 2, k = 0; i < className.length; i=i+2, k++) {
        classList[k] = [className[i], className[i+1]]
    }
    console.log(classList)

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("lab_system");
        var myobj = { username: id, password: "111", name: name, course: classList};
        dbo.collection("teacher").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
      });
      res.redirect('info')
})
router.get('/dashboard/classinfo', function(req, res){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("lab_system");
        dbo.collection("teacher").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.render('admin/classinfo',{layout: 'layouts/admin_layout.ejs', data: result})

            db.close();
        });
    });
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
router.post('/addinfo',urlencodedParser, function(req, res){
    
    console.log('trigger');
    const class_info = new classInfo({
        _id: new mongoose.Types.ObjectId(),
        classId: req.body.classId,
        className: req.body.className,
        classInstruter: req.body.classInstruter,
        day: req.body.day,
        time1: req.body.time1,
        time2: req.body.time2
    })
    res.redirect('dashboard/classinfo')
    class_info.save().catch(err => console.log(err))
})
router.post('/deletecourse',urlencodedParser, function(req, res){
    classInfo.remove({classId:req.body.deleteId})
    .exec()
    res.redirect('dashboard/classinfo')
})
router.get('/dashboard/new', function(req, res){
    res.render('admin/new',{layout: 'layouts/admin_layout.ejs'})
})
router.post('/new', function(req, res){
    const myNews = new news({
        id: getRandomInt(100000),
        author: '系統管理員',
        title: req.body.title,
        text: req.body.text,
        day: moment().subtract(10, 'days').calendar()
    })
    myNews.save().catch(err=>console.log(err))
    res.redirect('dashboard/new')
})
router.post('/dashboard/del', function(req, res){
    console.log('trigger')
    news.remove({id:req.body.del}).exec()
    res.render('admin/new',{layout: 'layouts/admin_layout.ejs'})
})



module.exports = router