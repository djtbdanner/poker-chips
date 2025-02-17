const drawScreen = (table) => {
    clearAllNodes();
    const id = `table-div`;

    const myTurnPlayer = table.players.find(player => player.turn);
    // const thisPlayerId = document.getElementById(`player-id`).value;
    const thisPlayerId = localStorage.getItem(`player-id`);
    const thisPlayer = table.players.find(player => player.id === thisPlayerId);
    const playStatus = table.playStatus;
    let disabledFold = `disabled`;
    let disabledCheck = `disabled`;
    let disabledCall = `disabled`;
    let disabledRaise = `disabled`;
    // these are global
    playerBlackChipCount = thisPlayer.chips.filter(c => c.color === `black`).length;
    playerGreenChipCount = thisPlayer.chips.filter(c => c.color === `green`).length;
    playerRedChipCount = thisPlayer.chips.filter(c => c.color === `red`).length;
    playerGrayChipCount = thisPlayer.chips.filter(c => c.color === `gray`).length;
    totalChips = thisPlayer.chipTotal;
    callAmount = ``;
    // these are global

    // add name to title
    if (thisPlayer && thisPlayer.name){
        document.title = `Poker Chips - ${thisPlayer.name} ${myTurnPlayer && thisPlayer.id === myTurnPlayer.id ? ` (Your bet)` : ``}`;
    } else {
        document.title = `Poker Chips`;
    }
 
    if (myTurnPlayer && (myTurnPlayer.id === thisPlayerId) && !playStatus.selectWinner && !playStatus.gameOver) {
        disabledFold = ``;
        if (thisPlayer.chipTotal > playStatus.callAmount ){
            disabledRaise = ``;
        }
        // if (playStatus && playStatus.callAmount && playStatus.callAmount > 0) {
        if (playStatus.callAmount  > 0) {
            disabledCall = ``;
            callAmount = playStatus.callAmount<=thisPlayer.chipTotal?playStatus.callAmount:thisPlayer.chipTotal;
        } else {
            disabledCheck = ``;
        }
    }

    // === Build HTML ====/
    let html = ``;
    html += `    <div class="outerContainer">`;
    // === Top Section =====/
    html += `        <div class="topSection">`;
    html += `            <div class="tableContainer">`;
    html += `                   <div class="playerGrid">`;
    // ==== Player divs ======/
    if (table.players.length > 0) {
        for (let i = 0; i < table.players.length; i++) {
            const player = table.players[i];
            let additionalClass = ``;
            if (player.dealer && !playStatus.selectWinner) {
                additionalClass = `playerDealer`;
            }
            if (player.turn) {
                additionalClass = `playerTurn${additionalClass?" "+additionalClass:""}`;
            }
            if (player.folded || player.chipTotal < 1) {
                additionalClass = `playerOut${additionalClass?" "+additionalClass:""}`;
            }
            if (player.allIn) {
                additionalClass = `playerOut${additionalClass?" "+additionalClass:""}`;
            }
            if (!player.isConnected){
                additionalClass = `playerOut${additionalClass?" "+additionalClass:""}`;
            }
            console.log(JSON.stringify(player));
            // === Player div ==== //
            html += `<div id="${player.id}" class="playerDiv ${getPlayerLocationStyle(table, i)} ${additionalClass?additionalClass:''}">`;
            console.log(html);
            html+=generateChipColumnsSVG(player.chips);
            html += `${player.name}:${player.chipTotal}`
            if (playStatus.selectWinner && !thisPlayer.hasVoted && !player.folded) {
                html += `<span id="${player.id}_win" onClick = "voteForWinner('${player.id}')" style="padding-top:5px;" >${getSelectWinnerLogo()}</span>`
            }    
            html += `</div>`;
        }
    }
    //  === Pot Div === /
    if (playStatus.pot > 0){
        html += `    <div class="playerDiv playerPot">POT:${playStatus.pot}`;  
        html += `      <input type = "button" style="display:none;"value="Submit Winner(s)" id="submit-vote-button" onClick = "submitVote()" >`;
        html +=        getPotChipPile(playStatus);
        html += `    </div>`;
    }
    ///////////////////////////////////////////////// GRID CELLS - VISUALIZE THINGS
    // html += getGridLines();
    ///////////////////////////////////////////////// GRID CELLS TO VISUALIZE THINGS
    html += `                   </div>`;
    html += `                   <div class = "pokerTableDiv"></div>`
    html += `                </div>`;
    html += `           </div>`;
    html += `        <div class="middleSection">`;
    html += `           <textarea id="history-text" rows = "4"  readonly>`;
    table.messages.forEach((message) => {
         html += `&#8226; ${message}\r\n`;
     });
    html += `           </textarea>`;
    html += `        </div>`;   
    html += `        <div class="bottomSection">`;
    html += `           <div class="dynamicGrid">`;
    html += `               <div class="grid-item-dynamic">`;
    html += `                   <input type="button" id="options-button" value="..." onclick = "buildMenu()" \>`;
    html += `                   <br>`;
    html += `                   Options`;
    html += `               </div>`;
    html += `               <div class="grid-item-dynamic">`;
    html += `                   <input type="button" id="fold-button" ${disabledCheck} value="&nbsp;&#10004;&nbsp;"  onClick="playerAction('CHECK', 0);" \>`;
    html += `                   <br>`;   
    html += `                   Check`;
    html += `               </div>`;
    html += `               <div class="grid-item-dynamic">`;
    html += `                   <input type="button" id="fold-button" ${disabledFold} value="&nbsp;&#10008;&nbsp;"  onClick="playerAction('FOLD', 0);" \>`;
    html += `                   <br>`;   
    html += `                   Fold`;
    html += `               </div>`;
    html += `               <div class="grid-item-dynamic">`;
    let icon = `&phone;`;
    let text = `Call`;
    if (thisPlayer.chipTotal <= playStatus.callAmount){
        icon= `$$`
        text = `!All In!`
    }                                
    html += `                    <input type="button" id="call-button" ${disabledCall} value="&nbsp;${icon}&nbsp;"  onClick="playerAction('CALL', ${callAmount});" \>`;
    html += `                    <br>`;
    html += `                    ${text} ${callAmount}`;
    html += `               </div>`;
    html += `               <div class="grid-item-dynamic">`;
    html += `                    <input type="button" id="raise-button" ${disabledRaise} value="&nbsp;&#10010;&nbsp;"  onClick="drawBetScreen();" \>`;
    html += `                    <br>`;
    html += `                    Raise`;
    html += `               </div>`;
    html += `           </div>`; // end div for "dynamic grid"
    html += `    </div>`; /// end div for "bottom section"
    createAndAppendDiv(html, id, true);
    scrollText();
    if (thisPlayer.showChipExchangeDiv){
        buildChangeChipsHtml();
    }
};

