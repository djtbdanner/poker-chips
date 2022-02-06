// The primary socket processing on server side
const io = require('../server').io
const Table = require('./classes/Table');
const Player = require('./classes/Player');
const PlayProcessor = require('./process-play');
const PlayStatus = require('./classes/PlayStatus');
const Chip = require('./classes/Chip');
// maybe a  database :)
let tables = new Map();
let joinerIndex = 1;//--TODO-- delete this
io.sockets.on('connect', (socket) => {
    console.log("initial connection ");
    socket.on('join-poker-game', (data) => {
        try {
            const table = testTable();
            socket.emit(`set-table-id`, { tableId: table.id });
            socket.emit(`set-player-id`, { playerId: table.players[joinerIndex].id });
            table.players[joinerIndex].socketId = socket.id;
            joinerIndex = joinerIndex + 1;
            socket.join(table.id);
            socket.broadcast.to(table.id).emit(`poker-table-change`, JSON.stringify(table));
            socket.emit(`join-poker-game`, JSON.stringify(table));


            // const tableId = data.tableId;
            // const playerName = data.playerName;
            // const player = new Player(playerName);
            // const table = tables.get(tableId);
            // if (!table) {
            //     throw new Error(`Could not find room or table: ${tableId}.`);
            // }
            // if (table.players.length === table.playerCount) {
            //     throw new Error(`Table ${table.name} is full - no more players allowed.`);
            // }
            // table.addPlayer(player);
            // if (table.players.length < table.playerCount){
            //     const count = table.playerCount - table.players.length;
            //     const morePlayers = `waiting for ${count} more player${count===1?"":"s"}.`
            //     table.addMessage(`${player.name} joined table ${table.name} ${morePlayers}`);
            // } else{
            //     table.addMessage(`${player.name} joined table ${table.name}, filling table.`);
            //     table.players[0].dealer = true;
            //     table.players[1].turn = true;
            //     table.addMessage(`${table.players[0].name} is Dealer. ${table.players[1].name} is first bet.`);
            // }
            // socket.emit('set-player-id', { playerId: player.id });
            // socket.emit('set-table-id', { tableId: table.id });
            // socket.emit('join-poker-game', JSON.stringify(table));
            // socket.join(tableId);
            // socket.broadcast.to(tableId).emit(`poker-table-change`,  JSON.stringify(table));
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on('start-poker-game', (data) => {
        try {
            const table = testTable();
            socket.emit(`set-table-id`, { tableId: table.id });
            socket.emit(`set-player-id`, { playerId: table.players[0].id });
            table.players[0].socketId = socket.id;
            socket.join(table.id);
            tables.set(table.id, table);
            socket.emit(`start-poker-game`, JSON.stringify(table));



            // const tableName = data.tableName;
            // const playerName = data.playerName;
            // const playerCount = data.playerCount;
            // const startChipCount = data.startChipCount;
            // const player = new Player(playerName);
            // const table = new Table(tableName, parseInt(playerCount,10), parseInt(startChipCount, 10));
            // socket.emit(`set-table-id`, { tableId: table.id});
            // socket.emit(`set-player-id`, { playerId: player.id });
            // table.addPlayer(player);
            // table.addMessage(`${player.name} started ${table.name}, ${table.playerCount} players, each with ${table.startChipCount} chips.`);
            // tables.set(table.id, table);

            // socket.emit(`start-poker-game`, JSON.stringify(table));
            // socket.join(table.id);
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on(`get-tables`, () => {
        try {
            // - remove this
            const table = testTable();
            tables.set(table.id, table);
            //
            const arr = Array.from(tables.values());
            const availableTables = arr;//arr.filter((table)=> !table.playersFull());
            socket.emit(`get-tables`, JSON.stringify(availableTables));
        } catch (error) {
            handleError(socket, error, `NA`);
        }
    });

    const pokerActions = ["CALL", "CHECK", "FOLD", "RAISE"];
    socket.on(`poker-action`, (data) => {
        try {
            const tableId = data.tableId;
            const playerId = data.playerId;
            const action = data.action;
            const chips = JSON.parse(data.chips);

            console.log(`poker-action: ${JSON.stringify(data)}`);
            if (!pokerActions.includes(action)) {
                throw Error(`Invalid Action:${action}, from player - valid actions${pokerActions}.`)
            }

            const table = tables.get(tableId);
            const player = table.players.find(player => player.id === playerId);
            let totalChips = 0;
            if (action === "RAISE") {
                totalChips = PlayProcessor.calculateChips(chips, player, table);
                const raisedByAmount = totalChips - table.playStatus.callAmount;
                table.playStatus.totalRaiseThisRound = table.playStatus.totalRaiseThisRound + raisedByAmount;
                table.playStatus.playerLastRaised = player;
            } else if (action === "CALL") {
                totalChips = PlayProcessor.calculateChips(chips, player, table);
            } else if (action === "FOLD") {
                player.folded = true;
            } else if (action === "CHECK") {
            }
            table.addMessage(`${player.name} ${action} with ${totalChips} chips.`);
            table.setChipTotalsForPlayers();
            if (PlayProcessor.isBetRoundOver(player, table, socket)) {
                PlayProcessor.updatePlayersAfterBetting(player, table, totalChips);
            } else {
                PlayProcessor.setNextPlayerTurn(player, table);
                PlayProcessor.calculateCurrentCallAmount(table);
            }
            socket.broadcast.to(tableId).emit(`poker-table-change`, JSON.stringify(table));
            socket.emit(`poker-table-change`, JSON.stringify(table));
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on(`poker-win-round`, (data) => {
        try {
            console.log(`poker-win-round: ${JSON.stringify(data)}`);
            const votingPlayerId = data.playerId;
            const winningPlayerId = data.winningPlayerId;
            const tableId = data.tableId;
            const table = tables.get(tableId);
            const votingPlayer = table.players.find(player => player.id === votingPlayerId);
            votingPlayer.hasVoted = true;
            const winningPlayer = table.players.find(player => player.id === winningPlayerId);
            winningPlayer.winVoteCount = winningPlayer.winVoteCount + 1;
            table.addMessage(`${votingPlayer.name} voted ${winningPlayer.name} winner.`);
            if (winningPlayer.winVoteCount >= 2) {
                PlayProcessor.processWinner(winningPlayer, table, socket);
            } else {
                const playersNotVoted = table.players.find(player => !player.hasVoted);
                if (!playersNotVoted || playersNotVoted.length === 0) {
                    table.addMessage(`All votes for winner cast, but no 2 votes for anyone, resetting to try again.`);
                    table.players.forEach((p) => { p.winVoteCount = 0; p.hasVoted = false; });
                }
            }

            socket.broadcast.to(tableId).emit(`poker-table-change`, JSON.stringify(table));
            socket.emit(`poker-table-change`, JSON.stringify(table));
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on(`poker-get-current-table`, (data) => {
        try {
            const playerId = data.playerId;
            const tableId = data.tableId;
            const table = tables.get(tableId);
            socket.emit(`poker-get-current-table`, JSON.stringify(table));
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    // socket.on('is-room-available', (data) => {
    //     try { 
    //         const room = rooms.get(data);
    //         console.log(`checking if ${data} is available ${room === undefined}`);
    //         socket.emit('is-room-available', { isAvailable: room === undefined });
    //     } catch (error) {
    //         handleError(socket, error, data);
    //     }
    // });

    // socket.on('get-text-messages', (data) => {
    //     try {
    //         const room = rooms.get(data);
    //         console.log(`getting messages`);
    //         socket.emit('get-text-messages', room.textMessages);
    //     } catch (error) {
    //         handleError(socket, error, data);
    //     }
    // });

    // socket.on('message-text', (data) => {
    //     try {
    //         const roomName = data.roomName;
    //         const message = data.message;
    //         const room = rooms.get(roomName);
    //         room.textMessages.push(message);
    //         socket.broadcast.to(roomName).emit(`new-text-message`);

    //     } catch (error) {
    //         handleError(socket, error, data);
    //     }
    // });

    // socket.on('message-room', (data) => {
    //     try {
    //         const roomName = data.roomName;
    //         const message = data.message;
    //         console.log(`sending message to room  ${roomName} message ${message}`);
    //         const room = rooms.get(roomName);
    //         if (room){
    //             room.textMessages.push(`&#9733 ${message}`);
    //         }
    //         socket.to(roomName).emit('message-room', message);
    //     } catch (error) {
    //         handleError(socket, error, data);
    //     }
    // });
});

io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
});
io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});
io.of("/").adapter.on("leave-room", (room, id) => {
    let socket;
    try {
        socket = io.sockets.sockets.get(id);
        const abandonRoom = tables.get(room);
        // if (abandonRoom && abandonRoom.owner === id) {
        //     const msg = `The scorekeeper left or lost Internet connection. If game ${room} is still on, they may reconnect and you will still catch the score.`;
        //     abandonRoom.textMessages.push(`&#9733; ${msg}`);
        //     socket.to(room).emit('message-room', msg);
        // }
        console.log(`socket ${id} has left room ${room}`);
    } catch (error) {
        handleError(socket, error, "leaving room");
    }
});
io.of("/").adapter.on("delete-room", (room) => {
    console.log(`room ${room} was deleted`);
    if (tables.get(room)) {
        tables.delete(room);
        io.sockets.emit('room-change');
    }
    tables.delete(room);
});

function handleError(socket, error, data) {
    try {
        console.log(`ERROR: ${error} - DATA: ${JSON.stringify(data)} - STACK: ${error.stack}`);
        console.error(error);
        let errorMessage = `A stupid error [${error.message}]. Not something we expected. If the server didn't go down, you may want to just start over. Sorry!`
        if (socket) {
            socket.emit('backendError', errorMessage);
        }
    } catch (e) {
        // dont' shut down if error handling error
        console.log(e);
    }
}

// test data
function testTable() {
    const chips = `"chips": [{
        "color": "black",
        "value": 100
    }, {
        "color": "green",
        "value": 25
    }, {
        "color": "green",
        "value": 25
    }, {
        "color": "red",
        "value": 5
    }, {
        "color": "red",
        "value": 5
    }, {
        "color": "red",
        "value": 5
    }, {
        "color": "red",
        "value": 5
    }, {
        "color": "gray",
        "value": 1
    }, {
        "color": "gray",
        "value": 1
    }, {
        "color": "gray",
        "value": 1
    }, {
        "color": "gray",
        "value": 1
    }, {
        "color": "gray",
        "value": 1
    }
]`;

    const testTable = JSON.parse(
        `{
            "name": "GameOfThrones",
            "id": "bf9bea20aabe911aae94c764a9569cc3",
            "playerCount": 4,
            "startChipCount": 100,
            "players": [
              {
                "name": "Dave",
                "id": "6670aa87f33fa093ba0e97a500d48b82",
                ${chips},
                "turn": false,
                "firstBettor": false,               
                "dealer": true,
                "folded": false,
                "hasVoted": false,
                "winVoteCount":0,
                "potRaisedBy":0
              },
              {
                "name": "Tom",
                "id": "ef5199ff18153c7527a1543e3f0a8e4c",
                ${chips},
                "turn": true,
                "firstBettor": true,
                "dealer": false,
                "folded": false,
                "hasVoted": false,
                "winVoteCount":0,
                "potRaisedBy":0
              },
              {
                "name": "Marty",
                "id": "ef5199ff18ji2j9427a1543e3f0a8e4c",
                ${chips},
                "turn": false,
                "dealer": false,
                "firstBettor": false,               
                "folded": false,
                "hasVoted": false,
                "winVoteCount":0,
                "potRaisedBy":0
              },
              {
                "name": "Stan",
                "id": "abcdfa12318ji2j9427a1543e3f0a8e4c",
                ${chips},
                "turn": false,
                "dealer": false,
                "firstBettor": false,               
                "folded": false,
                "hasVoted": false,
                "winVoteCount":0,
                "potRaisedBy":0
              }
            ],
            "pot": 0,
            "messages": [
              "TEST TABLE."
            ]
          }`

    );
    const table = new Table(testTable.name, testTable.playerCount, testTable.startChipCount);
    table.id = testTable.id;
    table.players = testTable.players;
    table.pot = testTable.pot;
    table.messages = testTable.messages;
    table.playStatus = new PlayStatus();
    table.setChipTotalsForPlayers();
    return table;
}

module.exports = io;