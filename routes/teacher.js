const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require('mongodb').MongoClient;
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var url = "mongodb://127.0.0.1:27017/lab_system";


router.get('/', function(req, res){
    res.render('teacherLogin.ejs')
})
router.post('/',urlencodedParser, function(req, res){
    //console.log('name:' + req.body.username);
    //console.log('password: ' + req.body.password);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("lab_system");
        dbo.collection("user").findOne({'username' : req.body.username }, function(err, result) {
            console.log(result);
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
                    res.redirect('teacher/dashboard/index');
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

router.get('/dashboard/index', function(req, res){
    res.render('teacher/index.ejs', {layout: 'layouts/teacher_dashboard.ejs', name: '陳信北'})
    //router.set('layout', 'layouts/teacher_dashboard')
    //res.render('teacher/teacher_dashboard.ejs')
})


module.exports = router