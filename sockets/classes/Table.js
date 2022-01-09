const crypto = require("crypto");
const players = [];

class Table {
    constructor(name, playerCount, startChipCount) {
        this.name = name;
        this.id = crypto.randomBytes(16).toString("hex");
        this.playerCount = playerCount;
        this.startChipCount = startChipCount;
        this.players = [];
        this.pot = 0;
        this.messages = [];
    }

    addPlayer(player) {
        // TODO -- check for player already here
        this.players.push(player);
    }

    addMessage(text) {
        // TODO -- check for player already here
        this.messages.push(text);
    }

    playersFull(){
        if (this.players.length < this.playerCount){
            return false;
        }
        return true;
    }
}
module.exports = Table 