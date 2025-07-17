// Tic Tac Toe Game (converted from Python to JS with UI integration)

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let isGameOver = false;
let isVsComputer = true;
let playerLetter = 'X';
let computerLetter = 'O';
let aiMode = 'normal'; // 'normal' hoặc 'hard'


let playerScore = 0;
let opponentScore = 0;
let draws = 0;

const board = document.getElementById('board');
const letterChoice = document.getElementById('letterChoice');
const message = document.getElementById('message');
const playerScoreDisplay = document.getElementById('playerScore');
const opponentScoreDisplay = document.getElementById('opponentScore');
const drawsDisplay = document.getElementById('draws');
const scoreboard = document.getElementById('scoreboard');
const restartBtn = document.getElementById('restartBtn');
const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel = document.getElementById('settingsPanel');
const gearIcon = document.getElementById('gearIcon');

settingsToggle.addEventListener('click', () => {
  settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
  gearIcon.style.transition = 'transform 0.5s';
  gearIcon.style.transform = 'rotate(360deg)';
  setTimeout(() => {
    gearIcon.style.transform = 'rotate(0deg)';
  }, 500);
});


////////////////////////////////////////////////////////////
function startGame(letter) {
  playerLetter = letter;
  computerLetter = letter === 'X' ? 'O' : 'X';
  currentPlayer = 'X';
  isGameOver = false;
  gameBoard = ['', '', '', '', '', '', '', '', ''];

  // Ẩn vùng chọn sau khi bắt đầu
  letterChoice.classList.add('hidden');
  letterChoice.classList.remove('visible');

  const modeChoice = document.getElementById('modeChoice');
  if (modeChoice) {
    modeChoice.classList.add('hidden');
    modeChoice.classList.remove('visible');
  }

  scoreboard.style.display = 'flex';
  board.style.display = 'grid';
  message.textContent = '';
  restartBtn.style.display = 'none';

  drawBoard();

  if (playerLetter === 'O') {
    currentPlayer = computerLetter;
    setTimeout(computerMove, 500);
  }
}


function drawBoard() {
  board.innerHTML = '';
  gameBoard.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    cellDiv.textContent = cell;
    cellDiv.addEventListener('click', () => handleMove(index));
    board.appendChild(cellDiv);
  });
}


function handleMove(index) {
  if (isGameOver || gameBoard[index]) return;

  gameBoard[index] = currentPlayer;
  drawBoard();

  if (checkWinner(currentPlayer)) {
    endGame(currentPlayer);
    return;
  }

  if (isDraw()) {
    endGame('draw');
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  if (isVsComputer && currentPlayer === computerLetter) {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  let move = null;

  if (aiMode === 'hard') {
    move = getBestMoveMinimax(computerLetter);
  } else {
    move = getBestMove(computerLetter);
  }

  if (move === null) {
    let available = gameBoard
      .map((val, idx) => (val === '' ? idx : null))
      .filter(val => val !== null);
    move = available[Math.floor(Math.random() * available.length)];
  }

  gameBoard[move] = computerLetter;
  drawBoard();

  if (checkWinner(computerLetter)) {
    endGame(computerLetter);
    return;
  }

  if (isDraw()) {
    endGame('draw');
    return;
  }

  currentPlayer = playerLetter;
}


function getBestMove(letter) {
  const opponent = letter === 'X' ? 'O' : 'X';
  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] === '') {
      gameBoard[i] = letter;
      if (checkWinner(letter)) {
        gameBoard[i] = '';
        return i;
      }
      gameBoard[i] = '';
    }
  }
  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] === '') {
      gameBoard[i] = opponent;
      if (checkWinner(opponent)) {
        gameBoard[i] = '';
        return i;
      }
      gameBoard[i] = '';
    }
  }
  return null;
}

function checkWinner(player) {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return wins.some(combo => combo.every(i => gameBoard[i] === player));
}

function isDraw() {
  return gameBoard.every(cell => cell !== '');
}

function endGame(result) {
  isGameOver = true;
  restartBtn.style.display = 'inline-block';

  if (result === 'draw') {
    message.textContent = 'Hòa!';
    draws++;
  } else {
    if (result === playerLetter) {
      message.textContent = 'Bạn thắng!';
      playerScore++;
    } else {
      message.textContent = 'Máy thắng!';
      opponentScore++;
      [playerLetter, computerLetter] = [computerLetter, playerLetter];
    }
  }
  updateScore();
  document.getElementById('resetAllBtn').style.display = 'inline-block';

}

function updateScore() {
  playerScoreDisplay.textContent = playerScore;
  opponentScoreDisplay.textContent = opponentScore;
  drawsDisplay.textContent = draws;
}

function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  isGameOver = false;
  message.textContent = '';
  restartBtn.style.display = 'none';
  currentPlayer = 'X';
  drawBoard();

  if (playerLetter === 'O') {
    currentPlayer = computerLetter;
    setTimeout(computerMove, 500);
  }
}

function getBestMoveMinimax(letter) {
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] === '') {
      gameBoard[i] = letter;
      let score = minimax(gameBoard, 0, false, letter);
      gameBoard[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}
// thuat toan minimax cho che do kho
function minimax(board, depth, isMaximizing, player) {
  const opponent = player === 'X' ? 'O' : 'X';

  if (checkWinner(player)) return 10 - depth;
  if (checkWinner(opponent)) return depth - 10;
  if (isDraw()) return 0;

  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = isMaximizing ? player : opponent;
      const score = minimax(board, depth + 1, !isMaximizing, player);
      board[i] = '';
      bestScore = isMaximizing
        ? Math.max(score, bestScore)
        : Math.min(score, bestScore);
    }
  }
  return bestScore;
}


function resetToStart() {
  // Reset all game variables to their initial state
  currentPlayer = 'X';
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  isGameOver = false;
  playerScore = 0;
  opponentScore = 0;
  draws = 0;

  // Reset UI elements
  message.textContent = '';
  restartBtn.style.display = 'none';
  document.getElementById('resetAllBtn').style.display = 'none';

  // Hiện lại vùng chọn
  letterChoice.classList.remove('hidden');
  letterChoice.classList.add('visible');

  scoreboard.style.display = 'none';
  board.style.display = 'none';

  const modeChoice = document.getElementById('modeChoice');
  if (modeChoice) {
    modeChoice.classList.remove('hidden');
    modeChoice.classList.add('visible');
  }

  updateScore();
}



