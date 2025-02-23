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

    html += getSVGchipGradients();
    html += getSVGArrowGradsAndShads();

    html += `<div id = "${id}" class="addedInputScreen">`;
    html += `    <div class="grid-container5x4">`;
    html += `        <div class="grid-item5x4">`;
    html += `           <div class="svg-container-border" id ="blackContainer">`;
    html += `               <svg class="svg-column" id="blackColumn" xmlns="http://www.w3.org/2000/svg">`;
    html += `               </svg>`;
    html += `           </div>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <div class="svg-container-border" id ="greenContainer">`;
    html += `               <svg class="svg-column" id="greenColumn" xmlns="http://www.w3.org/2000/svg">`;
    html += `               </svg>`;
    html += `           </div>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <div class="svg-container-border" id ="redContainer">`;
    html += `               <svg class="svg-column" id="redColumn" xmlns="http://www.w3.org/2000/svg">`;
    html += `               </svg>`;
    html += `           </div>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <div class="svg-container-border" id ="grayContainer">`;
    html += `               <svg class="svg-column" id="grayColumn" xmlns="http://www.w3.org/2000/svg">`;
    html += `               </svg>`;
    html += `           </div>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <svg width="6vh" height="3vh" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;" id="${BLACK}-up" onClick="sumColor('${BLACK}', 1)"  >`; 
    html += `               <polygon points="20,300 580,300 300,75" fill="${BLACK_CHIP_COLOR}" filter="url(#blurFilter_x)"/>`;
    html += `           </svg>`;
    html += `           ${createSVGChip(BLACK_CHIP_COLOR,"6vh", 100 )}`;
    html += `           <svg width="6vh" height="3vh" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;" id="${BLACK}-down" onClick="sumColor('${BLACK}', -1)">`; 
    html += `               <polygon points="20,0 580,0 300,225" fill="${BLACK_CHIP_COLOR}" filter="url(#blurFilter_x)"/>`;
    html += `           </svg>`;    
    html += `           <span id="black-chipcount">${playerBlackChipCount}</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <svg width="6vh" height="3vh" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;" id="${GREEN}-up" onClick="sumColor('${GREEN}', 1)"  >`; 
    html += `               <polygon points="20,300 580,300 300,75" fill="${GREEN_CHIP_COLOR}" filter="url(#blurFilter_x)"/>`;
    html += `           </svg>`;
    html += `           ${createSVGChip(GREEN_CHIP_COLOR,"6vh", 25 )}`;
    html += `           <svg width="6vh" height="3vh" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;" id="${GREEN}-down" onClick="sumColor('${GREEN}', -1)">`; 
    html += `               <polygon points="20,0 580,0 300,225" fill="${GREEN_CHIP_COLOR}" filter="url(#blurFilter_x)"/>`;
    html += `           </svg>`;
    html += `           <span id="green-chipcount">${playerGreenChipCount}</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <svg width="6vh" height="3vh" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;" id="${RED}-up" onClick="sumColor('${RED}', 1)"  >`; 
    html += `               <polygon points="20,300 580,300 300,75" fill="${RED_CHIP_COLOR}" filter="url(#blurFilter_x)"/>`;
    html += `           </svg>`;
    html += `           ${createSVGChip(RED_CHIP_COLOR,"6vh", 5 )}`;
    html += `           <svg width="6vh" height="3vh" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;" id="${RED}-down" onClick="sumColor('${RED}', -1)">`; 
    html += `               <polygon points="20,0 580,0 300,225" fill="${RED_CHIP_COLOR}" filter="url(#blurFilter_x)"/>`;
    html += `           </svg>`;
    html += `           <span id="red-chipcount">${playerRedChipCount}</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <svg width="6vh" height="3vh" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;" id="${GRAY}-up" onClick="sumColor('${GRAY}', 1)"  >`; 
    html += `               <polygon points="20,300 580,300 300,75" fill="${GRAY_CHIP_COLOR}" filter="url(#blurFilter_x)"/>`;
    html += `           </svg>`;
    html += `           ${createSVGChip(GRAY_CHIP_COLOR,"6vh", 1 )}`;
    html += `           <svg width="6vh" height="3vh" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;" id="${GRAY}-down" onClick="sumColor('${GRAY}', -1)">`; 
    html += `               <polygon points="20,0 580,0 300,225" fill="${GRAY_CHIP_COLOR}" filter="url(#blurFilter_x)"/>`;
    html += `           </svg>`;
    html += `           <span id="gray-chipcount">${playerGrayChipCount}</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <input type="text" class="addedInputScreenInput" id="black-bet" maxlength="3" size="3" onKeyUp = "onChangeBet(this)">`;
    html += `            <span class="smallitalic">x 100</span><br>`;
    html += `            <span id="black-betval">0</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <input type="text" class="addedInputScreenInput" id="green-bet" maxlength="3" size="3" onKeyUp = "onChangeBet(this)">`;
    html += `           <span class="smallitalic">x 25</span><br>`;
    html += `           <span id="green-betval">0</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <input type="text" class="addedInputScreenInput" id="red-bet" maxlength="3" size="3" onKeyUp = "onChangeBet(this)">`;
    html += `           <span class="smallitalic">x 5</span><br>`;
    html += `           <span id="red-betval">0</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <input type="text" class="addedInputScreenInput" id="gray-bet" maxlength="3" size="3" onKeyUp = "onChangeBet(this)">`;
    html += `           <span class="smallitalic">x 1</span><br>`;
    html += `           <span id="gray-betval">0</span>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <input type="button" id="bet-cancel" class="mainButton" value="CANCEL" onClick="cancelBetScreen();">`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <input type="button" id="bet-reset" class="mainButton" value="RESET" onClick="resetBet();">`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <input type="button" id="bet-button" class="mainButton" ${callAmount > 0 ? "" : "disabled"} value="CALL"  onClick="playerAction('CALL', ${callAmount});" \>`;
    html += `        </div>`;
    html += `        <div class="grid-item5x4">`;
    html += `           <input type="button" id="bet-bet" class="mainButton" value="${callAmount > 0 ? "RAISE" : "BET"}" disabled onClick="playerAction('RAISE', buildChipsForBet());">`;
    html += `        </div>`;
    if(callAmount > 0){
        html += `        <div class="grid-item5x4">`;
        html += `            Total Bet:`;
        html += `            <span id="totalBet">0</span>`;
        html += `        </div>`;
        html += `        <div class="grid-item5x4">`;
        html += `            Remaining Chips:`;
        html += `            <span id="totalChips">${totalChips}</span>`;
        html += `        </div>`;
        html += `        <div class="grid-item5x4">`;
        html += `            Call:`;
        html += `            <span id="callAmount">${callAmount}</span>`;
        html += `        </div>`;
        html += `        <div class="grid-item5x4">`;
        html += `            Amount Raised:`;
        html += `            <span id="totalRaise">0</span>`;   
        html += `        </div>`;
    } else {
        html += `        <div class="grid-item5x4">`;
        html += `        </div>`;
        html += `        <div class="grid-item5x4">`;
        html += `            Remaining Chips:`;
        html += `            <span id="totalChips">${totalChips}</span>`;
        html += `        </div>`;
        html += `        <div class="grid-item5x4">`;
        html += `            No Call`;
        html += `        </div>`;
        html += `        <div class="grid-item5x4">`;
        html += `            Total Bet:`;
        html += `            <span id="totalBet">0</span>`;
        html += `        </div>`;
    }
    html += `    </div>`;  /// end grid container
    html += `</div>`;
    return html;
}

