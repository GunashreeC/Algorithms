// comparison.js

// Unsolved Sudoku for comparison
const unsolvedSudoku = [
  [5, 3, null, null, 7, null, null, null, null],
  [6, null, null, 1, 9, 5, null, null, null],
  [null, 9, 8, null, null, null, null, 6, null],
  [8, null, null, null, 6, null, null, null, 3],
  [4, null, null, 8, null, 3, null, null, 1],
  [7, null, null, null, 2, null, null, null, 6],
  [null, 6, null, null, null, null, 2, 8, null],
  [null, null, null, 4, 1, 9, null, null, 5],
  [null, null, null, null, 8, null, null, 7, 9],
];

// Brute Force solution
const bruteForceSolution = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

// Pencil and Paper solution
const pencilAndPaperSolution = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

document.addEventListener('DOMContentLoaded', function () {
  loadSudokuSolution('comparison-board-left', unsolvedSudoku); // Load unsolved Sudoku on the left
  loadSudokuSolution('comparison-board-right', unsolvedSudoku); // Load unsolved Sudoku on the right
});

function loadSudokuSolution(boardId, solution) {
  const board = document.getElementById(boardId);
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = solution[i][j] !== null ? solution[i][j] : '';
      board.appendChild(cell);
    }
  }
}

async function startComparison() {
  const gapElement = createGapElement();
  document.getElementById('comparison-container').appendChild(gapElement);

  // Apply brute force method to the left Sudoku
  const leftBoard = document.getElementById('comparison-board-left');
  await solveSudoku('brute-force', leftBoard);

  // Apply pencil and paper method to the right Sudoku
  const rightBoard = document.getElementById('comparison-board-right');
  await solveSudoku('pencil-and-paper', rightBoard);
}

function createGapElement() {
  const gapElement = document.createElement('div');
  gapElement.style.width = '20px'; // Adjust the gap width as needed
  return gapElement;
}

async function solveSudoku(method, board) {
  const startTime = performance.now();

  // Clear the board before solving
  clearBoard(board);

  if (method === 'brute-force') {
    await bruteForceSolve(0, 0, board);
  } else if (method === 'pencil-and-paper') {
    await pencilAndPaperSolve(board);
  }

  alert(`Sudoku solved using ${method} method in ${formatTime(performance.now() - startTime)}!`);
}

function clearBoard(board) {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
}

function formatTime(milliseconds) {
  const seconds = (milliseconds / 1000).toFixed(2);
  return seconds + ' seconds';
}