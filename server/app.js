var pig = require('to-market'),
    GameServer = new pig.GameServer();

GameServer.init({
    connect: (id) => {
        // on connect add a new player client to the GameServer
        var c = new pig.Client({id: id});
        GameServer.clients[id] = c;
        // create a Entity and add it to the server
        // give it a reference to that player
        var r = new pig.Renderer({}),
            cm = new pig.CharacterMotion({id: id}),
            e = new pig.Entity({name: id, game: GameServer});

        // add the components
        e.addComponents([r,cm]);
        // add it to the server
        GameServer.addEntities([e]);
    },
    disconnect: (id)=>{
        // on disconnect Remove it
        var e = GameServer.getEntityByName(id),
            index = GameServer.entities.indexOf(e);
        if ( index > -1 ){
            GameServer.entities.splice(index, 1);
        }
        delete GameServer.clients[id];
    },
    port: null
});