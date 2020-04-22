const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const news = require('../models/new')

router.get('/', function(req, res){
    res.render('new/new');
})
router.get('/:id', function(req, res){
    news.find({id:req.params.id}).exec()
    .then(function(myList){
        console.log(myList)
        res.render('new/news',{data: myList})
    })
})


module.exports = router