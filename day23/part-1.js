const coordinates = {};

const direction = { // [y, x]
    up: [-1, 0],
    right: [0, 1],
    down: [1, 0],
    left: [0, -1]
};

const opposite = {
    up: 'down',
    right: 'left',
    down: 'up',
    left: 'right'
}

const slopeDir = {
    '^': 'up',
    '>': 'right',
    'v': 'down',
    '<': 'left'
};

const slopeChars = [...Object.keys(slopeDir)]//['^', '>', 'v', '<',];

const colors = {
    khaki: 'rgb(240, 230, 140)', // 'khaki',
    dark: 'rgb(189, 183, 107)', // 'darkkhaki',
    grey: 'rgb(128, 128, 128)', // 'grey'
    white: 'rgb(255, 255, 255)', // 'white'
};

const root = document.querySelector('body');
const height = root.clientHeight;
const width = root.clientWidth;

const rows = input.length;
const cols = input[0].length;

const scaledCanvas = document.querySelector('canvas');
const scaledCtx = scaledCanvas.getContext('2d');

const canvas = new OffscreenCanvas(cols, rows);
const ctx = canvas.getContext('2d');

const scale = Math.min(
    Math.floor(height / rows),
    Math.floor(width / cols)
);
console.log({ scale });

const scaledWidth = cols * scale;
const scaledHeight = rows * scale;
scaledCanvas.width = scaledWidth;
scaledCanvas.height = scaledHeight;
scaledCtx.imageSmoothingEnabled = false;

ctx.fillStyle = colors.khaki;
ctx.fillRect(0, 0, cols, rows);

const rocksImg = ctx.getImageData(0, 0, cols, rows);

const rocks = new Set();
const slopes = new Set();
// const prev = new Set();
// const next = new Set();
for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        const coords = [y, x];
        coordinates[encode(y, x)] = coords;
        if (input[y][x] === '#') {
            rocks.add(coords);
        } else if (slopeChars.includes(input[y][x])) {
            slopes.add(coords);
        }
    }
}
// console.log({ prev, rocks });
console.log({ rocksImg });

let beginning, ending;
for (let x = 0; x < cols; x++) {
    if (input[0][x] === '.') beginning = keycode(0, x);
    if (input[rows - 1][x] === '.') ending = keycode(rows - 1, x);
}
console.log({ beginning, ending });
paint(beginning, colors.white, rocksImg);
paint(ending, colors.white, rocksImg);


// paint rocks and slopes
for (const rock of rocks) {
    paint(rock, colors.grey, rocksImg);
}
for (const slope of slopes) {
    paint(slope, colors.dark, rocksImg);
}

let image;
resetImg();
renderScaled();

// routing(beginning, 'down');
const hike = hiking();
console.log({ hike });


// let fps = 10;
// const stepCount = 64;
// let steps = 0;
// scaledCanvas.addEventListener('click' , () => {
//     // while (steps < stepCount) {
//     //     stepping();
//     // }

//     // animate();

//     walk();
// }, {once: true});


function paint(coords, color, imgData = image) {
    // console.log({coords});
    const [y, x] = coords//.split(' ').map(d => parseInt(d));
    const i = (y * cols + x) * 4;
    // console.log({ y, x, i });
    const [r, g, b] = color.slice(4, -1).split(', ');
    imgData.data[i] = r;
    imgData.data[i + 1] = g;
    imgData.data[i + 2] = b;
}

function resetImg() {
    image = new ImageData(
        new Uint8ClampedArray(rocksImg.data),
        rocksImg.width,
        rocksImg.height
    );
}

function renderScaled() {
    ctx.putImageData(image, 0, 0);
    scaledCtx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight);
}

function hiking() {
    const hike = routing(beginning, 'down');

    let next = rerouting(hike);
    hike.next = next;

// TODO: recursively build all possible routes graph

    // while (Array.isArray(next)) {

        for (const reroute of hike.next) {
            next = rerouting(reroute);
            // if (next) reroute.next
            reroute.next = next.filter(d => Array.isArray(d));
        }
    // }
        
}

function rerouting(route) {
    const last = route.at(-1);
    if (last[0] === ending) return true; // ending reached

    const walks = walking(...last);
    const routes = [];
    for (const walk of walks) {
        const nextRoute = routing(...walk);
        if (nextRoute.length) routes.push(nextRoute);
    }
    return routes;
}

function routing(start, vel) {
    let route = [];
    let next = [[start, vel]];
    while (next.length === 1) {
        route.push(next);
        next = walking(...next[0]);
        if (!next.length) return [];
        if (next[0][0] === ending) console.log('this is the end');
    }
    return route;
}

function walking(coord, vel) {
    console.log(`walking from ${coord} ${vel}`);
    const [y, x] = coord;
    let next = [];
    for (const dir in direction) {
        // console.log(vel, ' <-> ', opposite[dir]);
        if (opposite[dir] === vel) continue;
        const [yOff, xOff] = direction[dir];
        const [yNext, xNext] = [y + yOff, x + xOff];
        const nextCoord = keycode(yNext, xNext);
        console.log({ dir, yNext, xNext, nextCoord });
        if (!nextCoord || rocks.has(nextCoord)) continue;

        if (slopes.has(nextCoord) && // slopeChars.includes(input[yNext][xNext])
            slopeDir[input[yNext][xNext]] === opposite[dir]) {
            // slope points in the direction where coming from
            // therefore entire route is not valid
            console.log('invalid slope direction');
            return [];
        } else {
            console.log(`to ${nextCoord} ${dir}`);
            next.push([nextCoord, dir]);
        }
        if (nextCoord === ending) return [[nextCoord, dir]];
    }
    return next;
}

function forking(coord, vel) {
    
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

function run() {
    if (steps === stepCount) return;
    stepping();
    setTimeout(run, 1000 / fps);
}

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
 * @param {Number} y 
 * @param {Number} x 
 * @returns {Coords}
 */
function keycode(y, x) {
    return coordinates[encode(y, x)];
}
