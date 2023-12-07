Range = require('./range.js')

// example ranges
var a = new Range(10,49);
var b = new Range(40,60);
var c = new Range(50,80);
var d = new Range(0,100);

var ranges = [a,b,c,d];

// split & overlap
for (var source of ranges) {
    for (var target of ranges) {
        var splitMin = Range.split(source, target.min);
        var splitMax = Range.split(source, target.max);
        var overlap = Range.overlap(source, target);

        console.log({source, target, splitMin, splitMax, overlap});
    }
}

//  sort & combine
var sorted = Range.sort([...ranges]);
console.log({sorted});

var combined = Range.combine([...ranges]);
console.log({combined});

for (var source of ranges) {
    for (var target of ranges) {
        var combined = Range.combine([source, target]);

        console.log({source, target, combined});
    }
}
