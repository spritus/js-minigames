class Kutu {
    x = 0
    y = 0
    constructor(x, y, color, target) {
        this.x = x
        this.y = y
        this.color = color

        this.body = document.createElement("div")
        this.body.style.position = "absolute"
        this.body.style.left = this.x + "px"
        this.body.style.top = this.y + "px"
        this.body.style.width = "25px"
        this.body.style.height = "25px"
        this.body.style.borderRadius = "5px"
        this.body.style.backgroundColor = this.color
        target.append(this.body)
    }

    move(x, y) {
        this.x = x
        this.y = y
        this.body.style.left = this.x + "px"
        this.body.style.top = this.y + "px"
    }

    changeColor(color) {
        this.onChangeColor(this.color, color)
        this.color = color
        this.body.style.backgroundColor = this.color
    }

    /**
     * Renk degistiginde calisacak metod
     * @param {number} oldC - Degismeden onceki renk
     * @param {number} newC - Yeni renk
     * @example
     * ktu.onchangeColor=function(oldC,newC) ...
     */
    onChangeColor(oldC, newC) {
    }

    update() {
    }
}