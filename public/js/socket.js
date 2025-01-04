// our global websocket connection
let ws = undefined;

const connectAndSendSocketRequest = async(message) => {
    let webSocketUrl = 'ws://localhost:3000';
    await sendSocketMessage(message, webSocketUrl);
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
        fetchButtonSpinnerOff(`Websocket error: ${JSON.stringify(error)}`);
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

/**
 * Process any message from API gateway/lambda socket
 * @param message
 * @returns {Promise<void>}
 */
const socketOnMessage = async (message) => {
    console.log(`socket message received: ${message} - JSON.stringify: ${JSON.stringify(message)}`);
    let resultMsg = '';
    try {
        resultMsg = message.data;
        const resp = message.data;
        console.log(`RESPONSE: ${resp}`);
    } catch (e) {
        console.error(e);
        resultMsg(`Error processing response: ${e}`);
    }
};

