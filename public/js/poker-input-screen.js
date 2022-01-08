async function buildEntryScreens() {

    // const storedScores = localStorage.getItem('scores');
    // const date = localStorage.getItem('scores-date');
    // const roomName = localStorage.getItem('room-name');
    // const isOwner = localStorage.getItem(`is-owner`);
    // if (storedScores && date && roomName) {
    //     const dateToCompare = new Date(date);
    //     if (isToday(dateToCompare)) {
    //         const msg = `You were keeping score for <i><b>${roomName}</b></i> earlier today</br> Would you like to continue with that game?`;
    //         modalConfirm(msg, `rebuildGameFromLocalStorage()`, `buildInitialScreen()`, `Continue ${roomName}`, `New Game`);
    //         return;
    //     }
    // }
    await buildInitialScreen();
}

// async function processRoomAdded() {
//     if (document.getElementById(`initial-screen`)) {
//         await buildInitialScreen();
//     } else {
//         console.log('someone added another game');
//     }
// }

async function buildInitialScreen() {
    const tables = await getAvailableRooms();
    let tableList = ``;
    if (tables) {
        tableList = buildRoomList(tables);
    }
    destroyById(`initial-screen`);
    let html = ``;
    // html += `<form><div id="initial-screen" class="modal">`;
    html += `<div style="background-color:tan;width:100%;height:100%;">`;
    html += `<form id ="initial-screen">`;
    html += `<table>`;
    html += `<tr><td colspan = "2" style = "text-align:center;">`;
    html += `<p>Set a name for your table, set number of players (2-9) and how many chips each player starts with.</p>`;
    html += `</td></tr>`;
    html += `<tr><td style="text-align:right;">`;
    html += `Table: `;
    html += `</td><td>`;
    html += `<input type="text" maxlength="20" class="stInput" id="table-name" placeholder="Table Name" onKeyUp="checkTableName()" autofocus />`;
    html += `</td></tr>`;
    html += `<tr><td style="text-align:right;">`;
    html += `Your Name: `;
    html += `</td><td>`;
    html += `<input type="text" maxlength="20" class="stInput" id="player-name" placeholder="Your Name" />`;
    html += `</td></tr>`;
    html += `<tr><td style="text-align:right;">`;
    html += `# Players: `;
    html += `</td><td>`;
    html += `<input type="number" maxlength="3" class="stInput" id="player-count" value = "2" min="2" max="9" />`;
    html += `</td></tr>`;
    html += `<tr><td style="text-align:right;">`;
    html += `Initial # chips: `;
    html += `</td><td>`;
    html += `<input type="number" maxlength="4" class="stInput" id="chip-count" value = "100" min="2" max="9999" />`;
    html += `</td></tr>`;
    // html += `<tr><td colspan="2" style = "text-align:center;">`;
    // html += `<span id = "game-msg-span">&nbsp</span>`;
    // html += `</td></tr>`;
    html += `<tr><td colspan="2" style = "text-align:center;">`;
    html += `<br><input type="submit" id="start-table-button" class="stInput" disabled="true" value="Start Game" formaction="javascript:startGame();" />`;
    html += `</td></tr>`;
    html += tableList;
    html += `</table>`;
    html+=`</form>`;
    html+=`</div>`;
    createAndAppendDiv(html, 'initial-screen', true);
}


function startGame(){
    const playerName = document.getElementById(`player-name`).value;
    const playerCount = document.getElementById(`player-count`).value;
    const chipCount = document.getElementById(`chip-count`).value;
    const tableName = document.getElementById(`table-name`).value;
    if (!playerName){
        alert (`need player name`); // TODO - elegantly handle this
        return;
    }
    startPokerGame(tableName,playerName,playerCount,chipCount)

    // destroyById('initial-screen');
    // drawScreen();
}
// function rebuildGameFromLocalStorage() {

//     const storedScores = localStorage.getItem('scores');
//     const date = localStorage.getItem('scores-date');
//     const roomName = localStorage.getItem('room-name');
//     document.getElementById(`room-name`).value = roomName;
//     document.getElementById(`room-owner`).value = "true";
//     document.getElementById(`points-per-tap`).value = localStorage.getItem(`points-per-tap`) || 1;
//     const scores = JSON.parse(storedScores);
//     sendRoomMessage(roomName, `Score keeper reconnected to ${roomName}.`);
//     scoreChange(roomName, scores, true);
//     drawScreen(scores, true, roomName);
// }

// function setRoomAddPlayer() {

