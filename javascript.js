const HEIGHT = 6;
const WIDTH = 6;
var SCORE = 0;
// makes board
var BOARD = [];
for (let i = 0; i < HEIGHT; i++) {
    let row = [];
    for (let j = 0; j < WIDTH; j++) {
        row.push({
            "dwight": false,
            "raddish": false,
            "jim": false
        });
    }
    BOARD.push(row.slice());
}

function drawGameBoard() {
    let html = '';
    for (let i = 0; i < BOARD.length; i++) { // for every row
        html += '<div class="row">';
        for (let j = 0; j < BOARD[i].length; j++) { // for every block in the row
            let className = 'light';
            if ((i + j) % 2) { // alternates the colors by checking to see if the sum of the two numbers is odd or even
                className = 'dark';
            }
            html += `<div class="square ${className}">`;
            if (BOARD[i][j].dwight) {
                html += '<img class="game-piece" src="assets/dwight.jpg">'
            } else if (BOARD[i][j].raddish) {
                html += '<img class="game-piece" src="assets/raddish.jpg">'
            } else if (BOARD[i][j].jim) {
                html += '<img class="game-piece" src="assets/jim.jpg">'
            }
            html += '</div>'
        }
        html += '</div>'
    }
    document.getElementById('container').innerHTML = html;
    document.getElementById('score').innerText = SCORE;
}

// when dom is ready it will run this function
document.addEventListener("DOMContentLoaded", function () {
    let randI = Math.floor(Math.random() * BOARD.length);
    let randJ = Math.floor(Math.random() * BOARD[0].length);
    let randA = Math.floor(Math.random() * BOARD.length);
    let randB = Math.floor(Math.random() * BOARD[0].length);

    BOARD[randI][randJ].dwight = true; // randomly chooses a starting point for dwight
    let raddishI = randI;
    let raddishJ = randJ;
    let jimA = randA;
    let jimB = randB;
    while (raddishI == randI && raddishJ == randJ) {
        raddishI = Math.floor(Math.random() * BOARD.length);
        raddishJ = Math.floor(Math.random() * BOARD[0].length);
    }
    BOARD[raddishI][raddishJ].raddish = true; // randomly chooses a starting point for the raddish

    while (jimA == randA && jimB == randB) {
        jimA = Math.floor(Math.random() * BOARD.length);
        jimB = Math.floor(Math.random() * BOARD[0].length);
    }
    BOARD[jimA][jimB].jim = true;
    drawGameBoard();
});

function getCurrentPosition(key) {
    for (let i = 0; i < BOARD.length; i++) {
        for (let j = 0; j < BOARD.length; j++) {
            if (BOARD[i][j][key]) {
                return { "i": i, "j": j };
            }
        }
    }
}

function movePlayer(event) {
    let key = event.key;
    let moves = {
        'ArrowUp': { "i": -1, "j": 0 },
        'ArrowDown': { "i": 1, "j": 0 },
        'ArrowRight': { "i": 0, "j": 1 },
        'ArrowLeft': { "i": 0, "j": -1 }
    }
    if (key in moves) {
        let move = moves[key];
        let pos = getCurrentPosition("dwight");
        let newI = Math.max(0, Math.min(pos.i + move.i, BOARD.length - 1));
        let newJ = Math.max(0, Math.min(pos.j + move.j, BOARD[newI].length - 1));
        BOARD[pos.i][pos.j].dwight = false;
        BOARD[newI][newJ].dwight = true;
        console.log(`${key}: (${pos.i}, ${pos.j}) -> (${newI}, ${newJ})`);
        let raddishPosition = getCurrentPosition("raddish");
        let jimPosition = getCurrentPosition("jim");
        if (move) {
            if (raddishPosition.i == newI && raddishPosition.j == newJ) {
                SCORE += 10;
            }
            else if (jimPosition.i == newI && jimPosition.j == newJ) {
                SCORE = 0;
            }
            let raddishI = newI;
            let raddishJ = newJ;
            let jimA = newI;
            let jimB = newJ;
            BOARD[pos.i][pos.j].raddish = false;
            BOARD[pos.i][pos.j].jim = false;
            while (raddishI == newI && raddishJ == newJ) {
                raddishI = Math.floor(Math.random() * BOARD.length);
                raddishJ = Math.floor(Math.random() * BOARD[0].length);
            }
            while (jimA == newI && jimB == newJ) {
                jimA = Math.floor(Math.random() * BOARD.length);
                jimB = Math.floor(Math.random() * BOARD[0].length);
            }
            BOARD[raddishPosition.i][raddishPosition.j].raddish = false;
            BOARD[jimPosition.i][jimPosition.j].jim = false;
            BOARD[raddishI][raddishJ].raddish = true;
            BOARD[jimA][jimB].jim = true;
        }
        drawGameBoard();
    }
}

document.addEventListener('keydown', movePlayer);