// Create a 4 x 4 grid of squares
let grid = Array.from({ length: 4 }, () => Array(4).fill(0));

// Initialize the game
function init() {
  addNewTile();
  addNewTile();
  updateBoard();
}

// Add a new tile (2 or 4) to a random empty square
function addNewTile() {
  let emptyCells = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push({ i, j });
      }
    }
  }
  if (emptyCells.length > 0) {
    let { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[i][j] = Math.random() < 0.9 ? 2 : 4;
  }
}

// Update the board display
function updateBoard() {
  const container = document.getElementById("gameContainer");
  container.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let tile = document.createElement("div");
      tile.classList.add("tile");
      const value = grid[i][j];
      if (value !== 0) {
        tile.innerText = value;
        tile.classList.add(`tile-${value}`);
        tile.classList.add("new-tile");
      }
      container.appendChild(tile);
    }
  }
}

// Helper functions to slide and merge rows
function slide(row) {
  let arr = row.filter((val) => val !== 0);
  while (arr.length < 4) {
    arr.push(0);
  }
  return arr;
}

function merge(row) {
  for (let i = 0; i < 3; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
    }
  }
  return row;
}

// Move Left: Process each row
function moveLeft() {
  let moved = false;
  for (let i = 0; i < 4; i++) {
    let oldRow = grid[i].slice();
    let newRow = slide(oldRow);
    newRow = merge(newRow);
    newRow = slide(newRow);
    grid[i] = newRow;
    if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
      moved = true;
    }
  }
  return moved;
}

// Move Right: Reverse each row, process like moveLeft, then reverse back
function moveRight() {
  let moved = false;
  for (let i = 0; i < 4; i++) {
    let oldRow = grid[i].slice();
    let reversed = oldRow.slice().reverse();
    let newRow = slide(reversed);
    newRow = merge(newRow);
    newRow = slide(newRow);
    newRow.reverse();
    grid[i] = newRow;
    if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
      moved = true;
    }
  }
  return moved;
}

// Helper to transpose a matrix (used for vertical moves)
function transpose(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

// Move Up: Transpose, process as left move, then transpose back
function moveUp() {
  let moved = false;
  let transposed = transpose(grid);
  for (let i = 0; i < 4; i++) {
    let oldRow = transposed[i].slice();
    let newRow = slide(oldRow);
    newRow = merge(newRow);
    newRow = slide(newRow);
    transposed[i] = newRow;
    if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
      moved = true;
    }
  }
  grid = transpose(transposed);
  return moved;
}

// Move Down: Transpose, reverse each row, process as left move, then reverse and transpose back
function moveDown() {
  let moved = false;
  let transposed = transpose(grid);
  for (let i = 0; i < 4; i++) {
    let oldRow = transposed[i].slice();
    let reversed = oldRow.slice().reverse();
    let newRow = slide(reversed);
    newRow = merge(newRow);
    newRow = slide(newRow);
    newRow.reverse();
    transposed[i] = newRow;
    if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
      moved = true;
    }
  }
  grid = transpose(transposed);
  return moved;
}

// Listen for key events to move the tiles
document.addEventListener("keydown", (event) => {
  let moved = false;
  if (event.key === "ArrowUp") {
    moved = moveUp();
  } else if (event.key === "ArrowDown") {
    moved = moveDown();
  } else if (event.key === "ArrowLeft") {
    moved = moveLeft();
  } else if (event.key === "ArrowRight") {
    moved = moveRight();
  }
  if (moved) {
    addNewTile();
    updateBoard();
  }
});

// Start the game
init();
