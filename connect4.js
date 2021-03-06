/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let i = 0; i < HEIGHT; i++) {
    board.push([0]);
    for (let j = 0; j < WIDTH; j++) {
      board[i][j] = null;
    }
  }

  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board');
  // TODO: add top row on board for players to be able to select column for dropping pieces
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.classList.add('player1');
  top.addEventListener('click', handleClick);
  // Create data cell columns that will eventually hold game pieces
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: Create data cell rows that will eventually hold game pieces
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (!board[i][x]) {
      return i;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const player = `p${currPlayer}`;
  const currTC = document.getElementById(`${y}-${x}`);
  const div = document.createElement('div');
  div.classList.add('piece', player);
  currTC.append(div);
}

function hoverColor() {
  const currColTop = document.getElementById('column-top');
  currColTop.classList.toggle('player1');
  currColTop.classList.toggle('player2');
}

/** endGame: announce game end */

function stopListen() {
  const topRow = document.getElementById('column-top');
  topRow.removeEventListener('click', handleClick);
  // console.log(this.topRow);
  // this.currColTop.removeEventListener('click', handleClick);
}

function endGame(msg) {
  // stopListen.bind(hoverColor);
  setTimeout(() => {
    stopListen();
    alert(msg);
  }, 100);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  checkForTie();

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  switchPlayer();
  //Change column top hover color
}

function switchPlayer() {
  currPlayer = currPlayer === 1 ? 2 : 1;
  hoverColor();
}

function checkForTie() {
  if (board.every((boardRow) => boardRow.every((boardCol) => boardCol))) {
    return endGame("IT'S A TIE!!!");
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // Create an multidimentional array with the 4 squares needed to win
  // starting with the current played piece.
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];
      //Use the previos array to check if any of the connect four combinations
      //have won the game
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
