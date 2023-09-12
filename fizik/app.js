const Engine = Matter.Engine,
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

// Motoru oluştur
const engine = Engine.create();
const world = engine.world;
const game = document.getElementById("game");

// Rendereri oluştur
const render = Render.create({
    element: game,
    engine: engine,
    options: {
        wireframes: false,
        width: WIDTH,
        height: HEIGHT
    }
});

// Zemin için texture yap
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

// Zemini oluştur
const level1 = "112,547 800,549 800,241 785,243 765,233 746,238 728,257 726,292 694,351 680,375 626,376 610,363 587,355 567,349 563,327 543,306 545,238 523,214 497,212 467,214 441,242 441,299 441,330 439,351 397,385 392,325 374,303 340,309 330,340 330,472 317,485 300,499 234,522 179,525 146,533";
const ground = Bodies.fromVertices(545, 375, Matter.Vertices.fromPath(level1),
    {
        isStatic: true,
        label: "ground",
        render: {
            visible: false
        }
    }, true);

// Bomba özellikleri
const bombOptions = {
    density: 0.004,
    friction: 0,
    label: "bombe",
    render: {
        fillStyle: "red"
    }
};

// İlk bombayı oluştur
let bomb = Bodies.circle(CX, CY, 7, bombOptions);

// Mancınık oluştur
const elastic = Constraint.create({
    pointA: { x: CX, y: CY },
    bodyB: bomb,
    stiffness: 0.01
});

// Mancınık bomba ve mouse bağlantılarını oluştur
const mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.5,
            label: "elastic",
            render: {
                visible: false
            }
        }
    });

World.add(world, mouseConstraint);

// Mouse işlemleri
render.mouse = mouse;
Events.on(engine, "afterUpdate", function () {
    if (mouseConstraint.mouse.button === -1 && (bomb.position.x > CX + 20 || bomb.position.y < CY - 20)) {
        bomb = Bodies.circle(CX, CY, 7, bombOptions);
        elastic.bodyB = bomb;
    }
});

// Bombanın ilk temas ettiği yerde yapılacaklar
let touch = false;
Events.on(engine, "collisionStart", function (event) {
    let obj = event.pairs[0].bodyB;

    if (obj.label == "bombe" && !touch) {
        obj.render.fillStyle = "green";
        touch = true;
        setTimeout(() => {
            Matter.Composite.remove(engine.world, obj);
            World.add(engine.world, bomb);
            touch = false;
        }, 3000);
    }
});

// Tüm materyalleri dünyaya ekle
World.add(engine.world, [ground, image, bomb, elastic]);

// Renderi çalıştır
Render.run(render);

// Motoru çalıştır
Engine.run(engine);