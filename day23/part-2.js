const coordinates = {};

const colors = {
    khaki: 'rgb(240, 230, 140)', // 'khaki',
    dark: 'rgb(189, 183, 107)', // 'darkkhaki',
    green: 'rgb(60, 179, 113)', // 'MediumSeaGreen'
    grey: 'rgb(128, 128, 128)', // 'grey'
    white: 'rgb(255, 255, 255)', // 'white'
    red: 'rgb(255, 0, 0)', // 'red'
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
// console.log({ scale });

const scaledWidth = cols * scale;
const scaledHeight = rows * scale;
scaledCanvas.width = scaledWidth;
scaledCanvas.height = scaledHeight;
scaledCtx.imageSmoothingEnabled = false;

ctx.fillStyle = colors.khaki;
ctx.fillRect(0, 0, cols, rows);

const rawImg = ctx.getImageData(0, 0, cols, rows);

const forrest = new Set();
const slopes = new Set();
// const prev = new Set();
// const next = new Set();
for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        const coords = [y, x];
        coordinates[encode(y, x)] = coords;
        if (input[y][x] === '#') {
            forrest.add(coords);
        } else if (slopeChars.includes(input[y][x])) {
            slopes.add(coords);
        }
    }
}
// console.log({ prev, rocks });
// console.log({ rawImg });

let beginning, ending;
for (let x = 0; x < cols; x++) {
    if (input[0][x] === '.') beginning = keycode(0, x);
    if (input[rows - 1][x] === '.') ending = keycode(rows - 1, x);
}
console.log({ beginning, ending });
paint(beginning, colors.white, rawImg);
paint(ending, colors.white, rawImg);


// paint rocks and slopes
for (const tree of forrest) {
    paint(tree, colors.green, rawImg);
}
for (const slope of slopes) {
    paint(slope, colors.dark, rawImg);
}

let image;
resetImg();
renderScaled();


const data = new Data2D(input);
const graph = new Graph(data);
console.log(graph);

scaledCanvas.addEventListener('click', () => {
    traceHike(graph.longestPath.steps());
}, { once: true });


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

/**
 * @param {Coords[]} route 
 */
function traceHike(route) {
    resetImg();

    requestAnimationFrame(paintNext.bind(null, route, 0));

}

function paintNext(route, index) {
    if (index < route.length) {
        paint(route[index], colors.white);
        renderScaled();

        index++;
        requestAnimationFrame(paintNext.bind(null, route, index));
    }
}

function paint(coords, color = colors.red, imgData = image) {
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
        new Uint8ClampedArray(rawImg.data),
        rawImg.width,
        rawImg.height
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
        if (!nextCoord || forrest.has(nextCoord)) continue;

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
            if (!forrest.has(coords)) {
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
