class SocketPlay {
    constructor(player, socketMessage, data) {
        this.player = player;
        this.socketMessage = socketMessage;
        this.data = data;
    }

    reset() {
        this.player = undefined;
        this.socketMessage = undefined;
        this.data = undefined;
    }
}
module.exports = SocketPlay