module.exports = class Tile {
    static setPipes(pipes) {
        Tile.pipes = pipes;
    };
    // static pipes;
    static types = { // pipe types
        '|': ['n', 's'],
        '-': ['w', 'e'],
        'L': ['n', 'e'],
        'J': ['n', 'w'],
        '7': ['s', 'w'],
        'F': ['s', 'e'],
        '.': [null, null],
        'S': ['', ''],
    }
    static dirs = { // directions
        n: { x: 0, y: -1 },
        ne: { x: 1, y: -1 },
        e: { x: 1, y: 0 },
        se: { x: 1, y: -1 },
        s: { x: 0, y: 1 },
        sw: { x: -1, y: 1 },
        w: { x: -1, y: 0 },
        nw: { x: -1, y: -1 },
    }
    static opp = { // opposites
        n: 's',
        e: 'w',
        s: 'n',
        w: 'e'
    }
    static wall = '*';
    static areSame(t1,t2) {
        return t1.x === t2.x && t1.y === t2.y;
    }
    static findStart() {
        for (let y = 0; y < Tile.pipes.length; y++) {
            const line = Tile.pipes[y];
            for (let x = 0; x < line.length; x++) {
                if (line[x] === 'S') {
                    // console.log(line[x]);
                    return new Tile(x, y);
                }
            }
        }
    }
    /** @param {Tile} tile */
    static createNeighbors(tile) {
        const [dir1, dir2] = tile.getConnections();
        const tile1 = Tile.clone(tile);
        const tile2 = Tile.clone(tile);
        tile1.move(dir1);
        tile2.move(dir2);
        return [tile1, tile2];
    }
    static clone(tile) {
        return new Tile(tile.x, tile.y);
    }
    constructor(x, y) {
        this.init(x, y);
        this.steps = 0;
    }
    init(x, y) {
        this.c = Tile.pipes[y][x];
        this.x = x;
        this.y = y;
        this.rim = {};
        // { // TODO: replace with dirs loop
        //     n: Tile.pipes[y - 1][x] || Tile.wall,
        //     ne: Tile.pipes[y - 1][x + 1] || Tile.wall,
        //     e: Tile.pipes[y][x + 1] || Tile.wall,
        //     se: Tile.pipes[y - 1][x + 1] || Tile.wall,
        //     s: Tile.pipes[y + 1][x] || Tile.wall,
        //     sw: Tile.pipes[y + 1][x - 1] || Tile.wall,
        //     w: Tile.pipes[y][x - 1] || Tile.wall,
        //     nw: Tile.pipes[y - 1][x - 1] || Tile.wall
        // }
        for (let dir in Tile.dirs) {
            const {x:offX, y:offY} = Tile.dirs[dir]; // offsets
            const type = Tile.pipes[y + offY] && Tile.pipes[y + offY][x + offX] ?
                Tile.pipes[y + offY][x + offX] : Tile.wall;
            this.rim[dir] = type;
        }
    }
    getConnections() {
        if (this.c === 'S') {
            const connections = [];
            for (let dir in this.rim) {
                if (dir.length > 1) continue;
                console.log({ dir })
                const [tx, ty] = [this.x, this.y];
                const { x: nx, y: ny } = Tile.dirs[dir];
                const nType = Tile.pipes[ty + ny][tx + nx];
                if (!nType) continue;
                const nDirs = Tile.types[nType];
                const opp = Tile.opp[dir];
                const nHasOpp = nDirs[0] === opp || nDirs[1] === opp;
                console.log({ nType, nDirs, opp, nHasOpp })
                if (nHasOpp) {
                    connections.push(dir);
                }
            }
            // console.log({ connections })
            return connections;
        } else {
            return Tile.types[this.c];
        }
    }
    move(dir) {
        const exC = this.c;
        // this.previous = [this.x, this.y];
        this.previous = Tile.opp[dir];
        const { x, y } = Tile.dirs[dir]
        this.init(this.x + x, this.y + y);
        this.steps++;
        console.log(`${exC} => ${this.c}, steps: ${this.steps}`);
    }
    progress() {
        const dirs = Tile.types[this.c];
        const dir = dirs[0] === this.previous ? dirs[1] : dirs[0];
        this.move(dir);
    }
    render() {
        // console.log('render',tile);
        const c = this.c;
        const { n, ne, e, se, s, sw, w, nw } = tile.rim;

        process.stdout.moveCursor(0, -3); // Move the cursor up by 3 lines
        process.stdout.clearScreenDown();
        process.stdout.write(nw + n + ne + '\n');
        process.stdout.write(w + c + e + '\n');
        process.stdout.write(sw + s + se + '\n');
    }
}
