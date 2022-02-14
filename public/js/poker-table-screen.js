let firstScreen = true;
function drawScreen(table) {
    const id = `table-div`;
    destroyById(`bet-input`);
    destroyById(`initial-screen`);
    destroyById(`chip-change`);
    destroyById(id);
    let html = ``;
    html += `    <div class="pokerTableDiv"></div>`;
    const myTurnPlayer = table.players.find(player => player.turn);
    const thisPlayerId = document.getElementById(`player-id`).value;
    const thisPlayer = table.players.find(player => player.id === thisPlayerId);
    const playStatus = table.playStatus;
    let disabledFold = `disabled`;
    let disabledCheck = `disabled`;
    let disabledCall = `disabled`;
    let disabledRaise = `disabled`;
    // these are global
    playerBlackChipCount = thisPlayer.chips.filter(c => c.color === `black`).length;
    playerGreenChipCount = thisPlayer.chips.filter(c => c.color === `green`).length;
    playerRedChipCount = thisPlayer.chips.filter(c => c.color === `red`).length;
    playerGrayChipCount = thisPlayer.chips.filter(c => c.color === `gray`).length;
    totalChips = thisPlayer.chipTotal;
    // these are global
    let callAmount = ``;

    if (myTurnPlayer && (myTurnPlayer.id === thisPlayerId) && !playStatus.selectWinner) {
        disabledFold = ``;
        if (thisPlayer.chipTotal > playStatus.callAmount ){
            disabledRaise = ``;
        }
        // if (playStatus && playStatus.callAmount && playStatus.callAmount > 0) {
        if (playStatus.callAmount  > 0) {
            disabledCall = ``;
            callAmount = playStatus.callAmount<=thisPlayer.chipTotal?playStatus.callAmount:thisPlayer.chipTotal;
        } else {
            disabledCheck = ``;
        }
    }
    if (table.players.length > 0) {
        for (let i = 0; i < table.players.length; i++) {
            const player = table.players[i];
            let divClass = `playerDiv`;
            if (player.dealer) {
                divClass = `playerDivDealer`;
            }
            if (player.turn) {
                divClass = `playerDivTurn`;
            }
            if (player.folded) {
                divClass = `playerFoldedDiv`;
            }
            if (player.allIn) {
                divClass = `playerAllinDiv`;
            }
            html += `<div id="${player.id}" class="${divClass} ${getPlayerLocationStyle(table, i)}">${player.name}<br>${player.chipTotal}${player.dealer ? "<br>&#9886;&DD;&#9887;" : ""}<br>`;
            if (playStatus.selectWinner && !thisPlayer.hasVoted && !player.folded) {
                html += `<input type = "button" class="voteButton" value="${player.name} wins" onClick = "choseRoundWinner('${player.id}')" ></div>`;
            } else {
                html += `</div>`;
            }
        }
    }

    html += `    <div class="playerDiv playerPot">pot<br>${playStatus.pot}</div>`;
    html += `    <div class="footer">`;
    html += `        <table>`;
    html += `            <tr>`;
    html += `                <td colspan="5" width="100%">`;
    html += `                    <textarea id="history-text" rows = "4"  readonly>`;
    table.messages.forEach((message) => {
        html += `&#8226; ${message}\r\n`;
    });
    html += `                      </textarea>`;
    html += `                </td>`;
    html += `            </tr>`;
    html += `        </table>`;
    html += `        <table>`;
    html += `            <tr>`;
    html += `                <td class="even5td">`;
    html += `                    Total Chips`;
    html += `                    <br>`;
    html += `                    <div id="total-chip-count">${thisPlayer.chipTotal}</div>`;
    html += `                </td>`;
    html += `                <td class="even5td">`;
    html += `                    <img src="images/chip-black.png"></img>`;
    html += `                    <div id="black-chip-count">${playerBlackChipCount}</div>`;
    html += `                </td>`;
    html += `                    <td class="even5td">`;
    html += `                    <img src="images/chip-green.png"></img>`;
    html += `                    <div id="green-chip-count">${playerGreenChipCount}</div>`;
    html += `                </td>`;
    html += `                <td class="even5td">`;
    html += `                    <img src="images/chip-red.png"></img>`;
    html += `                    <div id="red-chip-count">${playerRedChipCount}</div>`;
    html += `                </td>`;
    html += `                 <td class="even5td">`;
    html += `                    <img src="images/chip-gray.png"></img>`;
    html += `                    <div id="gray-chip-count">${playerGrayChipCount}</div>`;
    html += `                </td>`;
    html += `            </tr>`;
    html += `        </table>`;
    html += `        <table>`;
    html += `            <tr>`;
    html += `                <td class="even5td">`;
    html += `                    <input type="button" id="options-button" value="..." onclick = "buildMenu()" \>`;
    html += `                    <br>`;
    html += `                    Options`;
    html += `                </td>`;
    html += `                <td class="even5td">`;
    html += `                    <input type="button" id="fold-button" ${disabledFold} value="&nbsp;&#10008;&nbsp;"  onClick="playerAction('FOLD', 0);" \>`;
    html += `                    <br>`;
    html += `                    Fold`;
    html += `                </td>`;
    html += `                <td class="even5td">`;
    html += `                    <input type="button" id="check-button" ${disabledCheck} value="&nbsp;&#10004;&nbsp;" onClick="playerAction('CHECK', 0);" \>`;
    html += `                    <br>`;
    html += `                    Check`;
    html += `                </td>`;
    html += `                <td class="even5td">`;
    let icon = `&phone;`;
    let text = `Call`;
    if (thisPlayer.chipTotal <= playStatus.callAmount){
        icon= `$$`
        text = `!All In!`
    }                                
    html += `                    <input type="button" id="call-button" ${disabledCall} value="&nbsp;${icon}&nbsp;"  onClick="playerAction('CALL', ${callAmount});" \>`;
    html += `                    <br>`;
    html += `                    ${text} ${callAmount}`;
    html += `                </td>`;
    html += `                <td class="even5td">`;
    html += `                    <input type="button" id="raise-button" ${disabledRaise} value="&nbsp;&#10010;&nbsp;"  onClick="drawBetScreen();" \>`;
    html += `                    <br>`;
    html += `                    Raise`;
    html += `                </td>`;
    html += `            </tr>`;
    html += `        </table>`;
    html += `    </div>`;
    createAndAppendDiv(html, id, true);
    scrollText();
    if (thisPlayer.showChipExchangeDiv){
        buildChangeChipsHtml();
    }
}
function scrollText() {
    var textarea = document.getElementById('history-text');
    textarea.scrollTop = textarea.scrollHeight;
}

