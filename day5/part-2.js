const fs = require('node:fs');
const Range = require('./range.js');

const data = fs.readFileSync('input.txt', 'utf8');

const dataArr = data
    .split('\r\n\r\n')
    .map(line => line.split(':\r\n'));
// console.log(dataArr);

const seeds = dataArr[0][0]
    .replace(/\w*:\s/, '')
    .match(/\d+\s\d+/g)
    .map(d => Range.fromStingSnL(d));

console.log({ seeds });

let almanac = new Map();
for (let i = 1; i < dataArr.length; i++) {
    let [operation, ranges] = dataArr[i];
    operation = operation.replace(/\w*-to-(\w*) map/, '$1');
    ranges = ranges
        .split('\r\n')
        .map(line => {
            const ranges = line
                .split(' ')
                .map(d => parseInt(d));
            const [destination, source, span] = ranges;
            return {
                source: Range.fromSnL(source, span),
                // destination: Range.fromSnL(destination, span),
                shift: destination - source
            }
        });
    console.log({operation, ranges});
    almanac.set(operation, ranges);
}
// console.log(almanac);

const progress = new Map();
let drafts = [...seeds];
for (let [operation, ranges] of almanac) {
    // if (operation !== 'soil') break;
    console.log({ operation, drafts });
    // console.log({operation});

    let done = [];
    let undone = [];
    // for (let draft of drafts) {
    let overdone = false;
    while (drafts.length) { // || counter
        const draft = drafts.shift();
        let overlapped = false;
        for (const { source, shift } of ranges) {
            const overlap = Range.overlap(draft, source);
            // console.log({overlap});
            // console.log({draft,source, overlap: overlap.overlap});
            if (overlap.overlap) {
                done.push(overlap.overlap.shift(shift));
                overlap.left && undone.push(overlap.left);
                overlap.right && undone.push(overlap.right);
                overlapped = true;
                break;
            }
        }
        if (!overlapped) done.push(draft);

        // console.log({ done, undone, drafts });
        if (!drafts.length) {
            if (overdone) break;
            overdone = true;
            [undone, drafts] = [drafts, undone];
        }
    }
    // TODO: sort & combine ranges after each operation
    // done = Range.combine(done);

    progress.set(operation, [...done]);
    drafts = [...done];
    // console.log({drafts,undone});

    // if (operation === 'fertilizer') break;
    console.log({ // for tracking potential changes in ranges length 
        seeds: seeds.reduce((acc, cur) => acc + cur.length, 0),
        drafts: drafts.reduce((acc, cur) => acc + cur.length, 0),
    });
}

// console.log({drafts});
const nearest = Math.min(...drafts.map(d => d.min));
console.log({drafts,nearest});

console.log({
    seeds: seeds.reduce((acc, cur) => acc + cur.length, 0),
    drafts: drafts.reduce((acc, cur) => acc + cur.length, 0),
});

