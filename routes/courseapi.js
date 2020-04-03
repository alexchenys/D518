const express =  require('express')
const router = express.Router()
const course = require('../models/api')


router.get('/', async function(req, res){
    try {
        const course_list = await course.find()
        res.json(course_list)
    } catch (err) {
        res.status(500).json({message: err.message}); 
    }
})





module.exports = router;