//     const selectedRoomName = document.getElementById(`game-name`).value;
//     document.getElementById(`room-name`).value = document.getElementById(`game-name`).value;
//     document.getElementById(`points-per-tap`).value = document.getElementById(`goal-points`).value;
//     destroyById('initial-screen');
//     addPlayerOrTeam(0);
// }

function buildRoomList(availableRooms) {

    if (availableRooms && availableRooms.length > 0) {
        let html = ``;
        html += `<tr><td colspan = "2" style = "text-align:center;">`;
        html += `<p>Or, join a game. Enter name and select game.</p>`;
        html += `</td></tr>`;
        html += `<tr><td style="text-align:right;">`;
        html += `Name:`;
        html += `</td>`;
        html += `<td>`;
        html += `<input type="text" maxlength="20" class="stInput" id="joining-player-name" placeholder="Player Name"/>`;
        html += `</td></tr>`;
        html += `<tr><td style="text-align:right;">`;
        html += `Table:`;
        html += `</td>`;
        html += `<td>`;
        html += `<select class="stInput" onChange="joinTable(this.value)">`;
        html += `<option>-select game-</option>`;
        availableRooms.forEach(roomName => {
            html += `<option><value = "${roomName}">${roomName}</option>`;
        });
        html += `</select>`;
        html += `</td></tr>`;
        return html;
    }
    return ``;
}

function joinTable(tableName){
    const playerName = document.getElementById(`joining-player-name`).value;
    if (!playerName){
        alert (`need player name`); // TODO - elegantly handle this
        return;
    }
    joinPokerGame(tableName,playerName);

    // destroyById('initial-screen');
    // drawScreen();
}

// function addPlayerOrTeam(index) {
//     const html = buildAddTeamForm(index);
//     createAndAppendDiv(html, 'default', false);
//     document.getElementById(`in-teamName${index}`).focus();
//     // two teams, enable done
//     const enableDone = document.getElementById(`teamName${1}`) === null;
//     const doneButton = document.getElementById(`done-team-button${index}`);
//     doneButton.disabled = enableDone;
// }

// function buildAddTeamForm(index) {

//     const gameName = document.getElementById(`room-name`).value;
//     let html = ``;
//     // html += `<div id="addDiv${index}" class = "modal"><form>`;
//     html += `<form id="addDiv${index}"> `;
//     html += `<table style = "position:absolute;left:0;top:0;" cellpadding="5" cellspacing="0" width="100%" border="0">`;
//     html += `<tr><td style = "text-align:center;" colspan = "2">`;
//     html += `Add team # ${index + 1} for ${gameName}`
//     html += `</td></tr>`;
//     html += `<tr><td style="text-align:right;width:30%;">`;
//     html += `Team Name:`;
//     html += `</td><td>`;
//     html += `<input type="input" maxlength="12" id="in-teamName${index}" placeholder="Team${index + 1} Name" autofocus onKeyUp="checkTeamEntries(${index})"/>`;
//     html += `</td></tr>`;
//     html += `<tr><td style="text-align:right;width:30%;">`;
//     html += `Primary Color:`;
//     html += `</td><td>`;
//     const primaryRando = getRandomColor();
//     html += `<input type="color" id="primary-color${index}" value="${primaryRando}" onChange="checkTeamEntries(${index})">`
  
//     html += `<tr><td style="text-align:right;width:30%;">`;
//     html += `Secondary Color:`;
//     html += `</td><td>`;
//     const secondaryRando = getRandomColor(primaryRando);
//     html += `<input type="color" id="secondary-color${index}" value="${secondaryRando}" onChange="checkTeamEntries(${index})">`
//     html += `</td></tr><td></td><td>`;
//     html += `<i>Click or tap a color swath to select and change color.</i>`
//     html += `</td></tr>`;
//     html += `<tr><td>`;
//     html += `<tr><td style = "text-align:center;" colspan = "2">`;
//     html += `<input type="submit" value = "Add" id="add-team-button${index}" disabled=true formaction="javascript:addTeam(${index})"/>`;
//     html += `<input type="button" value = "Done" id="done-team-button${index}" disabled=true onClick="destroyById('addDiv${index}');buildAndSendScore();"/>`;
//     html += `</td></tr>`;
//     html += `</table>`;
//     // html += `</form></div>`;
//     html += `</form>`;
//     return html;
// }

