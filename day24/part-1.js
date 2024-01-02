const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr = data.split('\r\n');
// console.log(dataArr);

const testArea = {
    x1: 200000000000000, // 7,
    x2: 400000000000000, // 27,
    y1: 200000000000000, // 7,
    y2: 400000000000000, // 27,
};

const hailstones = [];
for (const line of dataArr) {
    const [pos, vel] = line.split(' @ ')
        .map(d => d.split(', ')
            .map(d => parseInt(d)));
    const hail = {
        px: pos[0],
        py: pos[1],
        sx: pos[0] + vel[0],
        sy: pos[1] + vel[1],
        vx: vel[0],
        vy: vel[1],
        // xsec: new Map()
    };
    hailstones.push(hail);
}
// console.log(hailstones[0]);

const intersections = new Map([...hailstones.map(hs =>
    [hs, new Map(
        [...hailstones.filter(d => d !== hs).map(d => [d, {}])]
    )]
)]);
intersections.getCell = function (a, b) {
    return intersections.get(a).get(b);
};
intersections.setCell = function (a, b, obj) {
    const cell = intersections.getCell(a, b);
    // console.log({cell, obj});
    Object.assign(cell, obj);
    return cell;
};

let collisions = 0;
for (let i = 0; i < hailstones.length; i++) {
    for (let j = i; j < hailstones.length; j++) {
        const hail = hailstones[i];
        const stone = hailstones[j];
        if (hail === stone) continue;
        const xing = intersect(hail, stone);

        const test = isInArea(xing);
        if (test) collisions++;
        xing.test = test;

        console.log({hail, stone, xing});
        intersections.setCell(hail, stone, xing);
        intersections.setCell(stone, hail, xing);
    }
}
console.log({collisions});
// console.log(intersections);


function isInArea(point) {
    if (!point.x) return false;
    return testArea.x1 <= point.x &&
           testArea.x2 >= point.x &&
           testArea.y1 <= point.y &&
           testArea.y2 >= point.y;
}

function intersect(a, b) {
    const intersection = { x: null, y: null },
        x1 = a.px,
        y1 = a.py,
        x2 = a.sx,
        y2 = a.sy,
        x3 = b.px,
        y3 = b.py,
        x4 = b.sx,
        y4 = b.sy;
    const down = ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    if (down === 0) { // lines are parallel
        return intersection;
    }

    // const xUp = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4));
    // const yUp = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4));
    // const intX = xUp / down;
    // const intY = yUp / down;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / down;
    const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / down;
    if (t < 0 || u < 0) { // lines might have crossed before they staring point
        return intersection;
    }

    const intX = (x1 + t * (x2-x1));
    const intY = (y1 + t * (y2-y1));

    intersection.x = intX;
    intersection.y = intY;
    return intersection;
}
