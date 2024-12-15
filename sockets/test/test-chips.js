const Table = require('../classes/Table');
const Player = require('../classes/Player');
const PlayProcessor = require('../process-play');
const PlayStatus = require('../classes/PlayStatus');
const Chip = require('../classes/Chip');

const numbs = [425,3, 1000, 62, 100000, 88, 23, 50, 654, 385, 833, 888,9,18,25,100000000,11,26];

numbs.forEach ((num ) => {
    const chips = PlayProcessor.parseChips(num);
    console.log(`${num} - ${JSON.stringify(chips)}`);

    const black = chips['black']||0;
    const green = chips['green']||0;
    const red = chips['red']||0;
    const gray = chips['gray']||0;
    let total = black * 100;
    total += green * 25;
    total += red * 5;
    total += gray;
    console.log (`${total} = ${num}`);
    if (total !== num){
        throw new Error ('did not work');
    }
});


