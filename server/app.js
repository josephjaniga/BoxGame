var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    pig = require('to-market'),
    io = require('socket.io')(server);

// set the server to listen on a port
server.listen(process.env.PORT || 1337);

// statically serve the client directory at root
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

// Broadcast Object State
setInterval(function(){
    io.emit('update', {entities: pig.getEntityLiterals()});
}, 10);