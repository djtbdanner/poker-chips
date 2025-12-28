# Copilot / AI Agent Instructions for poker-chips

Purpose
- Help an AI agent become immediately productive in this repository: where to look, how to run and test, common patterns, and gotchas.

Quick summary (big picture)
- This app implements a multiplayer (browser) poker game using WebSockets and a serverless/Lambda style handler:
  - Client UI: `public/` (HTML + `public/js/*` client logic)
  - Game logic & state: `sockets/` (classes, `process-play.js`, `socketEvents.js`)
  - Lambda integration: `lambda.js` (uses AWS ApiGatewayManagementApi to post to connections)
  - Local testing: `local/api-gateway-emulator/socket-api-emulator.js` emulates AWS WebSocket behavior
  - Static site server: `server.js` serves `public/` on port 8080

Key commands / workflows
- Run the WebSocket API emulator (local lambda -> websocket loop):
  - npm run socket  # runs `node local/api-gateway-emulator/socket-api-emulator.js`
  - When emulator is running, clients connect to ws://localhost:3000 (see `public/js/socket.js`).
- Serve static UI (dev):
  - node server.js  # serves `public/` on port 8080
  - Then open http://localhost:8080
- Run the tests (note: plain node scripts, not mocha):
  - npm test        # runs `node sockets/test/test-chips.js`
- Other scripts:
  - npm start       # currently `node index.js` but note: index.js requires `./sockets/socketMain` which is missing (see "Gotchas")
  - npm run go      # nodemon index.js (same caveat)

Important code patterns & conventions (do not change without checking tests)
- WebSocket message format used across client/server:
  - { action, payload, messageId }
  - Synchronous request pattern: client sends message with a messageId; server replies using the messageId as the action to deliver the response (see `public/js/socket.js::asyncEmit`).
- Server-side message handlers live in `sockets/socketEvents.js`.
  - Handlers receive (apigwManagementApi, connectionId, data, messageId) in the Lambda-emulation flow.
  - The server keeps in-memory state (Map of `tables`) — there is no DB persistence in current code.
- Game logic is centralized in `sockets/process-play.js` (chip parsing, round progression, side-pot logic, etc.).
- Chip representation: chips are objects/enums in `sockets/classes/Chip.js`. `process-play.js::parseChips` converts numeric totals → chip counts (used by tests).

Integration points / external deps
- AWS SDK v3 clients are referenced in `lambda.js` (ApiGatewayManagementApi + DynamoDB libs) — used in Lambda handler to post to connections and (partially) reference connection storage.
- Local emulator (`local/api-gateway-emulator`) talks to the local WebSocket server (ws://localhost:3000) and exposes an HTTPS endpoint that mimics API Gateway POSTs to @connections. The emulator calls the exported Lambda `handler` in `lambda.js`.

Common pitfalls & gotchas
- index.js currently does `require('./sockets/socketMain')` but `sockets/socketMain` is not in the repository. Running `npm start` may fail with "Cannot find module './sockets/socketMain'". Prefer `node server.js` to run the static site and use the emulator for socket behavior.
- State is in-memory in `sockets/socketEvents.js` — expect data loss on restart.
- `public/js/socket.js` expects ws://localhost:3000 by default (the emulator). If you change emulator ports, update client code.
- Message timeouts: `asyncEmit` uses a 15s timeout; failing to reply with the messageId will cause a timeout rejection.

Examples to reference when coding
- To add a new client action, add handling in `sockets/socketEvents.js` and document the payload shape in a nearby comment. Example: `start-poker-game` expects fields: { tableName, playerName, playerCount, chipCount, roundsPerDeal, bigBlind, blindsDouble }.
- To change chip parsing or unit tests, update `sockets/process-play.js::parseChips` and `sockets/test/test-chips.js`.

PR / test guidance
- Add or update the simple node test scripts in `sockets/test/` when changing game logic.
- Prefer to test behavior by running the emulator + browser UI for end-to-end socket flows.

If anything in these notes is unclear or you want me to include more code examples (payload examples, sample messages, or a small checklist for PRs), tell me what area to expand and I will iterate. ✅
