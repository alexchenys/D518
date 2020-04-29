const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const mongoose = require('mongoose')
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
const passport = require('passport')
const POP3Strategy = require('passport-pop3')
var url = "mongodb://127.0.0.1:27017/lab_system";
const classInfo = require('../models/classInfo.js')
const studentList = require('../models/studentList.js')
const news = require('../models/new.js');
const studentApi = require('../models/studentApi')
const mylog = require('../models/log')
const reportApi = require('../models/report.js')
const adminAccount = require('../models/admin')
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var sys = require('sys');
const { exec } = require("child_process");

passport.use(new POP3Strategy({
        host: 'mail.uch.edu.tw',
        port: 110,
        enabletls: false,
        usernameField: 'email',
        passwordField: 'passwd',
    }
));
router.use(session({
    secret: '1234',
    store: new MongoStore({url:'mongodb://localhost:27017/sessiondb'}),
    cookie: {maxAge: 600 * 100000}                       
}))

var date=new Date().getDate();
var month=new Date().getMonth();
var year=new Date().getFullYear();
var output='./public/backup/';
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
router.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});
router.get('/',function(req, res){
    var adminData = req.session.adminData;
    res.render('admin/login',{layout: 'layouts/dev_layout.ejs',Data: adminData})
})
router.get('/logout', function(req, res){
    delete req.session.adminData;
    return res.redirect('/');
})
router.post('/', urlencodedParser, function(req, res){
    var username = req.body.email.split('@')
    const log = new mylog({
        _id: new mongoose.Types.ObjectId(),
        date: moment().format('L'),
        time: moment().format('LTS'),
        username: username[0],
        ip: req.connection.remoteAddress,
        status: 'success',
    })
    const logF = new mylog({
        _id: new mongoose.Types.ObjectId(),
        date: moment().format('L'),
        time: moment().format('LTS'),
        username: username[0],
        ip: req.connection.remoteAddress,
        status: 'fault',
    })
    
    adminAccount.findOne({sid: username[0]}).exec()
    .then(function(doc){
        req.session.adminData = doc
        console.log(req.session.adminData)
        if (doc === null) {
            res.redirect('admin')
        } else {
            passport.authenticate('pop3', function(err, user, info){
                if (err){
                    logF.save().catch(err=>console.log(err))
                    res.redirect('admin')
                }
                if (!user){
                    logF.save().catch(err=>console.log(err))
                    res.redirect('admin')
                }
                else { 
                    log.save().catch(err=>console.log(err))
                    res.status(200).redirect('admin/dashboard/home')
                }
            })(req, res)
        }
    })
})
router.get('/dashboard/home', function(req, res){
    var adminData = req.session.adminData;
    if (adminData === undefined) {
        console.log('asdasd')
        res.redirect('/')
    } else {
        res.render('admin/index',{layout: 'layouts/admin_layout.ejs'})
    }
})
router.get('/dashboard/info', function(req, res){
    res.render('admin/info',{layout: 'layouts/admin_layout.ejs'})
})
router.post('/dashboard/info', function(req, res){
    var name = req.body.name
    var id = req.body.id
    var classList = []
    var className =  Object.values(req.body)

    for (let i = 2, k = 0; i < className.length; i=i+2, k++) {
        classList[k] = [className[i], className[i+1]]
    }

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("lab_system");
        var myobj = { username: id, password: "111", name: name, course: classList, super: false};
        dbo.collection("teacher").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
      });
      res.redirect('info')
})
router.post('/dashboard/deleteInfo',urlencodedParser, function(req, res){
    var delete_list = req.body.delete
    if (typeof delete_list === "string") {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("lab_system");
            var myquery = { username: delete_list };
            dbo.collection("teacher").deleteOne(myquery, function(err, obj) {
                if (err) throw err;
                console.log("1 document deleted");
                db.close();
            }); 
        });
    }else {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("lab_system");
            for (let i = 0; i < delete_list.length; i++) {
                var myquery = { username: delete_list[i] };
                dbo.collection("teacher").deleteOne(myquery, function(err, obj) {
                    if (err) throw err;
                    console.log("1 document deleted");
                    db.close();
                }); 
            }
        });
    }
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
        res.render('admin/print', {layout: 'layouts/dev_layout', list:myList, id:courseId, date:mydate})
    })
})
router.get('/dashboard/log', function(req, res){
    res.render('admin/log', {layout: 'layouts/admin_layout.ejs'})
})
router.get('/dashboard/backup', function(req, res){
    res.render('admin/backup', {layout: 'layouts/admin_layout.ejs'})
})
router.post('/backup', function(req, res){
    exec('mongodump --db lab_system --out '+output+year + '-' + month + '-' + date, function (err, res) {
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