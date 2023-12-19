const { direction, opposite, mirror } = require('./tile.js');
const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr = data
    .split('\r\n');
// console.log(dataArr);

const contraption = dataArr
    .map(line => line.split('')
        .map(type => ({ type, history: new Set() }))
    );
// console.log(contraption);

// const height = contraption.length;
// const width = contraption[0].length;


walk(0, 0, 'right');
// console.log(contraption[0][0]);
console.log(contraption);

let energized = 0;
contraption.flat().forEach(tile => {
    if (tile.history.size) energized++;
});
console.log({ energized });


function walk(x, y, vel, target = 0) { // TODO: remove target arg if of no use
    const tile = contraption[y]?.[x]; // check is tile exists
    if (!tile || tile.history.has(vel)) return;
    tile.history.add(vel);

    const dirs = mirror[tile.type][vel]; // new velocity
    // console.log({ tile, dirs });
    // console.log(Array.isArray(dirs));
    console.log(`I'm on ${tile.type}, going ${dirs.join(' & ')}`);

    for (const dir of dirs) {

        const [xOffset, yOffset] = direction[dir];
        const newX = x + xOffset;
        // if (newX < 0 || newX >= width) return;
        const newY = y + yOffset;
        // if (newY < 0 || newY >= height) return;

        walk(newX, newY, dir);
        // walk(newX, newY, dir[0]);
        // if (dir?.[1]) walk(newX, newY, dir[1]);

        // check newX & newY against width & height and 0
        // or try to find the tile with new coords
        // const newTile = contraption?.[newY]?.[newX]; // is undefined instead of error if not found
        // console.log({ dirs, newTile,x,xOffset,newX, newTile});
        // if (!newTile) return;
    }
}

// check if imports work
// for (let char of dataArr.flat()) {
//     console.log(char);
//     console.log(mirror[char]);
// }
// for (let prop in mirror) {
//     console.log(prop);
// }
