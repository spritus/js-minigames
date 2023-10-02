const W = 950, H = 550;
const { Engine, Body, Bodies, World, Mouse, MouseConstraint, Constraint, Events, Runner } = Matter;
let engine, world;
let ground, box, bomb, mConstraint, mouse, sling;
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
        this.body = Bodies.circle(x, y, this.r);
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
                console.log(this.frame);
                if (this.frame < 5) this.frame++;
                this.time++;
            }
        }
    }

    reset() {
        Body.setPosition(this.body, { x: 200, y: 200 });
        Body.setSpeed(this.body, 0);
        this.frame = 0;
        this.touch = false;
        this.size = 14;
        this.time = 0;
    }

    get x() {
        return this.body.position.x;
    }

    get y() {
        return this.body.position.y;
    }
}

class Sling {
    constructor(x, y, body) {
        this.body = Constraint.create({
            pointA: { x: x, y: y },
            bodyB: body,
            stiffness: 0.01,
            length: 0
        });
        World.add(world, this.body);
    }

    update() {
        if (this.body.bodyB) {
            stroke(255);
            alpha(0.5);

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

    ground = new Box(475, 550, 950, 50, true);
    box = new Box(300, 170, 20, 20);
    bomb = new Bomb(200, 200);
    sling = new Sling(200, 200, bomb.body);

    mouse = Mouse.create(canvas.elt);

    mConstraint = MouseConstraint.create(engine, {
        mouse: mouse
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
            setTimeout(() => {
                slingReset();
            }, 3000);
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