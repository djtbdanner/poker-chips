
const chipColors = ["black", "green", "red", "gray"];
const id = "bet-input";

function drawBetScreen() {
    destroyById(`table-div`);
    const html = getBetScreenHTML();
    createAndAppendDiv(html, id, true);
}

function getBetScreenHTML(id) {
    destroyById(id);
    let html = ``;
    html += `<div id = "${id}" class="additionalInputDiv">`;
    html += `    <table>`;
    html += `        <tr>`;
    html += `            <td colspan="5" style="text-align: center;">Current Amount Bet: 5 chips`;
    html += `        </tr>`;
    html += `        <tr>`;
    html += `            <td class="even5td" style="height:50vh;">`;
    html += `                f x`;
    html += `            </td>`;
    html += `            <!-- The colors only work in Firefox unless a lot of work into getting them vertical by rotating and that presents own issue`;
    html += `            the orient vertical here is only for Firefox -->`;
    html += `            <td class="even5td" style="height:25vh;">`;
    html += `                <input type="range" min="0" max="${playerBlackChipCount}" value="0" class="slider" style="background:#000000;"`;
    html += `                    id="black-range" oninput="processSliderInput(this)" orient="vertical">`;
    html += `            </td>`;
    html += `            <td class="even5td">`;
    html += `                <input type="range" min="0" max="${playerGreenChipCount}" value="0" class="slider" style="background:#2d6621;"`;
    html += `                    id="green-range" oninput="processSliderInput(this)" orient="vertical">`;
    html += `            </td>`;
    html += `            </td>`;
    html += `            <td class="even5td">`;
    html += `                <input type="range" min="0" max="${playerRedChipCount}" value="0" class="slider" id="red-range" style="background:#b72820;"`;
    html += `                    oninput="processSliderInput(this)" orient="vertical">`;
    html += `            </td>`;
    html += `            </td>`;
    html += `            <td class="even5td">`;
    html += `                <input type="range" min="0" max="${playerGrayChipCount}" value="0" class="slider" style="background:#6e7070;" id="gray-range"`;
    html += `                    oninput="processSliderInput(this)" orient="vertical">`;
    html += `            </td>`;
    html += `            </td>`;
    html += `        </tr>`;
    html += `        <tr>`;
    html += `            <td class="even5td">`;
    html += `                Total Chips<br>`;
    html += `                <span id="totalChips">${totalChips}</span>`;
    html += `            </td>`;
    html += `            <td class="even5td">`;
    html += `                <img src="images/chip-black.png" style="width:7vw;height:7vw;"></img><br><span`;
    html += `                    id="black-chipcount">${playerBlackChipCount}</span>`;
    html += `            </td>`;
    html += `            <td class="even5td">`;
    html += `                <img src="images/chip-green.png" style="width:7vw;height:7vw;"></img><br><span`;
    html += `                    id="green-chipcount">${playerGreenChipCount}</span>`;
    html += `            </td>`;
    html += `            <td class="even5td">`;
    html += `                <img src="images/chip-red.png" style="width:7vw;height:7vw;"></img><br><span id="red-chipcount">${playerRedChipCount}</span>`;
    html += `            </td>`;
    html += `            <td class="even5td">`;
    html += `                <img src="images/chip-gray.png" style="width:7vw;height:7vw;"></img><br><span`;
    html += `                    id="gray-chipcount">${playerGrayChipCount}</span>`;
    html += `            </td>`;
    html += `        </tr>`;
    html += `        <tr>`;
    html += `            <td class="even5td">`;
    html += `                Total Bet:<br>`;
    html += `                <span id="totalBet">0</span>`;
    html += `            </td>`;
    html += `            <td class="even5td">`;
    html += `                <input type="text" class="screenInput" id="black-bet" maxlength="3" size="3" onKeyUp = "onChangeBet(this)"> <br><span`;
    html += `                    class="smallitalic">x 100</span><br>`;
    html += `                <span id="black-betval">0</span>`;
    html += `            </td>`;
    html += `            <td class="even5td">`;
    html += `                <input type="text" class="screenInput" id="green-bet" maxlength="3" size="3" onKeyUp = "onChangeBet(this)"> <br><span`;
    html += `                    class="smallitalic">x 25</span><br>`;
    html += `                <span id="green-betval">0</span>`;
    html += `            </td>`;
    html += `            <td class="even5td">`;
    html += `                <input type="text" class="screenInput" id="red-bet" maxlength="3" size="3" onKeyUp = "onChangeBet(this)"> <br><span`;
    html += `                    class="smallitalic">x 5</span><br>`;
    html += `                <span id="red-betval">0</span>`;
    html += `            </td>`;
    html += `            <td class="even5td">`;
    html += `                <input type="text" class="screenInput" id="gray-bet" maxlength="3" size="3" onKeyUp = "onChangeBet(this)"> <br><span`;
    html += `                    class="smallitalic">x 1</span><br>`;
    html += `                <span id="gray-betval">0</span>`;
    html += `            </td>`;
    html += `        <tr>`;
    html += `            <td class="even5td">`;
    html += `                <input type="button" id="bet-change" value="Change">`;
    html += `            </td>`;
    html += `            <td class="even5td">`;
    html += `                <input type="button" id="bet-cancel" value="CANCEL" onClick="cancelBetScreen();">`;
    html += `            </td>`;
    html += `            <td class="even5td">`;
    html += `                <input type="button" id="bet-reset" value="RESET" onClick="resetBet();">`;
    html += `            </td>`;
    html += `            <td class="even5td">`;
    html += `            </td>`;
    html += `            <td class="even5td">`;
    html += `                <input type="button" id="bet-bet" value="RAISE" disabled onClick="playerAction('RAISE', buildChipsForBet());">`;
    html += `            </td>`;
    html += `        </tr>`;
    html += `    </table>`;
    html += `</div>`;
    return html;
}

