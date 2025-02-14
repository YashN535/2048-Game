// Global grid and score variables
let grid = Array.from({ length: 4 }, () => Array(4).fill(0));
let score = 0;

// For swipe detection
let startX = 0,
  startY = 0,
  endX = 0,
  endY = 0;
const swipeThreshold = 50; // Minimum pixels to qualify as a swipe

// Initialize or reset the game
function init() {
  score = 0;
  updateScore();
  grid = Array.from({ length: 4 }, () => Array(4).fill(0));
  hideGameOver();
  addNewTile();
  addNewTile();
  updateBoard();
}

// Add a new tile to a random empty cell
// Increased difficulty: 40% chance for a 2, 60% chance for a 4.
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
    grid[i][j] = Math.random() < 0.4 ? 2 : 4;
  }
}

// Update the score display
function updateScore() {
  document.getElementById("score").innerText = score;
}

// Render the game board
function updateBoard() {
  const container = document.getElementById("gameContainer");
  container.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const value = grid[i][j];
      let tile = document.createElement("div");
      tile.classList.add("tile");
      if (value !== 0) {
        tile.innerText = value;
        tile.classList.add(`tile-${value}`);
        tile.classList.add("new-tile");
      }
      container.appendChild(tile);
    }
  }
}

// Slide non-zero numbers to the left in a row
function slide(row) {
  let arr = row.filter((val) => val !== 0);
  while (arr.length < 4) {
    arr.push(0);
  }
  return arr;
}

// Merge tiles in a row and update the score
function merge(row) {
  for (let i = 0; i < 3; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  return row;
}

// Helper to compare two arrays
function arraysEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

// Move left: process each row
function moveLeft() {
  let moved = false;
  for (let i = 0; i < 4; i++) {
    let original = grid[i].slice();
    let row = slide(original);
    row = merge(row);
    row = slide(row);
    grid[i] = row;
    if (!arraysEqual(original, row)) {
      moved = true;
    }
  }
  return moved;
}

// Move right: reverse, process as left, then reverse back
function moveRight() {
  let moved = false;
  for (let i = 0; i < 4; i++) {
    let original = grid[i].slice();
    let row = grid[i].slice().reverse();
    row = slide(row);
    row = merge(row);
    row = slide(row);
    row.reverse();
    grid[i] = row;
    if (!arraysEqual(original, row)) {
      moved = true;
    }
  }
  return moved;
}

// Transpose the grid (rows become columns)
function transpose(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

// Move up: transpose, move left, then transpose back
function moveUp() {
  grid = transpose(grid);
  let moved = moveLeft();
  grid = transpose(grid);
  return moved;
}

// Move down: transpose, move right, then transpose back
function moveDown() {
  grid = transpose(grid);
  let moved = moveRight();
  grid = transpose(grid);
  return moved;
}

// Check if there are no moves left (game over)
function checkGameOver() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) return false;
    }
  }
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i][j] === grid[i][j + 1]) return false;
    }
  }
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 3; i++) {
      if (grid[i][j] === grid[i + 1][j]) return false;
    }
  }
  return true;
}

// Display the game over overlay
function showGameOver() {
  document.getElementById("gameOverOverlay").style.display = "block";
}

// Hide the game over overlay
function hideGameOver() {
  document.getElementById("gameOverOverlay").style.display = "none";
}

// Handle move input (from keyboard or gesture)
function handleMove(direction) {
  let moved = false;
  switch (direction) {
    case "ArrowLeft":
      moved = moveLeft();
      break;
    case "ArrowRight":
      moved = moveRight();
      break;
    case "ArrowUp":
      moved = moveUp();
      break;
    case "ArrowDown":
      moved = moveDown();
      break;
  }
  if (moved) {
    addNewTile();
    updateBoard();
    updateScore();
    if (checkGameOver()) {
      showGameOver();
    }
  }
}

// Keyboard controls
document.addEventListener("keydown", (event) => {
  handleMove(event.key);
});

/* --- Mobile Gesture Detection using Pointer and Touch Events --- */
function onStart(e) {
  if (e.type === "pointerdown") {
    startX = e.clientX;
    startY = e.clientY;
  } else if (e.type === "touchstart") {
    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;
  }
}

function onEnd(e) {
  if (e.type === "pointerup") {
    endX = e.clientX;
    endY = e.clientY;
  } else if (e.type === "touchend") {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
  }
  processSwipe();
}

function processSwipe() {
  const dx = endX - startX;
  const dy = endY - startY;
  if (Math.abs(dx) < swipeThreshold && Math.abs(dy) < swipeThreshold) return;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      handleMove("ArrowRight");
    } else {
      handleMove("ArrowLeft");
    }
  } else {
    if (dy > 0) {
      handleMove("ArrowDown");
    } else {
      handleMove("ArrowUp");
    }
  }
}

// Add pointer and touch event listeners for swipe gestures
document.addEventListener("pointerdown", onStart);
document.addEventListener("pointerup", onEnd);
document.addEventListener("touchstart", onStart, { passive: true });
document.addEventListener("touchend", onEnd, { passive: true });

// Prevent default touchmove behavior (e.g. pull-to-refresh)
// document.addEventListener(
//   "touchmove",
//   function (e) {
//     e.preventDefault();
//   },
//   { passive: false }
// );

document.getElementById("gameContainer").addEventListener(
  "touchmove",
  function (e) {
    e.preventDefault(); // This prevents the default pull-to-refresh inside your game area
  },
  { passive: false }
);

// Bind retry buttons (both header and overlay) to reset the game
document.getElementById("retryBtnHeader").addEventListener("click", init);
document.getElementById("retryBtnOverlay").addEventListener("click", init);

// Start the game
init();