function getPlayerLocationStyle(table, i) {
    const count = table.players.length;
    const indexOfThisPlayer = table.players.findIndex((player) => player.id === document.getElementById(`player-id`).value);
    i = i - indexOfThisPlayer;
    console.log(`is gr:` + i);
    if (i < 0) {
        i = (i + count);
    }
    let loc;
    if (count <= 2) {
        if (i === 0) {
            loc = `playerCurrent`;
        }
        if (i === 1) {
            loc = `playerTopCenter`;
        }
        return loc;
    }
    if (count === 3) {
        if (i === 0) {
            loc = `playerCurrent`;
        }
        if (i === 1) {
            loc = `playerTopCenter`;
        }
        if (i === 2) {
            loc = `playerRightCenter`;
        }
        return loc;
    }
    if (count === 4) {
        if (i === 0) {
            loc = `playerCurrent`;
        }
        if (i === 1) {
            loc = `playerLeftCenter`;
        }
        if (i === 2) {
            loc = `playerTopCenter`;
        }
        if (i === 3) {
            loc = `playerRightCenter`;
        }
        return loc;
    }
    if (count === 5) {
        if (i === 0) {
            loc = `playerCurrent`;
        }
        if (i === 1) {
            loc = `playerLeftCenter`;
        }
        if (i === 2) {
            loc = `playerTopLeft`;
        }
        if (i === 3) {
            loc = `playerTopRight`;
        }
        if (i === 4) {
            loc = `playerRightCenter`;
        }
        return loc;
    }
    if (count === 6) {
        if (i === 0) {
            loc = `playerCurrent`;
        }
        if (i === 1) {
            loc = `playerLeftCenter`;
        }
        if (i === 2) {
            loc = `playerTopLeft`;
        }
        if (i === 3) {
            loc = `playerTopRight`;
        }
        if (i === 4) {
            loc = `playerRightTop`;
        }
        if (i === 5) {
            loc = `playerRightBottom`;
        }
        return loc;
    }
    if (count === 7) {
        if (i === 0) {
            loc = `playerCurrent`;
        }
        if (i === 1) {
            loc = `playerLeftBottom`;
        }
        if (i === 2) {
            loc = `playerLeftTop`;
        }
        if (i === 3) {
            loc = `playerTopLeft`;
        }
        if (i === 4) {
            loc = `playerTopRight`;
        }
        if (i === 5) {
            loc = `playerRightTop`;
        }
        if (i === 6) {
            loc = `playerRightBottom`;
        }
        return loc;
    }
    if (count === 8) {
        if (i === 0) {
            loc = `playerCurrent`;
        }
        if (i === 1) {
            loc = `playerLeftBottom`;
        }
        if (i === 2) {
            loc = `playerLeftTop`;
        }
        if (i === 3) {
            loc = `playerTopLeft`;
        }
        if (i === 4) {
            loc = `playerTopRight`;
        }
        if (i === 5) {
            loc = `playerRightTop`;
        }
        if (i === 6) {
            loc = `playerRightCenter`;
        }
        if (i === 7) {
            loc = `playerRightBottom`;
        }
        return loc;
    }
    if (count === 9) {
        if (i === 0) {
            loc = `playerCurrent`;
        }
        if (i === 1) {
            loc = `playerLeftBottom`;
        }
        if (i === 2) {
            loc = `playerLeftCenter`;
        }
        if (i === 3) {
            loc = `playerLeftTop`;
        }
        if (i === 4) {
            loc = `playerTopLeft`;
        }
        if (i === 5) {
            loc = `playerTopRight`;
        }
        if (i === 6) {
            loc = `playerRightTop`;
        }
        if (i === 7) {
            loc = `playerRightCenter`;
        }
        if (i === 8) {
            loc = `playerRightBottom`;
        }
        return loc;
    }
}