const scrollText = () => {
    var textarea = document.getElementById('history-text');
    textarea.scrollTop = textarea.scrollHeight;
};

const getPlayerLocationStyle = (table, i) => {
    const count = table.players.length;
    const indexOfThisPlayer = table.players.findIndex((player) => player.id === localStorage.getItem(`player-id`));
    i = i - indexOfThisPlayer;
    if (i < 0) {
        i = (i + count);
    }
    let loc;
    if (count <= 2) {
        if (i === 0) {
            loc = `playerCurrent`;
        }
        if (i === 1) {
            loc = `playerTopCenter`;
        }
        return loc;
    }
    if (count === 3) {
        if (i === 0) {
            loc = `playerCurrent`;
        }
        if (i === 1) {
            loc = `playerTopCenter`;
        }
        if (i === 2) {
            loc = `playerRightCenter`;
        }
        return loc;
    }
    if (count === 4) {
        if (i === 0) {
            loc = `playerCurrent`;
        }
        if (i === 1) {
            loc = `playerLeftCenter`;
        }
        if (i === 2) {
            loc = `playerTopCenter`;
        }
        if (i === 3) {
            loc = `playerRightCenter`;
        }
        return loc;
    }
    if (count === 5) {
        if (i === 0) {
            loc = `playerCurrent`;
        }
        if (i === 1) {
            loc = `playerLeftCenter`;
        }
        if (i === 2) {
            loc = `playerTopLeft`;
        }
        if (i === 3) {
            loc = `playerTopRight`;
        }
        if (i === 4) {
            loc = `playerRightCenter`;
        }
        return loc;
    }
    if (count === 6) {
        if (i === 0) {
            loc = `playerCurrent`;
        }
        if (i === 1) {
            loc = `playerLeftCenter`;
        }
        if (i === 2) {
            loc = `playerTopLeft`;
        }
        if (i === 3) {
            loc = `playerTopRight`;
        }
        if (i === 4) {
            loc = `playerRightTop`;
        }
        if (i === 5) {
            loc = `playerRightBottom`;
        }
        return loc;
    }
    if (count === 7) {
        if (i === 0) {
            loc = `playerCurrent`;
        }
        if (i === 1) {
            loc = `playerLeftBottom`;
        }
        if (i === 2) {
            loc = `playerLeftTop`;
        }
        if (i === 3) {
            loc = `playerTopLeft`;
        }
        if (i === 4) {
            loc = `playerTopRight`;
        }
        if (i === 5) {
            loc = `playerRightTop`;
        }
        if (i === 6) {
            loc = `playerRightBottom`;
        }
        return loc;
    }
    if (count === 8) {
        if (i === 0) {
            loc = `playerCurrent`;
        }
        if (i === 1) {
            loc = `playerLeftBottom`;
        }
        if (i === 2) {
            loc = `playerLeftTop`;
        }
        if (i === 3) {
            loc = `playerTopLeft`;
        }
        if (i === 4) {
            loc = `playerTopRight`;
        }
        if (i === 5) {
            loc = `playerRightTop`;
        }
        if (i === 6) {
            loc = `playerRightCenter`;
        }
        if (i === 7) {
            loc = `playerRightBottom`;
        }
        return loc;
    }
    if (count === 9) {
        if (i === 0) {
            loc = `playerCurrent`;
        }
        if (i === 1) {
            loc = `playerLeftBottom`;
        }
        if (i === 2) {
            loc = `playerLeftCenter`;
        }
        if (i === 3) {
            loc = `playerLeftTop`;
        }
        if (i === 4) {
            loc = `playerTopLeft`;
        }
        if (i === 5) {
            loc = `playerTopRight`;
        }
        if (i === 6) {
            loc = `playerRightTop`;
        }
        if (i === 7) {
            loc = `playerRightCenter`;
        }
        if (i === 8) {
            loc = `playerRightBottom`;
        }
        return loc;
    }
};

