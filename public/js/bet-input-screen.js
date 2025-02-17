const chipColors = [BLACK, GREEN, RED, GRAY];
const id = "bet-input";

function drawBetScreen() {
    destroyById(`table-div`);
    const html = getBetScreenHTML();
    createAndAppendDiv(html, id, true);
    initializeAllSliders();
}

function getBetScreenHTML(id) {
    destroyById(id);
    let html = ``;
    html += `<div id = "${id}" class="betInputScreen">`;
    html += `    <div class="grid-container5x4">`;
    html += `        <div class="grid-item5x4"></div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <div class="svg-container" id ="blackContainer">`;
    html += `               <svg class="svg-column" id="blackColumn" xmlns="http://www.w3.org/2000/svg">`;
    html += `               </svg>`;
    html += `           </div>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <div class="svg-container" id ="greenContainer">`;
    html += `               <svg class="svg-column" id="greenColumn" xmlns="http://www.w3.org/2000/svg">`;
    html += `               </svg>`;
    html += `           </div>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <div class="svg-container" id ="redContainer">`;
    html += `               <svg class="svg-column" id="redColumn" xmlns="http://www.w3.org/2000/svg">`;
    html += `               </svg>`;
    html += `           </div>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <div class="svg-container" id ="grayContainer">`;
    html += `               <svg class="svg-column" id="grayColumn" xmlns="http://www.w3.org/2000/svg">`;
    html += `               </svg>`;
    html += `           </div>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `            Remaining:`;
    html += `            <span id="totalChips">${totalChips}</span>`;
    html += `            Betting:`;
    html += `            <span id="totalBet">0</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <img src="images/chip-black.png" style="width:7vw;height:7vw;"></img>`
    html += `           <span id="black-chipcount">${playerBlackChipCount}</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <img src="images/chip-green.png" style="width:7vw;height:7vw;"></img>`;
    html += `           <span id="green-chipcount">${playerGreenChipCount}</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <img src="images/chip-red.png" style="width:7vw;height:7vw;"></img>`;
    html += `           <span id="red-chipcount">${playerRedChipCount}</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <img src="images/chip-gray.png" style="width:7vw;height:7vw;"></img>`;
    html += `           <span id="gray-chipcount">${playerGrayChipCount}</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `            Call:`;
    html += `            <span id="callAmount">${callAmount}</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <input type="text" class="screenInput" id="black-bet" maxlength="3" size="3" onKeyUp = "onChangeBet(this)">`;
    html += `            <span class="smallitalic">x 100</span><br>`;
    html += `            <span id="black-betval">0</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <input type="text" class="screenInput" id="green-bet" maxlength="3" size="3" onKeyUp = "onChangeBet(this)">`;
    html += `           <span class="smallitalic">x 25</span><br>`;
    html += `           <span id="green-betval">0</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <input type="text" class="screenInput" id="red-bet" maxlength="3" size="3" onKeyUp = "onChangeBet(this)">`;
    html += `           <span class="smallitalic">x 5</span><br>`;
    html += `           <span id="red-betval">0</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <input type="text" class="screenInput" id="gray-bet" maxlength="3" size="3" onKeyUp = "onChangeBet(this)">`;
    html += `           <span class="smallitalic">x 1</span><br>`;
    html += `           <span id="gray-betval">0</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           Raising:`;
    html += `           <span id="totalRaise">0</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <input type="button" id="bet-cancel" value="CANCEL" onClick="cancelBetScreen();">`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <input type="button" id="bet-reset" value="RESET" onClick="resetBet();">`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <input type="button" id="bet-button" ${callAmount > 0 ? "" : "disabled"} value="CALL"  onClick="playerAction('CALL', ${callAmount});" \>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <input type="button" id="bet-bet" value="RAISE" disabled onClick="playerAction('RAISE', buildChipsForBet());">`;
    html += `        </div>`;
    html += `    </div>`;  /// end grid container
    html += `</div>`;

    /// this will not show, but is used for the chip gradients
html +=  `<svg width="0" height="0"><defs>
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
</defs></svg>`;



    return html;
}

function cancelBetScreen() {
    getCurrentTable();
}

function processSliderInput(chipColor, count) {
    chipsChange(chipColor, count);
}

