var app = new Vue({
    el: '#vue',
    data: {
        socket: null,
        myId: 'erik',
        keyIsPressed: {
            up: false,
            down: false,
            left: false,
            right: false,
        },
        entities: [],
    },
    methods: {
        sendKeyState: function () {
            this.socket.emit('keyStateChange', this.keyIsPressed);
        },
        getObjectLength:function(obj){
            return Object.keys(obj).length;
        },
    },
    ready: function () {

    }
});


class CanvasRenderer {
    constructor(canvas) {
        var body = document.getElementById("body");
        var canvas = canvas || document.getElementById("canvas");
        canvas.width = body.offsetWidth;
        canvas.height = body.offsetHeight;

        this.origin = {
            x: canvas.width / 2,
            y: canvas.height / 2,
        };

        this.ctx = canvas.getContext("2d");
        this.ctx.scale(1,1);
        this.data = [];
        this.images = [];
    }
    setData(dataArray) {
        this.data = dataArray;
    }
    drawAllData() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(var i=0; i<this.data.length;i++) {
            this.drawEntity(this.data[i]);
        }
    }
    preloadImageFromEntity(entity) {
        if(entity.renderer.type == "Image" || entity.renderer.type == "Sprite") {
            entity.renderer.imageObject = new Image();
            entity.renderer.imageObject.src = entity.renderer.source;
        }
    }
    preloadImagesFromAllEntities() {
        for(var i=0; i<this.data.length;i++) {
            this.preloadImageFromEntity(this.data[i]);
        }
    }
    drawEntity(entity) {
        try {
            this["draw" + entity.renderer.type](entity);
        } catch(err) {
            console.log("Entity Render Type [" + entity.renderer.type + "] Is Not Implemented: " + err);
        }
    }
    drawRectangle(entity) {
        this.ctx.fillStyle = entity.renderer.color;
        this.ctx.fillRect(
            entity.position.x + this.origin.x,
            entity.position.y + this.origin.y,
            entity.size.w,
            entity.size.h
        );
    }
    drawImage(entity) {
        entity.renderer.imageObject.onload = () => {
            this.ctx.drawImage(
                entity.renderer.imageObject,
                entity.position.x + this.origin.x,
                entity.position.y + this.origin.y,
                entity.size.w,
                entity.size.h
            );
        }
    }
    drawSprite(entity) {
        // TODO: implement a method to draw a sprite based image on the canvas
    }
}

var canvas = document.getElementById("canvas"),
    renderer = new CanvasRenderer(),
    socketHref = (window.location.href.indexOf('localhost') > -1) ? 'http://localhost:1337' : window.location.protocol + "//" + window.location.host + "/",
    socket = io.connect(socketHref);

alert(socketHref);

socket.on('connect', function () {
    console.log("Connected");
    socket.on('update', function (d) {
        app.$data.entities = d.entities;
        renderer.setData(app.$data.entities);
    });
});

renderer.preloadImagesFromAllEntities();

function Loop(){
    renderer.drawAllData();
    window.requestAnimationFrame(Loop);
}

window.requestAnimationFrame(Loop);