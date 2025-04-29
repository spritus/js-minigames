"use strict"
const SCREENSIZE = 600
const screen = document.createElement("div")
const puanDiv = document.createElement("div")
const kutular = []
const pos = []

let apple = {}
let rot = 0
let gameover = false
let puan = 0

screen.append(puanDiv)
puanDiv.style.color = "white"
puanDiv.style.fontWeight = "600"
puanDiv.innerText = "Puan: 0"

document.body.append(screen)
screen.style.width = SCREENSIZE + "px"
screen.style.height = SCREENSIZE + "px"
screen.style.backgroundColor = "black"
screen.style.overflow = "hidden"
screen.style.position = "relative"
screen.style.margin = "20px auto"
screen.style.outline = "solid 4px white"

kutular.push(new Kutu(SCREENSIZE / 2, SCREENSIZE / 2, "green", screen))

function collision(obj1, obj2) {
    // Nesne1'in sınırları
    const obj1Left = obj1.x + 3;
    const obj1Right = obj1.x + 22;
    const obj1Top = obj1.y + 3;
    const obj1Bottom = obj1.y + 22;

    // Nesne2'nin sınırları
    const obj2Left = obj2.x + 3;
    const obj2Right = obj2.x + 22;
    const obj2Top = obj2.y + 3;
    const obj2Bottom = obj2.y + 22;

    // Çarpışma kontrolü
    if (
        obj1Right > obj2Left &&
        obj1Left < obj2Right &&
        obj1Bottom > obj2Top &&
        obj1Top < obj2Bottom
    ) {
        return true; // Çarpışma var
    }
    return false; // Çarpışma yok
}

function kuyrukEkle() {
    const a = kutular.length;
    const kutu = new Kutu(0, 0, "green", screen);
    kutu.update = function () {
        kutu.move(pos[a * 9]?.x || 0, pos[a * 9]?.y || 0);
    };
    kutular.push(kutu);
}

for (let n = 1; n < 3; n++) {
    kuyrukEkle()
}

kutular[0].update = function () {
    switch (rot) {
        case 0:
            if (this.x < SCREENSIZE - 25) this.move(this.x + 3, this.y)
            break;

        case 1:
            if (this.y < SCREENSIZE - 25) this.move(this.x, this.y + 3)
            break;

        case 2:
            if (this.x > 0) this.move(this.x - 3, this.y)
            break;

        case 3:
            if (this.y > 0) this.move(this.x, this.y - 3)
            break;
    }
    pos.unshift({ x: this.x, y: this.y })
    if (pos.length > kutular.length * 10) pos.length = kutular.length * 10;

    if (!gameover && collision(this, apple)) {
        apple.move(Math.round(Math.random() * (SCREENSIZE - 25)), Math.round(Math.random() * (SCREENSIZE - 25)))
        kuyrukEkle()
        puanDiv.innerText = "Puan:" + (++puan)
    }

    for (const kutu in kutular) {
        if (!gameover && (this.x <= 0 || this.x >= SCREENSIZE - 25 || this.y <= 0 || this.y >= SCREENSIZE - 25 || kutu > 1 && collision(this, kutular[kutu]))) {
            //alert("Oyun bitti, Puanın " + puan)
            const go = document.createElement("div")
            go.innerText = "Oyun bitti Puanın " + puan
            Object.assign(go.style, {
                fontFamily: "sans-serif",
                position: "absolute",
                top: "-50px",
                left: "50%",
                transform: "translate(-50%,-50%)",
                fontSize: "30px",
                color: "white",
                fontWeight: "600",
                pointerEvents: "none"
            })
            screen.append(go)

            const explode = document.createElement("div")
            Object.assign(explode.style, {
                position: "absolute",
                width: "5px",
                height: "5px",
                top: (kutular[0].y + 12) + "px",
                left: (kutular[0].x + 12) + "px",
                backgroundColor: "red",
                borderRadius: "50%",
                transform: "translate(-50%,-50%)"
            })
            screen.append(explode)

            let top = -50
            let exp = 5
            const gotimer = setInterval(() => {
                top += 10
                exp += 3
                if (top >= 300) clearInterval(gotimer)
                go.style.top = top + "px"
                explode.style.width = exp + "px"
                explode.style.height = exp + "px"
                explode.style.opacity = (100 - exp) / 100
                for (let kutu of kutular) kutu.body.style.opacity = (100 - exp) / 100
            }, 16)

            gameover = true
        }
    }
}

window.onkeydown = function (e) {
    switch (e.code) {
        case "ArrowRight": if (rot != 2) rot = 0
            break

        case "ArrowDown": if (rot != 3) rot = 1
            break

        case "ArrowLeft": if (rot != 0) rot = 2
            break

        case "ArrowUp": if (rot != 1) rot = 3
            break
    }
}

apple = new Kutu(Math.round(Math.random() * (SCREENSIZE - 25)), Math.round(Math.random() * (SCREENSIZE - 25)), "red", screen)
apple.body.style.borderRadius = "50%"

setInterval(() => {
    for (const kutu of kutular) kutu.update()
}, 16)