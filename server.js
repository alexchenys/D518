const express = require('express');
const app = express()
const expressLayouts = require('express-ejs-layouts'); // Layout Folder
//My Router
const indexRouter = require('./routes/index')
const teacherRouter = require('./routes/teacher')
const studentRouter = require('./routes/student')

const bodyParser = require('body-parser')
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/teacher', teacherRouter);
app.use('/student', studentRouter);
app.listen(process.env.PORT || 3000);