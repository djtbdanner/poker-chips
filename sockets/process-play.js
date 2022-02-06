const Chip = require('./classes/Chip');

exports.setNextPlayerTurn = (currentPlayer, table) => {
    const playerIndex = table.players.findIndex(player => player.id === currentPlayer.id);
    currentPlayer.turn = false;
    let nextPlayer = playerIndex + 1;
    if (nextPlayer >= table.players.length) {
        nextPlayer = 0;
    }
    const player = table.players[nextPlayer];
    if (player.folded) {
        this.setNextPlayerTurn(player, table)
    } else {
        player.turn = true;
    }
}


exports.calculateCurrentCallAmount = (table) => {

    table.playStatus.callAmount = 0;
    const bettingPlayer = table.players.find(player => player.turn);
    const thisPlayersBetAmount = bettingPlayer.potRaisedBy;
    const totalRaiseAmount = table.playStatus.totalRaiseThisRound;
    if (totalRaiseAmount > thisPlayersBetAmount) {
        table.playStatus.callAmount = totalRaiseAmount - thisPlayersBetAmount;
    }
}

exports.isBetRoundOver = (currentPlayer, table, socket) => {

    const playersNotFolded = table.players.filter(player => !player.folded);
    if (playersNotFolded.length < 2) {
        this.processWinner(playersNotFolded[0], table, socket);
        return true;
    }

    const playerIndex = table.players.findIndex(player => player.id === currentPlayer.id);
    let nextPlayer = playerIndex + 1;
    if (nextPlayer >= table.players.length) {
        nextPlayer = 0;
    }
    const player = table.players[nextPlayer];

    if (!table.playStatus.playerLastRaised) {
        if (player.firstBettor) {
            table.playStatus.selectWinner = true;
            return true;
        }
    } else {
        if (player.id === table.playStatus.playerLastRaised.id) {
            table.playStatus.selectWinner = true;
            return true;
        }
    }
    return false;
}

exports.updatePlayersAfterBetting = (currentPlayer, table, bet) => {
    // table.playStatus.reset();
    const dealerIndex = table.players.findIndex(player => player.dealer);
    const currentDealer = table.players[dealerIndex];
    currentDealer.dealer = false;
    let nextDealerIndex = dealerIndex + 1;
    if (nextDealerIndex >= table.players.length) {
        nextDealerIndex = 0;
    }
    const nextDealer = table.players[nextDealerIndex];
    nextDealer.dealer = true;
    table.players.forEach((p) => { p.turn = false; p.firstBettor = false; });
    let nextPlayerIndex = nextDealerIndex + 1;
    if (nextPlayerIndex >= table.players.length) {
        nextPlayerIndex = 0;
    }
    const nextPlayer = table.players[nextPlayerIndex];
    nextPlayer.turn = true;
    nextPlayer.firstBettor = true;
    table.addMessage(`Betting round complete.`);
    table.addMessage(`${nextDealer.name} is dealer with ${nextPlayer.name} betting.`);

    // const playersNotFolded = table.players.filter(player => !player.folded);
    // if (playersNotFolded.length < 2) {
    //     return true;
    // }
}

exports.processWinner = (winningPlayer, table, socket) => {
    table.players.forEach((p) => { p.winVoteCount = 0; p.hasVoted = false; p.potRaisedBy = 0; p.folded = false; });
    table.addMessage(`${winningPlayer.name} WINS the pot of ${table.playStatus.pot} chips!!`);
    winningPlayer.chips.push(...table.playStatus.chips);
    table.playStatus.reset();
    table.setChipTotalsForPlayers();
    // give the process a second to update the pages, then flash (no harm if not done)
    setTimeout(() => {
        socket.broadcast.to(table.id).emit(`poker-div-blink`, { elementId: winningPlayer.id });
        socket.emit(`poker-div-blink`, { elementId: winningPlayer.id });
    }, 500);
} 

exports.calculateChips = (chips, player, table) => {
    let betBlackCount = 0;
    let betGreenCount = 0;
    let betRedCount = 0;
    let betGrayCount = 0;
    let totalChips = 0;

    if (Array.isArray(chips)) {
        betBlackCount = chips.find((c) => c.color === "black").count;
        betGreenCount = chips.find((c) => c.color === "green").count;
        betRedCount = chips.find((c) => c.color === "red").count;
        betGrayCount = chips.find((c) => c.color === "gray").count;
        totalChips = betBlackCount * 100 + betGreenCount * 25 + betRedCount * 5 + betGrayCount * 1;
    } else {
        totalChips = chips;
        let amount = totalChips;
        while (amount > 0) {
            if (amount >= 100) {
                betBlackCount = betBlackCount + 1;
                amount -= 100;
            } else if (amount >= 25) {
                betGreenCount = betGreenCount + 1;
                amount -= 25;
            } else if (amount >= 5) {
                betRedCount = betRedCount + 1;
                amount -= 5;
            } else {
                betGrayCount = betGrayCount + 1;
                amount -= 1;
            }
        }
    }

    let playerBlackChipCount = player.chips.filter(c => c.color === `black`).length;
    let playerGreenChipCount = player.chips.filter(c => c.color === `green`).length;
    let playerRedChipCount = player.chips.filter(c => c.color === `red`).length;
    let playerGrayChipCount = player.chips.filter(c => c.color === `gray`).length;
    playerBlackChipCount = playerBlackChipCount - betBlackCount;
    playerGreenChipCount = playerGreenChipCount - betGreenCount;
    playerRedChipCount = playerRedChipCount - betRedCount;
    playerGrayChipCount = playerGrayChipCount - betGrayCount;

    while (betBlackCount > 0) {
        table.playStatus.chips.push(Chip.Black);
        betBlackCount -= 1;
    }
    while (betGreenCount > 0) {
        table.playStatus.chips.push(Chip.Green);
        betGreenCount -= 1;
    }
    while (betRedCount > 0) {
        table.playStatus.chips.push(Chip.Red);
        betRedCount -= 1;
    }
    while (betGrayCount > 0) {
        table.playStatus.chips.push(Chip.Gray);
        betGrayCount -= 1;
    }

    player.chips = [];
    while (playerBlackChipCount > 0) {
        player.chips.push(Chip.Black);
        playerBlackChipCount -= 1;
    }
    while (playerGreenChipCount > 0) {
        player.chips.push(Chip.Green);
        playerGreenChipCount -= 1;
    }
    while (playerRedChipCount > 0) {
        player.chips.push(Chip.Red);
        playerRedChipCount -= 1;
    }
    while (playerGrayChipCount > 0) {
        player.chips.push(Chip.Gray);
        playerGrayChipCount -= 1;
    }
    table.playStatus.pot = table.playStatus.pot + totalChips;
    player.potRaisedBy = player.potRaisedBy + totalChips;
    return totalChips;
}
