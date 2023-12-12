const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr = data
    .split('\r\n')
    .map(d => d.split(''));
// console.log(dataArr);

// galaxies count
let rows = [...Array(dataArr.length)].fill(0);
let columns = [...Array(dataArr[0].length)].fill(0);
for (let y = 0; y < dataArr.length; y++) {
    for (let x = 0; x < dataArr[y].length; x++) {
        const space = dataArr[y][x];
        if (space === '#') {
            // console.log(x, y);
            rows[y]++;
            columns[x]++;
        }
    }
}
console.log({ rows, columns });

// expand
const empty = '+';
const expanded = [];
for (let y = 0; y < dataArr.length; y++) {
    const line = [];
    expanded.push(line);
    for (let x = 0; x < dataArr[y].length; x++) {
        const space = dataArr[y][x];
        line.push(space);
        if (!columns[x]) line.push(empty);
    }
    if (!rows[y]) expanded.push([...line].fill(empty));
}
// console.log({ expanded });

let output = [...expanded].join('\r\n').replaceAll(',', '');
// console.log(output);
fs.writeFileSync('output.txt', output);


// galaxies coords
const coordsOld = galaxiesCoords(dataArr);
const coordsExp = galaxiesCoords(expanded);


function galaxiesCoords(spaceMap) {
    const coords = [];
    for (let y = 0; y < spaceMap.length; y++) {
        for (let x = 0; x < spaceMap[y].length; x++) {
            const space = spaceMap[y][x];
            if (space === '#') {
                // console.log(x,y);
                coords.push([x, y]);
            }
        }
    }
    return coords;
}
console.log({ coordsOld, coordsExp });

// galaxies distances
const distancesOld = galaxiesDistances(coordsOld);
const distancesExp = galaxiesDistances(coordsExp);

function galaxiesDistances(coords) {
    const distances = []
    let distSum = 0;
    for (let i = 0; i < coords.length - 1; i++) {
        for (let j = i + 1; j < coords.length; j++) {
            const [x1, y1] = coords[i];
            const [x2, y2] = coords[j];
            const distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);
            distances.push(distance);
            distSum += distance;
            console.log({ i, j, distance });
        }
    }
    return distances;
}
// console.log({ distancesOld, distancesExp });

// expansion growth
const growth = 1000000;
const distances = [];
for (let i = 0; i < distancesOld.length; i++) {
    const distOld = distancesOld[i];
    const distExp = distancesExp[i];
    const dist = distOld + (distExp - distOld) * (growth - 1);
    distances.push(dist);
    console.log({ distOld, distExp, dist });
}

const totalDistances = distances.reduce((sum, dist) => sum + dist);
console.log({ distances, totalDistances });
