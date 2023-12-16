const fs = require('node:fs');

// const data = fs.readFileSync('output2.txt', 'utf8');
// const dataArr = data
//     .split('\r\n')
//     .map(d => d.split(' '));
// console.log(dataArr);

// const springRows = [];
// for (let [conditions, groups] of dataArr) {
//     springRows.push({
//         conditions,
//         groups: groups.split(',')
//     })
// }
// console.log(springRows[0]);

const timeStart = performance.now();

const rowRaw = '.????.?#?#?#?##?? 1,8'
    .split(' ');
const row = {
    conditions: rowRaw[0],
    groups: rowRaw[1].split(',')
};

const conditions = rowRaw[0];
const groups = rowRaw[1].split(',');

console.log({ rowRaw, row });

const reg = buildReg(groups);

// TODO: try adding to Set while iterating over it
// TODO: consolidate collections and unsolved into single structure

// const condSpit = splitAt(conditions);
let collection = { '-1': new Set(conditions) };
let unsolved = { '-1': [['', conditions]] };
let solved// = [];


for (let g = 0; g < groups.length; g++) { // g => group
    // if (g > 1) continue;
    const group = groups[g];
    const isLast = g === groups.length - 1;

    collection[g] = new Set();
    unsolved[g] = [];
    // unsolved[g].group = group;

    let filling = '#'.repeat(group);
    if (!isLast) filling += '.'
    console.log('');
    console.log(`The group ${g} # count is ${group}: ${filling}`);


    var regGroup = buildGroupExpr(group, isLast)
    for (let [past, cond] of unsolved[g - 1]) {

        //TODO: while (regGroup.test(replaceAt(cond, q, '.')))

        const q = cond.indexOf('?');

        const condDota = replaceAt(cond, q, '.');
        const wholeDota = past + condDota;
        const testDota = reg.test(wholeDota);
        if (testDota /* && !collection[g - 1].has(wholeDota) */) {
            // collection[g - 1].add(wholeDota);
            // console.group('Dota')
            // console.log(unsolved[g - 1]);
            // console.log([past,cond]);
            console.log('(', group, ')', g, '/', groups.length - 1, past, condDota);
            console.log(collection[g - 1].has(wholeDota));
            // console.groupEnd('Dota')
            if (condDota.indexOf('?') === 1 && !collection[g - 1].has(wholeDota)) {
                collection[g - 1].add(wholeDota);

                const moveDot = splitMove([past, condDota], 1);
                unsolved[g - 1].push(moveDot);
            }

            // const [thisGroup, nextGroups] = matchGroup(condDota,regGroup);
            const newDota = matchGroup(past, condDota, regGroup, filling);
            const wholeNewDota = newDota.join('');
            // if (!collection[g].has(wholeNewDota)) {
                collection[g].add(wholeNewDota);

            unsolved[g].push(newDota);
            // }
        }

        const condHash = replaceAt(cond, q, '#');
        const wholeHash = past + condHash;
        const testHash = reg.test(wholeHash);
        if (testHash && !collection[g - 1].has(wholeHash)) {
            collection[g - 1].add(wholeHash);

            // const [thisGroup, nextGroups] = matchGroup(condHash,regGroup);
            const newHash = matchGroup(past, condHash, regGroup, filling);
            const wholeNewHash = newHash.join('');
            // if (!collection[g].has(wholeNewHash)) {
                collection[g].add(wholeNewHash);

            unsolved[g].push(newHash);
            // }
        }
    }
    if (isLast) {
        solved = new Set(unsolved[g].map(d => d[0] + '.'.repeat(d[1].length)));
    }
}

console.group('Raport: arrays vs maps');
// console.log('')
for (let i = -1; i < groups.length; i++) {
    console.log('i: ', i);
    console.log('arr: ', unsolved[i].length);
    console.log('map: ', collection[i].size);
    if (i == 1) {
        console.log(unsolved[i]);
        console.log(collection[i]);
    }
}
// console.log(Object.keys(unsolved))
console.groupEnd();


const solutions = [...solved.keys()].sort();

const timeEnd = performance.now();
const time = Math.round(timeEnd - timeStart);
const moreThanSecond = time > 1000;
const moreThanMinute = time > 60000;
const timeMod = (time / 1000) % 60;
const timeFormatted = moreThanMinute ? `${((time / 1000) - timeMod) / 60}m ${Math.round(timeMod)}s` :
    moreThanSecond ? `${Math.round(time / 10) / 100}s` : `${time}ms`;

function matchGroup(past, condDota, regGroup, hashFill) {
    const matcha = regGroup.exec(condDota);
    if (!matcha) return null;
    // console.log(matcha);

    const dotsStr = matcha.groups.dots;
    const dotsIdx = matcha.indices.groups.dots;
    const hashStr = matcha.groups.hash;
    const hashIdx = matcha.indices.groups.hash;

    const dotsFill = '.'.repeat(dotsStr.length);

    // console.log('\nMatch group report:');
    // console.log({
    //     examined: condDota,
    //     reg: regGroup.toString(),
    //     match: matcha[0],
    //     dotsMatch: [dotsStr, dotsIdx],
    //     hashMatch: [hashStr, hashIdx],
    //     fill: [dotsFill, hashFill],
    // });

    const [, future] = splitAt(condDota, hashIdx[1]);
    const present = past + dotsFill + hashFill;

    return [present, future]
}


const output = {
    conditions,
    groups,
    reg: reg.toString(),
    unsolved,
    solutions,
    count: solved.size,
    time: timeFormatted
};
fs.writeFileSync('outputX.json', JSON.stringify(output, null, 2));


function buildReg(arr) {
    var ends = '[?\\.]*'
    var mid = '([?#]{'
    var dle = '})[?\\.]+'

    var expr = '^' + ends;
    arr.forEach(num => {
        expr += mid + num + dle;
    })
    // expr += ends + '$';
    expr = replaceAt(expr, expr.length - 1, '*$')

    var reg = new RegExp(expr)
    console.log(reg.toString());
    return reg;
}

function buildGroupExpr(group, last = false) {
    // /([?#]{2,}?)[?\.]+?/;
    // '([?#]{2,}?)[?\.]+?'
    // let expr = `([?#]{${group},}?)`;
    // let expr = `^(?<dots>[\\?\\.]*?)(?<hash>[\\?#]{${group},}?)`;
    // expr += last ? '[?\\.]*$' : '[?\\.]+?';
    // let expr = `^(?<dots>[\\?\\.]*?)(?<hash>[\\?#]{${group}})`;
    let expr = `^(?<dots>[\\?\\.]*?)(?<hash>[\\?#]{${group}}`;
    expr += last ? ')' : '[?\\.])';
    console.log(expr);
    return new RegExp(expr, 'd');
}

function splitAt(str, i = 0) { // ('abcdef', 3) => [ 'abc', 'def' ]
    return [
        str.slice(0, i),
        str.slice(i)
    ]
}

function splitMove(split, v = 0) { // (['abc', 'def'], 2) => [ 'abcde', 'f' ]
    if (!v) return split;
    let [str1, str2] = split;
    const i = str1.length + v;
    return splitAt(str1 + str2, i);
}

function reverse(str) {
    return str.split('').reverse().join();
}

function replaceAt(str, index, replacement) {
    return str.substring(0, index) + replacement + str.substring(index + 1);
}
