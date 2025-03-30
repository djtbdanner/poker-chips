async function startPokerGame(fields) {
    localStorage.clear();/// just be sure nothing is left over
    const table = await asyncEmit(`start-poker-game`, fields);
    // console.log(`Data Back from call to startPokerGame ${JSON.stringify(table)}`);
    if (table) {
        drawScreen(table);
    }
}

async function joinPokerGame(tableId, playerName) {
    localStorage.clear();/// just be sure nothing is left over
    const table = await asyncEmit(`join-poker-game`, { tableId, playerName });
    if (table) {
        drawScreen(JSON.parse(table));
    }
}

function pokerChipDenominationChange(fromChipColor, toChipColor){
    const playerId = localStorage.getItem(`player-id`);
    const tableId = localStorage.getItem(`table-id`);
    const message = { action: `poker-player-chip-denomination-change`, payload:  {playerId, tableId, fromChipColor, toChipColor} };
    connectAndSendSocketRequest(message);
}

function pokerChipDenominationQuit(){
    const playerId = localStorage.getItem(`player-id`);
    const tableId = localStorage.getItem(`table-id`);
    const message = { action: `poker-player-chip-denomination-change`, payload: {playerId, tableId, playerDone:true} };
    connectAndSendSocketRequest(message);
}

socketEventHandlers['poker-remove-player'] = async (data) => {
    console.log('poker-remove-player:', JSON.stringify(data));
    alert('Good Luck...');
    buildEntryScreens();
};

// message that open tables may have changed
socketEventHandlers['poker-open-tables'] = async (data) => {
    console.log('poker-open-tables', JSON.stringify(data));
    buildEntryScreens();
};


function removePlayer() {
    const confirmed = confirm("Are you sure you want to quit?");
    if (confirmed){
        const playerId = localStorage.getItem(`player-id`);
        const tableId = localStorage.getItem(`table-id`);
        const message = { action: `poker-remove-player`, payload: { playerId, tableId }};
        connectAndSendSocketRequest(message);// backend will call poker-remove-player handler and do the rest
    }
}

socketEventHandlers['poker-table-change'] = async (data) => {
    // console.log('Received poker-table-change:', JSON.stringify(data));
    const table = JSON.parse(JSON.stringify(data));
    if (table) {
        drawScreen(table);
    }
};

socketEventHandlers[`set-player-id`] = async (data) => {
    localStorage.setItem(`player-id`, data.playerId);
};

socketEventHandlers[`set-table-id`] = async (data) => {
    localStorage.setItem(`table-id`, data.tableId);
};

socketEventHandlers[`poker-div-blink`] = async (data) => {
    const element = document.getElementById(data.elementId);
    if (element) {
        element.classList.add("blink");
    }
};

socketEventHandlers[`poker-animate-chips-bet`] = async (data) => {
    const playerId = data.playerId;
    let chips = data.chips;
    let potChips = data.potChips;
    chips = JSON.parse(chips);
    potChips = JSON.parse(potChips);
    potTotal = data.potTotal;
    skipPotAnimation = data.skipPotAnimation;
    animatePlayerToPot(playerId, chips, potChips, potTotal, skipPotAnimation);
};

socketEventHandlers[`poker-table-modal-message`] = async (data) => {
    modalMessage(data);
};

function playerAction(action, chips) {
    const playerId = localStorage.getItem(`player-id`);
    const tableId = localStorage.getItem(`table-id`);
    const message = { action: 'poker-action', payload: { tableId, playerId, action, chips } };
    connectAndSendSocketRequest(message);
}

function choseRoundWinner(winningPlayerIds) {
    const playerId = localStorage.getItem(`player-id`);
    const tableId = localStorage.getItem(`table-id`);
    const message = { action: 'poker-win-round', payload: {winningPlayerIds, playerId, tableId} };
    connectAndSendSocketRequest(message);
}

async function getCurrentTable() {
    const playerId = localStorage.getItem(`player-id`);
    const tableId = localStorage.getItem(`table-id`);
    const table = await asyncEmit(`poker-get-current-table`, { tableId, playerId });
    if (table) {
        drawScreen(table);
    }
}

async function canReconnect() {
    const playerId = localStorage.getItem(`player-id`);
    const tableId = localStorage.getItem(`table-id`);
    const result = await asyncEmit(`poker-can-reconnect`, { tableId, playerId });
    return JSON.parse(result);
}

async function reconnectToGame() {
    const playerId = localStorage.getItem(`player-id`);
    const tableId = localStorage.getItem(`table-id`);
    const table = await asyncEmit(`poker-reconnect-to-game`, { tableId, playerId });
    if (table) {
        drawScreen(table);
    }
}

async function getAvailableTables() {
    const result = await asyncEmit('get-tables');
    return JSON.parse(result);
}

socketEventHandlers[`backendError`] = async (data) => {
    alert(data);
};