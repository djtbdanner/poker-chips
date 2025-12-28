const assert = require('assert');
const pp = require('../process-play');

console.log('Running parseChips tests...');

// Representative amounts and expected behavior (based on current implementation)
assert.deepStrictEqual(pp.parseChips(1), { gray: 1, red: 0, green: 0, black: 0 }, 'parseChips(1)');
assert.deepStrictEqual(pp.parseChips(4), { gray: 4, red: 0, green: 0, black: 0 }, 'parseChips(4)');
assert.deepStrictEqual(pp.parseChips(5), { gray: 5, red: 0, green: 0, black: 0 }, 'parseChips(5)');
assert.deepStrictEqual(pp.parseChips(29), { gray: 9, red: 4, green: 0, black: 0 }, 'parseChips(29)');
assert.deepStrictEqual(pp.parseChips(117), { gray: 7, red: 7, green: 3, black: 0 }, 'parseChips(117)');

console.log('parseChips tests passed');
