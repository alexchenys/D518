const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function(req, res){
    res.render('studentSignin.ejs')
})

router.post('/',urlencodedParser,function(req, res){
    console.log(req.body.stu_name);
})


module.exports = router