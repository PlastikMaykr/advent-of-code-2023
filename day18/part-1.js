// console.log(input);

// constants
const dirs = {
    U: [0, -1],
    R: [1, 0],
    D: [0, 1],
    L: [-1, 0]
};

const pos = {
    xRange: [0, 0],
    yRange: [0, 0],
    x: 0,
    y: 0,
    moves: [[0, 0]]
};

// calc
const path = new Path2D();
path.moveTo(0, 0);
for (let i = 0; i < input.length; i++) {
    const [dir, dig] = input[i];
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

console.log(pos);
let width = pos.xRange[1] - pos.xRange[0] + 1;
let height = pos.yRange[1] - pos.yRange[0] + 1;
console.log({ width, height });


// draw
const canvas = document.querySelector('canvas');
canvas.height = height// * 10;
canvas.width = width// * 10;

const ctx = canvas.getContext('2d');
ctx.translate(0.5 - pos.xRange[0], 0.5 - pos.yRange[0]);

ctx.strokeStyle = 'white';
ctx.fillStyle = 'white';
ctx.stroke(path);
ctx.fill(path);

const lagoon = ctx.getImageData(0, 0, width, height).data;
console.log(lagoon);

let cubics = 0;
for (let i = 3; i < lagoon.length; i += 4) {
    if (lagoon[i] > 128) cubics++;
}
console.log({cubics});
