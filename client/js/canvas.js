function log(x) {
    console.log(x);
}
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
        this.debug = [];
        this.images = [];
    }
    getCanvasOrigin() {
        return this.origin;
    }
    setData(dataArray, debugArray) {
        this.data = dataArray;
        this.debug = debugArray;
    }
    drawAllData() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(var i=0; i<this.data.length;i++) {
            this.drawEntity(this.data[i]);
        }
        for(var i=0; i<this.debug.length;i++) {
            this.drawDebugElement(this.debug[i]);
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
    drawDebugElement(debugEntity){
        if ( debugEntity.type == "Raycast" ){
            if ( debugEntity.result ){
                this.ctx.strokeStyle = '#FFFF00';
            } else {
                this.ctx.strokeStyle = '#00cc00';
            }
            this.ctx.beginPath();
            this.ctx.moveTo(
                debugEntity.ray.start.x + this.origin.x,
                debugEntity.ray.start.y + this.origin.y
            );
            this.ctx.lineTo(
                debugEntity.ray.end.x + this.origin.x,
                debugEntity.ray.end.y + this.origin.y
            );
            this.ctx.stroke();
        }
    }
}

var app = new Vue({
    el: '#vue',
    data: {
        socket: null,
        myId: 'erik',
        input: {
            up: false,
            down: false,
            left: false,
            right: false,
            mouseLeft: false,
            mouseRight: false,
        },
        entities: [],
        debug: [],
        mouse: window.mouse,
        canvasOrigin: null
    },
    methods: {
        getObjectLength:function(obj){
            return Object.keys(obj).length;
        },
        sendKeyState: function () {
            this.socket.emit('keyStateChange', this.input);
        },
        rightKeyDown: function () {
            if (!this.input.right) {
                this.input.right = true;
                this.sendKeyState();
            }
        },
        rightKeyUp: function () {
            this.input.right = false;
            this.sendKeyState();
        },
        leftKeyDown: function () {
            if (!this.input.left) {
                this.input.left = true;
                this.sendKeyState();
            }
        },
        leftKeyUp: function () {
            this.input.left = false;
            this.sendKeyState();
        },
        upKeyDown: function () {
            if (!this.input.up) {
                this.input.up = true;
                this.sendKeyState();
            }
        },
        upKeyUp: function () {
            this.input.up = false;
            this.sendKeyState();
        },
        downKeyDown: function () {
            if (!this.input.down) {
                this.input.down = true;
                this.sendKeyState();
            }
        },
        downKeyUp: function () {
            this.input.down = false;
            this.sendKeyState();
        },
        getObjectLength:function(obj){
            return Object.keys(obj).length;
        },
        mouseMove: function(e) {
            console.log("x:" + (e.clientX - this.canvasOrigin.x) + "y:" + (e.clientY - this.canvasOrigin.y));
        },
        mouseDown: function(e) {
          switch(e.button) {
              case 0:
                  if(!this.input.mouseLeft) {
                      this.input.mouseLeft = true;
                      this.sendKeyState();
                  }
                  break;
          }
        },
        mouseUp: function(e) {
            switch(e.button) {
                case 0:
                    this.input.mouseLeft = false;
                    this.sendKeyState();
                    break;
            }
        }
    },
    ready: function () {

        var self = this;

        var canvas = document.getElementById("canvas"),
            renderer = new CanvasRenderer(),
            socketHref = (window.location.href.indexOf('localhost') > -1) ? 'http://localhost:1337' : window.location.protocol + "//" + window.location.host + "/";

        this.canvasOrigin = renderer.getCanvasOrigin();

        this.socket = io.connect(socketHref);

        this.socket.on('connect', ()=>{
            console.log("Connected");
            this.socket.on('update', (d)=>{
                app.$data.entities = d.entities;
                app.$data.debug = d.debug;
                renderer.setData(app.$data.entities, app.$data.debug);
            });
        });

        renderer.preloadImagesFromAllEntities();

        function Loop(){
            renderer.drawAllData();
            window.requestAnimationFrame(Loop);
        }

        window.requestAnimationFrame(Loop);
    }
});
