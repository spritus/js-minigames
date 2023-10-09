const W = 950, H = 550;
const SX = 150, SY = 350;
const { Engine, Body, Bodies, World, Mouse, MouseConstraint, Constraint, Events, Runner, Vertices, Query } = Matter;
let engine, world;
let ground, box, bomb, mConstraint, mouse, sling, levelImg;
let bombSprites = [];

class Box {
    constructor(x, y, w, h, stat = false) {
        this.body = Bodies.rectangle(x, y, w, h);
        this.body.isStatic = stat;
        World.add(world, this.body);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    update() {
        const pos = this.body.position;
        const angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        fill(255);
        rectMode(CENTER);
        rect(0, 0, this.w, this.h);
        pop();
    }
}

class Bomb {
    constructor(x, y) {
        this.r = 7;
        this.body = Bodies.circle(x, y, this.r, { collisionFilter: { category: 2 } });
        World.add(world, this.body);
        this.touch = false;
        this.frame = 0;
        this.size = 14;
        this.time = 0;
    }

    update() {
        const pos = this.body.position;
        image(bombSprites[this.frame], pos.x, pos.y, this.size, this.size);
    }

    explode() {
        if (this.time == 33) this.frame = 2;
        if (this.time < 33) {
            this.size = 14;
            if (frameCount % 5 == 0) {
                this.frame = (this.frame + 1) % 2;
                this.time++;
            }
        }
        else {
            this.size = 14 * 4;
            if (frameCount % 3 == 0) {
                if (this.frame < 5) this.frame++;
                this.time++;
            }
        }
    }

    reset() {
        Body.setPosition(this.body, { x: SX, y: SY });
        Body.setSpeed(this.body, 0);
        this.frame = 0;
        this.touch = false;
        this.size = 14;
        this.time = 0;
        this.body.collisionFilter.category = 2;
    }

    get x() {
        return this.body.position.x;
    }

    get y() {
        return this.body.position.y;
    }
}

class Ground {
    constructor(x, y, img, verts) {
        this.body = Bodies.fromVertices(x, y, Vertices.fromPath(verts), {
            isStatic: true
        }, true);
        World.add(world, this.body);

        this.img = img;
    }

    update() {
        const pos = this.body.position;
        image(this.img, pos.x - 147, pos.y - 100);
    }
}

class Sling {
    constructor(x, y, body) {
        this.body = Constraint.create({
            pointA: { x: x, y: y },
            bodyB: body,
            stiffness: 0.02,
            length: 0,
        });
        World.add(world, this.body);
    }

    update() {
        if (this.body.bodyB) {
            stroke(55);
            strokeWeight(3);

            const posA = this.body.pointA;
            const posB = this.body.bodyB.position;
            line(posA.x, posA.y, posB.x, posB.y);
        }
    }
}

function slingReset() {
    bomb.reset();
    sling.body.bodyB = bomb.body;
}

function preload() {
    spritesheet = loadImage("./assets/sprites.png");
    levelImg = loadImage("./assets/level1.png");
}

function setup() {
    const canvas = createCanvas(W, H);
    imageMode(CENTER);

    for (let n = 0; n < 2; n++) {
        bombSprites.push(spritesheet.get(n * 32, 0, 32, 32));
    }

    for (let n = 0; n <= 3; n++) {
        bombSprites.push(spritesheet.get(64 + n * 96, 0, 96, 96));
    }

    engine = Engine.create({
        wireFrame: true
    });
    world = engine.world;
    Runner.run(engine);

    ground = new Ground(697, 380, levelImg, "112,547 800,549 800,241 785,243 765,233 746,238 728,257 726,292 694,351 680,375 626,376 610,363 587,355 567,349 563,327 543,306 545,238 523,214 497,212 467,214 441,242 441,299 441,330 439,351 397,385 392,325 374,303 340,309 330,340 330,472 317,485 300,499 234,522 179,525 146,533");
    box = new Box(350, 170, 20, 20);
    bomb = new Bomb(SX, SY);
    sling = new Sling(SX, SY, bomb.body);

    mouse = Mouse.create(canvas.elt);

    mConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        collisionFilter: { mask: 2 }
    });
    World.add(world, mConstraint);

    Events.on(engine, "afterUpdate", function () {
        if (mConstraint.mouse.button === -1 && (bomb.body.position.x > sling.body.pointA.x + 20 || bomb.body.position.y < sling.body.pointA.y - 20)) {
            sling.body.bodyB = null;
        }
    });

    Events.on(engine, "collisionStart", function (event) {
        let obj = event.pairs[0].bodyB;

        if (obj == bomb.body && !bomb.touch) {
            bomb.touch = true;
            bomb.body.collisionFilter.category = 1;
            setTimeout(() => {
                slingReset();
            }, 2950);
        }
    });

    const maxLen = 120;
    Events.on(engine, "beforeUpdate", (event) => {
        if (sling.body.bodyB) {
            const dx = sling.body.pointA.x - sling.body.bodyB.position.x;
            const dy = sling.body.pointA.y - sling.body.bodyB.position.y;
            const currentLength = Math.sqrt(dx * dx + dy * dy);

            if (currentLength > maxLen) {
                const angle = Math.atan2(dy, dx);
                const targetX = sling.body.pointA.x - Math.cos(angle) * maxLen;
                const targetY = sling.body.pointA.y - Math.sin(angle) * maxLen;
                Body.setPosition(sling.body.bodyB, { x: targetX, y: targetY }, true);
            }

            if (sling.body.bodyB.position.x > sling.body.pointA.x) {
                //Body.setPosition(sling.body.bodyB, { x: sling.body.pointA.x, y: sling.body.bodyB.position.y }, true);
            }
        }
    });

    frameRate(60);
}

function draw() {
    background(0);
    ground.update();
    box.update();
    sling.update();
    bomb.update();

    if (bomb.touch) {
        bomb.explode();
    }

    if (!bomb.touch && bomb.y > 560) {
        slingReset();
    }
}