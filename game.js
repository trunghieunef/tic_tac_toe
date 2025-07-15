let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let isGameOver = false;
let isVsComputer = true;
let playerLetter = 'X';
let computerLetter = 'O';

let playerScore = 0;
let opponentScore = 0;
let draws = 0;

// DOM elements
const board = document.getElementById('board');
const letterChoice = document.getElementById('letterChoice');
const message = document.getElementById('message');
const playerScoreDisplay = document.getElementById('playerScore');
const opponentScoreDisplay = document.getElementById('opponentScore');
const drawsDisplay = document.getElementById('draws');

// Chọn chế độ chơi
function selectMode(mode) {
  resetBoard();
  if (mode === '1P') {
    isVsComputer = true;
    letterChoice.style.display = 'block';
  } else {
    isVsComputer = false;
    letterChoice.style.display = 'none';
    startGame('X');
  }
}

// Bắt đầu game sau khi chọn X hoặc O
function startGame(letter) {
  playerLetter = letter;
  computerLetter = letter === 'X' ? 'O' : 'X';
  currentPlayer = 'X';
  letterChoice.style.display = 'none';
  drawBoard();
}

// Vẽ bàn cờ
function drawBoard() {
  board.innerHTML = '';
  gameBoard.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.textContent = cell;
    cellDiv.addEventListener('click', () => handleMove(index));
    board.appendChild(cellDiv);
  });
}

// Xử lý lượt chơi
function handleMove(index) {
  if (isGameOver || gameBoard[index]) return;

  // Người chơi
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

  // Máy chơi
  if (isVsComputer && currentPlayer === computerLetter) {
    setTimeout(() => {
      computerMove();
    }, 500);
  }
}

// Máy tính chọn ô ngẫu nhiên
function computerMove() {
  let available = gameBoard
    .map((val, idx) => (val === '' ? idx : null))
    .filter(val => val !== null);

  if (available.length === 0) return;

  let move = available[Math.floor(Math.random() * available.length)];
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

// Kiểm tra chiến thắng
function checkWinner(player) {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  return wins.some(combo =>
    combo.every(i => gameBoard[i] === player)
  );
}

// Kiểm tra hòa
function isDraw() {
  return gameBoard.every(cell => cell !== '');
}

// Kết thúc trò chơi
function endGame(result) {
  isGameOver = true;
  if (result === 'draw') {
    message.textContent = 'Hòa!';
    draws++;
  } else {
    if (result === playerLetter) {
      message.textContent = 'Bạn thắng!';
      playerScore++;
    } else {
      message.textContent = isVsComputer ? 'Máy thắng!' : 'Người chơi 2 thắng!';
      opponentScore++;
    }
  }
  updateScore();
}

// Cập nhật bảng điểm
function updateScore() {
  playerScoreDisplay.textContent = playerScore;
  opponentScoreDisplay.textContent = opponentScore;
  drawsDisplay.textContent = draws;
}

// Reset ván chơi
function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  isGameOver = false;
  message.textContent = '';
  currentPlayer = 'X';
  drawBoard();
}
function toggleMode() {
  const isTwoPlayer = document.getElementById('modeToggle').checked;

  resetGame();
  if (isTwoPlayer) {
    selectMode('2P');
  } else {
    selectMode('1P');
  }
}
