const lemmings = [];
const screen = document.getElementById("screen");

const W = 900;
const H = 600;
const LS = 20;

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
        switch (this.rot) {
            case 1:
                if (this.y <= 0) this.rot = 1 + this.rot % 4;
                else this.y--;
                break;

            case 2:
                if (this.x >= W - LS) this.rot = 1 + this.rot % 4;
                else this.x++;
                break;

            case 3:
                if (this.y >= H - LS) this.rot = 1 + this.rot % 4;
                else this.y++;
                break;

            case 4:
                if (this.x <= 0) this.rot = 1 + this.rot % 4;
                else this.x--;
                break;
        }

        this.body.style.left = this.x + "px";
        this.body.style.top = this.y + "px";
    }
}

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