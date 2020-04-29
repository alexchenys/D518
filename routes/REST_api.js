const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const courseInfo = require('../models/classInfo')
const studentList = require('../models/studentList')
const studentApi = require('../models/studentApi')
const newsApi = require('../models/new')
const mylog = require('../models/log')
const reportApi = require('../models/report')
const adminAccount = require('../models/admin')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/lab_system";
router.get('/', function(req, res){
    //res.send('Wellcome to Lab_System API')
    res.render('labApi/index.ejs', {layout: 'layouts/dev_layout.ejs'})
})

router.get('/course', function(req, res){
    courseInfo.find().exec()
    .then(function(course){
        res.status(200).json(course)
    })
    .catch(function(err){
        res.status(500).json({error: err})
    })
})
router.get('/admin', function(req, res){
    adminAccount.find().exec()
    .then(function(course){
        res.status(200).json(course)
    })
    .catch(function(err){
        res.status(500).json({error: err})
    })
})

router.get('/studentList', function(req, res){
    studentList.find().exec()
    .then(function(myList){
        res.status(200).json(myList)
        //res.send(JSON.stringify(myList));
        //console.log(JSON.stringify(myList));
    })
    .catch(function(err){
        res.status(500).json({error: err})
    })

})

router.get('/signin', function(req, res){
    studentApi.find().exec()
    .then(function(myList){
        res.status(200).json(myList)
    })
    .catch(function(err){
        res.status(500).json({error: err})
    })
})
router.get('/log', function(req, res){
    mylog.find().exec()
    .then(function(myList){
        res.status(200).json(myList)
    })
    .catch(function(err){
        res.status(500).json({error: err})
    })
})

router.get("/teacher", (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("lab_system");
        dbo.collection("teacher").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result)
            res.send(result)

            db.close();
        });
    });
});

router.get('/new', function(req, res){
    newsApi.find().exec()
    .then(function(myList){
        res.status(200).json(myList)
    })
    .catch(function(err){
        res.status(500).json({error: err})
    })
})

router.get('/report', function(req, res){
    reportApi.find().exec()
    .then(function(myList){
        res.status(200).json(myList)
    })
    .catch(function(err){
        res.status(500).json({error: err})
    })
})
module.exports = router