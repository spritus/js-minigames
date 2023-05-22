const lemmings = [];
const walls = [];
const screen = document.getElementById("screen");

const W = 900;
const H = 600;
const LS = 20;
const speed = 2;

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
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.rot = 1;

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
            }
        }

        switch (this.rot) {
            case 1:
                if (this.y <= 0) this.rot = 1 + this.rot % 4;
                else {
                    this.oy = this.y;
                    this.y -= speed;
                }
                break;

            case 2:
                if (this.x >= W - LS) this.rot = 1 + this.rot % 4;
                else {
                    this.ox = this.x;
                    this.x += speed;
                }
                break;

            case 3:
                if (this.y >= H - LS) this.rot = 1 + this.rot % 4;
                else {
                    this.oy = this.y;
                    this.y += speed;
                }
                break;

            case 4:
                if (this.x <= 0) this.rot = 1 + this.rot % 4;
                else {
                    this.ox = this.x;
                    this.x -= speed;
                }
                break;
        }

        this.body.style.left = this.x + "px";
        this.body.style.top = this.y + "px";
    }
}

walls.push(new Wall(100, 150, 400, 50));
walls.push(new Wall(100, 350, 400, 50));

function lifeLoop() {
    for (lem of lemmings) {
        lem.action();
    }

    requestAnimationFrame(lifeLoop);
}

screen.onclick = (e) => {
    lemmings.push(new Lemming(e.offsetX, e.offsetY));
}

lifeLoop();