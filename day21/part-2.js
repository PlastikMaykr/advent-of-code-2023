const fs = require('node:fs');
const data = fs.readFileSync('input0.txt', 'utf8');

const dataArr = data
    .split('\r\n')
    .map(line => line.split(''));
// console.log(dataArr);

const rows = dataArr.length;
const cols = dataArr[0].length;
console.log({ rows, cols });

/**
 * @typedef {number[]} Coords
 * @description Coordinates of garden plot.
*/

/**
 * @typedef {Set<Coords>} Plots
 * @description Coordinates of a farm.
 */

/**
 * @typedef {number[]} FarmCoords
 * @description Coordinates of a farm.
 */

/**
 * @typedef {Set<FarmCoords>} Farms
 * @description Coordinates of a farm.
 */

/**
 * @typedef {Map<Coords, Farms>} Garden
 * @description Coordinates of a farm.
 */

/**
 * @typedef {number[]} Directive
 * @description Relative direction.
*/

/** @type {Object.<string,Directive>} */
const direction = { // [y, x]
    up: [1, 0],
    right: [0, 1],
    down: [-1, 0],
    left: [0, -1]
};

// build coordinates dictionary and rocks map
let startCoords;
/** @type {Plots} */
const rocks = new Set();
/** @type {Object.<string,Coords>} */
const coordinates = {};
// const gardens = Array(rows);
for (let y = 0; y < rows; y++) {
    // gardens[y] = Array(cols);
    for (let x = 0; x < cols; x++) {
        /** @type {Coords} */
        const coords = [y, x];
        // coordinates[`${y} ${x}`] = coords;
        coordinates[encode(y, x)] = coords;
        // moves.set(coords, []);
        // gardens[y][x] = new Map([[`${y} ${x}`, [y, x]]]);

        if (dataArr[y][x] === '#') {
            rocks.add(coords);
        } else if (dataArr[y][x] === 'S') {
            // prev.add(coords);
            startCoords = coords;
        }
    }
}
// console.log(coordinates);

// outside gardens
/** @type {Map<Coords,Directive>} */
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
// console.log(bounds);

/** @type {Garden} */
let prev = new Map();
/** @type {Garden} */
let next = new Map();
/** @type {Map<Coords, Coords[]>} */
const moves = new Map();
for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        const coords = keycode(y, x);
        if (rocks.has(coords)) continue;

        prev.set(coords, new Set());
        next.set(coords, new Set());

        /** @type {Coords[]} */
        const adjacent = [];
        moves.set(coords, adjacent);
        for (const dir in direction) {
            const [yOff, xOff] = direction[dir];
            const offCoords = keycode(y + yOff, x + xOff);
            // console.log({ offCoords });
            if (!rocks.has(offCoords)) {

                adjacent.push(offCoords);
            }
        }
    }
}
// console.log(moves);

// farms
const farms = {}
prev.get(startCoords).add(farmCode(0, 0));


print(prev);
// stepping();
const times = 1000;
running(times);

// visualize();
// Object.values(farms).forEach(val => console.log(val));
console.log(`In ${times} steps reached ${visited()} plots`);


// TODO: figure out the flickering between steps when entire farm is visited
// TODO: add completed farms to a Set and just check the flickering phase
// TODO: when summarizing visited plots
// TODO: only simulate stepping on uncompleted farms


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
// function decode(coords) {
//     return coordinates[coords];
// }

/**
 * @param {Number} y 
 * @param {Number} x 
 * @returns {Coords}
 */
function keycode(y, x) {
    return coordinates[encode(y, x)];
}

/**
 * Farms coordinates getter / generator
 * @param {Number} y 
 * @param {Number} x 
 * @returns {FarmCoords}
 */
function farmCode(y, x) {
    const code = encode(y, x);
    let coords = farms[code];
    if (!coords) {
        coords = [y, x];
        farms[code] = coords;
    }
    return coords;
}

function reset() {
    [prev, next] = [next, prev];
    for (const [, farmCoords] of next) {
        // console.log({ farmCoords });
        farmCoords.clear();
    }
}

function stepping() {
    for (const [plot, farmes] of prev) {
        if (!farmes.size) continue;
        for (const farm of farmes) {

            const adjacent = moves.get(plot);
            // console.log(adjacent);
            for (let step of adjacent) {
                // console.log(step);
                const nextSteps = next.get(step);
                if (bounds.has(step)) {
                    const [y, x] = step;
                    const [yBound, xBound] = bounds.get(step);
                    const loopStep = keycode(
                        y - (rows * yBound),
                        x - (cols * xBound)
                    );
                    const [yFarm, xFarm] = farm;
                    const farmidlo = farmCode(
                        yFarm + yBound,
                        xFarm + xBound
                    );
                    next.get(loopStep).add(farmidlo);
                } else {
                    nextSteps.add(farm);
                }
            }
        }
    }
    reset();
    // print(prev);
}

function running(steps) {
    if (steps < 1) return;
    
    if (!(steps % 100)) console.log(`In ${times - steps} steps reached ${visited()} plots`);
    
    stepping();
    running(steps - 1);
}

/** @param {Garden} gardens */
function print(gardens) {
    console.log('');
    gardens.forEach((val, key) => {
        if (val.size) {
            console.log(`plot[${key}] => farms: [${[...val].join('][')}]`);
        }
    });
}

function visualize() {
    const arr = structuredClone(dataArr);
    console.log('');
    prev.forEach((farms, plot) => {
        if (farms.size) {
            const [y, x] = plot;
            arr[y][x] = farms.size;
            // console.log(`plot[${plot}] => farms: [${[...farms].join('][')}]`);
        }
    });
    arr.forEach(line => {
        console.log(line.join(''));
    });
}

function visited() {
    let counter = 0;
    prev.forEach((val, key) => {
        counter += val.size;
        // if (val.size)
    });
    return counter;
}
