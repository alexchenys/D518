const express = require('express')
const router = express.Router()
var multer = require('multer')
const bodyParser= require('body-parser')
const path = require('path')
const fs = require('fs')
const iconv = require('iconv-lite');
var xlsx2json = require("node-xlsx");

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
module.exports = router