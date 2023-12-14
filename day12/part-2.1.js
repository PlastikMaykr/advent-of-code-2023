const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr = data
    .split('\r\n')
    .map(d => d.split(' '));
console.log(dataArr);

const springRows = [];
for (let [conditions, groups] of dataArr) {
    const condUnfolded = (conditions + '?').repeat(5).slice(0, -1);
    const groupUnfolded = (groups + ',').repeat(5).slice(0, -1).split(',');
    springRows.push({
        conditions: condUnfolded,
        groups: groupUnfolded
    })
}
console.log(springRows[0]);

const tooManyQuestions = new RegExp('\\?{8,}')
// for (let row of springRows) {
for (let r = 0; r < springRows.length; r++) {
    const row = springRows[r]
    let { conditions, groups } = row;
    let rate = 0;
    // console.log(conditions.length);
    if (!tooManyQuestions.test(conditions) && conditions.length < 90) {
        ///
        const reg = buildReg(groups);
        for (let i = 0; i < conditions.length; i++) {
            if (conditions.charAt(i) !== '?') continue;
            const replaDot = replaceAt(conditions, i, '.');
            const replaHash = replaceAt(conditions, i, '#');
            const passDot = reg.test(replaDot);
            const passHash = reg.test(replaHash);
            // console.log({conditions,i,replaDot,passDot,replaHash,passHash});
            console.log(r, i);
            console.log(passDot, replaDot);
            console.log(passHash, replaHash);

            if (!passDot && !passHash) throw new Error('None passed')
            if (passDot && passHash) continue;
            // one of the tests has failed so the other one is good
            conditions = passDot ? replaDot : replaHash;
            console.log(conditions);
            rate++;
        }
    }
    row.improved = conditions;
    row.rate = rate;
    console.log('rate: ', rate);
}
console.log(springRows);

let output = '';
for (let i = 0; i < springRows.length; i++) {
    const row = springRows[i];
    let line = `${row.improved} ${row.groups.join(',')}`;

    output += line + '\r\n';
}
output = output.slice(0, -2);
// console.log(output)
fs.writeFileSync('output2.txt', output);


function buildReg(arr) {
    var ends = '[?\\.]*'
    var mid = '[?#]{'
    var dle = '}[?\\.]+'

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
