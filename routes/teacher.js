const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const path = require('path')
var multer = require('multer')
var xlsx2json = require("node-xlsx");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require('mongodb', {useUnifiedTopology: true}).MongoClient;
var session = require('express-session');
var moment = require('moment');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose')
const fs = require('fs')

var url = "mongodb://127.0.0.1:27017/lab_system";
const studentList = require('../models/studentList.js')
const studentApi = require('../models/studentApi')
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        console.log(file.filename)
        cb(null, file.fieldname + '-' + Date.now() + 
            path.extname(file.originalname))
    }
})
const uploads = multer({
    storage: storage,
    limits:{fileSize: 100000000},
    fileFilter:function(req, file, cb){
        const fileType = /jpeg|jpg|png|gif/;
        //const extname = fileType.test(path.extname(file.originalname).toLowerCase());
        //const mimetype = fileType.test(file.mimetype)
        const extname = true
        const mimetype = true
        if (extname && mimetype) {
            return cb(null, true)
        } else {
            cb('Error: Image Only!')
        }
    }
}).single('myFile')

router.use(session({
    secret: '1234',
    store: new MongoStore({url:'mongodb://localhost:27017/sessiondb'}),
    cookie: {maxAge: 600 * 100000}                       
}))
//router.use(bodyParser.urlencoded({ extended: true }));
router.get('/', function(req, res){
    res.render('teacherLogin.ejs')
})
router.post('/',urlencodedParser, function(req, res){
    //console.log('name:' + req.body.username);
    //console.log('password: ' + req.body.password);
    MongoClient.connect(url, function(err, db, next) {
        if (err) throw err;
        var dbo = db.db("lab_system");
        dbo.collection("teacher").findOne({'username' : req.body.username }, function(err, result) {
            //console.log(result);
            req.session.teacherData = result
            if (err) throw err;
            if(result == null){
                console.log('User Not find')
                res.redirect('/teacher');
            }
            else{
                var username = result.username;
                var password = result.password;
                if(req.body.password == result.password){
                    console.log('Login successfully')
                    res.redirect('teacher/dashboard/home');
                }
                else{
                    console.log('Password Incorrect')
                    res.redirect('/teacher');
                }
            }
            db.close();
            //res.render('view', { layout: 'teacher_dashboard' });
        });
    });
})
router.get('/dashboard/home', function(req, res){
    var teacherData = req.session.teacherData;
    res.render('teacher/teacher_home.ejs', {layout: 'layouts/teacher_dashboard.ejs', Data: teacherData})
})
router.get('/dashboard/rol', function(req, res){
    var teacherData = req.session.teacherData;
    res.render('teacher/rol.ejs', {layout: 'layouts/teacher_dashboard.ejs', Data: teacherData})
    //console.log(teacherData)
})
router.get('/dashboard/student_manage', function(req, res){
    var teacherData = req.session.teacherData;
    res.render('teacher/student_manage.ejs', {layout: 'layouts/teacher_dashboard.ejs', Data: teacherData})
})
router.post('/dashboard/add', function(req, res){
    const student_List = new studentList({
        _id: new mongoose.Types.ObjectId(),
        classID: req.body.classID,
        marjor: req.body.stu_major,
        grade: req.body.grade,
        stu_id: req.body.stu_id,
        stu_name: req.body.stu_name
    })
    console.log(req.body.stu_major);
    console.log(req.body.grade);
    console.log(req.body.stu_id);
    console.log(req.body.stu_name);
    console.log(req.body.classID);

    student_List.save().catch(err => console.log(err))
    res.redirect("student_manage");
})
router.post('/dashboard/file', function(req, res){
    var teacherData = req.session.teacherData;
    
    uploads(req, res, (err) => {
        console.log("classID = " + req.body.classID);
        const classID = req.body.classID
        if(err){
            res.render('teacher/student_manage.ejs', {layout: 'layouts/teacher_dashboard.ejs',
                msg: err,
                Data: teacherData
            });
        } else {
            if (req.file == undefined) {
                res.render('teacher/student_manage.ejs', {
                    layout: 'layouts/teacher_dashboard.ejs',
                    msg: 'Error: No File Selected!',
                    Data: teacherData
                })
            } else {
                /** 
                res.render('teacher/student_manage.ejs', {
                    layout: 'layouts/teacher_dashboard.ejs',
                    msg: 'File Uploaded!',
                    Data: teacherData
                    //file: `/uploads/${req.file.filename}`
                })*/
                var myData = xlsx2json.parse(`./public/uploads/${req.file.filename}`)
                console.log(myData[0].data.length)
                if (myData[0].data[0][0] === '科系') {
                    myData[0].data.shift()
                    console.log('---------------------------')
                    console.log(myData[0].data)
                }

                for (let i = 0; i < myData[0].data.length; i++) {
                    const student_List = new studentList({
                        _id: new mongoose.Types.ObjectId(),
                        classID: classID,
                        marjor: myData[0].data[i][0],
                        grade: myData[0].data[i][1],
                        stu_id: myData[0].data[i][2],
                        stu_name: myData[0].data[i][3]
                    })
                    //console.log(myData[0].data[i][0])
                    //console.log(myData[0].data[i][1])
                    //console.log(myData[0].data[i][2])
                    //console.log(myData[0].data[i][3])
                    student_List.save().catch(err => console.log(err))
                }


                fs.unlink(`./public/uploads/${req.file.filename}`, function(err){
                    if (err) {
                        console.log(err)
                        return;
                    } 
                    console.log('Removed')
                })
                res.redirect("student_manage");
            }
        }
    })
})
router.post('/dashboard/delete',urlencodedParser, function(req, res){
    let deleteList = req.body
    //console.log("id: " + deleteList.delete_list)
    //console.log(typeof deleteList.delete_list)
    if(typeof deleteList.delete_list === "string"){
        studentList.remove({stu_id: deleteList.delete_list}).exec()
        res.redirect("student_manage");
    } else {
        for (let i = 0; i < deleteList.delete_list.length; i++) {
            //const element = array[i];
            const Dstu_id = deleteList.delete_list[i]
            //console.log(Dstu_id)
            studentList.remove({stu_id: Dstu_id}).exec()
        }
        res.redirect("student_manage");
    }
    
})
router.get('/dashboard/fqa', function(req, res){
    var teacherData = req.session.teacherData;
    res.render('teacher/fqa', {layout: 'layouts/teacher_dashboard.ejs', Data: teacherData})
})
router.get('/dashboard/record', function(req, res){
    var teacherData = req.session.teacherData;
    res.render('teacher/record', {layout: 'layouts/teacher_dashboard.ejs', Data: teacherData})
})
router.post('/dashboard/print',urlencodedParser,function(req, res){
    
    var courseId =  req.body.courseId
    //console.log(req.body)
    var mydate =  req.body.date
    studentApi.find({class:courseId, date:mydate}).exec()
    .then(function(myList){
        //console.log(myList);
        res.render('teacher/print', {layout: 'layouts/dev_layout', list:myList, id:courseId, date:mydate})
    })
    
})
module.exports = router