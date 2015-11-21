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
            entity = new Entity({name: id, game: gameServerInstance, parentClient: clientObject}),
            transformComponent = entity.GetComponent("Transform"),
            colliderComponent = new Collider({}),
            rigidbodyComponent = new Rigidbody({transform: transformComponent, collider: colliderComponent}),
            healthComponent = new Health({id: id}),
            shootComponent = new Shoot({});


        // add the components
        entity.addComponents([rendererComponent, characterMotionComponent, colliderComponent, rigidbodyComponent, healthComponent, shootComponent]);
        // add it to the server
        gameServerInstance.addEntities([entity]);
    },
    disconnect: (id)=> {
        // on disconnect remove the entity added for the client
        var entity = gameServerInstance.getEntityByName(id),
            index = gameServerInstance.entities.indexOf(entity);
        if (index > -1) {
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
(()=> {

    gameServerInstance.addEntities(require('./map1')(gameServerInstance));

})();

//Physics.Raycast({point: {x: 300, y: 20}, direction: {x: 0, y: 1}, game: gameServerInstance, distance: 300});
//Physics.Raycast({point: {x: 0, y: 0}, direction: {x: 1, y: -1}, game: gameServerInstance, distance: 1000});