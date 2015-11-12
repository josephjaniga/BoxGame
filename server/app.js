var pig = require('to-market'),
    GameServer = new pig.GameServer();

GameServer.init({
    connect: (id) => {
        // on connect add a new entity to the GameServer
        GameServer.entities.push(
            new pig.Entity({
                name: id,
                components: [
                    new pig.Renderer()
                ]
            })
        );
    },
    disconnect: (id)=>{
        // on disconnect Remove it
        var e = GameServer.getEntityByName(id),
            index = GameServer.entities.indexOf(e);
        if ( index > -1 ){
            GameServer.entities.splice(index, 1);
        }
    },
    port: null
});