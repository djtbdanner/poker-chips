const crypto = require("crypto");
class Player {
    constructor(name) {
        this.name = name;
        this.id = crypto.randomBytes(16).toString("hex");
      //  this.chips = 0;
        this.turn = false;
        this.dealer = false;
        this.folded = false;
        this.firstBettor = false;
        this.socketId = undefined;
        this.hasVoted = false;
        this.winVoteCount = 0;
        this.potRaisedBy = 0;
        this.chips = [];
        this.chipTotal = 0;
        this.showChipExchangeDiv = false;
    }
}
module.exports = Player