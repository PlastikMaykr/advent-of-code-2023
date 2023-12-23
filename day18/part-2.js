// constants
const dirs = {
    U: [0, -1],
    R: [1, 0],
    D: [0, 1],
    L: [-1, 0]
};

const last = ['R', 'D', 'L', 'U'];

const data = input.map(([, , hex]) => {
    const dec = hex.substring(1, 6);
    const dir = hex.substring(6, 7);
    return [last[dir], parseInt(dec, 16)];
});
console.log(data);


// calc
const info = {
    xRange: [0, 0],
    yRange: [0, 0],
    x: 0,
    y: 0,
};
let circ = 0
const points = [];
for (let i = 0; i < data.length; i++) {
    const [dir, dig] = data[i];
    let [xOff, yOff] = dirs[dir];
    xOff *= dig;
    yOff *= dig;
    info.x += xOff;
    info.y += yOff;

    circ += dig;
    points.push([info.x, info.y]);
}
console.log(info);
console.log(points);

let area = 0;
for (let i = 1; i < points.length; i += 1) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    area += (x1 - x2) * y2;
    // area += (x2 - x1) + (y2 - y1);
    // console.log(area);
}
area = Math.abs(area) + (circ/2) + 1;
console.log({ area });


// draw
const pos = {
    xRange: [0, 0],
    yRange: [0, 0],
    x: 0,
    y: 0,
    moves: [[0, 0]]
};
const path = new Path2D();
path.moveTo(0, 0);
for (let i = 0; i < data.length; i++) {
    let [dir, dig] = data[i];
    dig /= 10000;
    let [xOff, yOff] = dirs[dir];

    xOff *= dig;
    yOff *= dig;
    pos.x += xOff;
    pos.y += yOff;

    pos.moves.push([pos.x, pos.y]);
    path.lineTo(pos.x, pos.y);
    // if (pos.x > pos.xRange[0]) pos.xRange[0]
    pos.xRange[0] = Math.min(pos.xRange[0], pos.x);
    pos.xRange[1] = Math.max(pos.xRange[1], pos.x);
    pos.yRange[0] = Math.min(pos.yRange[0], pos.y);
    pos.yRange[1] = Math.max(pos.yRange[1], pos.y);
}

// console.log(pos);
let width = pos.xRange[1] - pos.xRange[0] + 1;
let height = pos.yRange[1] - pos.yRange[0] + 1;
// console.log({ width, height });

const canvas = document.querySelector('canvas');
canvas.height = height// * 10;
canvas.width = width// * 10;

const ctx = canvas.getContext('2d');
ctx.translate(0.5 - pos.xRange[0], 0.5 - pos.yRange[0]);

ctx.strokeStyle = 'white';
ctx.fillStyle = 'white';
ctx.stroke(path);
ctx.fill(path);
