const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');
const [wfs, pts] = data
    .split('\r\n\r\n')
    .map(d => d.split('\r\n'));
// console.log(rls, pts);

// rules
const workflows = {};
wfs.forEach(str => {
    const [workflow, cond] = str.slice(0, -1).split('{');
    let conditions = cond.split(',');
    const final = conditions.pop();
    conditions = conditions.map(condit => condit.split(':'));

    workflows[workflow] = { conditions, final };
});
// console.log(workflows['px']);

// parts
const parts = pts.map(str => {
    const arr = str
        .slice(1, -1)
        .split(',')
        .map(rating => rating.split('='));
    const obj = {};
    arr.forEach(([prop, val]) => obj[prop] = +val);
    return obj;
});
// console.log({ parts });

const container = {
    A: [],
    R: []
}

const safety = /\w[<>]\d+/;

parts.forEach(part => processPart(part));
console.log({ container, accepted: container.A.length });

const totalRatings = container.A.reduce((acc, part) => acc + ratePart(part), 0);
console.log({ totalRatings });


function processPart(part) {
    // const entry = workflows['in'];
    const entry = 'in';
    let workflow = nextWorkflow(part, entry);
    while (workflows[workflow]) {
        workflow = nextWorkflow(part, workflow);
    }
    container[workflow].push(part);
}

function nextWorkflow(part, wf) {
    // console.log(wf, workflows[wf]);
    const { x, m, a, s } = part;
    let {conditions, final} = workflows[wf];
    // let rule = '';
    for (let i = 0; i < conditions.length; i++) {
        const [condition, workflow] = conditions[i];
        if (!condition.match(safety)) throw new Error('Unsafe condition: ', condition);
        if (eval(condition)) {
            // console.log(workflow);
            return workflow;
        }
    }
    // console.log('No conditiones met; Destination: ', final);
    return final;
}

function ratePart(part) {
    return part.x + part.m + part.a + part.s
}
