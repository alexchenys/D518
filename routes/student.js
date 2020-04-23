const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const mongoose = require('mongoose')
var url = "mongodb://127.0.0.1:27017/lab_system";
var moment = require('moment');
var MongoClient = require('mongodb', {useUnifiedTopology: true}).MongoClient;
const stuSignIn = require('../models/studentApi.js')

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
    //console.log(sign_in.stu_id, sign_in.stu_name)
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



module.exports = router