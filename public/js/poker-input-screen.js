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
    let html = `

        <div class="grid-container-input">
            <div class="grid-item-input label">Your Name:</div>
            <div class="grid-item-input input"><input type="text" maxlength="20" id="player-name" value = "${getBrowserName()}" placeholder="Your Name"  autofocus  /></div>
            <div class="grid-item-input label">Table Name:</div>
            <div class="grid-item-input input"><input type="text" maxlength="20" id="table-name" value = "${getBrowserName()}" placeholder="Table Name" onKeyUp="checkTableName()" /></div>
            <div class="grid-item-input label">Number of players (max 9):</div>
            <div class="grid-item-input input"><input type="number" maxlength="3" id="player-count" value = "3" min="2" max="9" /></div>
            <div class="grid-item-input label">Number of chips (max 999):</div>
            <div class="grid-item-input input"><input type="number" maxlength="4" id="chip-count" value = "100" min="2" max="9999" /></div>
            <div class="grid-item-input label">Rounds per deal (optional):</div>
            <div class="grid-item-input input"><input type="number" maxlength="4" id="round-count" value = "3" min="1" max="5" /></div>
            <div class="grid-item-input label">Big Blind (optional):</div>
            <div class="grid-item-input input"><input type="number" maxlength="4" id="big-blind" value = "2" min="0" max="100"  step="2" /></div>
            <div class="grid-item-input label">Blinds double every x minutes(optional):</div>
            <div class="grid-item-input input"><input type="number" maxlength="4" id="blinds-double" value = "0" min="0" max="100" /></div>
            <div class="grid-item-input label">Start New Game:</div>
            <div class="grid-item-input input"><input type="submit" id="start-table-button" class="mainButton" value="Start Game" onclick="javascript:startGame();" /></div>
            <!-- Add more rows as needed -->

            ${tableList}

        </div>
        <div>
            <h3>
                Play poker at a table without chips. Each player's chips will be taken care of by your computer or phone. You can 
                bet, raise, check and fold with the buttons on the screen. You can change chip denomination whenever you want by clicking 
                on your chip pile.
                <ul>
                    <li><i>Your Name:</i> Is Your Name</li>
                    <li><i>Table Name:</i> Will be the name of table for others to join if you start a game.</li>
                    <li><i>Number of players:</i> The number of players that need to join the table to start a game.</li>
                    <li><i>Number of chips:</i> The number of chips that each player will start with.</li>
                    <li><i>Rounds per deal:</i> The number of rounds of betting per deal (e.g. Texas Holdem' would be 3).</li>
                    <li><i>Big Blind:</i> Big blind, must be an even number as small blind will be 1/2. Optional, leave at 0 for no blinds.</li>     
                    <li><i>Blinds double every x minutes:</i> Time between blinds doubling, leave at 0 for no doubling.</li>                                   
                    <li><i>Start New Game:</i> Once you have all the set up data in, click the button to start a game.</li>   
                    <li><i>... or play at an existing table:</i> When someone has started a game, this will be on screen to choose to play that game until that particular table is filled.</li>  
                </ul>
                
            </h3>
        </div>
    
    
    `;
     createAndAppendDiv(html, 'initial-screen', true);
}

function startGame() {
    const playerName = document.getElementById(`player-name`).value;
    const playerCount = document.getElementById(`player-count`).value;
    const chipCount = document.getElementById(`chip-count`).value;
    const tableName = document.getElementById(`table-name`).value;
    const roundsPerDeal = document.getElementById(`round-count`).value;
    const bigBlind = document.getElementById(`big-blind`).value;
    const blindsDouble = document.getElementById(`blinds-double`).value;
    if (!playerName) {
        alert(`need player name`);
        return;
    }
    if (!tableName) {
        alert(`need table name`); 
        return;
    }
    if (bigBlind && bigBlind > 0 && bigBlind % 2 !== 0) {
        alert(`Big Blind must be an even number`);
        return;
    }
    const fields = {playerName, playerCount, chipCount, tableName, roundsPerDeal, bigBlind, blindsDouble}

    startPokerGame(fields);
}

function buildRoomList(tables) {
    if (tables && tables.length > 0) {
        let html = ``;
        html += `<div class="grid-item-input label"></div>`;
        html += `<div class="grid-item-input input"></div>`;
        html += `<div class="grid-item-input label">... or play at an existing table:</div>`;
        html += `<div class="grid-item-input input">`;
        html += `   <select id="select-table" class='mainButton' onChange="joinTable(this.value)">`;
        html += `       <option>-select game-</option>`;
        tables.forEach(table => {
            html += `       <option value = "${table.id}">${table.name}</option>`;
        });
        html += `   </select>`;
        html += `</div>`;
        return html;
    }
    return ``;
}

function joinTable(tableId) {
    const playerName = document.getElementById(`player-name`).value;
    if (!playerName || !tableId) {
        alert(`need player name/must select table`);
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

