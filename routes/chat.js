const express = require('express')
const router = express.Router()
router.use(express.static('public'));

router.get('/', function(req, res){
    var username = req.query.username;
    console.log(username)
    res.render('chat/index', {layout: 'layouts/dev_layout', user: username})
})



module.exports = router