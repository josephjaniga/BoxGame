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
];

class CanvasRenderer {
    constructor(canvas) {
        var canvas = canvas || document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.data = [];
    }
    setData(dataArray) {
        this.data = dataArray;
    }
    drawAllData() {
        for(var i=0; i<data.length;i++) {
            this.drawEntity(data[i]);
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
            entity.position.x,
            entity.position.y,
            entity.size.w,
            entity.size.h
        );
    }
    drawImage(entity) {
        // TODO: implement a method to draw a flat image on the canvas
    }
    drawSprite(entity) {
        // TODO: implement a method to draw a sprite based image on the canvas
    }
}

var canvas = document.getElementById("canvas");

var renderer = new CanvasRenderer();
renderer.setData(data);
renderer.drawAllData();

//var i = new Image();
//i.src = 'mario-jump.png';
//i.onload = function() {
//    ctx.drawImage(i, 0, 0, 100, 100);
//}

