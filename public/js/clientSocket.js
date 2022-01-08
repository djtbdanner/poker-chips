let socket = io.connect(window.location.href);
const tableNameField = document.getElementById('selected-table-name');
async function startPokerGame(tableName, playerName, playerCount, startChipCount) {
    const table = await asyncEmit(`start-poker-game`, { tableName, playerName, playerCount, startChipCount });
    console.log(JSON.stringify(table));
    if (table) {
        drawScreen(JSON.parse(table));
        console.log(JSON.stringify(table));
    }
  //  tableNameField.value= tableName;
}

async function joinPokerGame(tableName, playerName) {

        const table = await asyncEmit(`join-poker-game`, { tableName, playerName });
        console.log(JSON.stringify(table));
        if (table) {
            drawScreen(JSON.parse(table));
            console.log(JSON.stringify(table));
        }

 //   tableNameField.value= tableName;
}

socket.on(`poker-table-change`, (data) => {
    const table = JSON.parse(data);
    if (table) {
        drawScreen(table);
        console.log(JSON.stringify(table));
    }
});


socket.on(`set-player-id`, (data) => {
    // player id will be necessary to determine who is this player
    document.getElementById(`player-id`).value = data.playerId;
});



// socket.on('score-change', (data) => {
//     const scoreData = JSON.parse(data.scores);
//     drawScreen(JSON.parse(scoreData), false, data.roomName );
// });

// function scoreChange(room, scores, isOwner) {
//     socket.emit(`score-change`, { room, scores: JSON.stringify(scores), isOwner:isOwner });
// }

// socket.on('room-change', () => {
//     processRoomAdded();
// });

// socket.on('message-room', (message) => {
//     modalMessage(message);
// });

// function sendRoomMessage(roomName, message) {
//     socket.emit(`message-room`, { roomName, message });
// }

async function getAvailableRooms() {
    const result = await asyncEmit('get-rooms');
    return JSON.parse(result);
}

socket.on(`backendError`, (data) => {
    alert(data);
});

// async function joinRoom(roomName) {
//     const result = await asyncEmit(`join-room`, roomName);
//     const scores = JSON.parse(result);
//     drawScreen(scores, false, roomName);
// }

async function isRoomAvailable(room) {
    const result = await asyncEmit('is-room-available', room);
    const isAvailable = result.isAvailable;
    return isAvailable;
}

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