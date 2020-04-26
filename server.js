require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const app = express()
var http = require('http').createServer(app);
const expressLayouts = require('express-ejs-layouts'); // Layout Folder
mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true })
const db = mongoose.connection
const bodyParser = require('body-parser')
const path = require('path');
var io = require('socket.io')(http);
//middleware 
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
const divRouter = require('./routes/dev')
const newRouter = require('./routes/new')
const chatRouter = require('./routes/chat')
const nsp = io.of('/chat');
app.use(express.static(path.resolve('./public')));
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
app.use('/dev', divRouter);
app.use('/new', newRouter);
app.use('/chat', chatRouter)
/** 
nsp.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg)
        nsp.emit('chat message', msg);
    });
});
*/
nsp.on('connection', function(socket){
    socket.on("chat",function(msg){
        console.log(msg)
        nsp.emit("chat", msg)
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
//app.listen(process.env.PORT || 3000);