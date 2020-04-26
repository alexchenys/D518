const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const mongoose = require('mongoose')
var url = "mongodb://127.0.0.1:27017/lab_system";
var moment = require('moment');
var MongoClient = require('mongodb', {useUnifiedTopology: true}).MongoClient;
const stuSignIn = require('../models/studentApi.js')
const reportApi = require('../models/report.js')

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

router.get('/', function(req, res){
    res.render('studentSignin.ejs')
})
router.post('/',urlencodedParser,function(req, res){
    const sign_in = new stuSignIn({
        _id: new mongoose.Types.ObjectId(),
        stu_name: req.body.stu_name,
        stu_id: req.body.stu_id,
        day: req.body.day,
        date: moment().format('L'),
        class: req.body.class,
        picd : req.body.pcid_1 + "-" + req.body.pcid_2
    });
    if (req.body.report != null) {
        const report = new reportApi({
            _id: new mongoose.Types.ObjectId(),
            id: getRandomInt(100000),
            date: moment().format('L'),
            name: req.body.stu_name,
            pcid : req.body.pcid_1 + "-" + req.body.pcid_2,
            report: req.body.report
        })
        report.save()
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("lab_system");
        dbo.collection("listschemas").findOne({classID: sign_in.class, stu_id: sign_in.stu_id}, function(err, result) {
            if (err) throw err;
            if (result.stu_name == req.body.stu_name) {
                console.log(result.stu_name);
                sign_in.save()
                .catch(err => console.log(err))
            } else {
                console.log('404 not found')
            }
            db.close();
        });
      });
    sign_in.save()
    .catch(err => console.log(err))
    res.render('student/Awesome'); 
})

router.get('/search', function(req, res){
    res.render('student/search', {layout: 'layouts/dev_layout'})
})
router.post('/search', urlencodedParser, function(req, res){
    res.render('student/display_result', {layout: 'layouts/dev_layout', stu_id:req.body.stu_id})
})


module.exports = router