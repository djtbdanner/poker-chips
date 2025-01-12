const crypto = require('crypto');
const { handler } = require('../../lambda');
const { socketEvent } = require('./apiEvents/socket');
const { connectionEvent } = require('./apiEvents/connection');
const https = require('https');
const http = require('http');
const fs = require('fs');

// map of all the connections that this is processing
const socketConnections = new Map();

// HTTPS - server, this gets the responses from the lambda and converts them into
// client socket responses (the line above allows this to run with local cert)
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const options = {
    key: fs.readFileSync('./local/api-gateway-emulator/certs/key.pem'),
    cert: fs.readFileSync('./local/api-gateway-emulator/certs/cert.pem')
}
const httpsServer = https.createServer(options, async function (req, res) {
    let body = await getRequestBody(req);
    const socketId = decodeURIComponent(req.url.split('/')[2]);
    // console.log(`socket-api-emulator: Lambda responds to socket ${socketId} - \n ${body}`);
    // console.log(`socket-api-emulator: Lambda responds to socket ${socketId} `);
    const socket = socketConnections.get(socketId);
    if (!socket) {
        res.writeHead(410);// let the lambda know this no longer exists
        res.end();
    } else {
        const frame = createWebSocketFrame(body);
        socket.write(frame);
        res.writeHead(200);
        res.end();
    }
});

const socketServer = http.createServer((req, res) => {
    res.writeHead(404);
    res.end();
});

socketServer.on('upgrade', (req, socket, head) => {
    if (req.headers['upgrade'] !== 'websocket') {
        socket.destroy();
        return;
    }

    const key = req.headers['sec-websocket-key'];
    const acceptKey = generateAcceptKey(key);
    
    // Send WebSocket handshake response
    socket.write([
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${acceptKey}`,
        '', ''
    ].join('\r\n'));

    socketConnections.set(key, socket);
    // console.log(`socket-api-emulator: New client connected: ${key}`);

    // CONNECTION EVENT
    handler(connectionEvent(key, "$connect", "CONNECT"));

    socket.on('data', (data) => {
        try {
            if (!data || data.length === 0) return; // Ignore empty data
            const message = parseWebSocketMessage(data);
            if (message) {
                // console.log(`socket-api-emulator: Received message from ${key}:`, message);
                // MESSAGE EVENT
                handler(socketEvent(key, message));
            } else {
                // console.log(`socket-api-emulator: Ignored unrecognized or unwanted data from ${key}`);
            }
        } catch (err) {
            console.error(`socket-api-emulator: Error processing data from ${key}:`, err);
        }
    });

    socket.on('end', () => {
        // console.log(`socket-api-emulator: Client disconnected: ${key}`);
        // DISCONNECT EVENT
        handler(connectionEvent(key, "$disconnect", "DISCONNECT"));
        socketConnections.delete(key);
    });
    
    socket.on('error', () => {
        // console.log(`socket-api-emulator: Client disconnected: ${key}`);
        // ERROR EVENT
        handler(connectionEvent(key, "$disconnect", "DISCONNECT"));
        socketConnections.delete(key);
    });
});

function generateAcceptKey(secWebSocketKey) {
    const sha1 = crypto.createHash('sha1');
    sha1.update(secWebSocketKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
    return sha1.digest('base64');
}

function parseWebSocketMessage(data) {
    if (data.length < 2) {
        return null; // Not enough data for even the header
    }

    const firstByte = data[0];
    const secondByte = data[1];

    const opcode = firstByte & 0x0F; // Extract opcode (lower 4 bits)
    const mask = secondByte & 0x80; // Mask bit
    let length = secondByte & 0x7F;

    if (opcode === 0x8) {
        // Close frame
        // console.log("socket-api-emulator: Close frame received, ignoring...");
        return null; // Explicitly ignore close frames
    }

    let offset = 2; // Start offset for the payload

    if (length === 126) {
        if (data.length < 4) return null; // Incomplete frame
        length = data.readUInt16BE(2);
        offset += 2;
    } else if (length === 127) {
        if (data.length < 10) return null; // Incomplete frame
        length = data.readUInt32BE(2);
        offset += 8;
    }

    if (mask) {
        offset += 4; // Skip the masking key
    }

    if (data.length < offset + length) {
        return null; // Incomplete frame
    }

    let messageData = data.slice(offset, offset + length);

    if (mask) {
        const maskKey = data.slice(offset - 4, offset);
        messageData = Buffer.from(
            messageData.map((byte, i) => byte ^ maskKey[i % 4])
        );
    }

    return messageData.toString('utf8'); // Decode the message to a string
}

function createWebSocketFrame(data) {
    const json = typeof data === 'string' ? data : JSON.stringify(data);
    const jsonByteLength = Buffer.byteLength(json);
    const lengthByteCount = jsonByteLength < 126 ? 0 : jsonByteLength < 65536 ? 2 : 8;
    const payloadLength = lengthByteCount === 0 ? jsonByteLength : lengthByteCount === 2 ? 126 : 127;
    const buffer = Buffer.alloc(2 + lengthByteCount + jsonByteLength);

    buffer[0] = 0x81; // FIN and opcode for text frame
    buffer[1] = payloadLength;

    if (lengthByteCount === 2) {
        buffer.writeUInt16BE(jsonByteLength, 2);
    } else if (lengthByteCount === 8) {
        // Note: JavaScript can only handle up to 53-bit integers
        buffer.writeUInt32BE(0, 2); // Most significant 32 bits
        buffer.writeUInt32BE(jsonByteLength, 6); // Least significant 32 bits
    }

    buffer.write(json, 2 + lengthByteCount);
    return buffer;
}

async function getRequestBody(req) {
    let data = ``;
    req.on(`data`, (chunk) => {
        data += chunk;
    });

    return new Promise((resolve) => {
        req.on(`end`, () => {
            resolve(data);
        });
    });
}

httpsServer.listen(443, () => { console.log(`socket-api-emulator: HTTPS Server listening on port ${443}`) });
socketServer.listen(3000, () => {
    console.log('socket-api-emulator: WebSocket server is running on ws://localhost:3000');
});