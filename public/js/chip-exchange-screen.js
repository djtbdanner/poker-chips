function buildChangeChipsHtml() {
    const id = `chip-change`;
    destroyById(id);
    let html = ``;
    html += `    <div id="${id}" class="addedInputScreen">`;   
    html += `        <div class="grid-container">`;
    html += `            <div class="grid-item">`;
    html += `               <div class="svg-container" id ="blackContainer">`;
    html += `                   <svg class="svg-column" id="blackColumn" xmlns="http://www.w3.org/2000/svg"></svg>`;
    html += `               </div>`;
    html += `            </div>`;
    html += `            <div class="grid-item">`;
    html += `               <div class="svg-container" id ="greenContainer">`;
    html += `                   <svg class="svg-column" id="greenColumn" xmlns="http://www.w3.org/2000/svg"></svg>`;
    html += `               </div>`;
    html += `            </div>`;
    html += `            <div class="grid-item">`;
    html += `               <div class="svg-container" id ="redContainer">`;
    html += `                   <svg class="svg-column" id="redColumn" xmlns="http://www.w3.org/2000/svg"></svg>`;
    html += `               </div>`;
    html += `            </div>`;
    html += `            <div class="grid-item">`;
    html += `               <div class="svg-container" id ="grayContainer">`;
    html += `                   <svg class="svg-column" id="grayColumn" xmlns="http://www.w3.org/2000/svg"></svg>`;
    html += `               </div>`;
    html += `            </div>`;
    html += `           <div class="grid-item">`;
    html += `               <div class="horizontal-container">`;
    html +=                     getEmptySVG();
    html += `                   ${createSVGChip(BLACK_CHIP_COLOR,"7vw", 100)}`;
    if (playerBlackChipCount > 0) {
    html += `                    <svg width="4vw" height="7vw" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;" onClick="pokerChipDenominationChange(BLACK,GREEN)">`; 
    html += `                       <polygon points="0,0 0,100 50,50" fill="url(#blackToGreen)" filter="url(#blurFilter)" style="stroke:black;stroke-width:1;stroke-linejoin:round;"/>`;
    html += `                   </svg>`;
    } else {
    html +=                     getEmptySVG();      
    }  
    html += `               </div>`;
    html += `               ${playerBlackChipCount} (${playerBlackChipCount * 100})`;
    html += `           </div>`;
    html += `           <div class="grid-item">`;
    html += `               <div class="horizontal-container">`;
    if(playerGreenChipCount > 4) {
    html += `                    <svg width="4vw" height="7vw" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;" onClick="pokerChipDenominationChange(GREEN,BLACK)">`; 
    html += `                       <polygon points="50,50 100,0 100,100"  fill="url(#blackToGreen)" filter="url(#blurFilter)" style="stroke:black;stroke-width:1;stroke-linejoin:round;"/>`;
    html += `                   </svg>`;
    } else {
    html +=                     getEmptySVG();      
    }  
    html += `                   ${createSVGChip(GREEN_CHIP_COLOR,"7vw", 25)}`;
    if (playerGreenChipCount > 0) {
    html += `                    <svg width="4vw" height="7vw" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;" onClick="pokerChipDenominationChange(GREEN,RED)">`; 
    html += `                       <polygon points="0,0 0,100 50,50" fill="url(#greenToRed)" filter="url(#blurFilter)" style="stroke:black;stroke-width:1;stroke-linejoin:round;"/>`;
    html += `                   </svg>`;
    } else {
    html +=                     getEmptySVG();      
    }      
    html += `               </div>`;
    html += `               ${playerGreenChipCount} (${playerGreenChipCount * 25})`;
    html += `           </div>`;
    html += `           <div class="grid-item">`;
    html += `               <div class="horizontal-container">`;
    if (playerRedChipCount > 5) {
    html += `                    <svg width="4vw" height="7vw" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;" onClick="pokerChipDenominationChange(RED,GREEN)">`; 
    html += `                       <polygon points="50,50 100,0 100,100"  fill="url(#greenToRed)" filter="url(#blurFilter)" style="stroke:black;stroke-width:1;stroke-linejoin:round;"/>`;
    html += `                   </svg>`;
    } else {
    html +=                     getEmptySVG();      
    }   
    html += `                   ${createSVGChip(RED_CHIP_COLOR,"7vw", 5)}`;
    if (playerRedChipCount > 0) {
    html += `                    <svg width="4vw" height="7vw" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;" onClick="pokerChipDenominationChange(RED,GRAY)">`; 
    html += `                       <polygon points="0,0 0,100 50,50" fill="url(#redToGray)" filter="url(#blurFilter)" style="stroke:black;stroke-width:1;stroke-linejoin:round;"/>`;
    html += `                   </svg>`;
    } else {
    html +=                     getEmptySVG();      
    }
    html += `               </div>`;
    html += `               ${playerRedChipCount} (${playerRedChipCount * 5})`;
    html += `           </div>`;
    html += `           <div class="grid-item">`
    html += `               <div class="horizontal-container">`;
    if (playerGrayChipCount > 5) {
    html += `                   <svg width="4vw" height="7vw" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"  style="cursor:pointer;" onClick="pokerChipDenominationChange(GRAY,RED)">`; 
    html += `                       <polygon points="50,50 100,0 100,100" fill="url(#redToGray)" filter="url(#blurFilter)" style="stroke:black;stroke-width:1;stroke-linejoin:round;"/>`;
    html += `                   </svg>`;
    html += `                   </svg>`;   
    } else {
    html +=                     getEmptySVG();
    }
    html += `                   ${createSVGChip(GRAY_CHIP_COLOR,"7vw", 1 )}`;
    html +=                     getEmptySVG();
    html += `               </div>`;
    html += `               ${playerGrayChipCount}`
    html += `            </div>`;
    html += `            <div class="grid-item hr-item">`;
    html += `                <input type="button" value="DONE" class="stInputDefaultcolor" onClick="pokerChipDenominationQuit()"></input>`;
    html += `            </div>`;
    html += `       </div>`;
    html += `    </div>`;
    html += getSVGchipGradients();
    html += getSVGArrowGradsAndShads();
    createAndAppendDiv(html, id, false);
    initializeChipColumns();
}

