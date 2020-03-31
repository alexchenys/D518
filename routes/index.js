const express = require('express')
const router = express.Router()

router.get('/', function(req, res){
    //res.render('layouts');
    res.render('index', {layout: 'layouts/layout.ejs'})
})


module.exports = router