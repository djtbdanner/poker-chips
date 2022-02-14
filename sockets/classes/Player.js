const crypto = require("crypto");
class Player {
  constructor(name) {
    this.name = name;
    this.id = crypto.randomBytes(16).toString("hex");
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
    this.allIn = false;
  }

  getChipTotal() {
    this.chipTotal = 0;
    this.chips.forEach((c) => {
      this.chipTotal += c.value;
    });
    return this.chipTotal;
  }
}
module.exports = Player