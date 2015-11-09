var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

server.listen(process.env.PORT || 1337);

app.use('/', express.static('client'));

var lastFrameTime = new Date().getTime(),
    thisFrameTime = new Date().getTime();

var boxes = { };

io.on('connection', function (socket) {

    console.log(socket.id + " - connection started");
    playerConnect(socket);

    socket.on('disconnect', function () {
        console.log("disconnected - " + socket.id);
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
}, 10);

/**
 * DEFINITIONS
 */

function playerConnect(socket){
    readyPlayer(socket.id);
}

function playerDisconnect(socket){
    deletePlayer(socket.id);
}

function getNameOfPlayerById( id ){
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

    thisFrameTime = new Date().getTime();

    var deltaTime = (thisFrameTime - lastFrameTime) / 1000;

    var speed = 50 * deltaTime;

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

function readyPlayer(id){
    var playerName = id;
    boxes[playerName] = {
        id: id,
        color:"#"+((1<<24)*Math.random()|0).toString(16),
        y:0,
        x:0,
        keyIsPressed: {
            up: false,
            down: false,
            left: false,
            right: false,
        }
    };
}

function deletePlayer(id){
    delete boxes[id];
}
