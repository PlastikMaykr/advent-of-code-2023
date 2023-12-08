const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');

const dataArr = data
    .split('\r\n')
    .map(line => line
        .replace(/\w+:\s+/, '')
        .split(/\s+/g))
    .map(nums => parseInt(nums.join('')));
console.log(dataArr);

const [time, record] = dataArr;
console.log({ time, record });

let start = 0;
let end = time;

// brute force
// for (let hold = 1; hold < time - 1; hold++) {
//     const move = time - hold;
//     const distance = hold * move;
//     console.log({ distance, record });
//     if (distance > record) {
//         start = hold;
//         break;
//     }
//     // const multiplier = 10;
//     // if (hold * multiplier * ((time - hold * multiplier)) < record)
//     //     hold *= multiplier;
// }
// for (let hold = time - 1; hold > 0; hold--) {
//     const move = time - hold;
//     const distance = hold * move;
//     console.log({ distance, record });
//     if (distance > record) {
//         end = hold;
//         break;
//     }
// }

// quadratic equations
start = (-time + Math.sqrt(time * time - 4 * record)) / -2
end = (-time - Math.sqrt(time * time - 4 * record)) / -2

const ways = Math.floor(end) - Math.ceil(start) + 1;
console.log({ start, end, ways });
