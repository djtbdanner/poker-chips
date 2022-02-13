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
    if (div) {
        destroyNode(div);
        div = undefined;
    }
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
    html += `<a class ="menuItem">Sit out/Return </a></br>`;
    html += `<hr>`;
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

// function goToHomePage() {
//     window.location = '/';
// }

// async function modalConfirm(message, doFunctionName, dontFunctionName, doButton, dontButton) {

//     if (!doButton) {
//         doButton = `Continue`;
//     }
//     if (!dontButton) {
//         dontButton = `Cancel`;
//     }
//     destroyById(`modal-confirm`);
//     let html = ``;
//     html += `<div id="modal-confirm" class="modal" style="background-color: rgba(139, 139, 139, 0.9);">`;
//     html += `<table cellpadding="0" cellspacing="0" width="100%" border="0">`;
//     html += `<tr><td colspan="2" style = "text-align:center;">`;
//     html += `<p>${message}</p>`;
//     html += `</td></tr>`;
//     html += `<tr><td style = "text-align:center;">`;
//     html += `<input type="button" value="${doButton}" onClick="destroyById('modal-confirm');${doFunctionName};" />`;
//     html += `</td><td  style = "text-align:center;">`;
//     html += `<input type="button" value="${dontButton}" onClick="destroyById('modal-confirm');${dontFunctionName};" />`;
//     html += `</td></tr>`;
//     html += `</table>`;
//     html += `</div>`;
//     createAndAppendDiv(html, 'default', false);
// }

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

// async function textMessages() {
//     destroyById('text-message');
//     const roomName = document.getElementById(`room-name`).value;
//     let messages = await getMessages(roomName);
//     if (!messages || messages.length < 1) {
//         messages = [`no messages`];
//     }
//     let html = ``;
//     html += `<div id="text-message" class="txt" style="background-color: rgba(139, 139, 139, 0.9);text-align:center;">`;
//     html += `<textarea style="width:98%;height:90%;" id="txt-messages" readonly="true">`;
//     messages.forEach((message) => html += `&#8226;${message}\n`);
//     html += `</textarea>`;
//     html += `</br><input type="button" value="close" onClick="destroyById('text-message');" />`;
//     html += `</div>`;
//     createAndAppendDiv(html, 'default', false);
//     var textarea = document.getElementById('txt-messages');
//     textarea.scrollTop = textarea.scrollHeight;
// }

// function sendMessage() {
//     const roomName = document.getElementById(`room-name`).value;
//     destroyById('text-message-in');
//     let html = ``;
//     html += `<form><div id="text-message-in" class="txt" style="background-color: rgba(139, 139, 139, 0.9);text-align:center;">`;
//     html += `<textarea id="txt-message-to-send" style="width:98%;height:50%;" onKeyup="checkDisabled()">`;
//     html += `</textarea>`;
//     html += `</br><input type="button" value="Cancel" onClick="destroyById('text-message-in');" />`;
//     html += `<input type="submit" value="Send" disabled="true" id="send-text-button" formaction="javascript:send()"/>`;
//     html += `</div></form>`;
//     createAndAppendDiv(html, 'default', false);
//     document.getElementById(`txt-message-to-send`).focus();
// }

// function checkDisabled() {
//     const textMessage = document.getElementById(`txt-message-to-send`).value;
//     const button = document.getElementById(`send-text-button`);
//     if (textMessage) {
//         button.disabled = false;
//     } else {
//         button.disabled = true;
//     }
// }

// function send() {
//     const roomName = document.getElementById(`room-name`).value;
//     const message = document.getElementById(`txt-message-to-send`).value;
//     sendTextMessage(roomName, message);
//     destroyById('text-message-in');
// }