function chipsChange(chipColor, chipBet) {
    let chipMultiplier = 100;// black
    let originalChipCount = playerBlackChipCount;

    if (chipColor === GREEN) {
        originalChipCount = playerGreenChipCount;
        chipMultiplier = 25;
    }
    if (chipColor === RED) {
        originalChipCount = playerRedChipCount;
        chipMultiplier = 5;
    }
    if (chipColor === GRAY) {
        originalChipCount = playerGrayChipCount;
        chipMultiplier = 1;
    }
    const valueOfTheseChips = chipBet * chipMultiplier;
    document.getElementById(`${chipColor}-bet`).value = chipBet;
    document.getElementById(`${chipColor}-betval`).innerHTML = valueOfTheseChips;
    document.getElementById(`${chipColor}-chipcount`).innerHTML = originalChipCount - chipBet;
    const totalBet = calcTotalBet();
    document.getElementById(`totalBet`).innerHTML = totalBet;
    document.getElementById(`totalChips`).innerHTML = totalChips - totalBet;
    const callInt = isNaN(parseInt(callAmount, 10)) ? 0 : parseInt(callAmount, 10)
    const totalRaise = totalBet - callInt;
    if (totalRaise > 0) {
        document.getElementById(`bet-bet`).disabled = false;
        document.getElementById(`totalRaise`).innerHTML = totalRaise;
    } else {
        document.getElementById(`bet-bet`).disabled = true;
        document.getElementById(`totalRaise`).innerHTML = 0;
    }
}

function calcTotalBet() {

    const blackbetval = document.getElementById("black-betval").innerHTML;
    const greenbetval = document.getElementById("green-betval").innerHTML;
    const redbetval = document.getElementById("red-betval").innerHTML;
    const graybetval = document.getElementById("gray-betval").innerHTML;

    let total = parseInt(0, 10);
    if (blackbetval && !isNaN(blackbetval)) {
        total = total + parseInt(blackbetval, 10);
    }
    if (greenbetval && !isNaN(greenbetval)) {
        total = total + parseInt(greenbetval, 10);
    }
    if (redbetval && !isNaN(redbetval)) {
        total = total + parseInt(redbetval, 10);
    }
    if (graybetval && !isNaN(graybetval)) {
        total = total + parseInt(graybetval, 10);
    }
    return total;
}

function buildChipsForBet() {

    let blackbet = document.getElementById("black-bet").value;
    let greenbet = document.getElementById("green-bet").value;
    let redbet = document.getElementById("red-bet").value;
    let graybet = document.getElementById("gray-bet").value;
    if (blackbet === "" || !blackbet || isNaN(blackbet)) {
        blackbet = 0;
    }
    if (greenbet === "" || !greenbet && isNaN(greenbet)) {
        greenbet = 0;
    }
    if (redbet === "" || !redbet && !isNaN(redbet)) {
        redbet = 0;
    }
    if (graybet === "" || !graybet && !isNaN(graybet)) {
        graybet = 0;
    }
    const chips = `[{"color":"black", "count":${blackbet}},{"color":"green","count":${greenbet}},{"color":"red","count":${redbet}},{"color":"gray","count":${graybet}}]`
    return chips;
}

function resetBet() {
    document.getElementById("black-bet").value = "";
    document.getElementById("green-bet").value = "";
    document.getElementById("red-bet").value = "";
    document.getElementById("gray-bet").value = "";

    document.getElementById("black-betval").innerHTML = 0;
    document.getElementById("green-betval").innerHTML = 0;
    document.getElementById("red-betval").innerHTML = 0;
    document.getElementById("gray-betval").innerHTML = 0;

    document.getElementById("black-chipcount").innerHTML = playerBlackChipCount;
    document.getElementById("green-chipcount").innerHTML = playerGreenChipCount;
    document.getElementById("red-chipcount").innerHTML = playerRedChipCount;
    document.getElementById("gray-chipcount").innerHTML = playerGrayChipCount;

    document.getElementById("totalBet").innerHTML = calcTotalBet();
    document.getElementById("totalChips").innerHTML = totalChips;
    document.getElementById(`bet-bet`).disabled = true;
    initializeAllSliders();
}

function onChangeBet(element) {
    const id = element.id;
    const chipColor = id.split("-")[0];
    if (!chipColor || !chipColors.includes(chipColor)) {
        console.log("chip color not known");
        return;
    }

    let val = element.value;
    if (!val) {
        return;
    }

    if (isNaN(val)) {
        element.value = "";
        val = 0;
    }

    if (chipColor === BLACK && val > playerBlackChipCount) {
        console.log("black chip bet more than have");
        element.value = "";
        val = 0;
    }
    if (chipColor === GREEN && val > playerGreenChipCount) {
        console.log("green chip bet more than have");
        element.value = "";
        val = 0;
    }
    if (chipColor === RED && val > playerRedChipCount) {
        console.log("red chip bet more than have");
        element.value = "";
        val = 0;
    }
    if (chipColor === GRAY && val > playerGrayChipCount) {
        console.log("gray chip bet more than have");
        element.value = "";
        val = 0;
    }
    setChipSlider(val, chipColor);
    chipsChange(chipColor, val);
}

