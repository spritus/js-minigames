window.onload = function () {
    btnStart.onclick = function () {
        const MS = 30;
        var col = inpCol.value;
        var row = inpRow.value;
        var mineCount = inpMine.value;
        var mines = [];

        class Mine {
            constructor(x, y) {
                this.box = document.createElement("div");
                this.box.classList.add("mine");
                this.box.style.left = x + "px";
                this.box.style.top = y + "px";
                gameArea.appendChild(this.box);

                this.status = false;
                this.value = 0;
            }
        }

        function getMine(x, y) {
            return mines[x + y * col];
        }

        function setMine(x, y) {
            if (x >= 0 && x < col && y >= 0 && y < row && getMine(x, y).value != "*") {
                getMine(x, y).value++;
            }
        }

        function gameOver() {
            mines.map(m => {
                if (m.value != -1 && m.value != 0) m.box.innerHTML = m.value;
                m.box.style.border = "inset 3px";
                m.box.onclick = null;
            });
        }

        if (col > 1 && col < 25 && row > 1 && row < 25 && mineCount > 0 && mineCount < (col * row / 2)) {
            mines = [];
            gameArea.innerHTML = "";
            gameStatus.innerHTML = "Hadi mayınları bul ama dikkatli ol!";

            for (let y = 0; y < row; y++) {
                for (let x = 0; x < col; x++) {
                    let mine = new Mine(x * MS, y * MS);
                    if (x < col - 1) mine.box.style.float = "left";
                    mines.push(mine);
                    mine.box.oncontextmenu = function () {
                        mine.status = !mine.status;
                        mine.box.style.backgroundColor = mine.status ? "yellow" : "";
                        if (mines.filter(m => m.status).length == mineCount && mines.filter(m => m.value == "*").filter(m => !m.status).length == 0) {
                            gameStatus.innerHTML = "Bravo tüm mayınları buldun!";
                            gameOver();
                        }
                        return false;
                    }
                    mine.box.onclick = function (e) {
                        if (mine.value == "*") {
                            mine.box.innerHTML = "*";
                            mine.box.style.backgroundColor = "red";
                            mine.box.style.border = "inset 3px";
                            gameStatus.innerHTML = "Mayın Patladı. Oyun bitti!";
                            gameOver();
                        }
                        if (mine.value > 0) {
                            mine.box.innerHTML = mine.value;
                            mine.box.style.border = "inset 3px";
                        }
                        else if (mine.value == 0) {
                            (function openEmpty(mx, my) {
                                if (mx >= 0 && mx < col && my >= 0 && my < row && getMine(mx, my).value == 0) {
                                    getMine(mx, my).box.style.border = "inset 3px";
                                    getMine(mx, my).value = -1;

                                    openEmpty(mx, my - 1);
                                    openEmpty(mx - 1, my);
                                    openEmpty(mx + 1, my);
                                    openEmpty(mx, my + 1);
                                }
                            })(x, y);
                        }
                    }
                }
            }

            for (var n = 0; n < mineCount; n++) {
                var rx = Math.floor(Math.random() * col);
                var ry = Math.floor(Math.random() * row);

                if (getMine(rx, ry).value != "*") {
                    getMine(rx, ry).value = "*";
                    setMine(rx - 1, ry - 1);
                    setMine(rx, ry - 1);
                    setMine(rx + 1, ry - 1);
                    setMine(rx - 1, ry);
                    setMine(rx + 1, ry);
                    setMine(rx - 1, ry + 1);
                    setMine(rx, ry + 1);
                    setMine(rx + 1, ry + 1);
                }
                else {
                    n--;
                }
            }
        }
        else {
            gameStatus.innerHTML = "Girilen değerler hatalı";
        }
    }
}