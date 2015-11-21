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
 * TODO: better but not good enough
 */

// PLATFORMS
(()=>{

    var platformColor = gameServerInstance.getRandomColor();

    var platformOne = new PhysicsEntity({
            name: "PLATFORM ONE",
            color: platformColor,
            useGravity: false,
            isKinematic: true,
            rendererType: "Rectangle",
            x:-100,
            y:300,
            w:300,
            h:50,
            game: gameServerInstance
        }),
        platformTwo = new PhysicsEntity({
            name: "PLATFORM TWO",
            color: platformColor,
            useGravity: false,
            isKinematic: true,
            rendererType: "Rectangle",
            x:250,
            y:250,
            w:300,
            h:50,
            game: gameServerInstance
        }),
        platformThree = new PhysicsEntity({
            name: "PLATFORM THREE",
            color: platformColor,
            useGravity: false,
            isKinematic: true,
            rendererType: "Rectangle",
            x:600,
            y:200,
            w:300,
            h:50,
            game: gameServerInstance
        });

    gameServerInstance.addEntities([platformOne, platformTwo, platformThree]);

})();

Physics.Raycast({point:{x:300,y:20}, direction:{x:0,y:1}, game:gameServerInstance, distance: 300});
Physics.Raycast({point:{x:0,y:0}, direction:{x:1,y:-1}, game:gameServerInstance, distance: 1000});