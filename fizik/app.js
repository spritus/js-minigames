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
        width: WIDTH,
        height: HEIGHT
    }
});

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);

const level1 = [
    [{ "x": 725.5, "y": 257 }, { "x": 723.5, "y": 287 }, { "x": 782, "y": 240.5 }, { "x": 748, "y": 234.5 }, { "x": 736.5, "y": 241 }],
    [{ "x": 326.5, "y": 327 }, { "x": 327.5, "y": 343 }, { "x": 396.5, "y": 327 }, { "x": 391, "y": 314.5 }, { "x": 384, "y": 306.5 }, { "x": 368, "y": 299.5 }, { "x": 342, "y": 304.5 }, { "x": 331.5, "y": 315 }],
    [{ "x": 354, "y": 299.5 }, { "x": 342, "y": 304.5 }, { "x": 368, "y": 299.5 }],
    [{ "x": 792, "y": 239.5 }, { "x": 782, "y": 240.5 }, { "x": 716, "y": 311.5 }, { "x": 681, "y": 371.5 }, { "x": 798, "y": 549.5 }, { "x": 799.5, "y": 242 }],
    [{ "x": 760, "y": 232.5 }, { "x": 748, "y": 234.5 }, { "x": 782, "y": 240.5 }],
    [{ "x": 444.5, "y": 226 }, { "x": 438.5, "y": 238 }, { "x": 436.5, "y": 250 }, { "x": 437, "y": 350.5 }, { "x": 544.5, "y": 309 }, { "x": 496, "y": 210.5 }, { "x": 465, "y": 213.5 }, { "x": 452.5, "y": 219 }],
    [{ "x": 563.5, "y": 329 }, { "x": 544.5, "y": 309 }, { "x": 437, "y": 350.5 }, { "x": 426, "y": 356.5 }, { "x": 402.5, "y": 378 }, { "x": 570.5, "y": 347 }],
    [{ "x": 521, "y": 212.5 }, { "x": 497, "y": 210.5 }, { "x": 496, "y": 210.5 }, { "x": 544.5, "y": 309 }, { "x": 545.5, "y": 255 }, { "x": 539.5, "y": 227 }, { "x": 532.5, "y": 219 }],
    [{ "x": 396.5, "y": 327 }, { "x": 327.5, "y": 343 }, { "x": 325.5, "y": 353 }, { "x": 326.5, "y": 471 }, { "x": 396.5, "y": 381 }],
    [{ "x": 723.5, "y": 287 }, { "x": 716, "y": 311.5 }, { "x": 782, "y": 240.5 }],
    [{ "x": 544.5, "y": 239 }, { "x": 539.5, "y": 227 }, { "x": 545.5, "y": 255 }],
    [{ "x": 170, "y": 525.5 }, { "x": 118, "y": 542.5 }, { "x": 106, "y": 547.5 }, { "x": 106, "y": 549.5 }, { "x": 798, "y": 549.5 }, { "x": 214, "y": 525.5 }],
    [{ "x": 609, "y": 364.5 }, { "x": 585, "y": 356.5 }, { "x": 402.5, "y": 378 }, { "x": 626, "y": 374.5 }],
    [{ "x": 214, "y": 525.5 }, { "x": 798, "y": 549.5 }, { "x": 274, "y": 513.5 }],
    [{ "x": 274, "y": 513.5 }, { "x": 798, "y": 549.5 }, { "x": 307, "y": 496.5 }],
    [{ "x": 307, "y": 496.5 }, { "x": 798, "y": 549.5 }, { "x": 678, "y": 374.5 }, { "x": 402.5, "y": 378 }, { "x": 396.5, "y": 381 }],
    [{ "x": 681, "y": 371.5 }, { "x": 678, "y": 374.5 }, { "x": 798, "y": 549.5 }],
    [{ "x": 570.5, "y": 347 }, { "x": 402.5, "y": 378 }, { "x": 585, "y": 356.5 }]
];

var ground = Bodies.fromVertices(300, 200, level1, { isStatic: true, isSensor: false });

// add all of the bodies to the world
World.add(engine.world, [boxA, ground]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
