const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const courseInfo = require('../models/classInfo')
const studentList = require('../models/studentList')
const studentApi = require('../models/studentApi')
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
module.exports = router;