window.onload = function () {
    const CW = 40;
    const CH = 40;
    const W = 5;
    const H = 4;

    var cards = [];
    var curr = null;
    var t = 0;
    var g = 0;

    var area = document.createElement("div");
    var time = document.createElement("div");
    time.innerHTML = "0 sn";
    document.body.appendChild(time);
    document.body.appendChild(area);
    area.style.position = "relative";

    function getCard(x, y) {
        return cards[x + y * W];
    }

    var intv = setInterval(() => {
        t++;
        time.innerHTML = t + " sn";
    }, 1000);

    var n = 0;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            let card = document.createElement("div");
            with (card.style) {
                width = CW + "px";
                height = CH + "px";
                position = "absolute";
                boxSizing = "border-box";
                borderRadius = "10px";
                border = "solid 2px #ccc";
                cursor = "pointer";
            }
            card.style.left = (x * (CW + 2)) + "px";
            card.style.top = (y * (CH + 2)) + "px";
            area.appendChild(card);
            let obj = { box: card, value: null, id: n++ };
            cards.push(obj);
            card.onclick = function () {
                anime({
                    targets: obj.box,
                    keyframes: [
                        { scale: 0.9 },
                        { scale: 1 },
                    ],
                    duration: 200
                });
                if (curr == null) {
                    curr = obj;
                }
                else {
                    if (curr.id != obj.id && curr.value == obj.value) {
                        obj.box.onclick = curr.box.onclick = null;
                        anime({
                            targets: [obj.box, curr.box],
                            backgroundColor: "#fff",
                            duration: 5000
                        });
                        g++;
                        if (g >= (W * H) / 2) {
                            clearInterval(intv);
                            alert("Tebrikler " + t + " sn'de bitirdin!");
                        }
                    }
                    curr = null;
                }
            }
        }
    }

    function findEmpty() {
        x = Math.floor(Math.random() * W);
        y = Math.floor(Math.random() * H);
        if (getCard(x, y).value != null) return findEmpty()
        return getCard(x, y);
    }

    var v = 0;
    for (var n = 0; n < (W * H) / 2; n++) {
        setTimeout(() => {
            v++;
            b1 = findEmpty();
            b1.value = v;
            b2 = findEmpty();
            b2.value = v;
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            var color = "rgb(" + r + "," + g + "," + b + ")";
            b1.box.style.backgroundColor = color;
            b2.box.style.backgroundColor = color;
            anime({
                targets: [b1.box, b2.box],
                keyframes: [
                    { scale: 1.5, opacity: 0 },
                    { scale: 1, opacity: 1 },
                ]
            });
        }, n * 70);
    }
}