var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

const WIDTH = 800;
const HEIGHT = 550;

// create an engine
var engine = Engine.create();
const world = engine.world;
const game = document.getElementById("game");

// create a renderer
var render = Render.create({
    element: game,
    engine: engine,
    options: {
        wireframes: false,
        width: WIDTH,
        height: HEIGHT
    }
});

// create two boxes and a ground
var box = Bodies.rectangle(500, -200, 80, 80, {
    render: {
        color: "red"
    }
});

const level1 = "112,547 800,549 800,241 785,243 765,233 746,238 728,257 726,292 694,351 680,375 626,376 610,363 587,355 567,349 563,327 543,306 545,238 523,214 497,212 467,214 441,242 441,299 441,330 439,351 397,385 392,325 374,303 340,309 330,340 330,472 317,485 300,499 234,522 179,525 146,533";

var ground = Bodies.fromVertices(545, 375, Matter.Vertices.fromPath(level1),
    {
        isStatic: true,
        render: {
            visible: false
        }
    }, true);

const image = Bodies.rectangle(400, 275, 800, 550, {
    isStatic: true,
    render: {
        sprite: {
            texture: "./level1.png",
            xScale: 1,
            yScale: 1
        }
    }
});

image.collisionFilter = {};


// add all of the bodies to the world
World.add(engine.world, [box, ground, image]);

// run the renderer
Render.run(render);

// run the engine
Engine.run(engine);

