const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');

const dataArr = data
    .split('\r\n\r\n');
// console.log(dataArr);

const dirs = dataArr[0].split('');
// console.log(dirs);

const maps = dataArr[1].split('\r\n');
// console.log(maps);

const nodes = {};
for (let line of maps) {
    // console.log(line);
    const reg = /(\w{3})/g;
    // console.log(line.match(reg));
    const [node, L, R] = line.match(reg);
    nodes[node] = { L, R };
}
// console.log(nodes);

let pins = Object.keys(nodes).filter(n => n.endsWith('A'));
let steps = [...Array(pins.length)].fill(0);
console.log({ pins, steps });

// pins.every(n => n.endsWith('Z'));
// pins.endWithZ = function() {
//     return this.every(n => n.endsWith('Z'));
// }

let counter = 0;
while (!pins.every(n => n.endsWith('Z'))) {
    // while (steps < 10) {
    const index = counter % dirs.length;
    const dir = dirs[index];
    // console.log(index);

    for (let i = 0; i < pins.length; i++) {
        const pin = pins[i];
        // console.log(pin);
        if (pin.endsWith('Z')) continue;
        pins[i] = nodes[pin][dir];
        steps[i]++;
    }
    console.log(pins);

    counter++;
}
console.log(steps);

const stepsLCM = findLCM(steps);
console.log(stepsLCM);

function findLCM(nums) { // least common multiple
    const divisors = [];
    const numbers = [...nums];
    let prime = 2;
    const anyDivisibles = () => numbers.some(n => !(n % prime));

    while (!numbers.every(n => n === 1)) {
        while (!anyDivisibles()) {
            prime = findNextPrime(prime);
        }
        divisors.push(prime);
        for (let i = 0; i < numbers.length; i++) {
            if (!(numbers[i] % prime)) numbers[i] /= prime;
        }
    }
    return divisors.reduce((lcm, div) => lcm * div, 1);
}

function findNextPrime(num) {
    var isPrime = false;
    while (!isPrime) {
        num++;
        num % 2 || num++;
        isPrime = true;
        for (var i = 2; i < Math.ceil(num / 2); i++) {
            if (!(num % i)) {
                isPrime = false;
                break;
            }
        }
    }
    return num;
}
