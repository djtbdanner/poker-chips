const Chip = require('./classes/Chip');

exports.getNextActivePlayer = (currentPlayer, table) => {

    const activePlayers = table.players.filter((p) => {
        return !p.folded && p.getChipTotal() > 0 && p.isConnected;
    });
    if (activePlayers.length < 1) {
        console.log("Less than 1 active players - returning the current player in getNextActive player");
        return currentPlayer;
    }

    const playerIndex = table.players.findIndex(player => player.id === currentPlayer.id);
    currentPlayer.turn = false;
    let nextPlayer = playerIndex + 1;
    if (nextPlayer >= table.players.length) {
        nextPlayer = 0;
    }
    const player = table.players[nextPlayer];
    if (player.folded || !player.isConnected || player.chipTotal <= 0) {
        return this.getNextActivePlayer(player, table)
    } else {
        return player;
    }
}

exports.processSidePots = (table, player) => {
    const playersAllIn = table.players.filter(player => player.allIn);
    if (playersAllIn.length < 1) {
        return;
    }
    playersAllIn.forEach(allInPlayer => {
        const allInBet = allInPlayer.totalRoundBet;
        let sidePotTotal = allInBet;
        table.players.forEach(otherPlayer => {
            if (otherPlayer.id !== allInPlayer.id) {
                const otherPlayerBet = otherPlayer.totalRoundBet;
                if (otherPlayerBet > 0) {
                    sidePotTotal += Math.min(otherPlayerBet, allInBet);
                }
            }
        });
        allInPlayer.sidePotTotal = sidePotTotal;
        // table.addMessage(`${allInPlayer.name} is all in for ${allInBet} and can win ${sidePotTotal}!`);
        console.log(`${allInPlayer.name} is all in and the side pot amount is ${allInPlayer.sidePotTotal}`);
    });
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

exports.isBetRoundOver = (currentPlayer, table) => {

    const playersNotFolded = table.players.filter(player => !player.folded);
    if (playersNotFolded.length < 2) {
        const winningPlayer = playersNotFolded[0];
        table.addMessage(`${winningPlayer.name} buys the pot and wins with ${table.playStatus.pot} chips!`);
        winningPlayer.chips.push(...table.playStatus.chips);
        resetTable(table);
        return true;
    }

    player = this.getNextActivePlayer(currentPlayer, table);

    const isPot = table.playStatus.pot > 0;
    if (!table.playStatus.playerLastRaised) {
        // if no one has raised
        if (player.firstBettor) {
            if (isPot) {
                table.addMessage(`Bet round complete. A couple of you vote the winner(s).`);
                table.playStatus.selectWinner = true; // no need to select winner if no pot
            } else {
                table.addMessage(`Since there is no pot, there is no need to select a winner.`);
                resetTable(table);
            }
            return true;
        }
    } else {
        // either we have the player id of the last raise or we do not have a next active player becasue they are out of money 
        if (player.id === table.playStatus.playerLastRaised.id  || currentPlayer.id === player.id) {
            table.playStatus.selectWinner = true;
            table.playStatus.playerLastRaised = undefined;
            table.addMessage(`Bet round complete. A couple of you vote the winner(s).`);
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
    table.players.forEach((p) => { p.reset(); });
    const nextPlayer = this.getNextActivePlayer(nextDealer, table);
    nextPlayer.turn = true;
    nextPlayer.firstBettor = true;

    // if only one player has any money we be done.
    const playersWithMoney = table.players.filter((p) => {
        return p.getChipTotal() > 0;
    });

    if (playersWithMoney.length === 1){
        const theWinner = playersWithMoney[0];
        theWinner.isChampion = true;
        table.playStatus.gameOver = true;
        table.addMessage(`THE WINNER: ${theWinner.name}`);
        table.addMessage(`========== GAME OVER =============`);

    } else {
        table.addMessage(`Betting round complete. ${nextDealer.name} is now dealer with ${nextPlayer.name} first bet.`);
    }
}

const resetPotChips = (table, theChips) => {
    table.playStatus.pot = 0;
    table.playStatus.chips = [];
    let blackCount = theChips['black'];
    let greenCount = theChips['green'];
    let redCount = theChips['red'];
    let grayCount = theChips['gray'];
    this.setPotChips(table, blackCount, greenCount, redCount, grayCount);
}

exports.processWinner = (winningPlayers, table) => {
    if (winningPlayers.length > 1) {
        const sidePotWinningPlayers = winningPlayers.filter((p) => p.sidePotTotal > 0);
        if (sidePotWinningPlayers.length > 0) {
            // wow multiple winners and one of them has side pot and has we have a split pot/side pot situation 😒. 
            // we will get the least side pot player split pot for that and the other players, reset the pot and reprocess any remaining winners.
            const playerWithLeastSidePot = sidePotWinningPlayers.reduce((minPlayer, currentPlayer) => {
                return (currentPlayer.sidePotTotal < minPlayer.sidePotTotal) ? currentPlayer : minPlayer;
            }, sidePotWinningPlayers[0]);
            // get any leftover pot
            const leftOverPot = table.playStatus.pot - playerWithLeastSidePot.sidePotTotal;
            const leftOverPotChips = this.parseChips(leftOverPot);
            // split the sidePot
            const winningPlayerChips = this.parseChips(playerWithLeastSidePot.sidePotTotal);
            resetPotChips(table, winningPlayerChips)
            splitPotBetweenPlayers(table, winningPlayers);
            // pot is now any leftover pot - so all we gotta do is reprocess the whole thing
            resetPotChips(table, leftOverPotChips);
            // reset any other split pot players with a value for them
            resetAnyOtherSidePotPlayerAmounts(table, playerWithLeastSidePot);
            // Remove the player with the least split pot total from winningPlayers
            let remainingWinningPlayers = winningPlayers.filter(player => player.id !== playerWithLeastSidePot.id);
            // any remaining players with a split pot total that has zeroed out need to be removed as well as they cannot win any more
            remainingWinningPlayers = remainingWinningPlayers.filter((p) => !p.folded);
            this.processWinner(remainingWinningPlayers, table);
        } else {
            // no all ins pot, just split the pot giving any remainders to whoever is the first one in the list
            splitPotBetweenPlayers(table, winningPlayers);
            resetTable(table);
        }
        return;
    }

    const winningPlayer = winningPlayers[0];
    // winner has side pot so we need to process that players portion of the pot.
    if (winningPlayer.sidePotTotal > 0 && winningPlayer.sidePotTotal < table.playStatus.pot) {
        const newPotTotal = table.playStatus.pot - winningPlayer.sidePotTotal;
        const potChips = this.parseChips(newPotTotal);
        const winningPlayerChips = this.parseChips(winningPlayer.sidePotTotal);
        console.log(`Side pot processing for ${winningPlayer.name}, wins ${winningPlayer.sidePotTotal}, leftover pot ${newPotTotal} total pot ${table.playStatus.pot}`);
        resetPotChips(table, winningPlayerChips)
        table.addMessage(`${winningPlayer.name} WINS split pot of ${winningPlayer.sidePotTotal}, leaving ${newPotTotal} chips!!`);
        winningPlayer.chips.push(...table.playStatus.chips);

        // reset any other split pot players with a value for them
        resetAnyOtherSidePotPlayerAmounts(table, winningPlayer);

        // set the player as folded to remove them from the potential winners
        winningPlayer.getChipTotal();
        winningPlayer.allIn = false;
        resetPotChips(table, potChips);
        winningPlayer.folded = true;// todo something other that folded?
        winningPlayer.sidePotTotal = 0;

        // check if there are other players that could win the rest of the pot, if only one player not folded or out, that playet gets the rest of the pot.
        table.players.forEach((p) => { p.winVoteCount = 0; p.hasVoted = false; p.potRaisedBy = 0; });
        const playersThatCanWin = table.players.filter((p) => !p.folded);
        if (playersThatCanWin.length === 1) {
            const thisWinner = playersThatCanWin[0];
            table.addMessage(`${thisWinner.name} gets the leftover pot with no challengers.`);
            winningPlayer.chips.push(...table.playStatus.chips);
            resetTable(table);
        } else {
            table.playStatus.selectWinner = true;
            // todo if there is only one player left they win any of the rest and we done.
            table.addMessage(`${winningPlayer.name} won their side pot, we need to choose a winner for the rest; ${table.playStatus.pot}!`);
        }
    } else {
        // one winner... easy path
        table.addMessage(`${winningPlayer.name} wins ${table.playStatus.pot} chips!`);
        winningPlayer.chips.push(...table.playStatus.chips);
        resetTable(table);
    }
    // give the process a second to update the pages, then flash (no harm if not done)
    // setTimeout(() => {
    //     socket.broadcast.to(table.id).emit(`poker-div-blink`, { elementId: winningPlayer.id });
    //     socket.emit(`poker-div-blink`, { elementId: winningPlayer.id });
    // }, 500);
}
const resetTable = (table) => {
    table.players.forEach((p) => { p.winVoteCount = 0; p.hasVoted = false; p.potRaisedBy = 0; p.folded = false; p.allIn = false });
    table.playStatus.reset();
    table.setChipTotalsForPlayers();
    this.updatePlayersAfterBetting(table);
};

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
    player.getChipTotal();
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
                while (tempAmt > 0 && (playerRedChipCount >= 1 || playerGrayChipCount >= 1)) {
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
    // console.log(`Successfully pulled chips for bet.`);
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

exports.parseChips = (number) => {
    // Define the chip values in ascending order (starting with the smallest denomination)
    const chipValues = [
        { name: 'gray', value: 1 },
        { name: 'red', value: 5 },
        { name: 'green', value: 25 },
        { name: 'black', value: 100 }
    ];

    // Create an object to store the count of each chip type
    let chips = {
        gray: 0,
        red: 0,
        green: 0,
        black: 0
    };

    // Start by trying to use 4 or 5 of each chip denomination, starting from the smallest
    for (let i = 0; i < chipValues.length; i++) {
        let chipValue = chipValues[i].value;
        let chipName = chipValues[i].name;

        // Calculate how many chips of this denomination can fit into the remaining amount
        let maxChips = Math.floor(number / chipValue);

        // Aim for 4 or 5 chips of this denomination, but don't exceed the remaining amount
        let chipsToUse = 0;

        // If it's possible to use 5 chips, try to use that
        if (maxChips >= 5) {
            chipsToUse = 5;
        } else if (maxChips >= 4) {
            chipsToUse = 4;
        } else {
            chipsToUse = maxChips;
        }

        chips[chipName] = chipsToUse;

        number -= chipsToUse * chipValue;

        if (number <= 0) {
            break;
        }
    }

    // If the total is still not zero, we have some remaining value
    // We may need to adjust the count to match exactly the input value
    if (number > 0) {
        chips.gray += number;

        chips.gray -= 5;
        if (chips.gray > 5) {
            let extraRed = Math.floor(chips.gray / 5);
            chips.red += extraRed;
            chips.gray -= extraRed * 5;
        }
        chips.gray += 5;
        chips.red -= 5;
        if (chips.red > 5) {
            let extraGreen = Math.floor(chips.red / 5);
            chips.green += extraGreen;
            chips.red -= extraGreen * 5;
        }
        chips.red += 5;
        chips.green -= 4;
        if (chips.green > 4) {
            let extra = Math.floor(chips.green / 4);
            chips.black += extra;
            chips.green -= extra * 4;
        }
        chips.green += 4;

    }
    return chips;
};

exports.initializePlayerChips = (table, player) => {
    const totalChips = table.startChipCount;
    if (!totalChips) {
        throw new Error('need to have some chips to initialize for the player');
    }
    const chips = this.parseChips(totalChips);
    this.setPlayerChips(table, player, chips['black'], chips['green'], chips['red'], chips['gray']);
};

function splitPotBetweenPlayers(table, winningPlayers) {
    let totalPot = table.playStatus.pot;
    let numWinners = winningPlayers.length;
    const baseAmount = Math.floor(totalPot / numWinners);
    let remainder = totalPot % numWinners;

    winningPlayers.forEach((player, index) => {
        const amount = baseAmount + (index < remainder ? 1 : 0);
        table.addMessage(`${player.name} wins ${amount} chips in split win!`);
        const potChips = localParseChips(amount);
        resetPotChips(table, potChips);
        player.chips.push(...table.playStatus.chips);
    });
}

const localParseChips = (amount) => {
    return this.parseChips(amount);
}

function resetAnyOtherSidePotPlayerAmounts(table, winningPlayer) {
    const splitPotPlayers = table.players.filter((p) => p.sidePotTotal > 0);
    splitPotPlayers.forEach((p) => {
        if (p.id !== winningPlayer.id) {
            const initialsidePotTotal = p.sidePotTotal;
            p.sidePotTotal = p.sidePotTotal - winningPlayer.sidePotTotal;
            if (p.sidePotTotal < 1) {
                p.sidePotTotal = 0;
            }
            if (p.sidePotTotal === 0) {
                p.folded = true;  // TODO -- consider a different state, not technically folded but is same thing
            }
            console.log(`After processing the winner ${winningPlayer.name}, ${p.name} split pot total was ${initialsidePotTotal} now ${p.sidePotTotal}`);
        }
    });
}

