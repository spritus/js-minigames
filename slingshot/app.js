const W = 950, H = 550;

class Box {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        fill(255);
        rect(this.x, this.y, this.w, this.h);
    }
}

function setup() {
    createCanvas(W, H);
}

function draw() {
    background(0);
    const ground = new Box(0, 500, 950, 50);
}