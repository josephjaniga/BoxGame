var pig = require('to-market');

pig({
    connect: (id) => {
        pig.entities[id] = {
            id: id,
            color:"#"+((1<<24)*Math.random()|0).toString(16),
            y:0,
            x:0,
            keyIsPressed: {
                up: false,
                down: false,
                left: false,
                right: false
            }
        };
    },
    disconnect: (id)=>{
        delete pig.entities[id];
    }
});

