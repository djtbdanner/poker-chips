const Table = require('../classes/Table');
const Player = require('../classes/Player');
const PlayProcessor = require('../process-play');
const PlayStatus = require('../classes/PlayStatus');
const Chip = require('../classes/Chip');
const Me = require('./process-play.test');

// exports.setPlayerChips = (player, playerBlackChipCount, playerGreenChipCount, playerRedChipCount, playerGrayChipCount) => {
exports.testTable = () => {
    //function testTable(){
    const chips = `"chips": [{
        "color": "black",
        "value": 100
    }, {
        "color": "green",
        "value": 25
    }, {
        "color": "green",
        "value": 25
    }, {
        "color": "red",
        "value": 5
    }, {
        "color": "red",
        "value": 5
    }, { 
        "color": "red",
        "value": 5
    }, {
        "color": "red",
        "value": 5
    }, {
        "color": "gray",
        "value": 1
    }, {
        "color": "gray",
        "value": 1
    }, {
        "color": "gray",
        "value": 1
    }, {
        "color": "gray",
        "value": 1
    }, {
        "color": "gray",
        "value": 1
    }
]`;

    const testTable = JSON.parse(
        `{
            "name": "GameOfThrones",
            "id": "bf9bea20aabe911aae94c764a9569cc3",
            "playerCount": 4,
            "startChipCount": 100,
            "players": [
              {
                "name": "Dave",
                "id": "6670aa87f33fa093ba0e97a500d48b82",
                ${chips},
                "turn": false,
                "firstBettor": false,               
                "dealer": true,
                "folded": false,
                "hasVoted": false,
                "winVoteCount":0,
                "potRaisedBy":0,
                "showChipExchangeDiv":false
              },
              {
                "name": "Tom",
                "id": "ef5199ff18153c7527a1543e3f0a8e4c",
                ${chips},
                "turn": true,
                "firstBettor": true,
                "dealer": false,
                "folded": false,
                "hasVoted": false,
                "winVoteCount":0,
                "potRaisedBy":0,
                "showChipExchangeDiv":false
              },
              {
                "name": "Marty",
                "id": "ef5199ff18ji2j9427a1543e3f0a8e4c",
                ${chips},
                "turn": false,
                "dealer": false,
                "firstBettor": false,               
                "folded": false,
                "hasVoted": false,
                "winVoteCount":0,
                "potRaisedBy":0,
                "showChipExchangeDiv":false
              },
              {
                "name": "Stan",
                "id": "abcdfa12318ji2j9427a1543e3f0a8e4c",
                ${chips},
                "turn": false,
                "dealer": false,
                "firstBettor": false,               
                "folded": false,
                "hasVoted": false,
                "winVoteCount":0,
                "potRaisedBy":0,
                "showChipExchangeDiv":false
              }
            ],
            "pot": 0,
            "messages": [
              "TEST TABLE."
            ]
          }`

    );
    const table = new Table(testTable.name, testTable.playerCount, testTable.startChipCount);
    table.id = testTable.id;
    table.players = testTable.players;
    table.pot = testTable.pot;
    table.messages = testTable.messages;
    table.playStatus = new PlayStatus();
    table.setChipTotalsForPlayers();
    return table;
}

