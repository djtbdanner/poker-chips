let socket = io.connect(window.location.href);
async function startPokerGame(tableName, playerName, playerCount, startChipCount) {
    const table = await asyncEmit(`start-poker-game`, { tableName, playerName, playerCount, startChipCount });
    console.log(JSON.stringify(table));
    if (table) {
        drawScreen(JSON.parse(table));
        console.log(JSON.stringify(table));
    }
}

async function joinPokerGame(tableId, playerName) {
        const table = await asyncEmit(`join-poker-game`, { tableId, playerName });
        if (table) {
            drawScreen(JSON.parse(table));
        }
}

socket.on(`poker-table-change`, (data) => {
    const table = JSON.parse(data);
    if (table) {
        drawScreen(table);
        console.log(JSON.stringify(table));
    }
});

socket.on(`set-player-id`, (data) => {
    document.getElementById(`player-id`).value = data.playerId;
});

socket.on(`set-table-id`, (data) => {
    document.getElementById(`table-id`).value = data.tableId;
});

socket.on(`poker-div-blink`, (data) => {
    const element = document.getElementById(data.elementId);
    if (element){
        element.classList.add("blink");
    }
});

socket.on(`table-modal-message`, (data) => {
    modalMessage(data);
});

function playerAction(action, chips) {
    const playerId = document.getElementById(`player-id`).value;
    const tableId = document.getElementById(`table-id`).value;
    socket.emit(`poker-action`, { tableId, playerId, action, chips });
}

function choseRoundWinner(winningPlayerId) {
    const playerId = document.getElementById(`player-id`).value;
    const tableId = document.getElementById(`table-id`).value;
    socket.emit(`poker-win-round`, {winningPlayerId, playerId, tableId});
}

async function getCurrentTable() {
    const playerId = document.getElementById(`player-id`).value;
    const tableId = document.getElementById(`table-id`).value;
    const table = await asyncEmit(`poker-get-current-table`, { tableId, playerId });
    if (table) {
        drawScreen(JSON.parse(table));
    }
}

// socket.on('message-room', (message) => {
//     modalMessage(message);
// });

// function sendRoomMessage(roomName, message) {
//     socket.emit(`message-room`, { roomName, message });
// }

async function getAvailableTables() {
    const result = await asyncEmit('get-tables');
    return JSON.parse(result);
}

socket.on(`backendError`, (data) => {
    alert(data);
});


// socket.on('new-text-message', () => {
//     textMessages();
// });

// async function getMessages(room) {
//     const result = await asyncEmit('get-text-messages', room);
//     return result;
// }

// function sendTextMessage(roomName, message){
//     socket.emit(`message-text`, { roomName, message });
// }

function asyncEmit(eventName, data) {
    return new Promise(function (resolve, reject) {
        socket.emit(eventName, data);
        socket.on(eventName, result => {
            socket.off(eventName);
            resolve(result);
        });
        setTimeout(reject, 10000);
    });
}

function disconnect() {
    socket.disconnect();
}

function reconnect() {
    socket.connect();
}