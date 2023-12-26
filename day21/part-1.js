const direction = { // [y, x]
    up: [1, 0],
    right: [0, 1],
    down: [-1, 0],
    left: [0, -1]
};

const colors = {
    green: 'rgb(154, 205, 50)', // 'yellowgreen',
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

ctx.fillStyle = colors.green;
ctx.fillRect(0, 0, cols, rows);

const rocksImg = ctx.getImageData(0, 0, cols, rows);

const rocks = new Set();
const prev = new Set();
const next = new Set();
for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        if (input[y][x] === '#') {
            rocks.add(`${y} ${x}`);
        } else if (input[y][x] === 'S') {
            prev.add(`${y} ${x}`);
        }
    }
}
console.log({ prev, rocks });
console.log({ rocksImg });

for (const rock of rocks) {
    paint(rock, colors.grey, rocksImg);
}

let image;
resetImg();

for (const step of prev) {
    paint(step, colors.white);
}
renderScaled();

let fps = 10;
const stepCount = 64;
let steps = 0;
scaledCanvas.addEventListener('click' , () => {
    // while (steps < stepCount) {
    //     stepping();
    // }

    // animate();

    walk();
}, {once: true});


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
    setTimeout(walk, 1000/fps);
}