////////////////
function cancelBetScreen() {
    getCurrentTable();
}

function processSliderInput(elem) {
    const count = elem.value;
    const chipColor = elem.id.split("-")[0];
    chipsChange(chipColor, count);
}

function chipsChange(chipColor, chipBet) {
    let chipMultiplier = 100;// black
    let originalChipCount = playerBlackChipCount;

    if (chipColor === `green`) {
        originalChipCount = playerGreenChipCount;
        chipMultiplier = 25;
    }
    if (chipColor === `red`) {
        originalChipCount = playerRedChipCount;
        chipMultiplier = 5;
    }
    if (chipColor === `gray`) {
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
    if (totalBet >= currentBetAmount) {
        document.getElementById(`bet-bet`).disabled = false;
    } else {
        document.getElementById(`bet-bet`).disabled = true;
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

    document.getElementById("black-range").value = 0;
    document.getElementById("green-range").value = 0;
    document.getElementById("red-range").value = 0;
    document.getElementById("gray-range").value = 0;
    document.getElementById("totalBet").innerHTML = calcTotalBet();
    document.getElementById("totalChips").innerHTML = totalChips;
    document.getElementById(`bet-bet`).disabled = true;
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

    if (chipColor === "black" && val > playerBlackChipCount) {
        console.log("black chip bet more than have");
        element.value = "";
        val = 0;
    }
    if (chipColor === "green" && val > playerGreenChipCount) {
        console.log("green chip bet more than have");
        element.value = "";
        val = 0;
    }
    if (chipColor === "red" && val > playerRedChipCount) {
        console.log("red chip bet more than have");
        element.value = "";
        val = 0;
    }
    if (chipColor === "gray" && val > playerGrayChipCount) {
        console.log("gray chip bet more than have");
        element.value = "";
        val = 0;
    }
    document.getElementById(chipColor + "-range").value = val;
    chipsChange(chipColor, val);
}