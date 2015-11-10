var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    pig = require('to-market')(),
    io = require('socket.io')(server);

server.listen(process.env.PORT || 1337);

app.use('/', express.static('client'));

io.on('connection', function (socket) {

    console.log(socket.id + " - connection started");
    pig.playerConnect(socket);

    socket.on('disconnect', function () {
        console.log("disconnected - " + socket.id);
        pig.playerDisconnect(socket);
    });

    socket.on('keyStateChange', (keyStateObject)=>{
        pig.keyStateChange(keyStateObject, socket);
    });

});

// the Update Loop
setInterval(function(){
    io.emit('update', {boxes: pig.entities});
}, 10);