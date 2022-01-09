// The primary socket processing on server side
const io = require('../server').io
// const Room = require('./classes/Room');
const Table = require('./classes/Table');
const Player = require('./classes/Player');
// maybe a  database :)
let tables = new Map();

io.sockets.on('connect', (socket) => {
    console.log("initial connection ");

    socket.on('join-poker-game', (data) => {
        try {
            const tableId = data.tableId;
            const playerName = data.playerName;
            const player = new Player(playerName);
            const table = tables.get(tableId);
            if (!table) {
                throw new Error(`Could not find room or table: ${tableId}.`);
            }
            if (table.players.length === table.playerCount) {
                throw new Error(`Table ${table.name} is full - no more players allowed.`);
            }
            table.addPlayer(player);
            if (table.players.length < table.playerCount){
                const count = table.playerCount - table.players.length;
                const morePlayers = `waiting for ${count} more player${count===1?"":"s"}.`
                table.addMessage(`${player.name} joined table ${table.name} ${morePlayers}`);
            } else{
                table.addMessage(`${player.name} joined table ${table.name}, filling table.`);
                table.players[0].dealer = true;
                table.players[1].turn = true;
                table.addMessage(`${table.players[0].name} is Dealer. ${table.players[1].name} is first bet.`);
            }
            socket.emit('set-player-id', { playerId: player.id });
            socket.emit('set-table-id', { tableId: table.id });
            socket.emit('join-poker-game', JSON.stringify(table));
            socket.join(tableId);
            socket.broadcast.to(tableId).emit(`poker-table-change`,  JSON.stringify(table));
        } catch (error) {
            handleError(socket, error, data);
        } 
    });

    socket.on('start-poker-game', (data) => {
        try {
            const tableName = data.tableName;
            const playerName = data.playerName;
            const playerCount = data.playerCount;
            const startChipCount = data.startChipCount;
            const player = new Player(playerName);
            const table = new Table(tableName, parseInt(playerCount,10), parseInt(startChipCount, 10));
            socket.emit(`set-table-id`, { tableId: table.id});
            socket.emit(`set-player-id`, { playerId: player.id });
            table.addPlayer(player);
            table.addMessage(`${player.name} started ${table.name}, ${table.playerCount} players, each with ${table.startChipCount} chips.`);
            tables.set(table.id, table);
            
            socket.emit(`start-poker-game`, JSON.stringify(table));
            socket.join(table.id);
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on(`get-tables`, () => {
        try {
            const arr = Array.from(tables.values());
            const availableTables = arr.filter((table)=> !table.playersFull());
            socket.emit(`get-tables`, JSON.stringify(availableTables));
        } catch (error) {
            handleError(socket, error, `NA`);
        }
    });

    socket.on(`poker-action`, (data) => {
        try {
            const tableId = data.tableId;
            const playerId = data.playerId;
            const action = data.action;
            const chips = data.chips;

            const table = tables.get(tableId);
            const player = table.players.find(player => player.id === playerId);
            const playerIndex = table.players.findIndex(player => player.id === playerId);

            table.addMessage(`${player.name} ${action} with ${chips} chips.`);
            player.turn = false;
            let nextPlayer = playerIndex+1;
            if (nextPlayer >= table.players.length){
                nextPlayer = 0;
            }
            table.players[nextPlayer].turn = true;
            socket.broadcast.to(tableId).emit(`poker-table-change`,  JSON.stringify(table));
            socket.emit(`poker-table-change`,  JSON.stringify(table));
        } catch (error) {
            handleError(socket, error, `NA`);
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

module.exports = io;