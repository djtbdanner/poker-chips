function buildChangeChipsHtml() {
    const id = `chip-change`;
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
    html += `                    <input type="button" id="100-25" class="stInputDefaultcolor" ${playerBlackChipCount<1?"disabled":""} value="black (100)\n&nbsp;&#8658;&nbsp;\ngreen (25)\n&nbsp;&#8658;&nbsp;&nbsp;&#8658;&nbsp;&nbsp;&#8658;&nbsp;&nbsp;&#8658;&nbsp;" onclick = "pokerChipDenominationChange('black','green')"></input>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`; 
    html += `                    <img src="images/chip-green.png"  class = "imgreduced"></img> <br>`;
    html += `                     <div id="chip-change-green-one">${playerGreenChipCount}</div>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <input type="button" id="25-5" class="stInputDefaultcolor" ${playerGreenChipCount<1?"disabled":""}  value="green (25)\n&nbsp;&#8658;&nbsp;\nred (5)&nbsp;\n&nbsp;&#8658;&nbsp;&nbsp;&#8658;&nbsp;&nbsp;&#8658;&nbsp;&nbsp;&#8658;&nbsp;&nbsp;&#8658;&nbsp;" onclick = "pokerChipDenominationChange('green','red')"></input>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <img src="images/chip-red.png"  class = "imgreduced"></img> <br>`;
    html += `                     <div id="chip-change-red-one">${playerRedChipCount}</div>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <input type="button" id="5-1" class="stInputDefaultcolor" ${playerRedChipCount<1?"disabled":""} value="red (5)\n&nbsp;&#8658;&nbsp;\ngray (1)&nbsp;\n&nbsp;&#8658;&nbsp;&nbsp;&#8658;&nbsp;&nbsp;&#8658;&nbsp;&nbsp;&#8658;&nbsp;&nbsp;&#8658;&nbsp;" onclick = "pokerChipDenominationChange('red','gray')"></input>`;
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
    html += `                    <img src="images/chip-black.png"  class = "imgreduced"></img> <br>`;
    html += `                    <div id="chip-change-black-two">${playerBlackChipCount}</div>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <input type="button" id="1-5" class="stInputDefaultcolor" ${playerGreenChipCount<4?"disabled":""} value="green (25)\n&nbsp;&#8656;&nbsp;&nbsp;&#8656;&nbsp;&nbsp;&#8656;&nbsp;&nbsp;&#8656;&nbsp;\nblack (100)&nbsp;\n&nbsp;&#8656;&nbsp;" onclick = "pokerChipDenominationChange('green','black')"></input>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <img src="images/chip-green.png"  class = "imgreduced"></img> <br>`;
    html += `                     <div id="chip-change-green-two">${playerGreenChipCount}</div>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <input type="button" id="5-25" class="stInputDefaultcolor"  ${playerRedChipCount<5?"disabled":""} value="red (5)\n&nbsp;&#8656;&nbsp;&nbsp;&#8656;&nbsp;&nbsp;&#8656;&nbsp;&nbsp;&#8656;&nbsp;&nbsp;&#8656;&nbsp;\ngreen (25)&nbsp;\n&nbsp;&#8656;&nbsp;" onclick = "pokerChipDenominationChange('red','green')"></input>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <img src="images/chip-red.png"  class = "imgreduced"></img> <br>`;
    html += `                    <div id="chip-change-red-two">${playerRedChipCount}</div>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <input type="button" id="25-100" class="stInputDefaultcolor" ${playerGrayChipCount<5?"disabled":""} value="gray (1)\n&nbsp;&#8656;&nbsp;&nbsp;&#8656;&nbsp;&nbsp;&#8656;&nbsp;&nbsp;&#8656;&nbsp;&nbsp;&#8656;&nbsp;\nred (5)&nbsp;\n&nbsp;&#8656;&nbsp;" onclick = "pokerChipDenominationChange('gray','red')"></input>`;
    html += `                </td>`;
    html += `                <td class="tdSlim">`;
    html += `                    <img src="images/chip-gray.png"  class = "imgreduced"></img> <br>`;
    html += `                    <div id="chip-change-gray-two">${playerGrayChipCount}</div>`;
    html += `                </td>`;
    html += `            </tr>`;
    html += `            <tr>`;
    html += `                <td class="tdSlim" colspan=7>`;
    html += `                   <hr>`;
    html += `                </td>`;
    html += `            </tr>`;
    html += `            <tr>`;
    html += `                <td class="tdSlim" colspan=7>`;
    html += `                    <input type="button" id="1-5" value="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DONE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" class="stInputDefaultcolor" onClick="pokerChipDenominationQuit()"></input>`;
    html += `                </td>`;
    html += `            </tr>`;
    html += `        </table>`;
    html += `    </div>`;
    createAndAppendDiv(html, id, false);
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