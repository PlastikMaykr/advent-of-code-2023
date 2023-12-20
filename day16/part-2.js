const fs = require('node:fs');
const { direction } = require('./tile.js');
const { Worker } = require('node:worker_threads');


// data
const data = fs.readFileSync('input.txt', 'utf8');
const dataArr = data
    .split('\r\n');
// console.log(dataArr);

const contraption = dataArr
    .map(line => line.split('')
        .map(type => ({ type, history: new Set() }))
    );
const height = contraption.length;
const width = contraption[0].length;


// tasks
const tasks = {};
const dims = [height, width]
for (let prop in direction) {
    // TODO: refactor so that it looks as beautiful as it works
    const dir = tasks[prop] = [];
    // console.log(prop);
    const coords = [x, y] = direction[prop];

    const isX0 = x === 0 ? 1 : 0;
    // const isY0 = y === 0 ? 1 : 0;

    const progIndex = isX0 ? 0 : 1;
    const conIndex = isX0// ? 1 : 0;

    const limit = dims[isX0];
    // const con = coords[isY0] < 0 ? 0 : limit - 1; // stable

    const moving = coords[isX0];
    // const stable = coords[isY0] < 0 ? 0 : limit - 1;
    const stable = moving > 0 ? 0 : limit - 1;

    // console.log({ x, y, moving, stable });

    for (let i = 0; i < limit; i++) {
        const task = [, , prop];
        // prog === x ? [i, con, prop] : [con, i, prop];
        task[progIndex] = i;
        task[conIndex] = stable;
        dir.push(task);
    }
}
// for (let t = 0; t < width; t++) {
//     const task = [t, 0, 'down'];
//     tasks.push(task);
// }
// console.log(tasks['down'][0]);


// workers
async function doWork(tasks, prop) {
    // console.log(tasks);
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', {
            workerData: { contraption, tasks }
        });
        worker.once('message', (data) => {
            console.log(`Worker ${worker.threadId} with ${prop} tasks is done`);
            // console.log(data);
            resolve(data);
        });
        worker.once('error', (err) => {
            // console.error(`Worker error: ${err}`);
            reject(err);
        });
    });
}
// doWork(tasks['down'][0], 'down');

const products = []
for (let prop in tasks) {
    // console.log(tasks[prop][0]);
    const work = doWork(tasks[prop], prop);
    products.push(work);
}
// console.log(products);


// result
Promise.all(products)
    .then((results) => {
        const power = results.flat().reduce((acc,cur) => Math.max(acc,cur));
        console.log(power);
    });
