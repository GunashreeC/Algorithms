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

  const leftBoard = document.getElementById('comparison-board-left');
  const leftResults = await solveSudoku('brute-force', unsolvedSudoku, leftBoard);

  const rightBoard = document.getElementById('comparison-board-right');
  const rightResults = await solveSudoku('pencil-and-paper', unsolvedSudoku, rightBoard);

  updateRuntimeComparisonGraph(leftResults.runtime, rightResults.runtime);
}
function updateRuntimeComparisonGraph(leftRuntime, rightRuntime) {
  const ctx = document.getElementById('runtime-chart').getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Easy', 'Medium', 'Hard', 'Evil'],
      datasets: [
        {
          label: 'Pencil-and-paper',
          data: leftRuntime,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
        },
        {
          label: 'Brute Force',
          data: rightRuntime,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: 'category',
          labels: ['Easy', 'Medium', 'Hard', 'Evil'],
          title: {
            display: true,
            text: 'Difficulty Levels',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Runtime (ms)',
          },
        },
      },
    },
  });
}