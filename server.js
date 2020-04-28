require('dotenv').config()
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
//const express = require('express');
const mongoose = require('mongoose');
const app = express(feathers())
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
//app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/teacher', teacherRouter);
app.use('/student', studentRouter);
app.use('/admin', adminRouter);
app.use('/dev', divRouter);
app.use('/new', newRouter);
app.use('/chat', chatRouter)
class MessageService {
    constructor() {
        this.messages = [];
    }
    async find () {
        // Just return all our messages
        return this.messages;
    }
  
    async create (data) {
        // The new message is the data merged with a unique identifier
        // using the messages length since it changes whenever we add one
        const message = {
            id: this.messages.length,
            text: data.text,
            time: data.time,
            name: data.name
        }

        // Add new message to the list
        this.messages.push(message);

        return message;
    }
  }
  
class ReplyService {
    constructor() {
        this.reply = [];
    }
    async find () {
        // Just return all our messages
        return this.reply;
    }
    async create (data) {
        // The new message is the data merged with a unique identifier
        // using the messages length since it changes whenever we add one
        const reply = {
            id: this.reply.length,
            name: data.name,
            to: data.to,
            text: data.text,
            time: data.time
        }
        // Add new message to the list
        this.reply.push(reply);

        return reply;
    }
}
// Parse HTTP JSON bodies
app.use(express.json());
// Parse URL-encoded params
app.use(express.urlencoded({ extended: true }));
// Host static files from the current folder
app.use(express.static(__dirname));
// Add REST API support
app.configure(express.rest());
// Configure Socket.io real-time APIs
app.configure(socketio());
// Register an in-memory messages service
app.use('/messages', new MessageService());
app.use('/reply', new ReplyService())
// Register a nicer error handler than the default Express one
app.use(express.errorHandler());

// Add any new real-time connection to the `everybody` channel
app.on('connection', connection =>
  app.channel('everybody').join(connection)
);
// Publish all events to the `everybody` channel
app.publish(data => app.channel('everybody'));
app.listen(3000).on('listening', () =>
  console.log('Feathers server listening on localhost:3000')
);
/** 
nsp.on('connection', function(socket){
    socket.on("chat",function(msg){
        console.log(msg)
        nsp.emit("chat", msg)
    });
});*/

//http.listen(3000, () => {
//   console.log('listening on *:3000');
//});
//app.listen(process.env.PORT || 3000);