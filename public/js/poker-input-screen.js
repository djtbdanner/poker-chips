async function buildEntryScreens() {
    // check backend for existing game with this player, if there reconnect 
    // otherwise just show the screen.
    clearAllNodes();
    const data = await canReconnect();
    if (data.canReconnect) {
        await reconnectToGame();
    }
    else {
        await buildInitialScreen();
    }
}

async function buildInitialScreen() {
    const tables = await getAvailableTables();
    let tableList = ``;
    if (tables) {
        tableList = buildRoomList(tables);
    }
    destroyById(`initial-screen`);
    let html = ``;
    // html += `<form><div id="initial-screen" class="modal">`;
    html += `<div style="background-color:tan;width:100%;height:100%;color:black;">`;
    html += `<form id ="initial-screen">`;
    html += `<table>`;
    html += `<tr><td colspan = "2" style = "text-align:center;">`;
    html += `<p>Set a name for your table, set number of players (2-9) and how many chips each player starts with.</p>`;
    html += `</td></tr>`;
    html += `<tr><td style="text-align:right;">`;
    html += `Table: `;
    html += `</td><td>`;
    //--TODO-- remove the values
    html += `<input type="text" maxlength="20" class="stInput" id="table-name" value = "${getBrowserName()}" placeholder="Table Name" onKeyUp="checkTableName()" autofocus />`;
    html += `</td></tr>`;
    html += `<tr><td style="text-align:right;">`;
    html += `Your Name: `;
    html += `</td><td>`;
    html += `<input type="text" maxlength="20" class="stInput" id="player-name" value = "${getBrowserName()}" placeholder="Your Name" />`;
    html += `</td></tr>`;
    html += `<tr><td style="text-align:right;">`;
    html += `# Players: `;
    html += `</td><td>`;
    html += `<input type="number" maxlength="3" class="stInput" id="player-count" value = "4" min="2" max="9" />`;
    html += `</td></tr>`;
    html += `<tr><td style="text-align:right;">`;
    html += `Initial # chips: `;
    html += `</td><td>`;
    html += `<input type="number" maxlength="4" class="stInput" id="chip-count" value = "10" min="2" max="9999" />`;
    html += `</td></tr>`;
    // html += `<tr><td colspan="2" style = "text-align:center;">`;
    // html += `<span id = "game-msg-span">&nbsp</span>`;
    // html += `</td></tr>`;
    html += `<tr><td colspan="2" style = "text-align:center;">`;
    // --TODO-- disabled to true
    // html += `<br><input type="submit" id="start-table-button" class="stInput" disabled value="Start Game" formaction="javascript:startGame();" />`;
    html += `<br><input type="submit" id="start-table-button" class="stInput" value="Start Game" formaction="javascript:startGame();" />`;
    html += `</td></tr>`;
    html += tableList;
    html += `</table>`;
    html += `</form>`;
    html += `</div>`;
    createAndAppendDiv(html, 'initial-screen', true);
}

function startGame() {
    const playerName = document.getElementById(`player-name`).value;
    const playerCount = document.getElementById(`player-count`).value;
    const chipCount = document.getElementById(`chip-count`).value;
    const tableName = document.getElementById(`table-name`).value;
    if (!playerName) {
        alert(`need player name`); // TODO - elegantly handle this
        return;
    }
    startPokerGame(tableName, playerName, playerCount, chipCount)
}

function buildRoomList(tables) {

    if (tables && tables.length > 0) {
        let html = ``;
        html += `<tr><td colspan = "2" style = "text-align:center;">`;
        html += `<p>Or, join a game. Enter name and select game.</p>`;
        html += `</td></tr>`;
        html += `<tr><td style="text-align:right;">`;
        html += `Name:`;
        html += `</td>`;
        html += `<td>`;
        //--TODO-- remove the values
        html += `<input type="text" maxlength="20" class="stInput" id="joining-player-name" value="${getBrowserName()}" placeholder="Player Name"/>`;
        html += `</td></tr>`;
        html += `<tr><td style="text-align:right;">`;
        html += `Table:`;
        html += `</td>`;
        html += `<td>`;
        html += `<select class="stInput" id="select-table" onChange="joinTable(this.value)">`;
        html += `<option>-select game-</option>`;
        tables.forEach(table => {
            html += `<option value = "${table.id}">${table.name}</option>`;
        });
        html += `</select>`;
        html += `</td></tr>`;
        return html;
    }
    return ``;
}

function joinTable(tableId) {
    const playerName = document.getElementById(`joining-player-name`).value;
    if (!playerName || !tableId) {
        alert(`need player name/must select table`); // TODO - elegantly handle this
        const playerName = document.getElementById(`select-table`).selectedIndex = 0;
        return;
    }
    joinPokerGame(tableId, playerName);
}

async function checkTableName() {
    const tableName = document.getElementById(`table-name`).value;
    const startTableButton = document.getElementById(`start-table-button`);
    // const gameMessageSpan = document.getElementById(`game-msg-span`);
    //gameMessageSpan.innerHTML = `&nbsp;`;
    if (tableName && tableName.length > 0) {
        // const available = await isRoomAvailable(tableName);
        //  if (available) {
        startTableButton.disabled = false;
        //  } else {
        //     gameMessageSpan.innerHTML = `The name "${gameName}" in use.`
        //      startTableButton.disabled = true;
        //  }

    } else {
        startTableButton.disabled = true;
    }
}

