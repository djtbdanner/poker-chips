let firstScreen = true;
function drawScreen(table) {
    const id = `table-div`;
    destroyById(`initial-screen`);
    destroyById(id);
    let html = ``;
    html += `    <div class="pokerTableDiv"></div>`;
    const myTurnPlayer = table.players.find(player => player.turn);
    let disabled = `disabled`;
    if (myTurnPlayer && (myTurnPlayer.id === document.getElementById(`player-id`).value)){
        disabled = ``;
    }
    // html += `    <div class="playerDiv playerTopLeft">playerTopLeft</div>`;
    // html += `    <div class="playerDiv playerTopRight">playerTopRight</div>`;
    // html += `    <div class="playerDiv playerRightTop">playerRightTop</div>`;
    // html += `    <div class="playerDiv playerRightCenter">playerRightCenter</div>`;
    // html += `    <div class="playerDiv playerRightBottom">playerRightBottom</div>`;
    // html += `    <div class="playerDiv playerLeftTop">playerLeftTop</div>`;
    // html += `    <div class="playerDiv playerLeftCenter">playerLeftCenter</div>`;
    // html += `    <div class="playerDiv playerLeftBottom">playerLeftBottom</div>`;
    // html += `    <div class="playerDivTurn playerCurrent">you</div>`;
    if (table.players.length > 0) {
        for (let i = 0; i < table.players.length; i++) {
            const player = table.players[i];
            let divClass = `playerDiv`;

            if (player.dealer){
                divClass =  `playerDivDealer`;
            }
            if (player.turn){
                divClass =  `playerDivTurn`;
            }
            html += `<div class="${divClass} ${getPlayerLocationStyle(table, i)}">${player.name}</div>`;
        }
    }
    html += `    <div class="playerDiv playerPot">pot</div>`;
    html += `    <div class="footer">`;
    html += `        <table>`;
    html += `            <tr>`;
    html += `                <td colspan="5" width="100%">`;
    html += `                    <textarea id="history-text" rows = "3"  readonly>`;
    table.messages.forEach((message) =>{
        html += `&#8226; ${message}\r\n`;
    });
    html += `                      </textarea>`;
    html += `                </td>`;
    html += `            </tr>`;
    html += `        </table>`;
    html += `        <table>`;
    html += `            <tr>`;
    html += `                <td class="even5td">`;
    html += `                    <div id="total-chip-count">270</div>`;
    html += `                    <br>`;
    html += `                    Total Chips`;
    html += `                </td>`;
    html += `                <td class="even5td">`;
    html += `                    <img src="images/chip-black.png"></img>`;
    html += `                    <div id="black-chip-count">0</div>`;
    html += `                </td>`;
    html += `                    <td class="even5td">`;
    html += `                    <img src="images/chip-green.png"></img>`;
    html += `                    <div id="green-chip-count">10</div>`;
    html += `                </td>`;
    html += `                <td class="even5td">`;
    html += `                    <img src="images/chip-red.png"></img>`;
    html += `                    <div id="red-chip-count">3</div>`;
    html += `                </td>`;
    html += `                 <td class="even5td">`;
    html += `                    <img src="images/chip-gray.png"></img>`;
    html += `                    <div id="gray-chip-count">5</div>`;
    html += `                </td>`;
    html += `            </tr>`;
    html += `        </table>`;
    html += `        <table>`;
    html += `            <tr>`;
    html += `                <td class="even5td">`;
    html += `                    <input type="button" id="options-button" value="..." \>`;
    html += `                    <br>`;
    html += `                    Options`;
    html += `                </td>`;
    html += `                <td class="even5td">`;
    html += `                    <input type="button" id="fold-button" ${disabled} value="&nbsp;&#10008;&nbsp;"  onClick="playerAction('FOLD', 0);" \>`;
    html += `                    <br>`;
    html += `                    Fold`;
    html += `                </td>`;
    html += `                <td class="even5td">`;
    html += `                    <input type="button" id="check-button" ${disabled} value="&nbsp;&#10004;&nbsp;" onClick="playerAction('CHECK', 0);" \>`;
    html += `                    <br>`;
    html += `                    Check`;
    html += `                </td>`;
    html += `                <td class="even5td">`;
    html += `                    <input type="button" id="call-button" ${disabled} value="&nbsp;&phone;&nbsp;"  onClick="playerAction('CALL', 0);" \>`;
    html += `                    <br>`;
    html += `                    Call`;
    html += `                </td>`;
    html += `                <td class="even5td">`;
    html += `                    <input type="button" id="raise-button" ${disabled} value="&nbsp;&#9757;&nbsp;"  onClick="playerAction('RAISE', 0);" \>`;
    html += `                    <br>`;
    html += `                    Raise`;
    html += `                </td>`;
    html += `            </tr>`;
    html += `        </table>`;
    html += `    </div>`;
    createAndAppendDiv(html, id, true);
    scrollText();
}
function scrollText(){
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