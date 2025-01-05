async function startPokerGame(tableName, playerName, playerCount, startChipCount) {
    const table = await asyncEmit(`start-poker-game`, { tableName, playerName, playerCount, startChipCount });
    console.log(`Data Back from call to startPokerGame ${JSON.stringify(table)}`);
    if (table) {
        drawScreen(table);
        console.log(JSON.stringify(table));
    }
}

async function joinPokerGame(tableId, playerName) {
    const table = await asyncEmit(`join-poker-game`, { tableId, playerName });
    if (table) {
        drawScreen(JSON.parse(table));
    }
}

function pokerChipDenominationChange(fromChipColor, toChipColor){
    const playerId = document.getElementById(`player-id`).value;
    const tableId = document.getElementById(`table-id`).value;
    const message = { action: `poker-player-chip-denomination-change`, payload:  {playerId, tableId, fromChipColor, toChipColor} };
    connectAndSendSocketRequest(message);
}

function pokerChipDenominationQuit(){
    const playerId = document.getElementById(`player-id`).value;
    const tableId = document.getElementById(`table-id`).value;
    socket.emit(`poker-player-chip-denomination-change`, );
    const message = { action: `poker-player-chip-denomination-change`, payload: {playerId, tableId, playerDone:true} };
    connectAndSendSocketRequest(message);
}

function removePlayer() {
    const playerId = document.getElementById(`player-id`).value;
    const tableId = document.getElementById(`table-id`).value;
    socket.emit(`poker-remove-player`, { playerId, tableId });
    destroyById(`table-div`);
    destroyById(`bet-input`);
    destroyById(`initial-screen`);
    destroyById(`chip-change`);
}

socketEventHandlers['poker-table-change'] = async (data) => {
    console.log('Received poker-table-change:', JSON.stringify(data));
    const table = JSON.parse(JSON.stringify(data));
    if (table) {
        drawScreen(table);
        console.log(JSON.stringify(table));
    }
};

socketEventHandlers[`set-player-id`] = async (data) => {
    document.getElementById(`player-id`).value = data.playerId;
};

socketEventHandlers[`set-table-id`] = async (data) => {
    document.getElementById(`table-id`).value = data.tableId;
};

socketEventHandlers[`poker-div-blink`] = async (data) => {
    const element = document.getElementById(data.elementId);
    if (element) {
        element.classList.add("blink");
    }
};

socketEventHandlers[`poker-table-modal-message`] = async (data) => {
    modalMessage(data);
};

function playerAction(action, chips) {
    const playerId = document.getElementById(`player-id`).value;
    const tableId = document.getElementById(`table-id`).value;
    const message = { action: 'poker-action', payload: { tableId, playerId, action, chips } };
    connectAndSendSocketRequest(message);
}

function choseRoundWinner(winningPlayerId) {
    const playerId = document.getElementById(`player-id`).value;
    const tableId = document.getElementById(`table-id`).value;
    const message = { action: 'poker-win-round', payload: {winningPlayerId, playerId, tableId} };
    connectAndSendSocketRequest(message);
}

async function getCurrentTable() {
    const playerId = document.getElementById(`player-id`).value;
    const tableId = document.getElementById(`table-id`).value;
    const table = await asyncEmit(`poker-get-current-table`, { tableId, playerId });
    if (table) {
        drawScreen(JSON.parse(table));
    }
}

async function getAvailableTables() {
    const result = await asyncEmit('get-tables');
    return JSON.parse(result);
}

socketEventHandlers[`backendError`] = async (data) => {
    alert(data);
};