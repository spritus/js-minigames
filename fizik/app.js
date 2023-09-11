var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Events = Matter.Events,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composites = Matter.Composites;

const WIDTH = 800;
const HEIGHT = 550;

const CX = 120, CY = 350;

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

const image = Bodies.rectangle(400, 275, 1, 1, {
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

const level1 = "112,547 800,549 800,241 785,243 765,233 746,238 728,257 726,292 694,351 680,375 626,376 610,363 587,355 567,349 563,327 543,306 545,238 523,214 497,212 467,214 441,242 441,299 441,330 439,351 397,385 392,325 374,303 340,309 330,340 330,472 317,485 300,499 234,522 179,525 146,533";

var ground = Bodies.fromVertices(545, 375, Matter.Vertices.fromPath(level1),
    {
        isStatic: true,
        render: {
            visible: false
        }
    }, true);

var pyramid = Composites.pyramid(100, 200, 9, 10, 0, 0, function (x, y) {
    return Bodies.rectangle(x, y, 25, 40);
});

var rockOptions = { density: 0.004 },
    rock = Bodies.circle(CX, CY, 7, rockOptions),
    elastic = Constraint.create({
        pointA: { x: CX, y: CY },
        bodyB: rock,
        stiffness: 0.05
    });

var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

Events.on(engine, 'afterUpdate', function () {
    if (mouseConstraint.mouse.button === -1 && (rock.position.x > CX + 20 || rock.position.y < CY - 20)) {
        rock = Bodies.circle(CX, CY, 7, rockOptions);
        World.add(engine.world, rock);
        elastic.bodyB = rock;
    }
});

// add all of the bodies to the world
World.add(engine.world, [ground, image, rock, elastic]);

// run the renderer
Render.run(render);

// run the engine
Engine.run(engine);

