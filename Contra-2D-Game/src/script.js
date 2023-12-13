const gameScreen = document.getElementById('game-screen');
const titleScreen = document.getElementById('title-screen');
const startGame = document.getElementById('start-game');
const difficultlySelection = document.getElementById('difficulty-selection');
const gameOverScreen = document.getElementById('game-over-screen');
const displayCurrentScore = document.getElementById('game-over-score');
const displayHighScore = document.getElementById('game-over-high-score');
const restartGame = document.getElementById('game-over-restart');
const endGame = document.getElementById('game-over-end');

function displayGameScreen()
{   
    titleScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameScreen.style.display = 'flex';

}
displayGameScreen();