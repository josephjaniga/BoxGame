function log(x) {
    console.log(x);
}

// Key Codes
const
    KEY_UP = 38,
    KEY_LEFT = 37,
    KEY_DOWN = 40,
    KEY_RIGHT = 39,
    KEY_W = 87,
    KEY_A = 65,
    KEY_S = 83,
    KEY_D = 68,
    KEY_SPACE = 32;

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
        this.staticEntities = [];
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
        for(var i=0; i<this.staticEntities.length;i++) {
            this.drawEntity(this.staticEntities[i]);
        }
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
        } else {
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.strokeRect(
                debugEntity.x + this.origin.x,
                debugEntity.y + this.origin.y,
                debugEntity.w,
                debugEntity.h
            );
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
            mouseX: 0,
            mouseY: 0,
        },
        entities: [],
        staticEntities: [],
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
        handleKeyInput: function(keyCode, direction) {
            var keyName = '';
            switch (keyCode) {
                case KEY_UP:
                case KEY_W:
                    keyName = 'up';
                    break;
                case KEY_LEFT:
                case KEY_A:
                    keyName = 'left';
                    break;
                case KEY_DOWN:
                case KEY_S:
                    keyName = 'down';
                    break;
                case KEY_RIGHT:
                case KEY_D:
                    keyName = 'right';
                    break;
                default:
                    return 1;
                    break;
            }
            this.setKeyInputState(keyName, direction);
        },
        setKeyInputState: function(keyName, direction) {
            switch(direction) {
                case 'down':
                    if (!this.input[keyName]) {
                        this.input[keyName] = true;
                        this.sendKeyState();
                    }
                    break;
                case 'up':
                    this.input[keyName] = false;
                    this.sendKeyState();
                    break;
            }
        },
        keyDown: function(e) {
            this.handleKeyInput(e.keyCode, 'down');
        },
        keyUp: function(e) {
            this.handleKeyInput(e.keyCode, 'up');
        },
        getObjectLength:function(obj){
            return Object.keys(obj).length;
        },
        mouseMove: function(e) {
            this.input.mouseX = e.clientX - this.canvasOrigin.x;
            this.input.mouseY = e.clientY - this.canvasOrigin.y;
            //console.log("x:" + (e.clientX - this.canvasOrigin.x) + "y:" + (e.clientY - this.canvasOrigin.y));
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
            this.socket.on('load', (d)=>{
                app.$data.staticEntities = d.staticEntities;
                renderer.staticEntities = d.staticEntities;
            });
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
