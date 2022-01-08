const crypto = require("crypto");
const players = [];

class Table {
    constructor(name, playerCount, startChipCount) {
        this.name = name;
        this.id = crypto.randomBytes(16).toString("hex");
        this.playerCount;
        this.startChipCount;
        this.players = [];
        this.pot = 0;
    }

    addPlayer(player) {
        // TODO -- check for player already here
        this.players.push(player);
    }
}
module.exports = Table 