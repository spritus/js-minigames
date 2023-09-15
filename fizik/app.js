const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Events = Matter.Events,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composites = Matter.Composites;

const WIDTH = 950;
const HEIGHT = 550;

const CX = 180, CY = 350;

// Motoru oluştur
const engine = Engine.create({
    positionIterations: 10,  // Çarpışma sızıntıları olmaması için 
    velocityIterations: 10   // hassasiyet arttırılıyor
});
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
const image = Bodies.rectangle(550, 275, 1, 1, {
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

// Dünya zemini
const earth = Bodies.rectangle(-30000, 620, 70000, 100, { isStatic: true });

// Zemini oluştur
const level1 = "112,547 800,549 800,241 785,243 765,233 746,238 728,257 726,292 694,351 680,375 626,376 610,363 587,355 567,349 563,327 543,306 545,238 523,214 497,212 467,214 441,242 441,299 441,330 439,351 397,385 392,325 374,303 340,309 330,340 330,472 317,485 300,499 234,522 179,525 146,533";
const ground = Bodies.fromVertices(695, 375, Matter.Vertices.fromPath(level1),
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
    friction: 0.001,
    label: "bomb",
    inertia: Infinity,
    render: {
        fillStyle: "red",
        sprite: {
            texture: "./bomb0.png",
            xScale: 0.4,
            yScale: 0.4
        }
    }
};

// İlk bombayı oluştur
let bomb = Bodies.circle(CX, CY, 7, bombOptions);

// Sapan oluştur
const sling = Constraint.create({
    pointA: { x: CX, y: CY },
    bodyB: bomb,
    label: "sling",
    stiffness: 0.02,
    render: {
        //visible: false,
        lineWidth: 4,
        strokeStyle: "rgba(100,100,100,0.3)"
    }
});

// Sapan bomba ve mouse bağlantılarını oluştur
const mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.05,
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
        sling.bodyB = bomb;
    }
});

// Bombanın ilk temas ettiği yerde yapılacaklar
let touch = false;
Events.on(engine, "collisionStart", function (event) {
    let obj = event.pairs[0].bodyB;

    if (obj.label == "bomb" && !touch) {
        obj.render.fillStyle = "green";
        touch = true;
        setTimeout(() => {
            Matter.Composite.remove(engine.world, obj);
            World.add(engine.world, bomb);
            touch = false;
        }, 3000);
    }
});

const maxLen = 120;
let anm = 0;
Events.on(engine, "beforeUpdate", (event) => {
    let abomb = Matter.Composite.allBodies(world).find((body) => body.label == "bomb");
    if (touch && Math.round(event.timestamp) % 100 == 0) {
        anm = (anm + 1) % 2;
        abomb.render.sprite.texture = "./bomb" + anm + ".png";
    }
    const dx = sling.pointA.x - sling.bodyB.position.x;
    const dy = sling.pointA.y - sling.bodyB.position.y;
    const currentLength = Math.sqrt(dx * dx + dy * dy);

    if (currentLength > maxLen) {
        const angle = Math.atan2(dy, dx);
        const targetX = sling.pointA.x - Math.cos(angle) * maxLen;
        const targetY = sling.pointA.y - Math.sin(angle) * maxLen;
        Matter.Body.setPosition(sling.bodyB, { x: targetX, y: targetY }, true);
    }
});

// Tüm materyalleri dünyaya ekle
World.add(engine.world, [earth, ground, image, bomb, sling]);

// Renderi çalıştır
Render.run(render);

// Motoru çalıştır
Engine.run(engine);