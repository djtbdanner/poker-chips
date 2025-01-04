// async function startPokerGame(tableName, playerName, playerCount, startChipCount) {
//     const table = await asyncEmit(`start-poker-game`, { tableName, playerName, playerCount, startChipCount });
//     console.log(JSON.stringify(table));
//     if (table) {
//         drawScreen(JSON.parse(table));
//         console.log(JSON.stringify(table));
//     }
// }

// async function joinPokerGame(tableId, playerName) {
//         const table = await asyncEmit(`join-poker-game`, { tableId, playerName });
//         if (table) {
//             drawScreen(JSON.parse(table));
//         }
// }


// function pokerChipDenominationChange(fromChipColor, toChipColor){
//     const playerId = document.getElementById(`player-id`).value;
//     const tableId = document.getElementById(`table-id`).value;
//     socket.emit(`poker-player-chip-denomination-change`, {playerId, tableId, fromChipColor, toChipColor});
// }

// function pokerChipDenominationQuit(){
//     const playerId = document.getElementById(`player-id`).value;
//     const tableId = document.getElementById(`table-id`).value;
//     socket.emit(`poker-player-chip-denomination-change`, {playerId, tableId, playerDone:true});
// }

// function removePlayer(){
//     const playerId = document.getElementById(`player-id`).value;
//     const tableId = document.getElementById(`table-id`).value;
//     socket.emit(`poker-remove-player`, {playerId, tableId});
//     destroyById(`table-div`);
//     destroyById(`bet-input`);
//     destroyById(`initial-screen`);
//     destroyById(`chip-change`);
// }

// socket.on(`poker-table-change`, (data) => {
//     const table = JSON.parse(data);
//     if (table) {
//         drawScreen(table);
//         console.log(JSON.stringify(table));
//     }
// });

// socket.on(`set-player-id`, (data) => {
//     document.getElementById(`player-id`).value = data.playerId;
// });

// socket.on(`set-table-id`, (data) => {
//     document.getElementById(`table-id`).value = data.tableId;
// });

// socket.on(`poker-div-blink`, (data) => {
//     const element = document.getElementById(data.elementId);
//     if (element){
//         element.classList.add("blink");
//     }
// });

// socket.on(`poker-table-modal-message`, (data) => {
//     modalMessage(data);
// });

// function playerAction(action, chips) {
//     const playerId = document.getElementById(`player-id`).value;
//     const tableId = document.getElementById(`table-id`).value;
//     socket.emit(`poker-action`, { tableId, playerId, action, chips });
// }

// function choseRoundWinner(winningPlayerId) {
//     const playerId = document.getElementById(`player-id`).value;
//     const tableId = document.getElementById(`table-id`).value;
//     socket.emit(`poker-win-round`, {winningPlayerId, playerId, tableId});
// }

// async function getCurrentTable() {
//     const playerId = document.getElementById(`player-id`).value;
//     const tableId = document.getElementById(`table-id`).value;
//     const table = await asyncEmit(`poker-get-current-table`, { tableId, playerId });
//     if (table) {
//         drawScreen(JSON.parse(table));
//     }
// }

async function getAvailableTables() {
    connectAndSendSocketRequest('{hello:"world"}');
    // const result = await asyncEmit('get-tables');
    // return JSON.parse(result);
}

// socket.on(`backendError`, (data) => {
//     alert(data);
// });

// function asyncEmit(eventName, data) {
//     return new Promise(function (resolve, reject) {
//         socket.emit(eventName, data);
//         socket.on(eventName, result => {
//             socket.off(eventName);
//             resolve(result);
//         });
//         setTimeout(reject, 10000);
//     });
// }

// function disconnect() {
//     socket.disconnect();
// }

// function reconnect() {
//     socket.connect();
// }