const winnerIds = [];
const voteForWinner = (playerId) => {
    const voteButton = document.getElementById(`submit-vote-button`);
    const playerWinDiv = document.getElementById(`${playerId}_win`);

    if (winnerIds.includes(playerId)){
        playerWinDiv.innerHTML = getSelectWinnerLogo();
        winnerIds.splice(winnerIds.indexOf(playerId),1);
        if (winnerIds.length < 1){
            voteButton.style.display = "none";
        }
        return;
    }
    playerWinDiv.innerHTML = getWinnerLogo();
    voteButton.style.display = "block";
    winnerIds.push(playerId);
 };

const submitVote = () => {  
    choseRoundWinner(winnerIds.join(`,`));
    winnerIds.length = 0;
};

const getWinnerLogo = () => {
    let html = '';
    html += `<svg id="winner-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="24" height="24">`;
    html += `    <circle cx="26" cy="26" r="25" fill="none" stroke="white" stroke-width="5"/>`;
    html += `    <path fill="none" stroke="white" stroke-width="5" d="M14 27l7 7 16-16"/>`;
    html += `</svg>`;
    return html;
};

const getSelectWinnerLogo = () => {
    let html = '';
    html += `<svg id="select-winner-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="24" height="24">`;
    html += `    <circle cx="26" cy="26" r="25" fill="none" stroke="white" stroke-width="5"/>`;
    html += `</svg>`;
    return html;
};

const getPotChipPile = (playStatus) => {
    const lastPotAmount = localStorage.getItem(`pot`);
    if (parseInt(lastPotAmount, 10) === parseInt(playStatus.pot, 10)){
        const theExistingPile = localStorage.getItem(`chip-pile`);
        if (theExistingPile){
            return theExistingPile;
        }
    }
    const theNewPile = generateChipPileSVG(playStatus.chips);
    playPokerChipSound();
    localStorage.setItem(`pot`, playStatus.pot);
    localStorage.setItem(`chip-pile`, theNewPile);
    return theNewPile;
};

