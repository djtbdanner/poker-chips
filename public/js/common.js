/// global - all screens
let playerBlackChipCount = 0;
let playerGreenChipCount = 0;
let playerRedChipCount = 0;
let playerGrayChipCount = 0;
let totalChips = 0;
let currentBetAmount = 0;
let callAmount = 0;

const BLACK_CHIP_COLOR = 'rgb(0, 0, 0)' ;
const GREEN_CHIP_COLOR = 'rgb(45,102,33)' ;
const RED_CHIP_COLOR = 'rgb(183,40,32)' ;
const GRAY_CHIP_COLOR = 'rgb(112,110,110)' ;

const GRAY_CHIP_COLOR_HIGHLIGHT = `rgb(207, 203, 203)`;
const RED_CHIP_COLOR_HIGHLIGHT = `rgb(240, 104, 104)`;
const GREEN_CHIP_COLOR_HIGHLIGHT = `rgb(145, 207, 145)`;
const BLACK_CHIP_COLOR_HIGHLIGHT = `rgb(165, 163, 163)`;

const BLACK = 'black';
const GREEN  = 'green';
const RED = 'red';
const GRAY = 'gray';
////

function createAndAppendDiv(html, id, isFullScreen) {
    let div = document.getElementById(id);
    if (!div) {
        div = document.createElement(`div`);
        div.id = id;
    }
    if (isFullScreen) {
        div.style.width = `100%`;
        div.style.height = `100%`;
    }
    div.innerHTML = html;
    document.body.appendChild(div);
}

function destroyNode(node) {
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
}

function destroyById(id) {
    let node = document.getElementById(id);
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
}

// async function buildMenu() {
//     destroyById(`menu`);
//     let html = ``;
//     html += `<div id="menu" class="menu" onClick="destroyById('menu')">`;
//     if (!document.fullscreenElement) {
//         html += `<a class ="menuItem" onClick="openFullScreen();">FullScreen</a></br>`;
//         html += `<hr>`;
//     } else {
//         html += `<a class ="menuItem" onClick="closeFullscreen();">Exit FullScreen</a></br>`;
//         html += `<hr>`;
//     }
//     html += `<a class ="menuItem" onclick = "buildChangeChipsHtml()">Change Chip Denomination </a></br>`;
//     html += `<hr>`;
//     // html += `<a class ="menuItem">Sit out/Return </a></br>`;
//     // html += `<hr>`;
//     html += `<a class ="menuItem" onclick = "removePlayer()">Leave table</a></br>`;
//     html += `<hr>`;
//     html += `<a class ="menuItem">Close...</a></br>`;
//     html += `</div>`;
//     createAndAppendDiv(html, 'default', false);
//     let optionsButton = document.getElementById('options-button');
//     let optionsTextRectangle = optionsButton.getBoundingClientRect();
//     let optionsLeft = parseInt(optionsTextRectangle.left, 10);
//     let optionsBotton = parseInt(optionsTextRectangle.bottom, 10);
//     let menu = document.getElementById('menu');
//     let heightOfMenu = menu.offsetHeight;
//     menu.style.top = `${optionsBotton - heightOfMenu}px`;
//     menu.style.left = `${optionsLeft}px`;

// }

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function openFullScreen() {
    var root = document.documentElement;
    if (root.requestFullscreen) {
        root.requestFullscreen();
    } else if (root.webkitRequestFullscreen) {
        root.webkitRequestFullscreen();
    } else if (root.msRequestFullscreen) {
        root.msRequestFullscreen();
    }
}

async function modalMessage(message) {
    const id = `modal-message`;
    destroyById(id);
    let html = ``;
    html += `<div id="modal-message" class="modalOuterDiv" onClick="destroyById('${id}')">`;
    html += `<div id="modal-message-inner" class="modalInnerDiv" onClick="destroyById('${id}')">`;
    html += `<table cellpadding="0" cellspacing="0" width="100%" border="0">`;
    html += `<tr><td colspan="2" style = "text-align:center;">`;
    html += `<p>${message}</p>`;
    html += `</td></tr>`;
    html += `<tr><td style = "text-align:center;">`;
    html += `<input type="button" value="-&nbsp;OK&nbsp;-" class = "stInputDefaultcolor" onClick="destroyById('modal-message')" />`;
    html += `</td></tr>`;
    html += `</table>`;
    html += `</div>`;
    html += `</div>`;
    createAndAppendDiv(html, id, false);
}

function clearAllNodes() {
    const body = document.body;
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }
}

function getBrowserName() {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";

    if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Firefox";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
        browserName = "Opera";
    } else if (userAgent.indexOf("Trident") > -1) {
        browserName = "Internet Explorer";
    } else if (userAgent.indexOf("Edg") > -1) {
        browserName = "Edge";
    } else if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Safari";
    }

    return browserName;
}

