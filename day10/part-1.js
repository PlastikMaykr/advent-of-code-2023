const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');

const dataArr = data
    .split('\r\n')
    .map(d => d.split(''));
console.log(dataArr);

const Tile = require('./tile.js');
Tile.setPipes(dataArr);

process.stdout.write('\n'.repeat(3)); // Move the cursor up by 3 lines

const starting = Tile.findStart();
console.log(starting);
// console.log(starting.getConnections());
// renderTile(starting);
const [path1, path2] = Tile.createNeighbors(starting);
// console.log({ path1, path2 });

while (!Tile.areSame(path1, path2)) {
    path1.progress();
    path2.progress();
}
console.log(path1.steps);
