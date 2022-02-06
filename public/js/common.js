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
    html += `<a class ="menuItem">Leave table</a></br>`;
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

function buildChangeChipsHtml() {
    const id = `chip-change`
    destroyById(id);
    let html = ``;
    html += `    <div id = "${id}" class = "menu">`;
    html += `            <hr>`;
    html += `        <table>`;
    html += `            <tr>`;
    html += `                <td class="tdSlim">`;
    html += `                    <img src="images/chip-black.png" class = "imgreduced"></img>`;
    html += `                    <br>`;
    html += `                    <div id="chip-change-black-one">${playerBlackChipCount}</div>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <input type="button" id="100-25" class="stInput" value="100&#8658;25&nbsp;" onclick = "resetChips('black','green')"></input>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <img src="images/chip-green.png"  class = "imgreduced"></img> <br>`;
    html += `                     <div id="chip-change-green-one">${playerGreenChipCount}</div>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <input type="button" id="25-5" class="stInput" value="25&#8658;5&nbsp;" onclick = "resetChips('green','red')"></input>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <img src="images/chip-red.png"  class = "imgreduced"></img> <br>`;
    html += `                     <div id="chip-change-red-one">${playerRedChipCount}</div>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <input type="button" id="5-1" class="stInput" value="5&nbsp;&#8658;&nbsp;1&nbsp;" onclick = "resetChips('red','gray')"></input>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <img src="images/chip-gray.png"  class = "imgreduced"></img> <br>`;
    html += `                     <div id="chip-change-gray-one">${playerGrayChipCount}</div>`;
    html += `                </td>`;
    html += `            </tr>`;
    html += `            <tr>`;
    html += `                <td class="tdSlim" colspan=7>`;
    html += `                   <hr>`;
    html += `                </td>`;
    html += `            </tr>`;
    html += `            <tr>`;
    html += `                <td class="tdSlim">`;
    html += `                    <img src="images/chip-gray.png"  class = "imgreduced"></img> <br>`;
    html += `<div id="chip-change-gray-two">${playerGrayChipCount}</div>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <input type="button" id="1-5" class="stInput" value="1&nbsp;&#8658;&nbsp;5&nbsp;" onclick = "resetChips('gray','red')"></input>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <img src="images/chip-red.png"  class = "imgreduced"></img> <br>`;
    html += `                     <div id="chip-change-red-two">${playerRedChipCount}</div>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <input type="button" id="5-25" class="stInput" value="5&nbsp;&#8658;&nbsp;25&nbsp;" onclick = "resetChips('red','green')"></input>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <img src="images/chip-green.png"  class = "imgreduced"></img> <br>`;
    html += `                    <div id="chip-change-green-two">${playerGreenChipCount}</div>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <input type="button" id="25-100" class="stInput" value="25&nbsp;&#8658;&nbsp;100&nbsp;" onclick = "resetChips('green','black')"></input>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <img src="images/chip-black.png"  class = "imgreduced"></img> <br>`;
    html += `                    <div id="chip-change-black-two">${playerBlackChipCount}</div>`;
    html += `                </td>`;
    html += `            </tr>`;
    html += `            <tr>`;
    html += `                <td class="tdSlim" colspan=7>`;
    html += `                   <hr>`;
    html += `                </td>`;
    html += `            </tr>`;
    html += `            <tr>`;
    html += `                <td class="tdSlim" colspan=7>`;
    html += `                    <input type="button" id="1-5" value="DONE" class="stInput" onClick="destroyById('${id}')"></input>`;
    html += `                </td>`;
    html += `            </tr>`;
    html += `        </table>`;
    html += `    </div>`;
    createAndAppendDiv(html, 'default', false);
    let optionsButton = document.getElementById('options-button');
    let optionsTextRectangle = optionsButton.getBoundingClientRect();
    let optionsLeft = parseInt(optionsTextRectangle.left, 10);
    let optionsBotton = parseInt(optionsTextRectangle.bottom, 10);
    let div = document.getElementById(id);
    let heightOfOptions = parseInt((optionsTextRectangle.top - optionsTextRectangle.bottom), 10);
    let heightOfDiv = div.offsetHeight;
    div.style.top = `${optionsBotton - heightOfDiv}px`;
    div.style.left = `${optionsLeft}px`;
}

