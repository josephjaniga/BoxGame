var pig = require('to-market'),
    p = process.env.PORT || 1337,
    GameServer = new pig.GameServer();

console.log("the port = " + p);

GameServer.init({
    connect: (id) => {
        // on connect add a new player client to the GameServer
        var c = new pig.Client({id: id});
        GameServer.clients[id] = c;
        // create a Entity and add it to the server
        // give it a reference to that player
        var r = new pig.Renderer({}),
            cm = new pig.CharacterMotion({id: id}),
            e = new pig.Entity({name: id, game: GameServer}),
            t = e.GetComponent("Transform"),
            c = new pig.Collider({}),
            rb = new pig.Rigidbody({transform:t, collider:c});

        // add the components
        e.addComponents([r, cm, c, rb]);
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
    port: p
});


/**
 * THIS HAS TO GET EASIER?
 */
var r = new pig.Renderer({}),
    PlatformEntity = new pig.Entity({name: "PLATFORM", game: GameServer}),
    c = new pig.Collider({}),
    t = PlatformEntity.GetComponent("Transform");

    t.size = {w:300, h:50};
    t.position = {x: -100, y: 300};

var rb = new pig.Rigidbody({transform:t, collider:c});

    rb.isKinematic = true;
    rb.useGravity = false;

PlatformEntity.addComponents([r, c, rb]);
GameServer.addEntities([PlatformEntity]);