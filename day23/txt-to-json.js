const fs = require('node:fs');

const cwd = process.cwd();
console.log(cwd);

const files = fs.readdirSync(cwd);
const textInputs = files.filter(file => file.match(/^input.*txt$/));
console.log(textInputs);

for (const file of textInputs) {
    // if (file == 'input.txt') continue;
    const data = fs.readFileSync(file, 'utf8');
    const dataArr = data
        .split('\r\n');

    let output = 'const input = [' + '\r\n';
    for (let i = 0; i < dataArr.length; i++) {
        const item = dataArr[i].split('');
        let line = `\t[${item.map(d => `'${d}'`)}],`;

        output += line + '\r\n';
    }
    output += '];';
    console.log(output)

    const filename = file.replace('txt', '');
    fs.writeFileSync(filename + 'js', output);
}