const generateChipPileSVG = (theChips) => {

    const blacks = theChips.filter(c => c.color === BLACK).length;
    const greens = theChips.filter(c => c.color === GREEN).length;
    const reds = theChips.filter(c => c.color === RED).length;
    const grays = theChips.filter(c => c.color === GRAY).length;


    const chipValues = [
        { color: BLACK, count: blacks, label: '100', strokecolor: BLACK_CHIP_COLOR },
        { color: GREEN, count: greens, label: '25', strokecolor: GREEN_CHIP_COLOR },
        { color: RED, count: reds, label: '5', strokecolor: RED_CHIP_COLOR},
        { color: GRAY, count: grays, label: '1', strokecolor: GRAY_CHIP_COLOR },
    ];

    let chips = [];

    chipValues.forEach(chip => {
        for (let i = 0; i < chip.count; i++) {
            chips.push(chip);
        }
    });

    console.log(`The chips - ${JSON.stringify(chips)}`);
    let svg = '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">';
    chips.forEach((chip) => {
        const x = 50 + (Math.random() * 40 - 20); // Random x position within a range
        const y = 50 + (Math.random() * 40 - 20); // Random y position within a range
        const rotation = Math.random() * 360; // Random rotation

        // Group the chip elements
        svg += `<g transform="translate(${x}, ${y}) rotate(${rotation})">`;

        // Draw the chip
        svg += `<circle cx="0" cy="0" r="15" fill="${chip.strokecolor}" stroke="white" stroke-width="1.5"/>`;

        // Draw the inner circle
        svg += `<circle cx="0" cy="0" r="9" fill="none" stroke="white" stroke-width="1.5"/>`;

        // Draw pie-cut lines
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45) * (Math.PI / 180); // Convert degrees to radians
            const x1 = 9 * Math.cos(angle);
            const y1 = 9 * Math.sin(angle);
            const x2 = 15 * Math.cos(angle);
            const y2 = 15 * Math.sin(angle);
            svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="white" stroke-width="1.5"/>`;
        }

        // Add the number to the chip
        svg += `<text x="0" y="1" font-size="7" fill="white" text-anchor="middle" alignment-baseline="middle">${chip.label}</text>`;

        // Close the group
        svg += `</g>`; });
    svg += '</svg>';

    return svg;
};

const generateChipColumnsSVG = (theChips) => {

    const blacks = theChips.filter(c => c.color === BLACK).length;
    const greens = theChips.filter(c => c.color === GREEN).length;
    const reds = theChips.filter(c => c.color === RED).length;
    const grays = theChips.filter(c => c.color === GRAY).length;

    const chipValues = [
        { color: BLACK, count: blacks, label: '100', strokecolor: BLACK_CHIP_COLOR },
        { color: GREEN, count: greens, label: '25', strokecolor: GREEN_CHIP_COLOR },
        { color: RED, count: reds, label: '5', strokecolor: RED_CHIP_COLOR },
        { color: GRAY, count: grays, label: '1', strokecolor:GRAY_CHIP_COLOR },
    ];

    let svg = '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">';
   
     
    // Add a temporary border around the SVG
    // svg += '<rect x="0" y="0" width="100" height="100" stroke="blue" fill="none" stroke-width="2"/>';
   
    const columnWidth = 25;
    const chipHeight = 3; 
    const maxChips = 26; // Maximum number of chips to display

    // Define gradients for shading
    svg += `
        <defs>
            <linearGradient id="blackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${BLACK_CHIP_COLOR_HIGHLIGHT};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${BLACK_CHIP_COLOR};stop-opacity:1" />
            </linearGradient>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${GREEN_CHIP_COLOR_HIGHLIGHT};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${GREEN_CHIP_COLOR};stop-opacity:1" />
            </linearGradient>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${RED_CHIP_COLOR_HIGHLIGHT};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${RED_CHIP_COLOR};stop-opacity:1" />
            </linearGradient>
            <linearGradient id="grayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${GRAY_CHIP_COLOR_HIGHLIGHT};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${GRAY_CHIP_COLOR};stop-opacity:1" />
            </linearGradient>
        </defs>
    `;

    chipValues.forEach((chip, columnIndex) => {
        const x = columnWidth * columnIndex;
        const height = Math.min(chip.count, maxChips) * chipHeight;
        const y = 90 - height;

        // Determine the gradient to use
        let gradientId;
        switch (chip.color) {
            case BLACK:
                gradientId = 'blackGradient';
                break;
            case GREEN:
                gradientId = 'greenGradient';
                break;
            case RED:
                gradientId = 'redGradient';
                break;
            case GRAY:
                gradientId = 'grayGradient';
                break;
        }

        // Draw the column with gradient fill
          svg += `<rect x="${x}" y="${y}" width="${columnWidth -1}" height="${height}" fill="url(#${gradientId})" rx="1" ry="1"/>`;;

        // Draw divider lines for each chip
        for (let i = 1; i < Math.min(chip.count, maxChips); i++) {
            const lineY = y + i * chipHeight;
            svg += `<line x1="${x}" y1="${lineY}" x2="${x + columnWidth - 1}" y2="${lineY}" stroke="black" stroke-width="0.6"/>`;
        }

        // Add ellipsis if there are more than maxChips
        if (chip.count > maxChips) {
            svg += `<text x="${x + (columnWidth - 1) / 2}" y="${y - 5}" font-size="25" fill="${chip.strokecolor}" text-anchor="middle">...</text>`;
        }
        // Add an arrow up icon if the stack exceeds the maximum number of chips displayed
        if (chip.count > maxChips) {
            svg += `<text x="${x + columnWidth / 2}" y="${y - 5}" font-size="10" text-anchor="middle" fill="white">&#9650;</text>`; // Unicode for up arrow
        }


        // Add the label at the bottom of the column with the actual number of chips
        svg += `<text x="${x + (columnWidth - 1) / 2}" y="95" font-size="15" fill="white" text-anchor="middle">${chip.count}</text>`;
    });
    svg += '</svg>';

    return svg;
};

