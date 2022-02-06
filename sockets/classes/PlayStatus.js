class PlayStatus {
    constructor() {
        this.playerLastRaised = undefined;
        this.callAmount = 0;
        this.numberOfRaises = 0;
        this.roundsBet = 0;
        this.selectWinner = false;
        this.pot = 0;
        this.totalRaiseThisRound = 0;
        this.chips = [];
    }

    reset() {
        this.playerLastRaised = undefined;
        this.canCheck = true;
        this.callAmount = 0;
        this.numberOfRaises = 0;
        this.roundsBet = 0;
        this.selectWinner = false;
        this.pot = 0;
        this.totalRaiseThisRound = 0;
        this.chips = [];
    }
}
module.exports = PlayStatus