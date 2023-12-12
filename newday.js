const fs = require('node:fs');

const cwd = process.cwd();
console.log(cwd);

const days = fs.readdirSync(cwd); // { withFileTypes: true }
// console.log(days);
const nextDay = 1 + days
    .filter(d => d.startsWith('day'))
    .reduce((big, d) => Math.max(big, parseInt(d.replace('day', ''))), 0);
const dayNext = 'day' + nextDay;
console.log(nextDay, dayNext);

const day0 = 'day0';
// const day0path = cwd + '\\day0';
// const files = fs.readdirSync(day0path); // { withFileTypes: true }
fs.mkdirSync(dayNext);

const files = fs.readdirSync(day0);
console.log(files);

for (let file of files) {
    const source = `${day0}\\${file}`;
    const destination = `${dayNext}\\${file}`;
    fs.copyFile(source, destination, callback);
}

function callback(err) {
    if (err) throw err;
    // console.log('source.txt was copied to destination.txt');
}