const getSVGchipGradients = () => {
   return  `<svg width="0" height="0"><defs>
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
};

const getSVGArrowGradsAndShads = () =>  {

    let html =  '';   
    html += `    <svg width="0" height="0"><defs>`;
    html += `        <linearGradient id="redToGray" x1="0%" y1="0%" x2="100%" y2="0%">`;
    html += `            <stop offset="0%" style="stop-color:${RED_CHIP_COLOR};stop-opacity:1" />`;
    html += `            <stop offset="100%" style="stop-color:${GRAY_CHIP_COLOR};stop-opacity:1" />`;
    html += `        </linearGradient>`;
    html += `        <linearGradient id="greenToRed" x1="0%" y1="0%" x2="100%" y2="0%">`;
    html += `            <stop offset="0%" style="stop-color:${GREEN_CHIP_COLOR};stop-opacity:1" />`;
    html += `            <stop offset="100%" style="stop-color:${RED_CHIP_COLOR};stop-opacity:1" />`;
    html += `        </linearGradient>`;
    html += `        <linearGradient id="greenToBlack" x1="0%" y1="0%" x2="100%" y2="0%">`;
    html += `            <stop offset="0%" style="stop-color:${GREEN_CHIP_COLOR};stop-opacity:1" />`;
    html += `            <stop offset="100%" style="stop-color:${BLACK_CHIP_COLOR};stop-opacity:1" />`;
    html += `        </linearGradient>`;
    html += `        <linearGradient id="blackToGreen" x1="0%" y1="0%" x2="100%" y2="0%">`;
    html += `            <stop offset="0%" style="stop-color:${BLACK_CHIP_COLOR};stop-opacity:1" />`;
    html += `            <stop offset="100%" style="stop-color:${GREEN_CHIP_COLOR};stop-opacity:1" />`;
    html += `        </linearGradient>`;
    html += `        <filter id="arrowShadow" x="-50%" y="-50%" width="200%" height="200%">`;
    html += `           <feDropShadow dx="2" dy="2" stdDeviation="1" flood-color="rgba(0, 0, 0, 0.5)" />`;
    html += `        </filter>`;
    html += `        <filter id="blurFilter" x="-50%" y="-50%" width="200%" height="200%">`;
    html += `           <feGaussianBlur in="SourceGraphic" stdDeviation="2" />`;
    html += `        </filter>`;
    html += `        <filter id="blurFilter_x" x="-50%" y="-50%" width="200%" height="200%">`;
    html += `           <feGaussianBlur in="SourceGraphic" stdDeviation="9" />`;
    html += `        </filter>`;
    html += `    </defs></svg>`;

    return html;

};

const createSVGChip = (color, size, amount) => {
    const radius = 25; // Base radius for the chip
    const innerRadius = radius * 0.45; // Inner circle radius
    const pieMarkLength = radius * .85; // Length of the pie marks

    return `
        <svg width="${size}" height="${size}" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;">
            <defs>
                <filter id="shadow" x="-45%" y="-25%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0, 0, 0, 1)" />
                </filter>
            </defs>    
            <circle cx="25" cy="25" r="21" fill="${color}" filter="url(#shadow)" />
            <circle cx="25" cy="25" r="12" fill="white" />
            <circle cx="25" cy="25" r="10" fill="${color}" />
            <text x="25" y="29" font-size="10" text-anchor="middle" fill="white">${amount}</text>
            <line x1="25" y1="${25 - pieMarkLength}" x2="25" y2="${25 - innerRadius}" stroke="white" stroke-width="2"/>
            <line x1="25" y1="${25 + innerRadius}" x2="25" y2="${25 + pieMarkLength}" stroke="white" stroke-width="2"/>
            <line x1="${25 - pieMarkLength}" y1="25" x2="${25 - innerRadius}" y2="25" stroke="white" stroke-width="2"/>
            <line x1="${25 + innerRadius}" y1="25" x2="${25 + pieMarkLength}" y2="25" stroke="white" stroke-width="2"/>
            <line x1="${25 - pieMarkLength * 0.7}" y1="${25 - pieMarkLength * 0.7}" x2="${25 - innerRadius * 0.7}" y2="${25 - innerRadius * 0.7}" stroke="white" stroke-width="2"/>
            <line x1="${25 + innerRadius * 0.7}" y1="${25 + innerRadius * 0.7}" x2="${25 + pieMarkLength * 0.7}" y2="${25 + pieMarkLength * 0.7}" stroke="white" stroke-width="2"/>
            <line x1="${25 - pieMarkLength * 0.7}" y1="${25 + pieMarkLength * 0.7}" x2="${25 - innerRadius * 0.7}" y2="${25 + innerRadius * 0.7}" stroke="white" stroke-width="2"/>
            <line x1="${25 + innerRadius * 0.7}" y1="${25 - innerRadius * 0.7}" x2="${25 + pieMarkLength * 0.7}" y2="${25 - pieMarkLength * 0.7}" stroke="white" stroke-width="2"/>
        </svg>
    `;
}