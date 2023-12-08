const fs = require('node:fs');

const data = fs.readFileSync('input.txt', 'utf8');

const dataArr = data
    .split('\r\n')
    .map(line => line.split(/\s/))
    .map(([cards, bid]) => [cards.split(''), parseInt(bid)]);
// console.log(dataArr);

const labelsArr = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A',]
const labels = {};
for (let i = 0; i < labelsArr.length; i++) {
    labels[labelsArr[i]] = i + 2;
}
// console.log(labels);

const hands = [];
for (let i = 0; i < dataArr.length; i++) {
    const [cards, bid] = dataArr[i];
    const type = determineType(cards);

    hands[i] = {
        cards,
        type,
        bid
    }
}
// console.log(hands);

let handsTyped = [];
for (let i = 0; i < hands.length; i++) {
    const hand = hands[i];
    handsTyped[hand.type] ??= [];
    handsTyped[hand.type].push(hand);
}
// handsTyped = handsTyped.filter(n => n) // filter empty items
// console.log(handsTyped);

let handsSorted = handsTyped
    .map(type => type.sort(rankSort))
    .flat();
// console.log(handsSorted);

let winningsArr = [];
let winnings = 0;
for (let i = 1; i <= handsSorted.length; i++) {
    const win = handsSorted[i - 1].bid * i;
    winningsArr.push(win);
    winnings += win;
    handsSorted[i - 1].rank = i;
}
console.log({winningsArr, winnings});
console.log(handsSorted);
// console.log(handsTyped[0]);

function rankSort({ cards: a }, { cards: b }) {
    for (let i = 0; i < a.length; i++) {
        if (a[i] == b[i]) continue;
        if (labels[a[i]] < labels[b[i]]) {
            return -1
        } else {
            return 1
        }
    }
    throw new Error('Ideantical hands', a, b);
}

function determineType(cards) {
    const kinds = new Map();
    for (let i = 0; i < cards.length; i++) {
        const kind = cards[i];
        const count = kinds.get(kind);
        if (count) {
            kinds.set(kind, count + 1);
        } else {
            kinds.set(kind, 1);
        }
    }
    const totals = [...kinds.values()].sort().reverse();

    let type = 0;
    if (totals[0] === 5) { // five of a kind
        type = 7;
    } else if (totals[0] === 4) { // four of a kind
        type = 6;
    } else if (totals[0] === 3 && totals[1] === 2) { // full house
        type = 5;
    } else if (totals[0] === 3) { // three of a kind
        type = 4;
    } else if (totals[0] === 2 && totals[1] === 2) { // two pairs
        type = 3;
    } else if (totals[0] === 2) {  // one pair
        type = 2;
    } else if (totals[0] === 1) { // high card
        type = 1;
        // } else {
    }
    // console.log({ type, totals, cards });
    return type
}


let output = '';
for (let i = 0; i < handsSorted.length; i++) {
    const hand = handsSorted[i];
    let line = `${hand.cards.join('')} ${`${hand.bid}`.padEnd(4)} ${hand.type} ${hand.rank}`;

    output += line + '\r\n';
}
// console.log(output)
fs.writeFileSync('output.txt', output);
