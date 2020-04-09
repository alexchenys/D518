const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const courseInfo = require('../models/classInfo')

router.get('/', function(req, res){
    res.send('Wellcome to Lab_System API')
})

router.get('/course', function(req, res){
    courseInfo.find().exec()
    .then(function(course){
        res.status(200).json({course})
    })
    .catch(function(err){
        res.status(500).json({error: err})
    })
})

module.exports = router;