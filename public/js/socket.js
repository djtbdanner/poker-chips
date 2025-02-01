// our global websocket connection
let ws = undefined;

const connectAndSendSocketRequest = async(data) => {
    let webSocketUrl = 'ws://localhost:3000';
    const msg = typeof data === 'string' ? data : JSON.stringify(data);
    await sendSocketMessage(msg, webSocketUrl);
};

const sendSocketMessage = async (msg, webSocketUrl) => {
    try {
        let socket = await getSocket(webSocketUrl);
        socket.send(msg);
        console.log(`Sent Message: ${msg}`);
    } catch (e) {
        console.log(`Error sending message: ${e}`);
        console.log(e.stack);
    }
};

const getSocket = async (webSocketUrl) => {
    if (ws) {
        console.log(`Have socket, getSocket returning ${ws}`);
        return ws;
    }
    try {
        console.log(`getSocket setting up socket`);
        const socket = await openWebSocket(webSocketUrl);
        await waitForSocketConnection(socket);
        console.log('WebSocket is ready to be used');
        return socket;
    } catch (error) {
        console.error('WebSocket connection failed:', error);
    }
};

const openWebSocket = (webSocketUrl) => new Promise((resolve, reject) => {
    const connection = webSocketUrl;
    console.log(`Opening WebSocket: ${connection}`);
    ws = new WebSocket(connection);

    ws.onopen = () => {
        console.log(`WebSocket connection opened: ${ws}`);
        resolve(ws);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
    };

    ws.onclose = () => {
        console.log('WebSocket closed:');
        ws = undefined;
        resolve();
    };
    ws.onmessage = socketOnMessage;
});

const waitForSocketConnection = (socket) => new Promise((resolve) => {
    const checkConnection = () => {
        console.log(`Waiting for WebSocket ready state: ${socket.readyState}`);
        if (socket.readyState === WebSocket.OPEN) {
            console.log("Connection is established");
            resolve();
        } else {
            setTimeout(checkConnection, 5); // Check every 5 milliseconds
        }
    };
    checkConnection();
});


// global socketEventHandlers will be in clientSocket
const socketEventHandlers = {};
const socketOnMessage = async (message) => {
    // console.log(`socket message received: ${message} - JSON.stringify: ${JSON.stringify(message)} - data:${message.data}`);
    console.log(`socket message received: ${message.data}`);
    try {
        const data = JSON.parse(message.data);
        const { action, payload } = data;
        if (socketEventHandlers[action]) {
            socketEventHandlers[action](payload);
        } else {
            console.warn(`No handler for action: ${action}`);
        }
    } catch (e) {
        console.error(`Error processing response: ${e}`);
    }
};

function asyncEmit(action, payload) {
    return new Promise((resolve, reject) => {
        const messageId = generateUniqueId();
        const message = JSON.stringify({ action, payload, messageId });
        // "action" from server will be the messageId so we create a handler here for that id and 
        // we make a synchronous web socket call to the server
        socketEventHandlers[messageId] = (response) => {
            delete socketEventHandlers[messageId];
            resolve(response);
        };

        connectAndSendSocketRequest(message);

        setTimeout(() => {
            delete socketEventHandlers[messageId];
            reject(new Error('Request timed out'));
        }, 15000);
    });
}

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}