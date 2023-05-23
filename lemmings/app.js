const lemmings = [];
const walls = [];
const generators = [];
const doors = [];

const screen = document.getElementById("screen");

const W = 900;
const H = 600;
const LS = 20;
const speed = 0.5;

class Wall {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.body = document.createElement("div");
        this.body.classList.add("wall");
        this.body.style.left = this.x + "px";
        this.body.style.top = this.y + "px";
        this.body.style.width = this.w + "px";
        this.body.style.height = this.h + "px";
        screen.append(this.body);
    }
}

class Lemming {
    constructor(x, y, rot) {
        this.x = x;
        this.y = y;
        this.rot = rot;

        this.body = document.createElement("div");
        this.body.classList.add("lemming");
        this.body.style.left = this.x + "px";
        this.body.style.top = this.y + "px";
        screen.append(this.body);
    }

    action() {
        for (let wall of walls) {
            if (this.x < wall.x + wall.w &&
                this.x + LS > wall.x &&
                this.y < wall.y + wall.h &&
                this.y + LS > wall.y) {
                this.rot = 1 + this.rot % 4;
                this.x = this.ox;
                this.y = this.oy;
            }
        }

        for (let door of doors) {
            if (this.x < door.x + 36 &&
                this.x + LS > door.x &&
                this.y < door.y + 36 &&
                this.y + LS > door.y) {
                this.body.remove();
            }
        }

        this.ox = this.x;
        this.oy = this.y;

        switch (this.rot) {
            case 1:
                if (this.y < 0) {
                    this.rot = 1 + this.rot % 4;
                    this.y = 0;
                }
                else this.y -= speed;
                break;

            case 2:
                if (this.x > W - LS) {
                    this.rot = 1 + this.rot % 4;
                    this.x = W - LS;
                }
                else this.x += speed;
                break;

            case 3:
                if (this.y > H - LS) {
                    this.rot = 1 + this.rot % 4;
                    this.y = H - LS;
                }
                else this.y += speed;
                break;

            case 4:
                if (this.x < 0) {
                    this.rot = 1 + this.rot % 4;
                    this.x = 0;
                }
                else this.x -= speed;
                break;
        }

        this.body.style.left = this.x + "px";
        this.body.style.top = this.y + "px";
    }
}

class Generator {
    constructor(x, y, lc, rot) {
        this.x = x;
        this.y = y;
        this.lc = lc;
        this.rot = rot;
        this.body = document.createElement("div");
        this.body.classList.add("generator");
        this.body.style.left = this.x + "px";
        this.body.style.top = this.y + "px";
        screen.append(this.body);
    }

    action() {
        if (this.lc > 0) {
            setTimeout(() => {
                lemmings.push(new Lemming(this.x + 8, this.y + 8, this.rot));
            }, 1000 * this.lc);
            this.lc--;
        }
    }
}

class Doors {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.body = document.createElement("div");
        this.body.classList.add("door");
        this.body.style.left = this.x + "px";
        this.body.style.top = this.y + "px";
        screen.append(this.body);
    }
}

walls.push(new Wall(100, 150, 400, 50));
walls.push(new Wall(100, 350, 400, 50));
walls.push(new Wall(500, 150, 50, 150));
walls.push(new Wall(50, 150, 50, 200));

generators.push(new Generator(150, 250, 5, 1));
generators.push(new Generator(270, 450, 15, 3));
generators.push(new Generator(580, 400, 15, 4));

doors.push(new Doors(270, 545));
doors.push(new Doors(270, 0));

function lifeLoop() {
    for (lem of lemmings) {
        lem.action();
    }

    for (gen of generators) {
        gen.action();
    }

    requestAnimationFrame(lifeLoop);
}

screen.onclick = (e) => {
    //lemmings.push(new Lemming(e.offsetX, e.offsetY));
}

lifeLoop();