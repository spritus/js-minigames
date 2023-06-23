const lemmings = [];
const walls = [];
const inDoors = [];
const outDoors = [];
const buttons = [];

/** Ekran gostergeci */
const screen = document.getElementById("screen");

const W = 900;
const H = 560;
let time = 0;
let role = null;
let icon = "";

class Wall {
    /**
     * Duvar olusturan sinif
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 36;

        this.body = document.createElement("div");
        this.body.classList.add("wall");
        this.body.style.left = this.x + "px";
        this.body.style.top = this.y + "px";
        this.body.style.width = this.size + "px";
        this.body.style.height = this.size + "px";
        screen.append(this.body);
    }
}

class Lemming {
    /**
     * Lemming olusturan sinif
     * @param {number} x    x koordinati
     * @param {number} y    y koordinati
     * @param {number} rot  gidis yonu
     */
    constructor(x, y, rot) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.rot = rot;
        this.role = null;
        this.speed = 0.5;

        let that = this;

        this.body = document.createElement("div");
        this.body.classList.add("lemming");
        this.body.style.left = this.x + "px";
        this.body.style.top = this.y + "px";
        screen.append(this.body);

        this.body.onclick = function () {
            that.body.innerHTML = icon;
            that.role = role;
            that.body.style.zIndex = "1";
        }
    }

    /** Ana dongude yapacagi isler */
    action() {
        for (let wall of walls) {
            if (collide(this, wall)) {
                this.rot = 1 + this.rot % 4;
                this.x = this.ox;
                this.y = this.oy;
            }
        }

        for (let door of outDoors) {
            if (collide(this, door)) {
                this.body.remove();
            }
        }

        if (this.role) this.role(this);

        this.ox = this.x;
        this.oy = this.y;

        switch (this.rot) {
            case 1:
                if (this.y < 0) {
                    this.rot = 2;
                    this.y = 0;
                }
                else this.y -= this.speed;
                break;

            case 2:
                if (this.x > W - this.size) {
                    this.rot = 3;
                    this.x = W - this.size;
                }
                else this.x += this.speed;
                break;

            case 3:
                if (this.y > H - this.size) {
                    this.rot = 4;
                    this.y = H - this.size;
                }
                else this.y += this.speed;
                break;

            case 4:
                if (this.x < 0) {
                    this.rot = 1;
                    this.x = 0;
                }
                else this.x -= this.speed;
                break;
        }

        this.body.style.left = this.x + "px";
        this.body.style.top = this.y + "px";
        if (this.rot) this.brot = this.rot;
    }
}

class InDoor {
    /**
     * Bir veya daha fazla lemming ureten kapi
     * @param {Number} x    x koordinati
     * @param {Number} y    y koordinati
     * @param {Number} lc   uretilecek lemming sayisi
     * @param {Number} rot  kapinin yonu
     */
    constructor(x, y, lc, rot) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.lc = lc;
        this.rot = rot;
        this.body = document.createElement("div");
        this.body.classList.add("generator");
        this.body.style.left = this.x + "px";
        this.body.style.top = this.y + "px";
        screen.append(this.body);
    }

    /** Ana dongude yapacagi isler */
    action() {
        if (this.lc > 0 && time % 50 == 0) {
            lemmings.push(new Lemming(this.x + 8, this.y + 8, this.rot));
            this.lc--;
        }
    }
}

class OutDoor {
    /**
     * Lemmingler icin cikis kapisi
     * @param {number} x x koordinati
     * @param {number} y y koordinati
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 36;
        this.body = document.createElement("div");
        this.body.classList.add("door");
        this.body.style.left = this.x + "px";
        this.body.style.top = this.y + "px";
        screen.append(this.body);
    }
}

class Button {
    /**
     * 
     * @param {number} x 
     * @param {string} bicon 
     * @param {number} brole 
     */
    constructor(x, bicon, brole) {
        this.body = document.createElement("button");
        this.body.classList.add("role");
        this.body.innerHTML = bicon;
        this.body.style.left = x + "px";
        this.role = brole;
        screen.append(this.body);
        let that = this;

        this.body.onclick = () => {
            for (let btn of buttons) {
                btn.body.classList.remove("active");
            }
            that.body.classList.add("active");
            role = that.role;
            icon = bicon;
        }
    }
}

walls.push(new Wall(100, 150, 400, 50));
walls.push(new Wall(100, 350, 400, 50));
walls.push(new Wall(500, 150, 50, 150));
walls.push(new Wall(50, 150, 50, 200));

inDoors.push(new InDoor(150, 250, 5, 1));
inDoors.push(new InDoor(270, 450, 15, 3));
inDoors.push(new InDoor(580, 400, 15, 4));

//doors.push(new Doors(270, 545));
outDoors.push(new OutDoor(270, 0));

buttons.push(new Button(0, "", (that) => {
    that.rot = that.brot || 3;
    that.role = null;
    that.speed = 0.5;
}));

buttons.push(new Button(40, "&#8678;", (that) => {
    that.rot = 0;
    that.brot = 4;
    for (let lemm of lemmings) {
        if (that != lemm && collide(that, lemm)) lemm.rot = that.brot;
    }
}));

buttons.push(new Button(80, "&#8680;", (that) => {
    that.rot = 0;
    that.brot = 2;
    for (let lemm of lemmings) {
        if (that != lemm && collide(that, lemm)) lemm.rot = that.brot;
    }
}));

buttons.push(new Button(120, "&#8679;", (that) => {
    that.rot = 0;
    that.brot = 1;
    for (let lemm of lemmings) {
        if (that != lemm && collide(that, lemm)) lemm.rot = that.brot;
    }
}));

buttons.push(new Button(160, "&#8681;", (that) => {
    that.rot = 0;
    that.brot = 3;
    for (let lemm of lemmings) {
        if (that != lemm && collide(that, lemm)) lemm.rot = that.brot;
    }
}));

buttons.push(new Button(200, "&#8623;", (that) => {
    that.speed = 1.2;
}));

/** Carpisma kontrolu */
function collide(obj1, obj2) {
    return obj1.x < obj2.x + obj2.size &&
        obj1.x + obj1.size > obj2.x &&
        obj1.y < obj2.y + obj2.size &&
        obj1.y + obj1.size > obj2.y;
}

/** Ana dongu */
function lifeLoop() {
    time++;
    for (lem of lemmings) {
        lem.action();
    }

    for (door of inDoors) {
        door.action();
    }

    requestAnimationFrame(lifeLoop);
}

screen.onclick = (e) => {
    //lemmings.push(new Lemming(e.offsetX, e.offsetY));
}

lifeLoop();