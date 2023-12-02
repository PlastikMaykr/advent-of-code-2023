const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr = data.split('\r\n');
    // [
    //     'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green',
    //     'Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue',
    //     'Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red',
    //     'Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red',
    //     'Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green'
    // ];

/** 
 * @param {string} raw
 * @returns {jason} jason
 */
function jasonify(raw) {
    const [game, plays] = raw.split(': ');
    const id = parseInt(game.replace('Game ', ''));

    const draws = plays.split('; ');
    const sets = draws.map(draw => objectify(draw));

    // console.log(draws);
    return { id, sets }
}

/** @param {string} line */
function objectify(line) {
    const cols = line.split(', ');
    const groups = cols.map(col => col.split(' ')); // TODO: combine groups & props
    let props = {};
    groups.forEach(group => props[group[1]] = parseInt(group[0]));

    // console.log(props);
    return props
}
// objectify('6 blue, 6 red, 2 green')

/** @param {jason} line */
function combine({ sets }) {
    // console.log(jason.sets);
    const combined = {};
    for (let i = 0; i < sets.length; i++) {
        for (let prop in sets[i]) {
            combined[prop] ??= 0;
            combined[prop] = Math.max(combined[prop], sets[i][prop]);
            // console.log({prop, com:combined[prop], set: sets[i][prop]});
        }
    }
    return combined;
}

function powerize(combined) {
    // console.log(jason.sets);
    // const possible = true;
    let power = 1;
    for (let prop in combined) {
        power *= combined[prop];
    }
    // for (let i = 0; i < sets.length; i++) {
    // }
    return power;
}

const jason = [];
const fewest = [];
const powers = [];

dataArr.forEach(d => {
    const jasonified = jasonify(d);
    jason.push(jasonified);

    const combined = combine(jasonified);
    fewest.push(combined);
    
    const power = powerize(combined);
    powers.push(power);
})

// console.log(jason);
console.log(fewest);
console.log(powers);

const sumPowers = powers.reduce((acc, cur) => acc + cur);
console.log(sumPowers);
