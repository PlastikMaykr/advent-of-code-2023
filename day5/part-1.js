const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');

const dataArr = data
    .split('\r\n\r\n')
    .map(line => line.split(':\r\n'));
// console.log(dataArr);

const seeds = dataArr[0][0]
    .replace(/\w*:\s/, '')
    .split(' ')
    .map(n => parseInt(n));
console.log({ seeds });

let almanac = new Map();
for (let i = 1; i < dataArr.length; i++) {
    let [operation, ranges] = dataArr[i];
    operation = operation.replace(/\w*-to-(\w*) map/, '$1');
    ranges = ranges
        .split('\r\n')
        .map(line => {
            const range = line
                .split(' ')
                .map(d => parseInt(d));
            return {
                destination: range[0],
                source: range[1],
                span: range[2]
            }
        });
    // console.log({operation, ranges});
    almanac.set(operation, ranges);

    /* terribly slow; exceeded memory limits
    const lookup = {};
    for (let {destination, source, span} of ranges) {
        for (let i = 0; i < span; i++) {
            console.log(source + i, destination + i)
            lookup[source + i] = destination + i;
        }
    }
    // console.log({operation, lookup});
    almanac.set(operation, lookup);
     */
}
console.log(almanac);
// const order = [...almanac.keys()];
// console.log(order);

const locations = [];
for (let seed of seeds) {
    console.log(seed);

    for (let [operation, ranges] of almanac) {
        let newVal;
        for (let { destination, source, span } of ranges) {
            if (fitsRange(seed, source, source + span)) {
                newVal = seed - source + destination;
                break;
            }
        }
        // console.log({ operation, seed, lookup: newVal });
        seed = newVal ?? seed;
    }
    locations.push(seed);
}

function fitsRange(val, min, max) {
    return val >= min && val <= max;
}

const nearest = Math.min(...locations);
console.log(locations);
console.log(nearest);
