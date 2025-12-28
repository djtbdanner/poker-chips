const assert = require('assert');
const pp = require('../process-play');

console.log('Running process-play tests...');

// Helper: map chip enum to values
const Chip = require('../classes/Chip');
const VALUE_MAP = {};
VALUE_MAP[Chip.Black.color] = 100;
VALUE_MAP[Chip.Green.color] = 25;
VALUE_MAP[Chip.Red.color] = 5;
VALUE_MAP[Chip.Gray.color] = 1;

function chipsTotalValue(chips) {
    return chips.reduce((sum, c) => sum + (VALUE_MAP[c.color] || 0), 0);
}

// Stub out updatePlayersAfterCompleteRoundOfBetting so tests don't require full player objects
pp.updatePlayersAfterCompleteRoundOfBetting = () => {};

// --- Test 1: split pot between two winners (no side pots) ---
(function testSplitPotTwoWinners() {
    const p1 = { id: 'p1', name: 'Alice', chips: [], showWin: false, folded: false, isBroke: false, isConnected: true, sidePotTotal: 0 };
    const p2 = { id: 'p2', name: 'Bob', chips: [], showWin: false, folded: false, isBroke: false, isConnected: true, sidePotTotal: 0 };
    const table = {
        playStatus: { pot: 11, chips: [], reset: () => {}, selectWinner: false },
        players: [p1, p2],
        addMessage: (m) => { /* ignore */ },
        setChipTotalsForPlayers: () => {}
    };

    pp.processWinner([p1, p2], table);

    const totalAwarded = chipsTotalValue(p1.chips) + chipsTotalValue(p2.chips);
    assert.strictEqual(totalAwarded, 11, 'total chips awarded should equal initial pot');
    assert.strictEqual(p1.showWin, true, 'p1 should have showWin set');
    assert.strictEqual(p2.showWin, true, 'p2 should have showWin set');
    // check remainder handling: one should have 6 and other 5
    assert.ok(chipsTotalValue(p1.chips) === 6 || chipsTotalValue(p2.chips) === 6, 'one player should receive the remainder chip');
    console.log('split pot (two winners) test passed');
})();

// --- Test 2: single winner with side pot ---
(function testSingleWinnerWithSidePot() {
    const winner = {
        id: 'w1', name: 'Carol', chips: [], showWin: false, folded: false, allIn: true, sidePotTotal: 10,
        getChipTotal: function () { return chipsTotalValue(this.chips); }
    };
    const other = { id: 'p2', name: 'Dave', chips: [], showWin: false, folded: false, isBroke: false, isConnected: true };
    const table = {
        playStatus: { pot: 30, chips: [], reset: function() { this.pot = 0; this.chips = []; this.selectWinner = false; }, selectWinner: false },
        players: [winner, other],
        addMessage: (m) => { /* ignore */ },
        setChipTotalsForPlayers: () => {}
    };

    pp.processWinner([winner], table);

    assert.strictEqual(chipsTotalValue(winner.chips), 10, 'winner should receive their side pot total (10)');
    assert.strictEqual(winner.folded, true, 'winner should be marked folded after side pot processing');
    assert.strictEqual(winner.sidePotTotal, 0, 'winner sidePotTotal should be cleared');
    assert.strictEqual(chipsTotalValue(other.chips), 20, 'other player should receive the leftover pot (20)');
    assert.strictEqual(table.playStatus.pot, 0, 'pot should be reset after awarding leftover pot');
    console.log('single winner with side pot test passed');
})();

console.log('ALL process-play tests OK');
