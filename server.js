require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const app = express()
const expressLayouts = require('express-ejs-layouts'); // Layout Folder
mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true })
const db = mongoose.connection
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))
//My Router
const indexRouter = require('./routes/index')
const teacherRouter = require('./routes/teacher')
const studentRouter = require('./routes/student')
const adminRouter = require('./routes/admin')
const apiRouter = require('./routes/REST_api')

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/teacher', teacherRouter);
app.use('/student', studentRouter);
app.use('/admin', adminRouter);
app.listen(process.env.PORT || 3000);