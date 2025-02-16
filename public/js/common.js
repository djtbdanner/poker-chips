/// global - all screens
let playerBlackChipCount = 0;
let playerGreenChipCount = 0;
let playerRedChipCount = 0;
let playerGrayChipCount = 0;
let totalChips = 0;
let currentBetAmount = 0;
let callAmount = 0;
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

async function buildMenu() {
    destroyById(`menu`);
    let html = ``;
    html += `<div id="menu" class="menu" onClick="destroyById('menu')">`;
    if (!document.fullscreenElement) {
        html += `<a class ="menuItem" onClick="openFullScreen();">FullScreen</a></br>`;
        html += `<hr>`;
    } else {
        html += `<a class ="menuItem" onClick="closeFullscreen();">Exit FullScreen</a></br>`;
        html += `<hr>`;
    }
    html += `<a class ="menuItem" onclick = "buildChangeChipsHtml()">Change Chip Denomination </a></br>`;
    html += `<hr>`;
    // html += `<a class ="menuItem">Sit out/Return </a></br>`;
    // html += `<hr>`;
    html += `<a class ="menuItem" onclick = "removePlayer()">Leave table</a></br>`;
    html += `<hr>`;
    html += `<a class ="menuItem">Close...</a></br>`;
    html += `</div>`;
    createAndAppendDiv(html, 'default', false);
    let optionsButton = document.getElementById('options-button');
    let optionsTextRectangle = optionsButton.getBoundingClientRect();
    let optionsLeft = parseInt(optionsTextRectangle.left, 10);
    let optionsBotton = parseInt(optionsTextRectangle.bottom, 10);
    let menu = document.getElementById('menu');
    let heightOfMenu = menu.offsetHeight;
    menu.style.top = `${optionsBotton - heightOfMenu}px`;
    menu.style.left = `${optionsLeft}px`;

}

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