const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr = data
    .split(',');
console.log(dataArr);

const reg = /(\w+)([=-])(\d*)/;
const steps = dataArr
    .map(step => step.match(reg))
    .map(([step, label, operation, lens]) => {
        const box = hashAlgorithm(label);
        return {
            box, label, operation, lens
        }
    });
console.log(steps);

const boxes = [...Array(256)].map(d => []);
console.log(boxes);

for (const step of steps) {
    const { box, label, operation, lens } = step;
    const existingIndex = boxes[box]
        .findIndex(lens => lens.label === label);

    if (operation === '=') { // replace
        if (existingIndex >= 0) {
            boxes[box].splice(existingIndex, 1, step);
        } else {
            boxes[box].push(step);
        }
    } else if (operation === '-') { // remove
        if (existingIndex >= 0) {
            boxes[box].splice(existingIndex, 1);
        }
    }

    // logs
    // console.log('');
    // console.log(`After "${label + operation + lens}":`);
    // boxes.forEach((box, i) => {
    //     if (box.length) {
    //         let contents = '';
    //         box.forEach(cont => {
    //             contents += `[${cont.label} ${cont.lens}] `
    //         })
    //         console.log(`Box ${i}: ${contents}`);
    //     }
    // });
}

let sum = 0;
for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    const b = i + 1;
    for (let s = 0; s < box.length; s++) {
        const slot = s + 1;
        const {label,lens} = box[s];
        const power = b*slot*lens
        sum += power;
        console.log(`${label}: ${b} (box ${i}) * ${slot} (slot) * ${lens} (lens) = ${power}`);
    }
}
console.log('focusing power :', sum);

function hashAlgorithm(str) {
    const chars = str.split('');
    const result = chars.reduce((acc, cur) => {
        acc += cur.charCodeAt(0);
        acc *= 17;
        acc %= 256;
        return acc;
    }, 0);
    return result;
}
