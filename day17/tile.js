class Grid {
    static { }
    constructor(element, input) {
        this.input = input;
        this.rows = input.length;
        this.cols = input[0].length;

        this.element = element;
        this.element.style.setProperty('--cols', this.cols);

        this.tiles = [];
        for (let x = 0; x < this.cols; x++) {
            const column = [];
            this.tiles.push(column);
            for (let y = 0; y < this.rows; y++) {
                const loss = input[y][x];
                const tile = new Tile(this, x, y, loss);
                column.push(tile);
            }
        }
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const tile = this.getTile(x, y);
                tile.getAdj();
                this.element.append(tile.element);
            }
        }
    }
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Tile}
     */
    getTile(x, y) {
        if (
            x < 0 ||
            y < 0 ||
            x > this.cols - 1 ||
            y > this.rows - 1
        ) return null;
        return this.tiles[x][y];
    }
}

class Tile {
    /**
     * 
     * @param {Tile} a 
     * @param {Tile} b 
     */
    static distance(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
    // static { }
    constructor(grid, x, y, loss) {
        this.grid = grid;
        this.x = x;
        this.y = y;
        this.l = loss;
        this.g = null;
        this.h = null;
        this.f = null;
        /** @type {Tile} */
        this.from = null;

        this.element = document.createElement('div');
        this.element.classList.add('cell');
        this.element.style.setProperty('--loss', (100 / 8) * (this.l - 1));

        // this.$loss = document.createElement('span');
        // this.$loss.classList.add('l');
        // this.$loss.innerText = this.loss;
        // this.element.append(this.$loss);
        this.spans = {};

        this.addSpan(this.$g, 'g');
        this.addSpan(this.$h, 'h');
        this.addSpan(this.$f, 'f');
        this.addSpan(this.$l, 'l');
        this.updateVal('l', this.l);

        /** @type {Tile[]} */
        this.adj = [];
    }
    addSpan(span, style) {
        span = document.createElement('span');
        span.classList.add(style);
        this.element.append(span);

        this.spans[style] = span;
    }
    updateVal(value, newVal) {
        this.spans[value].innerText = newVal;
        this[value] = newVal;
    }
    open() {
        this.element.classList.add('open');
    }
    close() {
        this.element.classList.remove('open');
        this.element.classList.add('close');
    }
    getAdj() {
        for (let dir in direction) {
            const [x, y] = direction[dir];
            const tile = this.grid.getTile(this.x + x, this.y + y);
            if (tile) this.adj.push(tile);
        }
    }
    get [Symbol.toStringTag]() {
        return 'Validator';
    }
    toString() {
        return `MyClass - Name`//: ${this.name}, Age: ${this.age}`;
    }
}

class Path {
    static { }
    /**
     * 
     * @param {Grid} grid 
     */
    constructor(grid) {
        this.grid = grid;
        this.start = grid.getTile(0, 0);
        this.end = grid.getTile(grid.cols - 1, grid.rows - 1);

        this.done = false;
        this.init();
    }
    init() {
        this.start.updateVal('g', 0);
        this.start.updateVal('h', 0);
        this.start.updateVal('f', 0);

        this.current// = this.start;
        /** @type {Tile[]} */
        this.openSet = [this.start]//new Map([this.start, {}]);
        /** @type {Tile[]} */
        this.closedSet = []//new Map();
    }
    openTile(tile) {
        const openIdx = this.openSet.indexOf(tile);
        const closeIdx = this.closedSet.indexOf(tile);
        // console.log(`Tile(${tile.x}, ${tile.y}) openIdx: ${openIdx}, closeIdx: ${closeIdx}`);
        if (openIdx === -1 && closeIdx === -1) {
            this.openSet.push(tile);
            tile.open();
        }
    }
    closeTile(tile) {
        const index = this.openSet.indexOf(tile);
        this.openSet.splice(index, 1);
        this.closedSet.push(tile);
        tile.close();
    }
    getCheapest() {
        // const lowestF = this.openSet.reduce((acc, cur) => cur.f < acc.f ? cur : acc);
        const lowestF = this.openSet.reduce((acc, cur) => Math.min(cur.f, acc), Infinity);
        const cheapest = this.openSet.filter(tile => tile.f === lowestF);
        // console.log({ lowestF, cheapest });
        return cheapest; // cheapest tile
    }
    update() {
        if (this.openSet.length) {
            if (this.openSet.includes(this.end)) {
                this.retrace(this.end);
                this.done = true;
                return;
            }

            this.current = this.getCheapest();
            // console.log(this.current);
            for (let current of this.current) {
                // evaluate cheapest tile
                this.closeTile(current);
                for (let tile of current.adj) {
                    // TODO: check from direction past 2 tiles and skip if its continuous
                    if (this.lineageTooStr8(tile, current)) continue;
                    // console.debug(this.lineageTooStr8(tile));

                    this.openTile(tile);
                    // calc g, h and f
                    const g = Tile.distance(this.start, tile);
                    const h = Tile.distance(this.end, tile);
                    const f = g + h + tile.l;

                    if (tile.f === null || f < tile.f) {
                        tile.updateVal('g', g);
                        tile.updateVal('h', h);
                        tile.updateVal('f', f);
                        tile.from = current;
                    }
                }
            }
        } else {
            // no solution / end is reached
            console.log('no solution');
        }
        // console.log({ opened: this.openSet, closed: this.closedSet });
        // console.dir(this.openSet);
    }
    /** @param {Tile} tile */
    lineageTooStr8(tile, pa) {
        if (!pa?.from?.from) return false;
        // console.log('G-gf says HI', tile?.from?.from?.from);

        // const pa = tile.from; // father
        const papa = pa.from; // grandfather
        const papapa = papa.from; // great-grandfather

        return ((tile.x === pa.x && pa.x === papa.x && papa.x === papapa.x) ||
               (tile.y === pa.y && pa.y === papa.y && papa.y === papapa.y));
    }
    retrace(last = this.end.from ? this.end : this.getCheapest()[0]) {
        // let last;
        const trace = [last];
        while (last.from) {
            last = last.from;
            trace.push(last);
        }
        console.dir(trace);
        trace.forEach(({ element }) => element.classList.add('debug'));

        const heatLoss = trace.reduce((acc, cur) => acc + cur.l, 0);
        console.log({ heatLoss });
    }
    run() {
        if (this.done) return;
        const timer = performance.now();
        while (!this.done) {
            this.update();
        }
        console.log('Path finding took ', performance.now() - timer, 'ms');
    }
    animate() {
        if (this.done) return;
        this.update();
        requestAnimationFrame(this.animate.bind(this));
    }
}

const direction = { // [x,y]
    up: [0, -1],
    right: [1, 0],
    down: [0, 1],
    left: [-1, 0]
}

const opposite = {
    up: 'down',
    right: 'left',
    down: 'up',
    left: 'right'
}

const mirror = { // { old: new }
    '.': {
        up: ['up'],
        right: ['right'],
        down: ['down'],
        left: ['left']
    },
    '|': {
        up: ['up'],
        right: ['up', 'down'],
        down: ['down'],
        left: ['up', 'down']
    },
    '-': {
        up: ['right', 'left'],
        right: ['right'],
        down: ['right', 'left'],
        left: ['left']
    },
    '\\': {
        up: ['left'],
        right: ['down'],
        down: ['right'],
        left: ['up']
    },
    '/': {
        up: ['right'],
        right: ['up'],
        down: ['left'],
        left: ['down']
    },
}
