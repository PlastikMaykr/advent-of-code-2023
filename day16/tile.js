exports.direction = { // [x,y]
    up: [0, -1],
    right: [1, 0],
    down: [0, 1],
    left: [-1, 0]
}

exports.opposite = {
    up: 'down',
    right: 'left',
    down: 'up',
    left: 'right'
}

exports.mirror = { // { old: new }
    '.': {
        up: ['up'],
        right: ['right'],
        down: ['down'],
        left: ['left']
    },
    '|': {
        up: ['up'],
        right: ['up','down'],
        down: ['down'],
        left: ['up','down']
    },
    '-': {
        up: ['right','left'],
        right: ['right'],
        down: ['right','left'],
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
