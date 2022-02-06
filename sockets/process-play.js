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


exports.calculateCurrentCallAmount = (currentPlayer, table, bet) => {

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
    table.addMessage(`${nextDealer.name} is dealer with ${nextPlayer.name} betting.`);

    const playersNotFolded = table.players.filter(player => !player.folded);
    if (playersNotFolded.length < 2) {
        return true;
    }
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