const W = 950, H = 550;
const { Engine, Body, Bodies, World, Mouse, MouseConstraint, Constraint, Events, Runner } = Matter;
let engine, world;
let ground, box, bomb, mConstraint, mouse, sling;

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
        this.body = Bodies.circle(x, y, this.r);
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

class Sling {
    constructor(x, y, body) {
        this.body = Constraint.create({
            pointA: { x: x, y: y },
            bodyB: body,
            stiffness: 0.02,
            length: 0
        });
        World.add(world, this.body);
    }

    show() {
        if (this.body.bodyB) {
            stroke(255);
            const posA = this.body.pointA;
            const posB = this.body.bodyB.position;
            line(posA.x, posA.y, posB.x, posB.y);
        }
    }
}

function setup() {
    const canvas = createCanvas(W, H);
    engine = Engine.create({
        wireFrame: true
    });
    Runner.run(engine);
    world = engine.world;
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
            setTimeout(() => {
                console.log("o");
                Body.setPosition(bomb.body, { x: 200, y: 200 });
                sling.body.bodyB = bomb.body;
            }, 3000);
        }
    });
}

function draw() {
    background(0);
    ground.show();
    box.show();
    bomb.show();
    sling.show();
    //if (frameCount == 100) Body.setPosition(box.body, 450, 200);
}