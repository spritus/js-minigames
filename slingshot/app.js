const W = 950, H = 550;
const { Engine, Bodies, Render, World } = Matter;
let engine, world;
let ground, box, bomb;

class Box {
    constructor(x, y, w, h, stat = false) {
        this.body = Bodies.rectangle(x + w / 2, y + h / 2, w, h);
        this.body.isStatic = stat;
        World.add(world, this.body);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    show() {
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
        this.body = Bodies.circle(x + this.r, y + this.r, this.r);
        World.add(world, this.body);
        this.x = x;
        this.y = y;
    }

    show() {
        const pos = this.body.position;
        const angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        fill(255);
        ellipseMode(RADIUS);
        circle(0, 0, this.r);
        pop();
    }
}

function setup() {
    createCanvas(W, H);
    engine = Engine.create();
    world = engine.world;
    ground = new Box(0, 500, 950, 50, true);
    box = new Box(300, 170, 20, 20);
    bomb = new Bomb(300, 100);
}

function draw() {
    background(0);
    Engine.update(engine);
    ground.show();
    box.show();
    bomb.show();
}