/**
 * Ends and forks of a {@link Graph}
 */
class Node {
    /**
     * 
     * @param {Coords} coords 
     * @param {Graph} graph 
     * @param {Directive[]} dirs 
     */
    constructor(graph, coords, dirs) {
        this.graph = graph;
        this.coords = coords;
        this.dirs = dirs || graph.recon(coords);
        /** @type {Array<Edge>} */
        this.enter = [];
        /** @type {Array<Edge>} */
        this.exit = [];
    }
}

/**
 * Route from {@link start} to {@link end} {@link Node}
 * @property {Number} length Number of tiles exluding the last one.
 */
class Edge {
    /**
     * @param {Graph} graph 
     * @param {Node} start 
     * @param {Node} end 
     * @param {Coords[]} route 
     */
    constructor(graph, start, end, route) {
        this.graph = graph;
        this.start = start;
        this.end = end;
        this.route = route;
        this.length = this.route.length - 1;
        this.init();
    }
    init() {
        this.start.enter.push(this);
        this.end.exit.push(this);
        this.graph.adjacency.get(this.start).set(this.end, this);
    }
}

/**
 * Full hikes from start to finish
 */
class Path {
    /**
     * @param {Graph} graph 
     * @param {Node[]} path 
     */
    constructor(graph, path) {
        this.graph = graph;
        this.path = path;
        /** @type {Edge[]} */
        this.route = [];
        this.init();
    }
    init() {
        let length = 0;
        for (let i = 1; i < this.path.length; i++) {
            const edge = this.graph.getEdge(this.path[i - 1], this.path[i]);
            if (!edge) console.error('No edge between nodes: ', [this.path[i - 1], this.path[i]])
            this.route.push(edge);
            length += edge.length;
        }
        this.length = length;
    }
    steps() {
        const seq = [this.route[0].route[0]];
        for (const route of this.route) {
            for (let i = 1; i < route.route.length; i++) {
                const coords = route.route[i];
                seq.push(coords);
            }
        }
        return seq;
    }
}

/**
 * {@link Node|Nodes}, {@link Edge|Edges}, {@link Path|Paths} creator and {@link adjacency|Adjacency} list
 * @property {Data2D} data Number of tiles exluding the last one.
 * @property {Node} nodes array.
 * @property {Edge[]} edges array.
 * @property {Path[]} paths array.
 */
class Graph {
    /**
     * 
     * @param {Data2D} data
     */
    constructor(data) {
        this.data = data;

        /** @type {Map<Node,Map<Node,Edge[]>>} */
        this.adjacency = new Map();

        this.beginning;
        this.ending;
        /** @type {Node[]} */
        this.nodes = [];
        /** @type {Map<Coords,Node>} */
        this.nodeMap = new Map();
        this.buildNodes();

        /** @type {Edge[]} */
        this.edges = [];
        // /** @type {Map<Node,Edge>} */
        // this.edgeMap = new Map();
        this.buildEdges();

        /** @type {Path[]} */
        this.paths = [];
        this.buildPaths();
    }
    /**
     * @param {Coords} coords 
     * @param {Directive[]} dirs 
     */
    addNode(coords, dirs) {
        const node = new Node(this, coords, dirs);
        this.nodes.push(node);
        this.nodeMap.set(coords, node);
        this.adjacency.set(node, new Map());
        return node;
    }
    buildNodes() {
        const data = this.data;
        this.beginning = this.addNode(data.beginning);
        this.ending = this.addNode(data.ending);

        for (let y = 0; y < data.height; y++) {
            for (let x = 0; x < data.width; x++) {
                const tile = data.tile(y, x);
                if (tile.type === 'forrest') continue;

                let dirs = [];
                for (const dir in direction) {
                    const offTile = data.offTile(y, x, dir);
                    if (offTile && offTile.type !== 'forrest') dirs.push(dir);
                }
                // console.log(dirs);
                if (dirs.length > 2) this.addNode(tile.coords);
            }
        }
    }
    addEdge(route) {
        const start = this.nodeMap.get(route[0]);
        const end = this.nodeMap.get(route.at(-1));
        if (!start || !end) console.log('route start or end is no a Node!', { start, end, route });
        const edge = new Edge(this, start, end, route);
        this.edges.push(edge);
    }
    getEdge(start, end) {
        return this.adjacency.get(start).get(end);
    }
    buildEdges() {
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            for (const dir of node.dirs) {
                const route = this.walk(node.coords, dir);
                // console.log(route);
                if (route) this.addEdge(route);
            }
        }
    }
    walk(start, dir) {
        // console.log(`walking ${dir} from ${start}`);
        let coords = this.data.offCoords(...start, dir);
        let vel = dir;
        let route = [start, coords];
        // let [coords, vel] = this.step(start, dir);
        // let next = [coords, vel];
        while (!this.nodeMap.has(coords)) {
            // do {
            [coords, vel] = this.step(coords, vel);
            if (!vel) return false;
            route.push(coords);
        } //while (!this.nodeMap.has(coords));
        // route.push(coords);
        return route;
    }
    step(coords, vel) {
        // console.log(`stepping ${vel} from ${coords}`);
        let next = [false, false];

        const dirs = this.recon(coords, opposite[vel]);
        if (dirs.length < 1) return next;
        const dir = dirs[0];

        const nextTile = this.data.offTile(...coords, dir);
        if (!(nextTile?.dir === opposite[vel])) {
            next[0] = nextTile.coords;
            if (dirs.length === 1) next[1] = dir;
        };
        return next;
    }
    recon(coords, skip) {
        let dirs = [];
        for (const dir in direction) {
            if (dir === skip) continue;
            const nextTile = data.offTile(...coords, dir);
            if (nextTile && nextTile.type !== 'forrest') {
                // if ((nextTile?.dir === opposite[dir])) continue;
                dirs.push(dir);
            }
        }
        // if (!dirs.length) console.log('NO DIRS:' ,{coords, skip});
        return dirs;
    }
    addPath(path) {
        const hike = new Path(this, path);
        this.paths.push(hike);
    }
    buildPaths() {
        /** @type {Array<Node[]>} */
        const output = [];
        this.dfs(this.beginning, [this.beginning], output);
        // console.log({output});

        output.forEach(path => {
            const redundant = path.some((node, i) => {
                const dup = path.indexOf(node) !== i;
                if (dup) console.log('we have a dup: ', path);
                return dup;
            });
            if (!redundant) this.addPath(path);
        });
        // console.log(this.paths);
        const hikes = this.paths.map(path => path.length);
        const longest = hikes.reduce((acc, hike) => Math.max(acc, hike), 0);
        console.log({ hikes, longest });

        this.longestPath = this.paths.reduce((acc, path) => acc.length > path.length ? acc : path);
    }
    /**
     * @param {Node} node 
     * @param {Array<Node>} path 
     * @param {Array<Node>} output 
     * @returns {Array<Node>}
     */
    dfs(node, path, output) {
        if (node === this.ending) {
            output.push(path);
            return;
        }
        
        for (const route of node.enter) {
            if (path.includes(route.end)) continue;
            this.dfs(route.end, [...path, route.end], output);
        }
    }
}

