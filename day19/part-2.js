const fs = require('node:fs');
const Graph = require('./graph.js');

const data = fs.readFileSync('input0.txt', 'utf8');
const [wfs] = data
    .split('\r\n\r\n')
    .map(d => d.split('\r\n'));
// console.log(rls, pts);

// workflows
// const workflows = {};
// wfs.forEach(str => {
//     const [workflow, cond] = str.slice(0, -1).split('{');
//     let conditions = cond.split(',');
//     const final = conditions.pop();
//     conditions = conditions.map(condit => condit.split(':'));

//     workflows[workflow] = { conditions, final };
// });
// console.log(workflows['px']);

Graph.init(wfs);
const graph = new Graph();
console.log(...Graph.nodes[0].name);
Graph.nodes[0].paths.forEach(path => console.log(path));


/* 
const safety = /\w[<>]\d+/;
const A = 'A';

// endpoints for Accepted
const endpoints = {};
for (let wf in workflows) {
    let { conditions, final } = workflows[wf];
    // console.log(wf);
    const accepted = [];
    for (let i = 0; i < conditions.length; i++) {
        const [condition, workflow] = conditions[i];
        if (workflow === A) accepted.push(condition);
    }
    // if (final === A) accepted.push(final)

    const finalAccepted = final === A;
    if (accepted.length || finalAccepted) endpoints[wf] = {
        conditions: accepted,
        final: finalAccepted
    };
    // endpoints[wf].final = true;
}
// console.log({endpoints});
Object.keys(endpoints).forEach(wf => {
    console.log(wf, endpoints[wf]);
});
 */


// find all paths leading to 'A' in a TREE-like structure
// const acceptedFlows = [];
// for (let wf in endpoints) {
//     for (let i = 0; i < conditions.length; i++) {
//         const accflow = [];


//         acceptedFlows.push(accflow);
//     }
// }


// utility functions
// function prevWorkflows(wf, dest) {
//     // console.log(wf, workflows[wf]);
//     const { x, m, a, s } = part;
//     let { conditions, final } = workflows[wf];
//     // let rule = '';
//     for (let i = 0; i < conditions.length; i++) {
//         const [condition, workflow] = conditions[i];
//         if (eval(condition)) {
//             // console.log(workflow);
//             return workflow;
//         }
//     }
//     // console.log('No conditiones met; Destination: ', final);
//     return final;
// }

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
    let { conditions, final } = workflows[wf];
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
