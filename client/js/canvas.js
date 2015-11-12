// Sample Data Array we expect from server
var data = [
    {
        position: {
            x:0,
            y:0,
        },
        size: {
            h:100,
            w:100,
        },
        renderer: {
            type: 'Rectangle',
            color: '#ff9900',
        }
    },
    {
        position: {
            x:100,
            y:100,
        },
        size: {
            h:300,
            w:50,
        },
        renderer: {
            type: 'Rectangle',
            color: '#9900ff',
        }
    },
    {
        position: {
            x:0,
            y:10,
        },
        size: {
            h:300,
            w:50,
        },
        renderer: {
            type: 'Image',
            source: 'http://www.smashbros.com/images/og/mario.jpg',
        }
    },
];

class CanvasRenderer {
    constructor(canvas) {
        var body = document.getElementById("body");
        var canvas = canvas || document.getElementById("canvas");
        canvas.width = body.offsetWidth - 20;
        canvas.height = body.offsetHeight - 10;

        this.origin = {
            x: canvas.width / 2,
            y: canvas.height / 2,
        }

        this.ctx = canvas.getContext("2d");
        this.data = [];
        this.images = [];
    }
    setData(dataArray) {
        this.data = dataArray;
    }
    drawAllData() {
        for(var i=0; i<data.length;i++) {
            this.drawEntity(data[i]);
        }
    }
    preloadImageFromEntity(entity) {
        if(entity.renderer.type == "Image" || entity.renderer.type == "Sprite") {
            entity.renderer.imageObject = new Image();
            entity.renderer.imageObject.src = entity.renderer.source;
        }
    }
    preloadImagesFromAllEntities() {
        for(var i=0; i<data.length;i++) {
            this.preloadImageFromEntity(data[i]);
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

var canvas = document.getElementById("canvas");

var renderer = new CanvasRenderer();
renderer.setData(data);
renderer.preloadImagesFromAllEntities();
renderer.drawAllData();