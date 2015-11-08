var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 1337);

app.use('/', express.static('client'));


var lastFrameTime = new Date().getTime(),
    thisFrameTime = new Date().getTime();

var boxes = {
    player1: {
        id: null,
        color:'cyan',
        y:50,
        x:0,
        keyIsPressed: {
            up: false,
            down: false,
            left: false,
            right: false,
        }
    },
    player2: {
        id: null,
        color:'magenta',
        y:250,
        x:600,
        keyIsPressed: {
            up: false,
            down: false,
            left: false,
            right: false,
        }
    }
};

io.on('connection', function (socket) {

    console.log("connection started");
    // handoff "this is you"
    playerConnect(socket);

    socket.on('message', function (msg) {
        console.log("message received - " + msg);
    });

    socket.on('disconnect', function () {
        console.log("disconnected");
        playerDisconnect(socket);
    });

    socket.on('keyStateChange', function(keyStateObject){
        var playerString = getNameOfPlayerById(socket.id);
        if ( playerString !== null ){
            boxes[playerString].keyIsPressed = keyStateObject;
        }
    });

});

setInterval(function(){
    handleInput();
}, 10);

// the Update Loop
setInterval(function(){
    io.emit('update', {boxes: boxes});
    console.log(boxes);
}, 100);

function playerConnect(socket){
    if ( playersAvailable() ){
        assignBoxIdToFirstAvailable(socket.id);
        io.emit('assignId', socket.id);
    }
}

function playerDisconnect(socket){
    clearBoxBy(socket.id);
}

function playersAvailable(){
    var avail = false;
    for ( var b in boxes ){
        if ( boxes[b].id === null ){
            avail = true;
        }
    }
    return avail;
}

function assignBoxIdToFirstAvailable(newId){
    for ( var property in boxes ){
        if ( boxes[property].id === null ){
            boxes[property].id = newId;
            break;
        }
    }
}

function clearBoxBy(id){
    for ( var property in boxes ){
        if ( boxes[property].id === id ){
            boxes[property].id = null;
        }
    }
}

function getNameOfPlayerById(id){
    var playerName = null;
    for ( var property in boxes ){
        if ( boxes[property].id === id ){
            playerName = property;
            break;
        }
    }
    return playerName;
}

function handleInput( callback ){

    lastFrameTime = new Date().getTime();

    var deltaTime = (thisFrameTime - lastFrameTime) / 1000;

    var speed = 10 * deltaTime;

    for ( var property in boxes ){
        if ( boxes[property].keyIsPressed.up ){
            boxes[property].y += speed;
        }
        if ( boxes[property].keyIsPressed.down ){
            boxes[property].y -= speed;
        }
        if ( boxes[property].keyIsPressed.right ){
            boxes[property].x += speed;
        }
        if ( boxes[property].keyIsPressed.left ){
            boxes[property].x -= speed;
        }
    }

    lastFrameTime = thisFrameTime;
}