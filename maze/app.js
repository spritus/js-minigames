var area = document.createElement("div");
area.id = "area";
document.body.append(area);
var maze = [];
const w = 30;
const h = 20;
for (let n = 0; n < w * h; n++) {
    maze[n] = document.createElement("div");
    maze[n].classList.add("cell");
    area.append(maze[n]);
    maze[n].val = 0;
}

function cell(x, y) {
    return maze[x + y * w];
}

function set(x, y) {
    cell(x, y).val = 1;
    cell(x, y).style.backgroundColor = "white";
}

function get(x, y) {
    if (x < 0 || x >= w || y < 0 || y >= h) return 0;
    return cell(x, y).val;
}

/* for (let n = 0; n < 250; n++) {
    let x = Math.floor(Math.random() * w);
    let y = Math.floor(Math.random() * h);
    if (get(x, y) || (
        get(x - 1, y - 1) && get(x - 1, y) && get(x, y - 1) ||
        get(x, y - 1) && get(x + 1, y) && get(x + 1, y - 1) ||
        get(x - 1, y) && get(x - 1, y + 1) && get(x, y + 1) ||
        get(x + 1, y) && get(x, y + 1) && get(x + 1, y + 1)))
        n--;
    else
        set(x, y);
} */

function go(x, y) {
    if (get(x, y) || x < 0 || x >= w || y < 0 || y >= h || (
        get(x - 1, y - 1) && get(x - 1, y) && get(x, y - 1) ||
        get(x, y - 1) && get(x + 1, y) && get(x + 1, y - 1) ||
        get(x - 1, y) && get(x - 1, y + 1) && get(x, y + 1) ||
        get(x + 1, y) && get(x, y + 1) && get(x + 1, y + 1))) return;
    set(x, y);
    if (Math.random() * 100 > 40) go(x, y - 1);
    if (Math.random() * 100 > 40) go(x - 1, y);
    if (Math.random() * 100 > 40) go(x, y + 1);
    if (Math.random() * 100 > 40) go(x + 1, y);
}

go(w / 2, h / 2);