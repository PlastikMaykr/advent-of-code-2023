const fs = require('node:fs');

const data = fs.readFileSync('input0.txt', 'utf8');
const dataArr = data
    .split('\r\n')
    .map(line => {
        const [cmp, cnt] = line.split(': ');
        return [cmp, cnt.split(' ')];
    });
console.log(dataArr);

const unique = new Set();
dataArr.forEach(([cmp, cnt]) => {
    unique.add(cmp);
    cnt.forEach((comp) => unique.add(comp));
});
console.log(unique);

const components = new Map();
unique.forEach((cmp) => {
    components.set(cmp, new Set());
});
dataArr.forEach(([cmp, cnt]) => {
    const cmpSet = components.get(cmp);
    cnt.forEach((comp) => {
        cmpSet.add(comp);
        components.get(comp).add(cmp);
    });
});
console.log(components);
