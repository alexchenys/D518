const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const mongoose = require('mongoose')

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
        class: req.body.class,
        picd : req.body.pcid_1 + "-" + req.body.pcid_2
    });

    sign_in.save()
    .catch(err => console.log(err))
    res.render('student/Awesome');
})



module.exports = router