const playPokerChipSound = () => {
    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create a buffer for the sound
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Fill the buffer with white noise
    for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    // Create a buffer source
    const bufferSource = audioContext.createBufferSource();
    bufferSource.buffer = buffer;

    // Create a gain node to control the volume
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    // Connect the buffer source to the gain node and the gain node to the audio context
    bufferSource.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start the buffer source
    bufferSource.start();
};

const getGridLines = () => {
    let html = ``;
    html += `    <div class="playerGrid">`;
    html += `        <div class="grid-cell">1</div>`;
    html += `        <div class="grid-cell">2</div>`;
    html += `        <div class="grid-cell">3</div>`;
    html += `        <div class="grid-cell">4</div>`;
    html += `        <div class="grid-cell">5</div>`;
    html += `        <div class="grid-cell">6</div>`;
    html += `        <div class="grid-cell">7</div>`;
    html += `        <div class="grid-cell">8</div>`;
    html += `        <div class="grid-cell">9</div>`;
    html += `        <div class="grid-cell">10</div>`;
    html += `        <div class="grid-cell">11</div>`;
    html += `        <div class="grid-cell">12</div>`;
    html += `        <div class="grid-cell">13</div>`;
    html += `        <div class="grid-cell">14</div>`;
    html += `        <div class="grid-cell">15</div>`;
    html += `        <div class="grid-cell">16</div>`;
    html += `        <div class="grid-cell">17</div>`;
    html += `        <div class="grid-cell">18</div>`;
    html += `        <div class="grid-cell">19</div>`;
    html += `        <div class="grid-cell">20</div>`;
    html += `        <div class="grid-cell">21</div>`;
    html += `        <div class="grid-cell">22</div>`;
    html += `        <div class="grid-cell">23</div>`;
    html += `        <div class="grid-cell">24</div>`;
    html += `        <div class="grid-cell">25</div>`;
    html += `        <div class="grid-cell">26</div>`;
    html += `        <div class="grid-cell">27</div>`;
    html += `        <div class="grid-cell">28</div>`;
    html += `        <div class="grid-cell">29</div>`;
    html += `        <div class="grid-cell">30</div>`;
    html += `        <div class="grid-cell">31</div>`;
    html += `        <div class="grid-cell">32</div>`;
    html += `        <div class="grid-cell">33</div>`;
    html += `        <div class="grid-cell">34</div>`;
    html += `        <div class="grid-cell">35</div>`;
    html += `        <div class="grid-cell">36</div>`;
    html += `        <div class="grid-cell">37</div>`;
    html += `        <div class="grid-cell">38</div>`;
    html += `        <div class="grid-cell">39</div>`;
    html += `        <div class="grid-cell">40</div>`;
    html += `        <div class="grid-cell">41</div>`;
    html += `        <div class="grid-cell">42</div>`;
    html += `        <div class="grid-cell">43</div>`;
    html += `        <div class="grid-cell">44</div>`;
    html += `        <div class="grid-cell">45</div>`;
    html += `        <div class="grid-cell">46</div>`;
    html += `        <div class="grid-cell">47</div>`;
    html += `        <div class="grid-cell">48</div>`;
    html += `        <div class="grid-cell">49</div>`;
    html += `        <div class="grid-cell">50</div>`;
    html += `        <div class="grid-cell">51</div>`;
    html += `        <div class="grid-cell">52</div>`;
    html += `        <div class="grid-cell">53</div>`;
    html += `        <div class="grid-cell">54</div>`;
    html += `        <div class="grid-cell">55</div>`;
    html += `        <div class="grid-cell">56</div>`;
    html += `        <div class="grid-cell">57</div>`;
    html += `        <div class="grid-cell">58</div>`;
    html += `        <div class="grid-cell">59</div>`;
    html += `        <div class="grid-cell">60</div>`;
    html += `        <div class="grid-cell">61</div>`;
    html += `        <div class="grid-cell">62</div>`;
    html += `        <div class="grid-cell">63</div>`;
    html += `    </div>`;
    return html;
};