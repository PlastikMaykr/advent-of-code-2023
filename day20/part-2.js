const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const dataArr = data
    .split('\r\n');
// console.log(dataArr);

const modules = {};
dataArr.forEach(str => {
    const [mod, destin] = str.split(' -> ');
    const [, type, name] = mod.match(/([%&]{0,1})(\w+)/);
    const state = type === '&' ? new Map() : false;
    const dest = destin.split(', ');

    modules[name] = { type, state, dest };
});

// find output module and fill Conjunction module inputs
let output;
Object.keys(modules).forEach(m => {
    const mod = modules[m];
    for (let dest of mod.dest) {
        console.log(m, ' -> ', dest);
        if (!modules[dest]) { // output module
            console.error('=== NO DEST: ', dest, ' ===');
            output = dest;
            modules[dest] = {
                type: '',
                state: false,
                dest: []
            };
        } else if (modules[dest].type === '&') { // Conjunction module
            modules[dest].state.set(m, false);
        }
    };
    // console.log(mod);
});
console.log('Output module is "', output, '"');


const queue = [];
// const pulses = [0, 0];

let press = 0;
let lowOutput = false;
while (!lowOutput) {
    press++;
    pushButton();
}

console.log('');
console.log('Button pressed ', press, ' times');
// console.log(`LOW: ${pulses[0]}, HIGH: ${pulses[1]}, Total: ${pulses[0] * pulses[1]}`);


function pushButton() {
    // if (times < 1) return;
    console.log('');
    console.log('button press ', press);
    // let [mod, sig] = 
    sendPulse(['broadcaster', false, 'button']);
    while (queue.length) {
        // [mod, sig] = sendPulse(mod, sig);
        sendPulse(queue.shift());
    }
    // pushButton(times - 1);
}

function sendPulse([mod, pulse, source]) {
    // pulses[pulse ? 1 : 0]++;
    if (mod === output && !pulse) lowOutput = true;

    const { type, state, dest } = modules[mod];
    console.log(`${source} -${pulse ? 'HIGH' : 'LOW'}-> ${mod}`);

    if (type === '%') {
        // dest.forEach(destin => queue.push([destin, pulse]));
        flipFlop(mod, pulse);
    } else if (type === '&') {
        // dest.forEach(destin => queue.push([destin, pulse]));
        conjunct(mod, pulse, source);
    } else { // broadcaster
        dest.forEach(destin => queue.push([destin, pulse, mod]));
    }
}

function flipFlop(m, pulse) {
    if (pulse) return;
    const mod = modules[m];
    const newState = !mod.state;
    // console.log({mod, newState});
    mod.state = newState;
    mod.dest.forEach(dest => queue.push([dest, newState, m]));
}

function conjunct(m, pulse, source) {
    const mod = modules[m];

    mod.state.set(source, pulse);
    let newState = !(pulse && ![...mod.state.values()].some(d => !d));

    mod.dest.forEach(dest => queue.push([dest, newState, m]));
}