// function checkTeamEntries(index) {
//     const teamName = document.getElementById(`in-teamName${index}`).value;
//     const primaryColor = document.getElementById(`primary-color${index}`).value;
//     const secondaryColor = document.getElementById(`secondary-color${index}`).value;
//     const addButton = document.getElementById(`add-team-button${index}`);
//     addButton.disabled = true;
//     if (teamName && (secondaryColor !== primaryColor)) {
//         addButton.disabled = false;
//     }
// }

// function getRandomColor(notThisOne) {
//     let colors = [`#FFFFFF`,
//         `#C0C0C0`,
//         `#808080`,
//         `#000000`,
//         `#FF0000`,
//         `#800000`,
//         `#FFFF00`,
//         `#808000`,
//         `#00FF00`,
//         `#008000`,
//         `#00FFFF`,
//         `#008080`,
//         `#0000FF`,
//         `#000080`,
//         `#FF00FF`,
//         `#800080`,
//         `#8B4513`,
//         `#FF8C00`,
//         `#FF69B4`,];
//     colors = colors.filter((a) => a !== notThisOne);
//     var color = colors[Math.floor(Math.random() * colors.length)];
//     return color;
// }

// function addTeam(index) {
//     const primaryColor = document.getElementById(`primary-color${index}`).value;
//     const secondaryColor = document.getElementById(`secondary-color${index}`).value;
//     const teamName = document.getElementById(`in-teamName${index}`).value;
//     let html = ``;
//     html += `${teamName}`;
//     html += `<input type="hidden" id="teamName${index}" value="${teamName}" /><br>`;
//     html += `<input type="hidden" id="score${index}" value="0" /><br>`;
//     html += `<input type="hidden" id="color${index}" value="${primaryColor}" /><br>`;
//     html += `<input type="hidden" id="textColor${index}" value="${secondaryColor}" />`;
    
//     let fontSize = `8vh`;
    
//     var orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
//     if (orientation && orientation.includes(`portrait`)){
//         fontSize = `3vh`;
//     }
//     const div = document.createElement(`div`);
//     // couldnt' get the style to set
//     div.innerHTML = html;
//     document.body.appendChild(div);
//     div.classList.add(`exampleDiv`);
//     div.id = `div${index}`;
//     div.style.backgroundColor = primaryColor;
//     div.style.color = secondaryColor;
//     div.style.width = `25%`;
//     div.style.height = `50%`;
//     div.style.float = `left`;
//     div.style.fontSize = fontSize;
//     div.style.textAlign = `center`;
//     div.style.borderRadius = `5px`;
//     // remove the current add team div
//     let node = document.getElementById("addDiv" + index);
//     if (node.parentNode) {
//         node.parentNode.removeChild(node);
//     }

//     if (index === 7) {
//         buildAndSendScore();
//         return;
//     }
//     addPlayerOrTeam(index + 1);
// }

// function buildAndSendScore() {

//     const scores = [];

//     for (let i = 0; i < 8; i++) {
//         if (!document.getElementById(`teamName${i}`)) {
//             break;
//         }
//         const teamName = document.getElementById(`teamName${i}`).value;
//         const score = document.getElementById(`score${i}`).value;
//         const color = document.getElementById(`color${i}`).value;
//         const textColor = document.getElementById(`textColor${i}`).value;
//         let theScore = {};
//         theScore.teamName = teamName;
//         theScore.score = score;
//         theScore.color = color;
//         theScore.textColor = textColor;
//         scores.push(theScore);

//     }
//     const roomName = document.getElementById(`room-name`).value;
//     document.getElementById(`room-owner`).value = true;
//     scoreChange(roomName, scores, true);
//     clearAllDivs();
//     clearAllDivs();
//     drawScreen(scores, true, roomName);
//     const pointsPer = document.getElementById(`points-per-tap`).value;
//     if (pointsPer && parseInt(pointsPer, 10) > 1) {
//         modalMessage(`Each click on the score will add ${pointsPer} points, clicking at bottom of score will subtract ${pointsPer} points. If you need to add or remove a single point, slide up on the score to add, slide down to remove.`);
//     }
// }

async function checkTableName() {
    const tableName = document.getElementById(`table-name`).value;
    const startTableButton = document.getElementById(`start-table-button`);
   // const gameMessageSpan = document.getElementById(`game-msg-span`);
    //gameMessageSpan.innerHTML = `&nbsp;`;
    if (tableName && tableName.length > 0) {
        const available = await isRoomAvailable(tableName);
        if (available) {
            startTableButton.disabled = false;
        } else {
       //     gameMessageSpan.innerHTML = `The name "${gameName}" in use.`
            startTableButton.disabled = true;
        }

    } else {
        startTableButton.disabled = true;
    }
}
