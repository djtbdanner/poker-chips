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
        this.socketPlays = [];
    }

    addPlayer(player) {
        // TODO -- check for player already here
        this.players.push(player);
    }

    addMessage(text) {
        this.messages.push(`[${this.getCurrentTime()}] ${text}`);
    }

    addSocketPlay(socketPlay) {
        this.socketPlays.push(socketPlay);
    }   


    playersFull(){
        if (this.players.length < this.playerCount){
            return false;
        }
        return true;
    }

    setPlayerTurn(player) {
        this.players.forEach(p => {
            p.turn = false;
        });
        player.turn = true;
    }

    
    setFirstBettor(player) {
        this.players.forEach(p => {
            p.firstBettor = false;
        });
        player.firstBettor = true;
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