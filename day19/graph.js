class Node {
    static negateCondition(condition) {
        const regSign = /[<>]/;
        return condition.replace(regSign,'>' ? '<=' : '>=');
    }
    constructor(name, conditions, final) {
        this.name = name;
        // this.conditions = conditions;
        // this.final = final;

        this.paths = [];
        for (let i = 0; i < conditions.length; i++) {
            const workflow = conditions[i][1];
            const rules = [];
            rules.push(...conditions.slice(0, i)
                .map(([cond]) => Node.negateCondition(cond)));
            rules.push(conditions[i][0])

            this.paths.push({
                workflow,
                conditions: rules
            })
        }
        this.paths.push({
            workflow: final,
            conditions: conditions.map(([cond]) => Node.negateCondition(cond))
        });
    }
}

class Edge {
    static { }
    constructor() {

    }
}

module.exports = class Graph {
    static init(strs) {
        // this.workflows = workflows;
        strs.forEach(str => {
            const [workflow, cond] = str.slice(0, -1).split('{');
            let conditions = cond.split(',');
            const final = conditions.pop();
            conditions = conditions.map(condit => condit.split(':'));
            // workflows[workflow] = { conditions, final };
            const node = new Node(workflow, conditions, final);
            this.nodes.push(node);
        });
        console.log(this.nodes);
    }
    // workflows;
    static nodes = [];
    constructor() {

    }
}