const getEmptySVG =() =>{
    return `                    <svg width="4vw" height="7vw" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"/>`;
};

const setChips = (svgColumn, count, maxCount, color) => {
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

const initializeColumn = (maxChipCount, colorName) => {
    const containerId = colorName===BLACK?"blackContainer":colorName===GREEN?"greenContainer":colorName===RED?"redContainer":"grayContainer";
    let  svgContainer = document.getElementById(containerId);
    const columnId = colorName===BLACK?"blackColumn":colorName===GREEN?"greenColumn":colorName===RED?"redColumn":"grayColumn";
    const svgColumn = document.getElementById(columnId);
    setChips(svgColumn, maxChipCount, 100, colorName);

    const from = colorName===BLACK?GREEN:colorName===GREEN?RED:colorName===RED?GRAY:RED;
    const to = colorName;


    function handleClick(e) {
        const tagName = e.target.tagName;
        console.log(e.target.tagName);
        if (tagName && tagName.toLowerCase() != 'div'){
            pokerChipDenominationChange(to,from);
        } else {
            pokerChipDenominationChange(from,to);
        }
    }

    svgContainer.addEventListener('click', handleClick);
};

const initializeChipColumns = () => {
    const blackCount = isNaN(parseInt(playerBlackChipCount)) ? 0 : parseInt(playerBlackChipCount);
    const greenCount = isNaN(parseInt(playerGreenChipCount)) ? 0 : parseInt(playerGreenChipCount);
    const redCount = isNaN(parseInt(playerRedChipCount)) ? 0 : parseInt(playerRedChipCount);
    const grayCount = isNaN(parseInt(playerGrayChipCount)) ? 0 : parseInt(playerGrayChipCount);

    initializeColumn(blackCount, BLACK);
    initializeColumn(greenCount, GREEN);
    initializeColumn(redCount, RED);
    initializeColumn(grayCount, GRAY);
};

