const crypto = require("crypto");
const PlayStatus = require('./PlayStatus');

class Table {
    constructor(name, playerCount, startChipCount) {
        this.name = name;
        this.id = crypto.randomBytes(16).toString("hex");
        this.playerCount = playerCount;
        this.startChipCount = startChipCount;
        this.players = [];
        this.messages = [];
        this.playStatus = new PlayStatus();
    }

    addPlayer(player) {
        // TODO -- check for player already here
        this.players.push(player);
    }

    addMessage(text) {
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