/**
 * 2D array wrapper with some methods.
 */
class Data2D {
    /** @param {String[][]} arr2d  */
    constructor(arr2d) {
        this.raw = arr2d;

        // build coordinates & tiles
        /** @type {Object.<string,Coords>} */
        this.coordinates = {};
        /** @type {Map<Coords,Tile>} */
        this.tiles = new Map();
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                /** @type {Coords} */
                const coords = [y, x];
                this.coordinates[`${y} ${x}`] = coords;

                const char = arr2d[y][x];
                const type =
                    char === '#' ? 'forrest' :
                        // slopeChars.includes(char) ? 'slope' :
                            'path';
                /** @type {Tile} */
                const tile = { coords, char, type };
                // if (type === 'slope') tile.dir = slopeDir[char];
                this.tiles.set(coords, tile);
            }
        }
        this.height = arr2d.length;
        this.width = arr2d[0].length;

        this.beginning;
        this.ending;
        for (let x = 0; x < this.width; x++) {
            if (this.raw[0][x] === '.') this.beginning = this.coords(0, x);
            if (this.raw[this.height - 1][x] === '.') this.ending = this.coords(this.height - 1, x);
        }
    }
    /**
     * Get the coord set array for given y and x
     * @param {Number} y 
     * @param {Number} x 
     * @returns {Coords}
     */
    coords(y, x) {
        return this.coordinates[`${y} ${x}`];
    }
    /**
     * @param {Number} y 
     * @param {Number} x 
     * @param {Directive} dir 
     * @returns {Coords}
     */
    offCoords(y, x, dir) {
        const [yOff, xOff] = direction[dir];
        const [yNext, xNext] = [y + yOff, x + xOff];
        return this.coords(yNext, xNext);
    }
    tile(y, x) {
        return this.tiles.get(this.coords(y, x));
    }
    offTile(y, x, dir) {
        const [yOff, xOff] = direction[dir];
        const [yNext, xNext] = [y + yOff, x + xOff];
        return this.tiles.get(this.coords(yNext, xNext));
    }
}

class Painter { // TODO: refactor all image generation functions to methods
    constructor() {
        
    }
}

/**
 * @typedef {Array<Number,Number>} Coords Coordinates of garden plot.
 * @typedef {Array<Number,Number>} Offset Relative coordinates offset.
 * @typedef {'up'|'down'|'left'|'right'} Directive Direction name.
*/

/**
 * @typedef {Object} Tile Tile object.
 * @property {Coords} coords
 * @property {String} char
 * @property {'forrest'|'slope'|'path'} type
 * @property {Directive} dir
 */

/** @type {Object.<Directive,Offset>} */
const direction = { // [y, x]
    up: [-1, 0],
    right: [0, 1],
    down: [1, 0],
    left: [0, -1]
};

/** @type {Object.<Directive,Directive>} */
const opposite = {
    up: 'down',
    right: 'left',
    down: 'up',
    left: 'right'
};

const pathChars = ['.', '^', '>', 'v', '<'];

/** @type {Object.<String,Directive>} */
const slopeDir = {
    '^': 'up',
    '>': 'right',
    'v': 'down',
    '<': 'left'
};

const slopeChars = [...Object.keys(slopeDir)]//['^', '>', 'v', '<',];
