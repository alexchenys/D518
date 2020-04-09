const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require('mongodb', {useUnifiedTopology: true}).MongoClient;
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var url = "mongodb://127.0.0.1:27017/lab_system";

router.use(session({
    secret: '1234',
    store: new MongoStore({url:'mongodb://localhost:27017/sessiondb'}),
    cookie: {maxAge: 600 * 100000}                       
}))

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


module.exports = router