function createChips(svgColumn, count, maxCount, color) {
    svgColumn.innerHTML = ''; 
    const containerHeight = svgColumn.parentElement.clientHeight;
    const chipHeight = containerHeight / maxCount; 
    const columnHeight = count * chipHeight;
    svgColumn.setAttribute('height', columnHeight);
    const gradientId = `${color}Gradient`;

    for (let i = 0; i < count; i++) {
        const chip = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        chip.setAttribute('x', 0);
        chip.setAttribute('y', columnHeight - (i + 1) * chipHeight);
        chip.setAttribute('width', '100%');
        chip.setAttribute('height', chipHeight);
        chip.setAttribute('fill', `url(#${gradientId})`); 
        svgColumn.appendChild(chip);
    }
}

const setChipSlider = (count, color) => {
    const svgColumnId = `${color}Column`;
    const svgColumn = document.getElementById(svgColumnId);
    let maxChipCount;
    if (color === BLACK) {
        maxChipCount = isNaN(parseInt(playerBlackChipCount)) ? 0 : parseInt(playerBlackChipCount);
    } else if (color === GREEN) {
        maxChipCount = isNaN(parseInt(playerGreenChipCount)) ? 0 : parseInt(playerGreenChipCount);
    } else if (color === RED) {
        maxChipCount = isNaN(parseInt(playerRedChipCount)) ? 0 : parseInt(playerRedChipCount);
    } else {
        maxChipCount = isNaN(parseInt(playerGrayChipCount)) ? 0 : parseInt(playerGrayChipCount);
    }
    createChips(svgColumn, count, maxChipCount, color);
};

const initializeAllSliders = () => {
    const blackCount = isNaN(parseInt(playerBlackChipCount)) ? 0 : parseInt(playerBlackChipCount);
    const greenCount = isNaN(parseInt(playerGreenChipCount)) ? 0 : parseInt(playerGreenChipCount);
    const redCount = isNaN(parseInt(playerRedChipCount)) ? 0 : parseInt(playerRedChipCount);
    const grayCount = isNaN(parseInt(playerGrayChipCount)) ? 0 : parseInt(playerGrayChipCount);

    initializeSvgColumn(blackCount, BLACK);
    initializeSvgColumn(greenCount, GREEN);
    initializeSvgColumn(redCount, RED);
    initializeSvgColumn(grayCount, GRAY);
};

function initializeSvgColumn(maxChipCount, colorName) {

    const containerId = colorName===BLACK?"blackContainer":colorName===GREEN?"greenContainer":colorName===RED?"redContainer":"grayContainer";
    let  svgContainer = document.getElementById(containerId);

    const svgColumn = svgContainer.querySelector('.svg-column');
    let isDragging = false;
    let startY;
    let initialHeight;
    let currentChipCount = 0;
    createChips(svgColumn, 0, maxChipCount, colorName);

    function handleDrag(e) {
        if (isDragging) {
            const clientY = e.clientY || e.touches[0].clientY;
            const deltaY = startY - clientY;
            const newHeight = initialHeight + deltaY;
            currentChipCount = Math.max(0, Math.min(maxChipCount, Math.round(newHeight / (svgContainer.clientHeight / maxChipCount)))); // Ensure within bounds
            createChips(svgColumn, currentChipCount, maxChipCount, colorName);
        }
    }

    function startDrag(e) {
        isDragging = true;
        startY = e.clientY || e.touches[0].clientY;
        initialHeight = svgColumn.getBoundingClientRect().height;
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('touchmove', handleDrag);
    }

    function stopDrag() {
        if (isDragging) {
            isDragging = false;
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('touchmove', handleDrag);
            processSliderInput(colorName, currentChipCount); 
        }
    }

    function handleClick(e) {
        const clickY = e.clientY || e.touches[0].clientY;
        const svgRect = svgContainer.getBoundingClientRect();
        const clickPosition = clickY - svgRect.top;
        const chipHeight = svgRect.height / maxChipCount;

        // Check if the click is on the filled section (SVG color)
        if (clickPosition > svgRect.height - currentChipCount * chipHeight) {
            currentChipCount = Math.max(0, currentChipCount - 1);
        } else {
            currentChipCount = Math.min(maxChipCount, currentChipCount + 1);
        }

        createChips(svgColumn, currentChipCount, maxChipCount, colorName);
        processSliderInput(colorName, currentChipCount); 
    }

    svgContainer.addEventListener('mousedown', startDrag);
    svgContainer.addEventListener('touchstart', startDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
    svgContainer.addEventListener('click', handleClick);
    svgContainer.addEventListener('touchend', handleClick);
}
