const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr = data
    .split('\r\n')
    .map(d => d.split(''));
console.log(dataArr);


function consoleOverwrite(linesArr) {
    const len = linesArr.length;
    process.stdout.moveCursor(0, -len); // Move the cursor up by # lines
    process.stdout.clearScreenDown();

    // process.stdout.write('\n'.repeat(len));
    for (let line of linesArr) {
        process.stdout.write(line + '\n');
    }
}


let output = '';
for (let i = 0; i < dataArr.length; i++) {
    const item = dataArr[i];
    let line = `${item}`;

    output += line + '\r\n';
}
// console.log(output)
fs.writeFileSync('output.txt', output);