function testChipCalculator() {

    const testName = `TESTING CHIP CALCULATIONS...`;
    logTestMessage(`running ${testName}`);
    const table = Me.testTable();
    let player = table.players[0];
    PlayProcessor.setPlayerChips(table, player, 0, 0, 0, 256);
    compareValues(player.chipTotal, 256)
    PlayProcessor.calculateChips(26, player, table);
    compareValues(player.chipTotal, 230)
    compareValues(table.playStatus.pot, 26);
    compareValues(player.chips.filter((c) => c.color === "black").length, 0);
    compareValues(player.chips.filter((c) => c.color === "green").length, 0);
    compareValues(player.chips.filter((c) => c.color === "red").length, 0);
    compareValues(player.chips.filter((c) => c.color === "gray").length, 230);
    compareValues(table.playStatus.chips.filter((c) => c.color === "black").length, 0);
    compareValues(table.playStatus.chips.filter((c) => c.color === "green").length, 0);
    compareValues(table.playStatus.chips.filter((c) => c.color === "red").length, 0);
    compareValues(table.playStatus.chips.filter((c) => c.color === "gray").length, 26);

    logTestMessage(`${testName}-- TEST ONE GOOD -- `);

    player = table.players[1];
    PlayProcessor.setPlayerChips(table, player, 2, 2, 1, 1);
    compareValues(player.chipTotal, 256)
    PlayProcessor.calculateChips(26, player, table);
    compareValues(player.chipTotal, 230)
    compareValues(table.playStatus.pot, 52);
    compareValues(player.chips.filter((c) => c.color === "black").length, 2);
    compareValues(player.chips.filter((c) => c.color === "green").length, 1);
    compareValues(player.chips.filter((c) => c.color === "red").length, 1);
    compareValues(player.chips.filter((c) => c.color === "gray").length, 0);
    compareValues(table.playStatus.chips.filter((c) => c.color === "black").length, 0);
    compareValues(table.playStatus.chips.filter((c) => c.color === "green").length, 1);
    compareValues(table.playStatus.chips.filter((c) => c.color === "red").length, 0);
    compareValues(table.playStatus.chips.filter((c) => c.color === "gray").length, 27);

    logTestMessage(`${testName}-- TEST TWO GOOD -- `);

    player = table.players[2];
    PlayProcessor.setPlayerChips(table, player, 2, 0, 1, 51);
    compareValues(player.chipTotal, 256);

    PlayProcessor.calculateChips(26, player, table);
    compareValues(player.chipTotal, 230)
    compareValues(table.playStatus.pot, 78);
    compareValues(player.chips.filter((c) => c.color === "black").length, 2);
    compareValues(player.chips.filter((c) => c.color === "green").length, 0);
    compareValues(player.chips.filter((c) => c.color === "red").length, 0);
    compareValues(player.chips.filter((c) => c.color === "gray").length, 30);
    compareValues(table.playStatus.chips.filter((c) => c.color === "black").length, 0);
    compareValues(table.playStatus.chips.filter((c) => c.color === "green").length, 1);
    compareValues(table.playStatus.chips.filter((c) => c.color === "red").length, 1);
    compareValues(table.playStatus.chips.filter((c) => c.color === "gray").length, 48);
    logTestMessage(`${testName}-- TEST THREE GOOD -- `);


    player = table.players[3];
    PlayProcessor.setPlayerChips(table, player, 2, 2, 2, 5);
    compareValues(player.chipTotal, 265)
    PlayProcessor.calculateChips(126, player, table);
    compareValues(player.chipTotal, 139)
    compareValues(table.playStatus.pot, 204);
    compareValues(player.chips.filter((c) => c.color === "black").length, 1);
    compareValues(player.chips.filter((c) => c.color === "green").length, 1);
    compareValues(player.chips.filter((c) => c.color === "red").length, 2);
    compareValues(player.chips.filter((c) => c.color === "gray").length, 4);
    compareValues(table.playStatus.chips.filter((c) => c.color === "black").length, 1);
    compareValues(table.playStatus.chips.filter((c) => c.color === "green").length, 2);
    compareValues(table.playStatus.chips.filter((c) => c.color === "red").length, 1);
    compareValues(table.playStatus.chips.filter((c) => c.color === "gray").length, 49);
    logTestMessage(`${testName}-- TEST FOUR GOOD -- `);


    player = table.players[0];
    let chips = [];
    chips.push({ color: "black", count: 0 }, { color: "green", count: 0 }, { color: "red", count: 0 }, { color: "gray", count: 100 });
    PlayProcessor.calculateChips(chips, player, table);
    compareValues(player.chipTotal, 130)
    compareValues(table.playStatus.pot, 304);
    compareValues(player.chips.filter((c) => c.color === "black").length, 0);
    compareValues(player.chips.filter((c) => c.color === "green").length, 0);
    compareValues(player.chips.filter((c) => c.color === "red").length, 0);
    compareValues(player.chips.filter((c) => c.color === "gray").length, 130);
    compareValues(table.playStatus.chips.filter((c) => c.color === "black").length, 1);
    compareValues(table.playStatus.chips.filter((c) => c.color === "green").length, 2);
    compareValues(table.playStatus.chips.filter((c) => c.color === "red").length, 1);
    compareValues(table.playStatus.chips.filter((c) => c.color === "gray").length, 149);
    logTestMessage(`${testName}-- TEST FIVE GOOD -- `);
}

function testInvalidChipRequest() {
    
    const testName = `Testing player has plenty of chips, but bet amount does not work out'`;
    logTestMessage(`running ${testName}`);
    const table = Me.testTable();
    player = table.players[0];
    PlayProcessor.setPlayerChips(table, player, 2, 10, 0, 0);
    compareValues(player.chipTotal, 450);
    PlayProcessor.calculateChips(7, player, table);
    compareValues(player.chipTotal, 443);
    compareValues(player.chips.filter((c) => c.color === "black").length, 1);
    compareValues(player.chips.filter((c) => c.color === "green").length, 13);
    compareValues(player.chips.filter((c) => c.color === "red").length, 3);
    compareValues(player.chips.filter((c) => c.color === "gray").length, 3);
    logTestMessage(`${testName}-- TEST ONE GOOD -- `);

    player = table.players[1];
    PlayProcessor.setPlayerChips(table, player, 1, 0, 0, 0);
    compareValues(player.chipTotal, 100);
    PlayProcessor.calculateChips(1, player, table);
    compareValues(player.chipTotal, 99);
    compareValues(player.chips.filter((c) => c.color === "black").length, 0);
    compareValues(player.chips.filter((c) => c.color === "green").length, 3);
    compareValues(player.chips.filter((c) => c.color === "red").length, 4);
    compareValues(player.chips.filter((c) => c.color === "gray").length, 4);
    logTestMessage(`${testName}-- TEST TWO GOOD -- `);

    player = table.players[2];
    PlayProcessor.setPlayerChips(table, player, 0, 2, 0, 0);
    compareValues(player.chipTotal, 50);
    PlayProcessor.calculateChips(1, player, table);
    compareValues(player.chipTotal, 49);
    compareValues(player.chips.filter((c) => c.color === "black").length, 0);
    compareValues(player.chips.filter((c) => c.color === "green").length, 1);
    compareValues(player.chips.filter((c) => c.color === "red").length, 4);
    compareValues(player.chips.filter((c) => c.color === "gray").length, 4);
    logTestMessage(`${testName}-- TEST THREE GOOD -- `);
}


testChipCalculator();
testInvalidChipRequest();

function compareValues(actual, expected) {
    if (expected !== actual) {
        throw new Error(`Expected value of ${expected} does not match actual value ${actual}`);
    }
}

function logTestMessage(msg){
    console.log(`----------------------`);
    console.log(msg);
    console.log(`----------------------`);
}