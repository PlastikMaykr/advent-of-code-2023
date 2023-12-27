const fs = require('node:fs');
const data = fs.readFileSync('input0.txt', 'utf8');

const dataArr = data
    .split('\r\n')
    .map(line => line.split(''));
console.log(dataArr);

const rows = dataArr.length;
const cols = dataArr[0].length;
console.log({ rows, cols });

const direction = { // [y, x]
    up: [1, 0],
    right: [0, 1],
    down: [-1, 0],
    left: [0, -1]
};

const rocks = new Set();
const prev = new Set();
const next = new Set();
const moves = new Map();
const coordinates = {};
// const gardens = Array(rows);
for (let y = 0; y < rows; y++) {
    // gardens[y] = Array(cols);
    for (let x = 0; x < cols; x++) {
        const coords = [y, x];
        // coordinates[`${y} ${x}`] = coords;
        coordinates[encode(y, x)] = coords;
 // TODO: ignore rocks in moves
        moves.set(coords, []);
        // gardens[y][x] = new Map([[`${y} ${x}`, [y, x]]]);

        if (dataArr[y][x] === '#') {
            rocks.add(coords);
        } else if (dataArr[y][x] === 'S') {
            prev.add(coords);
        }
    }
}

// outside gardens
const bounds = new Map();
for (let y = 0; y < rows; y++) {
    const left = [y, -1];
    coordinates[encode(y, -1)] = left;
    bounds.set(left, direction['left']);

    const right = [y, cols];
    coordinates[encode(y, cols)] = right;
    bounds.set(right, direction['right']);

}
for (let x = 0; x < cols; x++) {
    const down = [-1, x];
    coordinates[encode(-1, x)] = down;
    bounds.set(down, direction['down']);

    const up = [rows, x];
    coordinates[encode(rows, x)] = up;
    bounds.set(up, direction['up']);

}
// console.log(gardens);
console.log(coordinates);
console.log(bounds);
// console.log({ prev, rocks });

for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        const adjacent = moves.get(keycode(y, x));

        for (const dir in direction) {
            const [yOff, xOff] = direction[dir];
            // const offCoords = `${y + yOff} ${x + xOff}`;
            const offCoords = keycode(y + yOff, x + xOff);
            // console.log({ offCoords });
            /* if (bounds.has(offCoords)) {
                const [yBound, xBound] = bounds.get(offCoords);
                const loopCoords = keycode(
                    y + yOff - (rows * yBound),
                    x + xOff - (cols * xBound)
                );
                // console.log(offCoords, ' looped to ', loopCoords);
                adjacent.push(loopCoords);
            } else */
            if (!rocks.has(offCoords)) {
                // console.log(offCoords, ' is a rock');
                // next.add(offCoords);
                adjacent.push(offCoords);
            }
        }
    }
}
console.log(moves);

// TODO: gardens = Map(coord, Set(visited farms coords))
// TODO: prev & next hold gardens Maps
// TODO: farms = Set(farms coords)
// TODO: farms coords getter / generator function
// TODO: stepping() adds farms coords to gardens (prev & next)
// TODO: gardens.forEach.size (visited Set) => total visited garden plots
// TODO: in other words: keep track of visited garden plots in farms

// const plots = [];
// for (const dir in direction) {
//     const [yOff, xOff] = direction[dir];
//     // const [y, x] = step.split(' ').map(d => parseInt(d));
//     const offCoords = `${y + yOff} ${x + xOff}`;
//     // console.log({ offCoords });
//     if (!rocks.has(offCoords)) {
//         // console.log(offCoords, ' is a rock');
//         next.add(offCoords);
//     }
// }


/* 
for (const rock of rocks) {
    paint(rock, colors.grey, rocksImg);
}


let fps = 10;
const stepCount = 64;
let steps = 0;
 */


/**
 * 
 * @param {Number} y 
 * @param {Number} x 
 * @returns {String}
 */
function encode(y, x) {
    return `${y} ${x}`;
}
/**
 * 
 * @param {String} coords 
 * @returns {Array}
 */
function decode(coords) {
    return coordinates[coords];
}
/**
 * 
 * @param {Number} y 
 * @param {Number} x 
 * @returns {Array}
 */
function keycode(y, x) {
    return coordinates[encode(y, x)];
}

function paint(coords, color, imgData = image) {
    // console.log({coords});
    const [y, x] = coords.split(' ').map(d => parseInt(d));
    const i = (y * cols + x) * 4;
    // console.log({ y, x, i });
    const [r, g, b] = color.slice(4, -1).split(', ');
    imgData.data[i] = r;
    imgData.data[i + 1] = g;
    imgData.data[i + 2] = b;
}

function stepping() {
    resetImg();

    // next steps
    for (const step of prev) {
        for (const dir in direction) {
            const [y, x] = step.split(' ').map(d => parseInt(d));
            const [yOff, xOff] = direction[dir];
            const coords = `${y + yOff} ${x + xOff}`;
            // console.log({ coords });
            if (!rocks.has(coords)) {
                // console.log(coords, ' is a rock');
                next.add(coords);
            }
        }
    }
    prev.clear();

    // paint next steps
    for (const step of next) {
        paint(step, colors.white);
        prev.add(step);
    }
    next.clear();

    renderScaled();
    steps++;
    console.log({ steps, gardens: prev.size });
}

function animate() {
    if (steps === stepCount) return;
    stepping();
    requestAnimationFrame(animate);
}

function walk() {
    if (steps === stepCount) return;
    stepping();
    setTimeout(walk, 1000 / fps);
}
