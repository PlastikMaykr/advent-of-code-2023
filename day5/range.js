// export default 
module.exports = class Range { //FIXME: rename to Domain
    static { console.log('Range loaded'); }
    /**
     * 
     * @param {Range} a 
     * @param {Range} b 
     */
    static areOverlapping(a, b) {
        return a.includes(b.min) || a.includes(b.max);
    }
    /**
     * 
     * @param {Range} source 
     * @param {Range} target 
     */
    static overlap(source, target) {
        let left, overlap, right;
        if (source.max < target.min) {
            left = Range.clone(source);
        } else if (source.min > target.max) {
            right = Range.clone(source);
        } else if (target.includes(source.min) && target.includes(source.max)) {
            overlap = Range.clone(source);
        } else if (source.includes(target.min) && source.includes(target.max)) {
            left = new Range(source.min, target.min - 1);
            overlap = new Range(target.min, target.max);
            right = new Range(target.max + 1, source.max);
        } else if (source.includes(target.min)) {
            left = new Range(source.min, target.min - 1);
            overlap = new Range(target.min, source.max);
        } else if (source.includes(target.max)) {
            overlap = new Range(source.min, target.max);
            right = new Range(target.max + 1, source.max);
        }

        return { left, overlap, right }
    }
    /**
     * 
     * @param {Range} range 
     * @param {number} value 
     * @returns 
     */
    static split(range, value, smallest = 1) {
        if (!range.includes(value)) return;
        if (range.min === value ||
            range.max === value)
            return [range];
        return [
            new Range(range.min, value - smallest),
            new Range(value, range.max)
        ];
    }
    /**
     * 
     * @param {Range[]} ranges 
     */
    static sort(ranges) {
        return ranges.sort((a,b) => a.min - b.min ?? a.max - b.max);
    }
    /**
     * 
     * @param {Range[]} ranges 
     */
    static combine(ranges) {
        if (ranges.length < 2) return [...ranges];
        const sorted = Range.sort([...ranges]);
        const combined = [];
        let start, end;
        for (let i = 1; i < sorted.length; i++) {
            const prev = sorted[i-1];
            const next = sorted[i];
            const ovelapping =
                Range.areOverlapping(prev, next) || 
                prev.max + 1 === next.min;
            start ??= prev.min;
            end ??= prev.max;
            if (!ovelapping) {
                end = prev.max;
                combined.push(new Range(start, end));
                start = next.min;
                end = null;
            }
            // console.log(i, sorted.length - 1);
            if (i === sorted.length - 1) {
                end = Math.max(next.max, end);
                combined.push(new Range(start, end));
            }
        }
        return combined;   



        // const rangeSet = new Set(ranges);
        // const combined = [];
        // for (let source of rangeSet) {
        //     let overlapped = false;
        //     for (let target of rangeSet) {
        //         if (Range.areOverlapping(source, target)) {
        //             combined.push(new Range());
        //             overlapped = true;
        //         }
        //     }
        // }
    }
    static clone({min, max}) {
        return new Range(min, max);
    }
    static fromSting(str, splitter = ' ') {
        const [min, max] = str
            .split(splitter)
            .map(s => parseInt(s)) // float ? parseFloat()
        return new Range(min, max);
    }
    static fromStingSnL(str, splitter = ' ') { // Start and Length
        const [min, len] = str
            .split(splitter)
            .map(s => parseInt(s)) // float ? parseFloat()
        return Range.fromSnL(min, len);
    }
    static fromSnL(start, len) { // Start and Length
        return new Range(start, start + len - 1);
    }
    constructor(min, max) {
        if (!max && typeof min === 'object') {
            this.min = Math.min(...min);
            this.max = Math.max(...min);
            return;
        }

        if (min > max) [min, max] = [max, min];
        this.min = min;
        this.max = max;
    }
    shift(val) {
        this.min += val;
        this.max += val;
        return this;
    }
    get length() {
        return this.max - this.min + 1;
    }
    includes(val) {
        return this.min <= val && val <= this.max;
    }
    get [Symbol.toStringTag]() {
        // return JSON.stringify(this);
        return `${this.min}, ${this.max}`;
    }
}
