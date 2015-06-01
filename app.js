var express = require('express');
var app = express();
var server = require('http').Server(app)
var io = require('socket.io')(server)
var ent = require('ent')
var port = process.env.PORT || 8000

//var io = require('socket.io')(3000);
var redis = require('socket.io-redis');
io.adapter(redis({ host: '192.168.3.1', port: 6379 }));


app.set('view engine', 'jade');
app.set('views',  __dirname +  '/views')
app.locals.pretty = true;

app.get('/', function(req, res) {
  res.render('index', {port: port});
});

io.sockets.on('connection', function (socket) {
  // handle new users
  socket.on('new_user', function(nick) {
    nick = ent.encode(nick);
    socket.nick = nick;
    socket.broadcast.emit('new_user', nick);
  });

  // forward message
  socket.on('message', function (message) {
    message = ent.encode(message);
    socket.broadcast.emit('message', {nick: socket.nick, message: message});
  });
});

server.listen(port);
console.log("Express server started on " + port);