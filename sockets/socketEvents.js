const Table = require('./classes/Table');
const Player = require('./classes/Player');
const PlayProcessor = require('./process-play');
// --TODO-- will be replaced with a database
let tables = new Map();
let connetedButNotPlaying = new Map();


const socketEventHandlers = {};

async function broadcastToTable(table, message, apigwManagementApi) {
    try {
        for (const p of table.players) {
            // console.log(`Broadcast table, player connection id ${p.connectionId}, ${p.name} =================`);
            await apigwManagementApi.postToConnection({ ConnectionId: p.connectionId, Data: JSON.stringify(message) });
        }
    } catch (error) {
        console.error(`Error in broadcastToTable: ${error}`);
    }
}

async function broadCastOpenTables(apigwManagementApi, connections) {
    try {
        const arr = Array.from(tables.values());
        const availableTables = arr.filter((table) => !table.playersFull());
        const response = { action: 'poker-open-tables', payload: JSON.stringify(availableTables) };
        for (let connectionId of connections.keys()) {
            console.log(`Sending new table to connection id ${connectionId}`);
            await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) })
        }
    } catch (error) {
        console.error(`Error in broadcastToTable: ${error}`);
    }
}

socketEventHandlers['join-poker-game'] = async (apigwManagementApi, connectionId, data, messageId) => {
    try {
        const tableId = data.tableId;
        const playerName = data.playerName;
        const player = new Player(playerName, connectionId);
        const table = tables.get(tableId);

        if (!table) {
            throw new Error(`Could not find room or table: ${tableId}.`);
        }
        if (table.players.length === table.playerCount) {
            throw new Error(`Table ${table.name} is full - no more players allowed.`);
        }

        PlayProcessor.initializePlayerChips(table, player);
        table.addPlayer(player);

        connetedButNotPlaying.delete(connectionId);
        if (table.players.length < table.playerCount) {
            const count = table.playerCount - table.players.length;
            const morePlayers = `waiting for ${count} more player${count === 1 ? "" : "s"}.`
            table.addMessage(`${player.name} joined table ${table.name} ${morePlayers}`);
        } else {
            table.addMessage(`${player.name} joined table ${table.name}, filling table.`);
            PlayProcessor.setTable(table);
            await broadCastOpenTables(apigwManagementApi, connetedButNotPlaying);
        }

        let response = { action: 'set-player-id', payload: { playerId: player.id } };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
        response = { action: 'set-table-id', payload: { tableId: table.id } };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
        response = { action: 'join-poker-game', payload: table };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
        response = { action: 'poker-table-change', payload: table };
        await broadcastToTable(table, response, apigwManagementApi);

        processAnySocketPlays(table, apigwManagementApi, 0);


    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};

socketEventHandlers['start-poker-game'] = async (apigwManagementApi, connectionId, data, messageId) => {
    try {
        const tableName = data.tableName;
        const playerName = data.playerName;
        const playerCount = data.playerCount;
        const startChipCount = data.chipCount;
        const roundsPerDeal = data.roundsPerDeal;
        const bigBlind = data.bigBlind;
        const blindsDouble = data.blindsDouble;


        const player = new Player(playerName, connectionId);
        const table = new Table(tableName, parseInt(playerCount, 10), parseInt(startChipCount, 10), parseInt(roundsPerDeal, 10), parseInt(bigBlind, 10), parseInt(blindsDouble, 10));
        let response = { action: 'set-table-id', payload: { tableId: table.id } };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
        response = { action: 'set-player-id', payload: { playerId: player.id } };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
        table.addPlayer(player);
        PlayProcessor.initializePlayerChips(table, player);
        table.addMessage(`${player.name} started ${table.name}, ${table.playerCount} players, each with ${table.startChipCount} chips. Rounds per deal: ${table.roundsPerDeal}, blinds: ${table.bigBlind} - ${table.bigBlind * 2}`);
        tables.set(table.id, table);
        connetedButNotPlaying.delete(connectionId);
        broadCastOpenTables(apigwManagementApi, connetedButNotPlaying);
        response = { action: messageId, payload: table };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};

socketEventHandlers['get-tables'] = async (apigwManagementApi, connectionId, data, messageId) => {
    try {
        console.log('Received get-tables:', JSON.stringify(data));
        if (!messageId) {
            throw new Error(`No messageId in get-tables - supposed to be a synchronous call`);
        }

        const arr = Array.from(tables.values());
        const availableTables = arr.filter((table) => !table.playersFull());
        const response = { action: messageId, payload: JSON.stringify(availableTables) };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) })
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};

