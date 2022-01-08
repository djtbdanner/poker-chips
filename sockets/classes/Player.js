const crypto = require("crypto");
class Player {
    constructor(name) {
        this.name = name;
        this.id = crypto.randomBytes(16).toString("hex");
        this.chips=[];
        this.turn = false;
        this.dealer = false;
    }
}
module.exports = Player