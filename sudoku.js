const initialPuzzle = [
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
  
  let puzzle;
  
  function compareSudoku() {
    window.location.href = 'comparison.html';
  }
  

  function initializeBoard() {
    puzzle = generateRandomBoard(); // Generate a random Sudoku board
    const board = document.getElementById('sudoku-board');
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell-${i}-${j}`;
        cell.textContent = puzzle[i][j] !== null ? puzzle[i][j] : '';
        cell.addEventListener('click', () => handleClick(i, j));
        board.appendChild(cell);
      }
    }
  }
  
  function generateRandomBoard() {
    const randomBoard = [];
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
    // Shuffle the numbers array
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
  
    // Create a valid Sudoku board based on the shuffled numbers
    for (let i = 0; i < 9; i++) {
      const row = [];
      for (let j = 0; j < 9; j++) {
        const numIndex = (i * 3 + Math.floor(i / 3) + j) % 9;
        row.push(numbers[numIndex]);
      }
      randomBoard.push(row);
    }
  
    // Add null values for empty cells
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (Math.random() < 0.5) {
          randomBoard[i][j] = null;
        }
      }
    }
  
    return randomBoard;
  }
  
  
  function handleClick(row, col) {
    const cellValue = prompt('Enter a number (1-9):');
    if (isValidMove(row, col, parseInt(cellValue))) {
      puzzle[row][col] = parseInt(cellValue);
      updateBoard();
    } else {
      alert('Invalid move. Please try again.');
    }
  }
  
  function isValidMove(row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (puzzle[row][i] === num || puzzle[i][col] === num || puzzle[Math.floor(row / 3) * 3 + Math.floor(i / 3)][Math.floor(col / 3) * 3 + i % 3] === num) {
        return false;
      }
    }
    return true;
  }
  
  function updateBoard() {
    const board = document.getElementById('sudoku-board');
    const cells = board.getElementsByClassName('cell');
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const cell = cells[i * 9 + j];
        cell.textContent = puzzle[i][j] !== null ? puzzle[i][j] : '';
        cell.classList.remove('solved');
      }
    }
  }
  
  function solveSudoku(method) {
    const startTime = performance.now(); // Record start time
  
    if (method === 'brute-force') {
      bruteForceSolve(0, 0);
    } else if (method === 'pencil-and-paper') {
      pencilAndPaperSolve();
    }
    updateBoard();
    alert(`Sudoku solved using ${method} method!`);
  }
  
  function formatTime(milliseconds) {
    const seconds = (milliseconds / 1000).toFixed(2);
    return seconds + ' seconds';
  }
  
  async function bruteForceSolve(row, col) {
    if (row === 9) {
      alert('Sudoku solved using brute force!');
      return true;
    }
  
    if (initialPuzzle[row][col] !== null) {
      await sleep(10); // Adjusted sleep time for visualization
      return bruteForceSolve(col === 8 ? row + 1 : row, (col + 1) % 9);
    }
  
    for (let num = 1; num <= 9; num++) {
      if (isValidMove(row, col, num)) {
        puzzle[row][col] = num;
        document.getElementById(`cell-${row}-${col}`).classList.add('solved');
        updateBoard();
        await sleep(10); // Adjusted sleep time for visualization
        if (await bruteForceSolve(col === 8 ? row + 1 : row, (col + 1) % 9)) {
          return true;
        }
        puzzle[row][col] = null; // Backtrack
        document.getElementById(`cell-${row}-${col}`).classList.remove('solved');
        updateBoard();
        await sleep(10); // Adjusted sleep time for visualization
      }
    }
  
    return false; // No solution found
  }

async function pencilAndPaperSolve() {
  let changesMade = true;
  while (changesMade) {
    changesMade = false;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzle[i][j] === null) {
          const possibilities = getPossibilities(i, j);

          // Method 1: Unique missing candidate
          if (uniqueMissingCandidate(i, j, possibilities)) {
            changesMade = true;
          }

          // Method 2: Naked single method
          if (!changesMade && nakedSingleMethod(i, j, possibilities)) {
            changesMade = true;
          }

          if (possibilities.length === 1) {
            puzzle[i][j] = possibilities[0];
            document.getElementById(`cell-${i}-${j}`).classList.add('solved');
            changesMade = true;
            updateBoard();
            await sleep(50); // Adjusted sleep time for visualization
          }
        }
      }
    }
  }
}

// Method 1: Unique missing candidate
function uniqueMissingCandidate(row, col, possibilities) {
  for (let num of possibilities) {
    if (isUniqueMissingCandidate(row, col, num)) {
      puzzle[row][col] = num;
      document.getElementById(`cell-${row}-${col}`).classList.add('solved');
      updateBoard();
      return true;
    }
  }
  return false;
}

function isUniqueMissingCandidate(row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (puzzle[i][col] === null && i !== row && getPossibilities(i, col).includes(num)) {
      return false;
    }

    if (puzzle[row][i] === null && i !== col && getPossibilities(row, i).includes(num)) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (puzzle[i][j] === null && (i !== row || j !== col) && getPossibilities(i, j).includes(num)) {
        return false;
      }
    }
  }

  return true;
}

// Method 2: Naked single method
function nakedSingleMethod(row, col, possibilities) {
  if (possibilities.length === 0) {
    return false;
  }

  for (let num of possibilities) {
    let count = 0;

    for (let i = 0; i < 9; i++) {
      if (puzzle[i][col] === null && i !== row && getPossibilities(i, col).includes(num)) {
        count++;
      }

      if (puzzle[row][i] === null && i !== col && getPossibilities(row, i).includes(num)) {
        count++;
      }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (puzzle[i][j] === null && (i !== row || j !== col) && getPossibilities(i, j).includes(num)) {
          count++;
        }
      }
    }

    if (count === 0) {
      puzzle[row][col] = num;
      document.getElementById(`cell-${row}-${col}`).classList.add('solved');
      updateBoard();
      return true;
    }
  }

  return false;
}

  
  function getPossibilities(row, col) {
    const possibilities = [];
    for (let num = 1; num <= 9; num++) {
      if (isValidMove(row, col, num)) {
        possibilities.push(num);
      }
    }
    return possibilities;
  }
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  function resetBoard() {
    initializeBoard();
  }
  
  // Initialize the board on page load
  window.onload = initializeBoard;
  