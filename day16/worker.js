const { parentPort, workerData } = require('node:worker_threads');
const { direction, mirror } = require('./tile.js');

const { contraption, tasks } = workerData;

let configuration = [];
let counter = [];

for (const task of tasks) {
    configuration = structuredClone(contraption); // reset contraption
    
    walk(...task);
    counter.push(count());
}

parentPort.postMessage(counter);


function walk(x, y, vel) {
    const tile = configuration[y]?.[x]; // check is tile exists
    if (!tile || tile.history.has(vel)) return;
    tile.history.add(vel);

    const dirs = mirror[tile.type][vel]; // new velocity/velocites
    // console.log(`I'm on ${tile.type}, going ${dirs.join(' & ')}`);
    for (const dir of dirs) {
        const [xOffset, yOffset] = direction[dir];
        const newX = x + xOffset;
        const newY = y + yOffset;
        walk(newX, newY, dir);
    }
}

function count() {
    let energized = 0;
    configuration.flat().forEach(tile => {
        if (tile.history.size) energized++;
    });
    return energized;
}
