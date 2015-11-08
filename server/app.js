var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(1337);

app.use('/', express.static('client'));

//app.get('/', function (req, res) {
//    res.sendfile('./client/index.html');
//});

var boxes = {
    player1: {
        id: null,
        color:'cyan',
        y:50,
        x:0,
    },
    player2: {
        id: null,
        color:'magenta',
        y:250,
        x:600,
    }
};

io.on('connection', function (socket) {

    console.log("connection started");
    // handoff "this is you"
    playerConnect(socket);

    socket.on('message', function (msg) {
        console.log("message received - " + msg);
    });

    socket.on('disconnect', function (socket) {
        console.log("disconnected");
        playerDisconnect(socket);
    });

});

//setInterval(function(){
//    io.emit('bgChange', {color: randColor()});
//}, 1000);
//
//function randColor(){
//    return '#'+Math.floor(Math.random()*16777215).toString(16);
//}

// the Update Loop
setInterval(function(){
    boxes.player1.x++;
    boxes.player2.y--;
    io.emit('update', {boxes: boxes});
}, 500);

function playerConnect(socket){
    var box = getFirstAvailablePlayer();
    if ( box !== null ){
        box.id = socket.id;
        io.emit('assignId', socket.id);
    }
    console.log(box);
}

function playerDisconnect(socket){
    console.log(boxes);
    clearBoxBy(socket.id);
}

function getFirstAvailablePlayer(){
    var box = null;
    for ( var property in boxes ){
        if ( property.id === null ){
            box = property;
        }
    }
    return box;
}

function clearBoxBy(id){
    for ( var property in boxes ){
        if ( property.id === id ){
            property.id = null;
        }
    }
}