function resetChips(fromColor, toColor) {
    if (fromColor === `black` && toColor === `green`) {
        if (playerBlackChipCount < 1){
            alert ('no black chips');
            return;
        }
        playerBlackChipCount = playerBlackChipCount -1;
        playerGreenChipCount = playerGreenChipCount + 4;
    } else if ((fromColor === `green` && toColor === `red`)) {
        if (playerGreenChipCount < 1){
            alert ('no green chips');
            return;
        }
        playerGreenChipCount = playerGreenChipCount -1;
        playerRedChipCount = playerRedChipCount + 5;
    } else if ((fromColor === `red` && toColor === `gray`)) {
        if (playerRedChipCount < 1){
            alert ('no red chips');
            return;
        }
        playerRedChipCount = playerRedChipCount -1;
        playerGrayChipCount = playerGrayChipCount + 5;
    } else if ((fromColor === `gray` && toColor === `red`)) {
        if (playerGrayChipCount < 5){
            alert ('not enough gray chips');
            return;
        }
        playerGrayChipCount = playerGrayChipCount -5;
        playerRedChipCount = playerRedChipCount + 1;
    } else if ((fromColor === `red` && toColor === `green`)) {
        if (playerRedChipCount < 5){
            alert ('not enough red chips');
            return;
        }
        playerRedChipCount = playerRedChipCount -5;
        playerGreenChipCount = playerGreenChipCount + 1;
    } else if ((fromColor === `green` && toColor === `black`)) {
        if (playerGreenChipCount < 4){
            alert ('not enough green chips');
            return;
        }
        playerGreenChipCount = playerGreenChipCount -4;
        playerBlackChipCount = playerBlackChipCount + 1;
    } else {
        alert(`invalid chip exchange`);
        return;
    }
    setChipcountDisplay();

}

function setChipcountDisplay(){

    document.getElementById(`chip-change-black-two`).innerHTML = playerBlackChipCount;
    document.getElementById(`chip-change-green-two`).innerHTML = playerGreenChipCount;
    document.getElementById(`chip-change-red-two`).innerHTML = playerRedChipCount;
    document.getElementById(`chip-change-gray-two`).innerHTML = playerGrayChipCount;
    document.getElementById(`chip-change-black-one`).innerHTML = playerBlackChipCount;
    document.getElementById(`chip-change-green-one`).innerHTML = playerGreenChipCount;
    document.getElementById(`chip-change-red-one`).innerHTML = playerRedChipCount;
    document.getElementById(`chip-change-gray-one`).innerHTML = playerGrayChipCount;


}

// function clearAllDivs() {
//     let divs = document.body.getElementsByTagName(`div`);
//     for (i = 0; i < divs.length; i++) {
//         destroyNode(divs[i]);
//     }

//     divs = document.getElementsByTagName(`div`);
//     for (i = 0; i < divs.length; i++) {
//         destroyNode(divs[i]);
//     }
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

// async function modalMessage(message) {
//     //destroyById('modal-message');
//     let html = ``;
//     html += `<div id="modal-message" class="modal" style="background-color: rgba(139, 139, 139, 0.9);" onClick="destroyById('modal-message')">`;
//     html += `<table cellpadding="0" cellspacing="0" width="100%" border="0">`;
//     html += `<tr><td colspan="2" style = "text-align:center;">`;
//     html += `<p>${message}</p>`;
//     html += `</td></tr>`;
//     html += `<tr><td style = "text-align:center;">`;
//     html += `<input type="button" value="OK" onClick="destroyById('modal-message')" />`;
//     html += `</td></tr>`;
//     html += `</table>`;
//     html += `</div>`;
//     createAndAppendDiv(html, 'default', false);
// }

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