const cancelBetScreen =  () => {
    getCurrentTable();
};

const processSliderInput = (chipColor, count) => {
    chipsChange(chipColor, count);
};

const chipsChange = (chipColor, chipBet) => {
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
    if (callAmount > 0){
        document.getElementById(`totalRaise`).innerHTML = totalRaise;
    }
    if (totalRaise > 0) {
        document.getElementById(`bet-bet`).disabled = false;
    } else {
        document.getElementById(`bet-bet`).disabled = true;
    }
};

const calcTotalBet = () => {
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
};

const buildChipsForBet = () => {

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
};

const resetBet = () => {
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

const sumColor = (color, val) => {
    let currentChipsBet = document.getElementById(`${color}-bet`).value;
    currentChipsBet = isNaN(parseInt(currentChipsBet, 10))?0:parseInt(parseInt(currentChipsBet, 10));
    currentChipsBet = currentChipsBet+val;
    const maxBetForThisColor = color===BLACK?playerBlackChipCount:color===GREEN?playerGreenChipCount:color===RED?playerRedChipCount:color===GRAY?playerGrayChipCount:-1;
    if (maxBetForThisColor < 0){
        throw new Error("invalid color passed");
    }

    if (currentChipsBet > maxBetForThisColor || currentChipsBet < 0){
        return;
    }

    setChipSlider(currentChipsBet, color);
    chipsChange(color, currentChipsBet);
};

const onChangeBet = (element) => {
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
};

const createChips = (svgColumn, count, maxCount, color) => {
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
};

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

const initializeSvgColumn = (maxChipCount, colorName) => {

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
        const clickedElement = e.target; 
        if (clickedElement.tagName === 'rect') {
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
