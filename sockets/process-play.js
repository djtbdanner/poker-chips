const Chip = require('./classes/Chip');

exports.getNextActivePlayer = (currentPlayer, table) => {

    const activePlayers = table.players.filter((p) =>{
        return !p.folded && p.getChipTotal() > 0;
    });
    if (activePlayers.length < 2){
        console.log ("Less than 2 active players - returning the current player in getNextActive player");
        return currentPlayer;
    }

    const playerIndex = table.players.findIndex(player => player.id === currentPlayer.id);
    currentPlayer.turn = false;
    let nextPlayer = playerIndex + 1;
    if (nextPlayer >= table.players.length) {
        nextPlayer = 0;
    }
    const player = table.players[nextPlayer];
    if (player.folded || player.chipTotal <= 0) {
        return this.getNextActivePlayer(player, table)
    } else {
        return player;
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

exports.updatePlayersAfterBetting = (table) => {
    
    const dealerIndex = table.players.findIndex(player => player.dealer);
    const currentDealer = table.players[dealerIndex];
    currentDealer.dealer = false;
    const nextDealer = this.getNextActivePlayer(currentDealer, table);
    nextDealer.dealer = true;

    table.players.forEach((p) => { p.turn = false; p.firstBettor = false; });
    const nextPlayer = this.getNextActivePlayer(nextDealer, table);
    nextPlayer.turn = true;
    nextPlayer.firstBettor = true;
    table.addMessage(`Betting round complete.`);
    table.addMessage(`${nextDealer.name} is dealer with ${nextPlayer.name} betting.`);
}

exports.processWinner = (winningPlayer, table, socket) => {
    table.players.forEach((p) => { p.winVoteCount = 0; p.hasVoted = false; p.potRaisedBy = 0; p.folded = false; p.allIn = false });
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
    // like this [{color:"black", count:0},{color:"green", count:0},{color:"red", count:0},{color:"gray", count:10},]
    if (Array.isArray(chips)) {
        totalChips = this.pullChipsByChipCount(table, player, chips);
    } else {
        totalChips = parseInt(chips, 10);
        let success = this.pullChipsToAmount(table, player, totalChips);
        let tries = 0;
        while (!success && tries < 4) {
            this.exchangeChipsPlayer(table, player, `black`, `green`);
            this.exchangeChipsPlayer(table, player, `green`, `red`);
            this.exchangeChipsPlayer(table, player, `red`, `gray`);
            tries += 1;
            success = this.pullChipsToAmount(table, player, totalChips);
        }
    }
    player.potRaisedBy = player.potRaisedBy + totalChips;
    return totalChips;
}

exports.setPlayerChips = (table, player, playerBlackChipCount, playerGreenChipCount, playerRedChipCount, playerGrayChipCount) => {
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
    table.setChipTotalsForPlayers();
}

exports.setPotChips = (table, betBlackCount, betGreenCount, betRedCount, betGrayCount) => {
    let totalChips = 0;
    while (betBlackCount > 0) {
        table.playStatus.chips.push(Chip.Black);
        betBlackCount -= 1;
        totalChips += 100;
    }
    while (betGreenCount > 0) {
        table.playStatus.chips.push(Chip.Green);
        betGreenCount -= 1;
        totalChips += 25;
    }
    while (betRedCount > 0) {
        table.playStatus.chips.push(Chip.Red);
        betRedCount -= 1;
        totalChips += 5;
    }
    while (betGrayCount > 0) {
        table.playStatus.chips.push(Chip.Gray);
        betGrayCount -= 1;
        totalChips += 1;
    }
    table.playStatus.pot = table.playStatus.pot + totalChips;
    return { betBlackCount, betGreenCount, betRedCount, betGrayCount };
}

exports.pullChipsByChipCount = (table, player, chips) => {

    let playerBlackChipCount = player.chips.filter(c => c.color === `black`).length;
    let playerGreenChipCount = player.chips.filter(c => c.color === `green`).length;
    let playerRedChipCount = player.chips.filter(c => c.color === `red`).length;
    let playerGrayChipCount = player.chips.filter(c => c.color === `gray`).length;

    let betBlackCount = chips.find((c) => c.color === "black").count;
    let betGreenCount = chips.find((c) => c.color === "green").count;
    let betRedCount = chips.find((c) => c.color === "red").count;
    let betGrayCount = chips.find((c) => c.color === "gray").count;
    let totalChips = betBlackCount * 100 + betGreenCount * 25 + betRedCount * 5 + betGrayCount * 1;
    // hope that the client side does not allow this.
    if (player.getChipTotal() < totalChips) {
        throw new Error(`Player ${player.name} does not have enough chips for a ${totalChips} call or bet.`);
    }
    playerBlackChipCount = playerBlackChipCount - betBlackCount;
    playerGreenChipCount = playerGreenChipCount - betGreenCount;
    playerRedChipCount = playerRedChipCount - betRedCount;
    playerGrayChipCount = playerGrayChipCount - betGrayCount;
    this.setPotChips(table, betBlackCount, betGreenCount, betRedCount, betGrayCount);
    this.setPlayerChips(table, player, playerBlackChipCount, playerGreenChipCount, playerRedChipCount, playerGrayChipCount);
    return totalChips;
}

exports.pullChipsToAmount = (table, player, totalBet) => {

    console.log(`Player ${player.name} betting ${totalBet}, pulling chips`);
    if (player.chipTotal < totalBet) {
        throw new Error(`Player ${player.name} does not have enough chips for a ${totalChips} call or bet.`);
    }
    let playerBlackChipCount = player.chips.filter(c => c.color === `black`).length;
    let playerGreenChipCount = player.chips.filter(c => c.color === `green`).length;
    let playerRedChipCount = player.chips.filter(c => c.color === `red`).length;
    let playerGrayChipCount = player.chips.filter(c => c.color === `gray`).length;

    let betBlackCount = 0;
    let betGreenCount = 0;
    let betRedCount = 0;
    let betGrayCount = 0;

    let amount = totalBet;
    let isStillFindingChips = true;
    while (amount > 0 && isStillFindingChips) {
        isStillFindingChips = false;
        if (amount >= 100) {
            if (playerBlackChipCount >= 1) {
                betBlackCount += 1;
                playerBlackChipCount -= 1;
                amount -= 100;
                isStillFindingChips = true;
            } else {
                let tempAmt = 100;
                while (tempAmt > 0 && (playerGreenChipCount >= 1 || playerRedChipCount >= 1 || playerGrayChipCount >= 1)) {
                    if (playerGreenChipCount >= 1) {
                        betGreenCount += 1;
                        playerGreenChipCount -= 1;
                        tempAmt -= 25;
                        amount -= 25;
                        isStillFindingChips = true;
                    } else if (playerRedChipCount >= 1) {
                        betRedCount += 1;
                        playerRedChipCount -= 1;
                        tempAmt -= 5;
                        isStillFindingChips = true;
                        amount -= 5;

                    } else if (playerGrayChipCount >= 1) {
                        betGrayCount += 1;
                        playerGrayChipCount -= 1;
                        tempAmt -= 1;
                        isStillFindingChips = true;
                        amount -= 1;
                    }
                }
            }
        } else if (amount >= 25) {
            if (playerGreenChipCount >= 1) {
                playerGreenChipCount -= 1;
                betGreenCount += 1;
                isStillFindingChips = true;
                amount -= 25;
            } else {
                let tempAmt = 25;
                while (tempAmt > 0 &&  (playerRedChipCount >= 1 || playerGrayChipCount >= 1)) {
                    if (playerRedChipCount >= 1) {
                        betRedCount += 1;
                        playerRedChipCount -= 1;
                        tempAmt -= 5;
                        isStillFindingChips = true;
                        amount -= 5;
                    } else if (playerGrayChipCount >= 1) {
                        betGrayCount += 1;
                        playerGrayChipCount -= 1;
                        tempAmt -= 1;
                        isStillFindingChips = true;
                        amount -= 1;
                    }
                }
            }

        } else if (amount >= 5) {
            if (playerRedChipCount >= 1) {
                playerRedChipCount -= 1;
                betRedCount += 1;
                isStillFindingChips = true;
                amount -= 5;
            } else {
                let tempAmt = 5;
                while (tempAmt > 0 && playerGrayChipCount >= 1) {
                    betGrayCount += 1;
                    playerGrayChipCount -= 1;
                    tempAmt -= 1;
                    amount -= 1;
                    isStillFindingChips = true;
                }
            }
        } else {
            if (playerGrayChipCount >= 1) {
                playerGrayChipCount = playerGrayChipCount - 1;
                betGrayCount = betGrayCount + 1;
                isStillFindingChips = true;
                amount -= 1;
            }
        }
    }
    if (amount !== 0) {
        console.log(`Unable to pull chips for player ${player.name}, chips:${JSON.stringify(player.chips)}, bet ${totalBet}`);
        return false;
    }
    console.log(`Successfully pulled chips for bet.`)
    this.setPotChips(table, betBlackCount, betGreenCount, betRedCount, betGrayCount);
    this.setPlayerChips(table, player, playerBlackChipCount, playerGreenChipCount, playerRedChipCount, playerGrayChipCount);
    return true;
}


exports.exchangeChipsPlayer = (table, player, fromChipColor, toChipColor) => {
    console.log(`Player ${player.name} exchanging ${fromChipColor} chips for ${toChipColor} chips.`);
    let playerBlackChipCount = player.chips.filter(c => c.color === `black`).length;
    let playerGreenChipCount = player.chips.filter(c => c.color === `green`).length;
    let playerRedChipCount = player.chips.filter(c => c.color === `red`).length;
    let playerGrayChipCount = player.chips.filter(c => c.color === `gray`).length;
    let errMessage = `Unable to exchange ${fromChipColor} chips for ${toChipColor} chips.`
    if (fromChipColor === `black`) {
        if (toChipColor !== `green` || playerBlackChipCount < 1) {
            console.log(errMessage);
            return errMessage;
        }

        playerBlackChipCount = playerBlackChipCount - 1;
        playerGreenChipCount = playerGreenChipCount + 4;
    }
    else if (fromChipColor === `green`) {
        if (toChipColor === `gray` || (toChipColor === `black` && playerGreenChipCount < 4) || playerGreenChipCount < 1) {
            console.log(errMessage);
            return errMessage;
        }
        if (toChipColor == `red`) {
            playerGreenChipCount = playerGreenChipCount - 1;
            playerRedChipCount = playerRedChipCount + 5;
        } else {
            playerGreenChipCount = playerGreenChipCount - 4;
            playerBlackChipCount = playerBlackChipCount + 1;
        }

    }
    else if (fromChipColor === `red`) {
        if (toChipColor === `black` || (toChipColor === `green` && playerRedChipCount < 5) || playerRedChipCount < 1) {
            console.log(errMessage);
            return errMessage;
        }
        if (toChipColor == `gray`) {
            playerRedChipCount = playerRedChipCount - 1;
            playerGrayChipCount = playerGrayChipCount + 5;
        } else {
            playerRedChipCount = playerRedChipCount - 5;
            playerGreenChipCount = playerGreenChipCount + 1;
        }
    }
    else if (fromChipColor === `gray`) {
        if (toChipColor !== `red` || playerGrayChipCount < 5) {
            console.log(errMessage);
            return errMessage;
        }
        playerGrayChipCount = playerGrayChipCount - 5;
        playerRedChipCount = playerRedChipCount + 1;
    } else {
        console.log(errMessage);
        return errMessage;
    }
    table.addMessage(`${player.name} exchanged chips ${fromChipColor} to ${toChipColor}`);
    this.setPlayerChips(table, player, playerBlackChipCount, playerGreenChipCount, playerRedChipCount, playerGrayChipCount);
    return undefined;/// no error no message caller assumes success
}