const pokerActions = ["CALL", "CHECK", "FOLD", "RAISE"];
socketEventHandlers['poker-action'] = async (apigwManagementApi, connectionId, data, messageId) => {
    try {
        const action = data.action;
        if (!pokerActions.includes(action)) {
            throw Error(`Invalid Action:${action}, from player - valid actions${pokerActions}.`)
        }

        const tableId = data.tableId;
        const playerId = data.playerId;
        let chips = JSON.parse(data.chips);
        const table = tables.get(tableId);
        table.players.forEach((p)=>p.showWin=false);// if there was a winner that is no longer true

        const player = table.players.find(player => player.id === playerId);
        if (action === "RAISE") {
            totalChips = PlayProcessor.processRaiseOrCall(table, player, chips, action);
        } else if (action === "CALL") {
            chips = PlayProcessor.pullPlayerChipsToAmount(table, player, chips);
            totalChips = PlayProcessor.processRaiseOrCall(table, player, chips, action);
        } else if (action === "FOLD") {
            player.folded = true;
            table.addMessage(`${player.name} folds.`);
        } else if (action === "CHECK") {
            table.addMessage(`${player.name} checks.`);
        }

       PlayProcessor.processPlayDetermineNextStep(player, table);

        // update the table
        await broadcastToTable(table, { action: 'poker-table-change', payload: table }, apigwManagementApi);

        // animate bets if there were any
        if (chips && chips.length > 0) {
            await animatePlayerBetOnScreen(playerId, chips, table, apigwManagementApi, 0);
        }
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};

socketEventHandlers['poker-win-round'] = async (apigwManagementApi, connectionId, data, messageId) => {
    try {

        console.log(`poker-win-round: ${JSON.stringify(data)}`);
        const votingPlayerId = data.playerId;
        let winningPlayerIds;
        if (data.winningPlayerIds) {
            winningPlayerIds = data.winningPlayerIds.split(',');
        }
        const tableId = data.tableId;

        const table = tables.get(tableId);
        table.players.forEach((p)=>p.showWin=false);
        const votingPlayer = table.players.find(player => player.id === votingPlayerId);
        votingPlayer.hasVoted = true;
        const winningPlayers = table.players.filter(player => winningPlayerIds.includes(player.id));
        winningPlayers.forEach((wp) => {
            wp.winVoteCount = wp.winVoteCount + 1;
        });
        const winningPlayerNames = winningPlayers.map(player => player.name).join(', ');
        table.addMessage(`${votingPlayer.name} voted ${winningPlayerNames} winner${winningPlayers.length > 1 ? "s" : ""}.`);
        if (winningPlayers.every(player => player.winVoteCount >= 2)) {
            table.players.forEach((p)=>p.showWin= false);
            PlayProcessor.processWinner(winningPlayers, table);
            await broadcastToTable(table, { action: 'poker-table-change', payload: table }, apigwManagementApi);
            processAnySocketPlays(table, apigwManagementApi, 1);
        } else {
            const playersNotVoted = table.players.find(player => !player.hasVoted);
            if (!playersNotVoted || playersNotVoted.length === 0) {
                table.addMessage(`All votes for winner cast, but no 2 votes for anyone, resetting to try again.`);
                table.players.forEach((p) => { p.winVoteCount = 0; p.hasVoted = false; });
            }
            await broadcastToTable(table, { action: 'poker-table-change', payload: table }, apigwManagementApi);
        }
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};

socketEventHandlers['poker-get-current-table'] = async (apigwManagementApi, connectionId, data, messageId) => {
    try {
        const tableId = data.tableId;
        const table = tables.get(tableId);
        response = { action: messageId, payload: table };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};


socketEventHandlers['poker-reconnect-to-game'] = async (apigwManagementApi, connectionId, data, messageId) => {
    try {
        const playerId = data.playerId;
        const tableId = data.tableId;
        const table = tables.get(tableId);
        const player = table.players.find(player => player.id === playerId);
        player.isConnected = true;
        player.connectionId = connectionId;
        player.id = connectionId;
        response = { action: 'set-player-id', payload: { playerId: player.id } };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
        table.addMessage(`${player.name} has reconnected to game.`);

        // update everyone still in
        await broadcastToTable(table, { action: 'poker-table-change', payload: table }, apigwManagementApi);
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};

socketEventHandlers['poker-player-chip-denomination-change'] = async (apigwManagementApi, connectionId, data, messageId) => {
    try {
        const playerId = data.playerId;
        const tableId = data.tableId;
        const table = tables.get(tableId);
        table.players.forEach((p)=>p.showWin=false);// if there was a winner that is no longer true
        const fromChipColor = data.fromChipColor;
        const toChipColor = data.toChipColor;
        const playerDone = data.playerDone;
        const player = table.players.find(player => player.id === playerId);

        let response = {};
        if (!fromChipColor || !toChipColor || playerDone) {
            player.showChipExchangeDiv = false;
            response = { action: `poker-table-change`, payload: table };
            await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
            return;
        }
        player.showChipExchangeDiv = true;
        const modalMsg = PlayProcessor.exchangeChipsPlayer(table, player, fromChipColor, toChipColor);
        if (modalMsg) {
            response = { action: `poker-table-modal-message`, payload: modalMsg };
            await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
            return;
        }
        response = { action: `poker-table-change`, payload: table };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });

    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};

socketEventHandlers['poker-remove-player'] = async (apigwManagementApi, connectionId, data, messageId) => {
    try {
        const playerId = data.playerId;
        const tableId = data.tableId;
        const table = tables.get(tableId);
        if (table){
            const player = table.players.find(player => player.id === playerId);
            if (player){
                removePlayer(player, table, apigwManagementApi, true);
            }   
        } else {
            // just this player
            const response = { action: 'poker-remove-player', payload: table };
            await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
        }
        // table.players = table.players.filter((p) => { return p.id !== player.id; });

        // console.log(`${player.name}, ${player.id} left the game.`);
        // table.addMessage(`${player.name} left the game.`);
        // await broadcastToTable(table, { action: 'poker-table-change', payload: table }, apigwManagementApi);
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};

exports.lambdaSocketHandler = async (data, apigwManagementApi, connectionId) => {
    try {
        console.log(typeof data);
        console.log(data);

        if (data === 'PING'){
            console.log('Received WebSocket ping');
            await apigwManagementApi.postToConnection({ ConnectionId: connectionId, action:'PONG' });
            return;
        }

        const obj = typeof data === 'string' ? JSON.parse(data) : data;
        const { action, payload, messageId } = obj;
        if (socketEventHandlers[action]) {
            return await socketEventHandlers[action](apigwManagementApi, connectionId, payload, messageId);
        } else {
            console.error(`No handler for action: ${action}`);
            throw new Error(`No handler for action: ${action} - data: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
}

exports.lambdaSocketDisconnectHandler = async (apigwManagementApi, connectionId) => {
    try {
        const table = findTableByConnectionId(tables, connectionId);
        if (table) {
            const player = table.players.find(player => player.connectionId === connectionId);
            player.isConnected = false;
            player.connectionId = undefined;
            table.addMessage(`${player.name} may have left the game perhaps disconnected browser`);
        }
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, { disconnect: connectionId });
    }
}
/**
 * After possible disconnection frontend check to see if game is still going and player is still in the game
 */
socketEventHandlers['poker-can-reconnect'] = async (apigwManagementApi, connectionId, data, messageId) => {
    try {
        console.log('Received  poker-can-reconnect:', JSON.stringify(data));
        if (!messageId) {
            throw new Error(`No messageId in  poker-can-reconnect - supposed to be a synchronous call`);
        }
        connetedButNotPlaying.set(connectionId, connectionId);
        const playerId = data.playerId;
        const tableId = data.tableId;
        const table = tables.get(tableId);
        let canReconnect = false;
        if (table) {
            const player = table.players.find(player => player.id === playerId);
            if (player) {
                canReconnect = true;
                connetedButNotPlaying.delete(connectionId);
            }
        }
        const response = { action: messageId, payload: JSON.stringify({ canReconnect }) };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};

animatePlayerBetOnScreen = async (playerId, chips, table, apigwManagementApi, index) => {
    try{
        const data = {};
        data.playerId = playerId;
        const chipCounts = chips.reduce((acc, chip) => {
            acc[chip.color] = chip.count;
            return acc;
        }, {});
        const theChips = PlayProcessor.chipsFromCounts(chipCounts.black, chipCounts.green, chipCounts.red, chipCounts.gray);
        data.chips = JSON.stringify(theChips);
        data.potChips = JSON.stringify(table.playStatus.chips);
        data.potTotal = table.playStatus.pot;
        data.skipPotAnimation=index&&index>0?true:false;
        await broadcastToTable(table, { action: 'poker-animate-chips-bet', payload: data }, apigwManagementApi);
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};

function processAnySocketPlays(table, apigwManagementApi, base) {
    if (table && table.socketPlays.length > 0) {
        setTimeout(() => {
            table.socketPlays.forEach((socketPlay, index) => {
                animatePlayerBetOnScreen(socketPlay.player.id, socketPlay.data, table, apigwManagementApi, index+base);
            });
            table.socketPlays = [];
        }, 500); 
    }
}

async function removePlayer(player, table, apigwManagementApi, thisPlayerIsConnected) {
    try {
        table.players = table.players.filter((p) => { return p.id !== player.id; });
        console.log(`${player.name}, ${player.id} left the game - the player is still connected: ${thisPlayerIsConnected}. If true will be removed.`);
        table.addMessage(`${player.name} left the game. ${thisPlayerIsConnected ? '' : " Apparently the browser disconnected."}`);
        // remove the player
        if (thisPlayerIsConnected) {
            table.playerCount = table.playerCount - 1;

            const response = { action: 'poker-remove-player', payload: table };
            await apigwManagementApi.postToConnection({ ConnectionId: player.connectionId, Data: JSON.stringify(response) });
            if (table.playerCount > 1) {
                // update everyone still in
                await broadcastToTable(table, { action: 'poker-table-change', payload: table }, apigwManagementApi);
            } else {
                table.addMessage("Not enough players table will be terminated");
                await broadcastToTable(table, { action: 'poker-table-change', payload: table }, apigwManagementApi);
                console.log(`Not enough players for table: ${JSON.stringify(table)}, table count ${tables.size} `);
                tables.delete(table.id);
                console.log(`Now there are ${tables.size} tables`);
            }
        }
    } catch (error) {
        handleError(undefined, undefined, error, data);
    }
}

function findTableByConnectionId(tables, connectionId) {
    for (let table of tables.values()) {
        console.log(`table: ${table}`);
        // const table = tables[tableId];
        const player = table.players.find(player => player.id === connectionId);
        if (player) {
            return table;
        }
    }
    return null;
}

function handleError(apigwManagementApi, connectionId, error, data) {
    try {
        console.log(`ERROR: ${error} - DATA: ${JSON.stringify(data)} - STACK: ${error.stack}`);
        console.error(error);
        let errorMessage = `A stupid error [${error.message}]. Not something we expected. Sorry!`
        if (apigwManagementApi && connectionId) {
            let response = { action: 'backendError', payload: errorMessage };
            apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
        }
    } catch (e) {
        console.error(`There was an ERROR trying to "handleError". Yikes. Error:${e}, apigwManagementApi:${apigwManagementApi}, connectionId:${connectionId}, originalError:${error}, data:${JSON.stringify(data)} `);
    }
}