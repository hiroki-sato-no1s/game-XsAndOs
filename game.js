const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const state = {
  board: Array(9).fill(null),
  currentPlayer: "X",
  gameOver: false,
  winningLine: null,
  scores: { X: 0, O: 0 },
};

const statusEl = document.getElementById("status");
const boardEl = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const scoreXEl = document.getElementById("score-x");
const scoreOEl = document.getElementById("score-o");
const resetBtn = document.getElementById("reset-btn");

function checkWinner(board) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return { winner: null, line: null };
}

function isDraw(board) {
  return board.every((cell) => cell !== null);
}

function handleCellClick(index) {
  if (state.gameOver || state.board[index] !== null) {
    return;
  }

  state.board[index] = state.currentPlayer;

  const { winner, line } = checkWinner(state.board);

  if (winner) {
    state.gameOver = true;
    state.winningLine = line;
    state.scores[winner]++;
  } else if (isDraw(state.board)) {
    state.gameOver = true;
  } else {
    state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
  }

  render();
}

function resetBoard() {
  state.board = Array(9).fill(null);
  state.currentPlayer = "X";
  state.gameOver = false;
  state.winningLine = null;
  render();
}

function render() {
  cells.forEach((cell, index) => {
    const value = state.board[index];
    cell.textContent = value ?? "";
    cell.className = "cell";
    cell.disabled = state.gameOver || value !== null;

    if (value === "X") {
      cell.classList.add("x");
    } else if (value === "O") {
      cell.classList.add("o");
    }

    if (state.winningLine && state.winningLine.includes(index)) {
      cell.classList.add("win");
    }
  });

  scoreXEl.textContent = state.scores.X;
  scoreOEl.textContent = state.scores.O;

  statusEl.className = "status";

  if (state.gameOver) {
    const { winner } = checkWinner(state.board);
    if (winner) {
      statusEl.textContent = `Player ${winner} の勝ち！`;
      statusEl.classList.add(winner === "X" ? "winner-x" : "winner-o");
    } else {
      statusEl.textContent = "引き分け";
      statusEl.classList.add("draw");
    }
  } else {
    statusEl.textContent = `Player ${state.currentPlayer} の番です`;
  }
}

cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    handleCellClick(Number(cell.dataset.index));
  });
});

resetBtn.addEventListener("click", resetBoard);

render();
