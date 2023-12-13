const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr = data
    .split('\r\n')
    .map(d => d.split(' '));
console.log(dataArr);

const springRows = [];
for (let [conditions, groups] of dataArr) {
    springRows.push({
        conditions,
        groups: groups.split(',')
    })
}
console.log(springRows[0]);


for (let row of springRows) {
    let { conditions, groups } = row;
    let rate = 0;
    // console.log(conditions.length);
    const reg = buildReg(groups);
    for (let i = 0; i < conditions.length; i++) {
        if (conditions.charAt(i) !== '?') continue;
        const replaDot = replaceAt(conditions, i, '.');
        const replaHash = replaceAt(conditions, i, '#');
        const passDot = reg.test(replaDot);
        const passHash = reg.test(replaHash);
        console.log({conditions,i,replaDot,passDot,replaHash,passHash});

        if (!passDot && !passHash) throw new Error('None passed')
        if (passDot && passHash) continue;
        // one of the tests has failed so the other one is good
        conditions = passDot ? replaDot : replaHash;
        console.log(conditions);
        rate++;
    }
    row.improved = conditions;
    row.rate = rate;
}
console.log(springRows);

function buildReg(arr) {
    var ends = '[?\\.]*'
    var mid = '([?#]{'
    var dle = '})[?\\.]+'

    var expr = '^' + ends;
    arr.forEach(num => {
        expr += mid + num + dle;
    })
    // expr += ends + '$';
    expr = replaceAt(expr, expr.length - 1, '*')

    var reg = new RegExp(expr)
    console.log(reg.toString());
    return reg;
}


let output = '';
for (let i = 0; i < springRows.length; i++) {
    const row = springRows[i];
    let line = `${row.improved} ${row.groups.join(',')}`;

    output += line + '\r\n';
}
output = output.slice(0, -2); 
// console.log(output)
fs.writeFileSync('output.txt', output);


function reverse(str) {
    return str.split('').reverse().join();
}
function replaceAt(str, index, replacement) {
    return str.substring(0, index) + replacement + str.substring(index + 1);
}

String.prototype.reverse = function () {
    this.split('').reverse().join();
}
String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
