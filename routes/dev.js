const express = require('express')
const router = express.Router()
var multer = require('multer')
const bodyParser= require('body-parser')
const path = require('path')
const fs = require('fs')
const iconv = require('iconv-lite');
var xlsx2json = require("node-xlsx");
var sys = require('sys');
const passport = require('passport')
const POP3Strategy = require('passport-pop3')
passport.use(new POP3Strategy({
    host: 'mail.uch.edu.tw',
    port: 110,
    enabletls: false,
    usernameField: 'email',
    passwordField: 'passwd',
  }
));



//var node_fs = require('node-fs');
const { exec } = require("child_process");
var date=new Date().getDate();
var month=new Date().getMonth();
var year=new Date().getFullYear();
var output='./public/backup/';
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
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
router.get('/', function(req, res){
    res.render('dev/index1', {layout: 'layouts/dev_layout.ejs'})
})
router.post('/upload', function(req, res){
    uploads(req, res, (err) => {
        console.log(req.body.classID)
        if(err){
            res.render('dev/index', {layout: 'layouts/dev_layout.ejs',
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('dev/index', {
                    layout: 'layouts/dev_layout.ejs',
                    msg: 'Error: No File Selected!',
                })
            } else {
                res.render('dev/index', {
                    layout: 'layouts/dev_layout.ejs',
                    msg: 'File Uploaded!',
                    file: `/uploads/${req.file.filename}`
                })
                var myData = xlsx2json.parse(`./public/uploads/${req.file.filename}`)
                console.log(myData)
                fs.unlink(`./public/uploads/${req.file.filename}`, function(err){
                    if (err) {
                        console.log(err)
                        return;
                    } 
                    console.log('Removed')
                })

            }
        }

    })
})
router.get('/csv',function(req, res){
    res.send('test')
    var list = xlsx2json.parse("./public/uploads/CS0169.xlsx" );
    
})
router.post('/array', function(req, res){
    res.send('good')
    let deleteList = req.body
    console.log(deleteList.option)
})
router.get('/time',function(req, res){
    res.render('dev/index2.ejs',{layout: 'layouts/dev_layout.ejs'})
})
router.get('/backup', async function(req, res){
    exec('mongodump --db lab_system --out '+output+year + '-' + month + '-' + date, function (err, res) {
        //console.log(res)
        console.log('Dump taken on '+ year+'-'+month+'-'+date)
    })
})
router.get('/pop3', function(req, res){
    res.render('dev/pop3',{layout: 'layouts/dev_layout.ejs'})
})
router.post('/login', function(req, res, next){
    passport.authenticate('pop3', function(err, user, info){
        if (err) return res.status(500).send('Internal Server Error')
        if (!user) return res.status(400).send('Bad Request')
        return res.status(200).send('OK')
    })(req, res, next)
})

module.exports = router