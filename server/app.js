var nameDoesNotMatter = require('to-market')(), // Init the Library
    portNumber = process.env.PORT || 1337,
    gameServerInstance = new GameServer();

console.log("the port = " + portNumber);

gameServerInstance.init({
    connect: (id) => {
        // on connect add a new player client to the GameServer
        var clientObject = new Client({id: id});
        gameServerInstance.clients[id] = clientObject;
        // create a Entity and add it to the server
        // give it a reference to that player
        var rendererComponent = new Renderer({}),
            characterMotionComponent = new CharacterMotion({id: id}),
            entity = new Entity({name: id, game: gameServerInstance}),
            transformComponent = entity.GetComponent("Transform"),
            colliderComponent = new Collider({}),
            rigidbodyComponent = new Rigidbody({transform:transformComponent, collider:colliderComponent});

        // add the components
        entity.addComponents([rendererComponent, characterMotionComponent, colliderComponent, rigidbodyComponent]);
        // add it to the server
        gameServerInstance.addEntities([entity]);
    },
    disconnect: (id)=>{
        // on disconnect remove the entity added for the client
        var entity = gameServerInstance.getEntityByName(id),
            index = gameServerInstance.entities.indexOf(entity);
        if ( index > -1 ){
            gameServerInstance.entities.splice(index, 1);
        }
        delete gameServerInstance.clients[id];
    },
    port: portNumber
});


/**
 * THIS HAS TO GET EASIER?
 */

var platformColor = gameServerInstance.getRandomColor();

// PLATFORM ONE
(()=> {
    var rendererComponent = new Renderer({color: platformColor}),
        PlatformEntity = new Entity({name: "PLATFORM ONE", game: gameServerInstance}),
        colliderComponent = new Collider({}),
        transformComponent = PlatformEntity.GetComponent("Transform");

    transformComponent.size = {w: 300, h: 50};
    transformComponent.position = {x: -100, y: 300};

    var rigidbodyComponent = new Rigidbody({transform: transformComponent, collider: colliderComponent});

    rigidbodyComponent.isKinematic = true;
    rigidbodyComponent.useGravity = false;

    PlatformEntity.addComponents([rendererComponent, colliderComponent, rigidbodyComponent]);
    gameServerInstance.addEntities([PlatformEntity]);
})();

// PLATFORM TWO
(()=> {
    var rendererComponent = new Renderer({color: platformColor}),
        PlatformEntity = new Entity({name: "PLATFORM TWO", game: gameServerInstance}),
        colliderComponent = new Collider({}),
        transformComponent = PlatformEntity.GetComponent("Transform");

    transformComponent.size = {w: 300, h: 50};
    transformComponent.position = {x: 250, y: 250};

    var rigidbodyComponent = new Rigidbody({transform: transformComponent, collider: colliderComponent});

    rigidbodyComponent.isKinematic = true;
    rigidbodyComponent.useGravity = false;

    PlatformEntity.addComponents([rendererComponent, colliderComponent, rigidbodyComponent]);
    gameServerInstance.addEntities([PlatformEntity]);
})();

Physics.Raycast({point:{x:300,y:20}, direction:{x:0,y:1}, game:gameServerInstance, distance: 300});
Physics.Raycast({point:{x:0,y:0}, direction:{x:1,y:-1}, game:gameServerInstance, distance: 1000});