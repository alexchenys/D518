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
const studentApi = require('../models/studentApi')
const mylog = require('../models/log')
const reportApi = require('../models/report.js')
var sys = require('sys');
const { exec } = require("child_process");
var date=new Date().getDate();
var month=new Date().getMonth();
var year=new Date().getFullYear();
var output='./public/backup/';
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

router.get('/',function(req, res){
    res.render('admin/login',{layout: 'layouts/dev_layout.ejs'})
})
router.post('/', urlencodedParser, function(req, res){
    const log = new mylog({
        _id: new mongoose.Types.ObjectId(),
        date: moment().format('L'),
        time: moment().format('LTS'),
        username: req.body.username,
        ip: req.connection.remoteAddress,
        status: 'success',
    })
    if (req.body.username === 'admin' && req.body.password === '123') {
        console.log('trigger')
        log.save().catch(err=>console.log(err))
        res.redirect('admin/dashboard/home')
    } else {
        const logF = new mylog({
            _id: new mongoose.Types.ObjectId(),
            date: moment().format('L'),
            time: moment().format('LTS'),
            username: req.body.username,
            ip: req.connection.remoteAddress,
            status: 'fault',
        })
        logF.save().catch(err=>console.log(err))
        res.redirect('admin')
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
    
    console.log(req.body.class2);
    const class_info = new classInfo({
        _id: new mongoose.Types.ObjectId(),
        classId: req.body.classId,
        className: req.body.className,
        classInstruter: req.body.classInstruter,
        day: req.body.day,
        year: req.body.year,
        class1: req.body.class1,
        class2: req.body.class2,
        grade: req.body.grade,
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
router.get('/dashboard/record_search', function(req, res){
    res.render('admin/record_search',{layout: 'layouts/admin_layout.ejs'})
})
router.post('/dashboard/record', function(req, res){
    var courseId =  req.body.courseId
    var mydate =  req.body.date
    studentApi.find({class:courseId, date:mydate}).exec()
    .then(function(myList){
        //console.log(myList);
        res.render('admin/print', {layout: 'layouts/dev_layout', list:myList, id:courseId, date:mydate})
    })
})
router.get('/dashboard/log', function(req, res){
    res.render('admin/log', {layout: 'layouts/admin_layout.ejs'})
    //console.log(req.connection.remoteAddress)
})
router.get('/dashboard/backup', function(req, res){
    res.render('admin/backup', {layout: 'layouts/admin_layout.ejs'})
})
router.post('/backup', function(req, res){
    exec('mongodump --db lab_system --out '+output+year + '-' + month + '-' + date, function (err, res) {
        //console.log(res)
        console.log('Dump taken on '+ year+'-'+month+'-'+date)
    })
    res.redirect('dashboard/backup')
})
router.get('/dashboard/report', function(req, res){
    res.render('admin/report', {layout: 'layouts/admin_layout.ejs'})
})
router.post('/dashboard/adminreport',urlencodedParser, function(req, res){
    const report = new reportApi({
        _id: new mongoose.Types.ObjectId(),
        id: getRandomInt(100000),
        date: moment().format('L'),
        name: 'admin',
        pcid : req.body.pcid,
        report: req.body.report
    })
    report.save()
    res.redirect('report')
})
router.get('/report/:id', function(req, res){
    reportApi.find({id:req.params.id}).exec()
    .then(function(myList){
        res.render('admin/device',{layout:'layouts/dev_layout', data: myList})
    })  

})
router.post('/dashboard/delete', urlencodedParser, function(req, res){
    var delete_list = req.body.delete

    console.log("dele: " + delete_list)
    if(typeof delete_list === "string"){
        reportApi.remove({id: delete_list}).exec()
    } else {
        for (let i = 0; i < delete_list.length; i++) {
            reportApi.deleteOne({id: delete_list[i]}).exec()
        }
    }
    //res.send('aaa')
    res.redirect('report')
})
router.get('/dashboard/board', function(req, res){
    res.render('admin/social', {layout: 'layouts/admin_layout.ejs'})
})
module.exports = router