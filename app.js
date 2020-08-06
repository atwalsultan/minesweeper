// Selecting elements and declaring global variables
const grid = document.querySelector('.grid');
const flagsLeft = document.querySelector('.flags_left');
const result = document.querySelector('.result');
const refresh = document.querySelector('#refresh');
let width;
let numberBombs;
let cells;
let flags;
let isGameOver;

refresh.addEventListener('click', newGame);

// Start new game
function newGame() {
    // Getting rid of the old grid
    grid.innerHTML = '';
    result.innerHTML = '';

    // (Re)Setting all variables
    width = 10;
    numberBombs = 10;
    cells = [];
    flags = 0;
    isGameOver = false;

    // (Re)Setting flags left
    flagsLeft.innerHTML = numberBombs;

    // Creating shuffled array with bombs at random positions
    const bombArray = Array(numberBombs).fill('bomb');
    const safeArray = Array(width*width - numberBombs).fill('safe');
    const combArray = bombArray.concat(safeArray);
    const shuffledArray = combArray.sort(() => Math.random() - 0.5);

    for(let i=0; i<width*width; i++) {
        // Creating cells
        const cell = document.createElement('div');
        cell.setAttribute('id', i);
        cell.classList.add(shuffledArray[i])
        grid.appendChild(cell);
        cells.push(cell);

        // Adding event listeners
        // Normal click
        cell.addEventListener('click', function(e) {
            click(cell);
        });

        // Right click
        cell.oncontextmenu = function(e) {
            e.preventDefault();
            addFlag(cell);
        }
    }


    // Adding numbers to each cell
    for(let i=0; i<cells.length; i++) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);

        // Check number of bombs around a cell
        if(cells[i].classList.contains('safe')) {
            // West
            if(i>0 && !isLeftEdge && cells[i-1].classList.contains('bomb')) total++;
            // North-East
            if(i>9 && !isRightEdge && cells[i+1-width].classList.contains('bomb')) total++;
            // North
            if(i>10 && cells[i-width].classList.contains('bomb')) total++;
            //North-West
            if(i>11 && !isLeftEdge && cells[i-1-width].classList.contains('bomb')) total++;
            // East
            if(i<98 && !isRightEdge && cells[i+1].classList.contains('bomb')) total++;
            // South-West
            if(i<90 && !isLeftEdge && cells[i-1+width].classList.contains('bomb')) total++;
            // South-East
            if(i<88 && !isRightEdge && cells[i+1+width].classList.contains('bomb')) total++;
            //South
            if(i<89 && cells[i+width].classList.contains('bomb')) total++;

            cells[i].setAttribute('data', total);
        }
    }
}

newGame();

// Add flag with right click
function addFlag(cell) {
    if(isGameOver) return;
    if(!cell.classList.contains('checked')) {
        // Remove flag
        if(cell.classList.contains('flag') && (flags <= numberBombs)) {
            cell.classList.remove('flag');
            cell.innerHTML = '';
            flags--;
            flagsLeft.innerHTML = numberBombs - flags;
        }
        // Add flag
        else if(!cell.classList.contains('flag') && (flags < numberBombs)){
            cell.classList.add('flag');
            cell.innerHTML = '🚩';
            flags++;
            flagsLeft.innerHTML = numberBombs - flags;
            checkWin();
        }
    }
}

// Click on cell actions
function click(cell) {
    let currentId = cell.id;
    if(isGameOver) return;
    if(cell.classList.contains('checked') || cell.classList.contains('flag')) return;
    if(cell.classList.contains('bomb')) {
        gameOver(cell);
    }
    else {
        let total = cell.getAttribute('data');
        if(total != 0) {
            cell.classList.add('checked');
            cell.innerHTML = total;
            return
        }
        checkCell(cell, currentId);
    }
    cell.classList.add('checked');
}

// Check neighbouring cells once cell is clicked
function checkCell(cell, currentId) {
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width - 1);

    setTimeout(() => {
        // West
        if(currentId>0 && !isLeftEdge) {
            const newId = cells[parseInt(currentId)-1].id;
            const newCell = document.getElementById(newId);
            click(newCell);
        }
        // North-East
        if(currentId>9 && !isRightEdge) {
            const newId = cells[parseInt(currentId)+1-width].id;
            const newCell = document.getElementById(newId);
            click(newCell);
        }
        // North
        if(currentId>10) {
            const newId = cells[parseInt(currentId)-width].id;
            const newCell = document.getElementById(newId);
            click(newCell);
        }
        // North-West
        if(currentId>11 && !isLeftEdge) {
            const newId = cells[parseInt(currentId)-1-width].id;
            const newCell = document.getElementById(newId);
            click(newCell);
        }
        // East
        if(currentId<98 && !isRightEdge) {
            const newId = cells[parseInt(currentId)+1].id;
            const newCell = document.getElementById(newId);
            click(newCell);
        }
        // South-West
        if(currentId<90 && !isLeftEdge) {
            const newId = cells[parseInt(currentId)-1+width].id;
            const newCell = document.getElementById(newId);
            click(newCell);
        }
        // South-East
        if(currentId<88 && !isRightEdge) {
            const newId = cells[parseInt(currentId)+1+width].id;
            const newCell = document.getElementById(newId);
            click(newCell);
        }
        // South
        if(currentId<89) {
            const newId = cells[parseInt(currentId)+width].id;
            const newCell = document.getElementById(newId);
            click(newCell);
        }
    }, 10);
}

// Game Over
function gameOver(cell) {
    result.innerHTML = 'GAME OVER!';
    isGameOver = true;

    // Show all bombs
    cells.forEach(cell => {
        if(cell.classList.contains('bomb')) {
            cell.innerHTML = '💣';
            cell.classList.remove('bomb');
            cell.classList.add('checked');
        }
    });
}

// Check for a win
function checkWin() {
    let matches = 0;
    for(let i=0;i<cells.length;i++) {
        if(cells[i].classList.contains('flag') && cells[i].classList.contains('bomb')) {
            matches++;
        }
        if(matches === numberBombs) {
            result.innerHTML = 'YOU WIN!';
            isGameOver = true;
            break;
        }
    }
}