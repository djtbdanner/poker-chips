const Table = require('./classes/Table');
const Player = require('./classes/Player');
const PlayProcessor = require('./process-play');
const PlayStatus = require('./classes/PlayStatus');
const Chip = require('./classes/Chip');
// --TODO-- will be replaced with a database
let tables = new Map();
const socketEventHandlers = {};

function broadcastToTable(table, message, apigwManagementApi) {
    table.socketConnections.forEach((connectionId) => {
        apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(message) });
    });
}

socketEventHandlers['join-poker-game'] = async (apigwManagementApi, connectionId, data, messageId) => {
    try {
        const tableId = data.tableId;
        const playerName = data.playerName;
        const player = new Player(playerName);
        const table = tables.get(tableId);
        PlayProcessor.initializePlayerChips(table, player);
        if (!table) {
            throw new Error(`Could not find room or table: ${tableId}.`);
        }
        if (table.players.length === table.playerCount) {
            throw new Error(`Table ${table.name} is full - no more players allowed.`);
        }
        table.addPlayer(player);
        if (table.players.length < table.playerCount) {
            const count = table.playerCount - table.players.length;
            const morePlayers = `waiting for ${count} more player${count === 1 ? "" : "s"}.`
            table.addMessage(`${player.name} joined table ${table.name} ${morePlayers}`);
        } else {
            table.addMessage(`${player.name} joined table ${table.name}, filling table.`);
            table.players[0].dealer = true;
            table.players[1].turn = true;
            table.addMessage(`${table.players[0].name} is Dealer. ${table.players[1].name} is first bet.`);
        }
        let response = { action: 'set-player-id', payload: { playerId: player.id } };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
        response = { action: 'set-table-id', payload: { tableId: table.id } };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
        response = { action: 'join-poker-game', payload: table };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
        table.socketConnections.push(connectionId);
        response = { action: 'poker-table-change', payload: table };
        broadcastToTable(table, response, apigwManagementApi);
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};

socketEventHandlers['start-poker-game'] = async (apigwManagementApi, connectionId, data, messageId) => {
    try {
        const tableName = data.tableName;
        const playerName = data.playerName;
        const playerCount = data.playerCount;
        const startChipCount = data.startChipCount;
        const player = new Player(playerName);
        const table = new Table(tableName, parseInt(playerCount, 10), parseInt(startChipCount, 10));
        let response = { action: 'set-table-id', payload: { tableId: table.id } };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
        response = { action: 'set-player-id', payload: { playerId: player.id } };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
        table.addPlayer(player);
        PlayProcessor.initializePlayerChips(table, player);
        table.addMessage(`${player.name} started ${table.name}, ${table.playerCount} players, each with ${table.startChipCount} chips.`);
        tables.set(table.id, table);

        response = { action: messageId, payload: table };
        table.socketConnections.push(connectionId);
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
        const availableTables = arr;//arr.filter((table)=> !table.playersFull());
        const response = { action: messageId, payload: JSON.stringify(availableTables) };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) })
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};

const pokerActions = ["CALL", "CHECK", "FOLD", "RAISE"];
socketEventHandlers['poker-action'] = async (apigwManagementApi, connectionId, data, messageId) => {
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
        const initialCallAmount = table.playStatus.callAmount;
        if (action === "RAISE") {
            totalChips = PlayProcessor.calculateChips(chips, player, table);
            const raisedByAmount = totalChips - table.playStatus.callAmount;
            table.playStatus.totalRaiseThisRound = table.playStatus.totalRaiseThisRound + raisedByAmount;
            table.playStatus.playerLastRaised = player;
            if (player.getChipTotal() === 0) {
                player.allIn = true;
                player.splitPotWinAmount = table.playStatus.chips;
                table.playStatus.splitPotCount += 1
            }
        } else if (action === "CALL") {
            totalChips = PlayProcessor.calculateChips(chips, player, table);
            if (player.getChipTotal() === 0) {
                player.allIn = true;
                player.splitPotWinAmount = table.playStatus.chips;
                table.playStatus.splitPotCount += 1
            }
        } else if (action === "FOLD") {
            player.folded = true;
        } else if (action === "CHECK") {
        }
        table.addMessage(`${player.name} ${action.toLowerCase()}s ${player.allIn ? " !ALL IN! " : ""} with ${totalChips} chips.`);
        if (PlayProcessor.isBetRoundOver(player, table)) {
            // PlayProcessor.updatePlayersAfterBetting(table);
        } else {
            PlayProcessor.getNextActivePlayer(player, table).turn = true;
            PlayProcessor.calculateCurrentCallAmount(table);
        }
        broadcastToTable(table, { action: 'poker-table-change', payload: table }, apigwManagementApi);
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};

socketEventHandlers['poker-win-round'] = async (apigwManagementApi, connectionId, data, messageId) => {
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
            PlayProcessor.processWinner(winningPlayer, table);
            PlayProcessor.updatePlayersAfterBetting(table);
            const brokePlayers = table.players.filter((p) => {
                console.log(p.getChipTotal());
                return p.getChipTotal() <= 0;
            });
            brokePlayers.forEach((bp) => {
                removePlayer(bp, table);
            });
        } else {
            const playersNotVoted = table.players.find(player => !player.hasVoted);
            if (!playersNotVoted || playersNotVoted.length === 0) {
                table.addMessage(`All votes for winner cast, but no 2 votes for anyone, resetting to try again.`);
                table.players.forEach((p) => { p.winVoteCount = 0; p.hasVoted = false; });
            }
        }
        broadcastToTable(table, { action: 'poker-table-change', payload: table }, apigwManagementApi);
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};

socketEventHandlers['poker-get-current-table'] = async (apigwManagementApi, connectionId, data, messageId) => {
    try {
        const playerId = data.playerId;
        const tableId = data.tableId;
        const table = tables.get(tableId);

        response = { action: messageId, payload: table };
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};

socketEventHandlers['poker-player-chip-denomination-change'] = async (apigwManagementApi, connectionId, data, messageId) => {
    try {
        const playerId = data.playerId;
        const tableId = data.tableId;
        const table = tables.get(tableId);
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
        const player = table.players.find(player => player.id === playerId);
        table.players = table.players.filter((p) => { return p.id !== player.id; });

        console.log(`${player.name}, ${player.id} left the game.`);
        table.addMessage(`${player.name} left the game.`);
        table.socketConnections = table.socketConnections.filter((c) => { return c !== connectionId; });
        broadcastToTable(table, { action: 'poker-table-change', payload: table }, apigwManagementApi);
    } catch (error) {
        handleError(apigwManagementApi, connectionId, error, data);
    }
};

exports.lambdaSocketHandler = async (data, apigwManagementApi, connectionId) => {
    try {
        console.log(typeof data);
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

function handleError(apigwManagementApi, connectionId, error, data) {
    try {
        console.log(`ERROR: ${error} - DATA: ${JSON.stringify(data)} - STACK: ${error.stack}`);
        console.error(error);
        let errorMessage = `A stupid error [${error.message}]. Not something we expected. Sorry!`
        if (apigwManagementApi) {
            let response = { action: 'backendError', payload: errorMessage };
            apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(response) });
        }
    } catch (e) {
        console.error(`There was an ERROR trying to "handleError". Yikes. Error:${e}, apigwManagementApi:${apigwManagementApi}, connectionId:${connectionId}, originalError:${error}, data:${JSON.stringify(data)} `);
    }
}