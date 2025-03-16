const crypto = require("crypto");
const PlayStatus = require('./PlayStatus');

class Table {
    constructor(name, playerCount, startChipCount, roundsPerDeal, bigBlind, blindsDouble) {
        this.name = name;
        this.id = crypto.randomBytes(16).toString("hex");
        this.playerCount = playerCount;
        this.startChipCount = startChipCount;
        this.roundsPerDeal = roundsPerDeal;
        this.bigBlind = bigBlind;
        this.blindsDouble = blindsDouble;
        this.players = [];
        this.messages = [];
        this.playStatus = new PlayStatus();
        this.startTime = new Date();
    }

    addPlayer(player) {
        // TODO -- check for player already here
        this.players.push(player);
    }

    addMessage(text) {
        this.messages.push(`[${this.getCurrentTime()}] ${text}`);
    }

    playersFull(){
        if (this.players.length < this.playerCount){
            return false;
        }
        return true;
    }

    setChipTotalsForPlayers(){
        this.players.forEach((p)=>{
            p.getChipTotal();
        });
    }

    getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };
}
module.exports = Table 