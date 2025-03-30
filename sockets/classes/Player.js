const crypto = require("crypto");
class Player {
  constructor(name, connectionId) {
    this.name = name;
    this.id = connectionId;
    this.connectionId = connectionId;
    this.turn = false;
    this.dealer = false;
    this.folded = false;
    this.firstBettor = false;
    this.hasVoted = false;
    this.winVoteCount = 0;
    this.potRaisedBy = 0;
    this.chips = [];
    this.chipTotal = 0;
    this.showChipExchangeDiv = false;
    this.allIn = false;
    this.totalRoundBet = 0;
    this.sidePotTotal = 0;
    this.isConnected = true;
    this.isChampion = false;
    this.isBroke = false;
    this.showWin=false;
    this.isBigBlind = false;
  }

  reset() {
    this.sidePotTotal = 0;
    this.totalRoundBet = 0;
    this.allIn = false;
    this.turn = false;
    this.firstBettor = false;
    this.isChampion = false;
    this.winVoteCount = 0;
    this.hasVoted = false;
    this.potRaisedBy = 0;
    this.folded = false;
    this.allIn = false;
    this.isBroke = false;
    this.dealer = false;
    this.isBigBlind = false;
   
  }
  
  getChipTotal() {
    this.chipTotal = 0;
    this.chips.forEach((c) => {
      this.chipTotal += c.value;
    });
    return this.chipTotal;
  }

  isActive(){
    return !this.folded && !this.isBroke && this.isConnected && !this.allIn;
  }
}
module.exports = Player