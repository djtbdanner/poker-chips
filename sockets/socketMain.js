// The primary socket processing on server side
const io = require('../server').io
const Room = require('./classes/Room');
const Table = require('./classes/Table');
const Player = require('./classes/Player');
// rooms database :)
let rooms = new Map();

io.sockets.on('connect', (socket) => {
    console.log("initial connection ");

    socket.on('join-poker-game', (data) => {
        try {
            const tableName = data.tableName;
            const playerName = data.playerName;
            const player = new Player(playerName);
            socket.emit('set-player-id', { playerId: player.id });
            const table = rooms.get(tableName);
            if (!table) {
                throw new Error(`Could not find room or table: ${tableName}.`);
            }
            if (table.players.length + 1 === table.playerCount) {
                throw new Error(`Table ${tableName} is full - no more players allowed.`);
            }

            table.addPlayer(player);
            socket.emit('join-poker-game', JSON.stringify(table));
            socket.broadcast.to(tableName).emit(`poker-table-change`,  JSON.stringify(table));
            socket.join(tableName);
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
            socket.emit('set-player-id', { playerId: player.id });
            const table = new Table(tableName, playerCount, startChipCount);
            table.addPlayer(player);
            console.log(table);
            if (rooms.get(table.name)) {
                throw new Error(`The room/table ${table.name} has already been taken.`);
                return;
            }
            rooms.set(table.name, table);
            socket.emit('start-poker-game', JSON.stringify(table));
            socket.join(tableName);
            // room = rooms.get(data);
            // if (!room) {
            //     throw new Error(`Could not find room or table: ${data}.`);
            // }
            // socket.join(data);
            // socket.emit(`join-room`, JSON.stringify(JSON.parse(room.scores)));
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on('get-rooms', () => {
        try {
            console.log(`getRooms, Rooms:${rooms}`);
            socket.emit('get-rooms', JSON.stringify(Array.from(rooms.keys())));
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on('is-room-available', (data) => {
        try {
            const room = rooms.get(data);
            console.log(`checking if ${data} is available ${room === undefined}`);
            socket.emit('is-room-available', { isAvailable: room === undefined });
        } catch (error) {
            handleError(socket, error, data);
        }
    });

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
        const abandonRoom = rooms.get(room);
        if (abandonRoom && abandonRoom.owner === id) {
            const msg = `The scorekeeper left or lost Internet connection. If game ${room} is still on, they may reconnect and you will still catch the score.`;
            abandonRoom.textMessages.push(`&#9733; ${msg}`);
            socket.to(room).emit('message-room', msg);
        }
        console.log(`socket ${id} has left room ${room}`);
    } catch (error) {
        handleError(socket, error, "leaving room");
    }
});
io.of("/").adapter.on("delete-room", (room) => {
    console.log(`room ${room} was deleted`);
    if (rooms.get(room)) {
        rooms.delete(room);
        io.sockets.emit('room-change');
    }
    rooms.delete(room);
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