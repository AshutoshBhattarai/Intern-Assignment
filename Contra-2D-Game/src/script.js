/* -------------------------------------------------------------------------- */
/*                                Main Screens                                */
/* -------------------------------------------------------------------------- */
const gameScreen = document.getElementById('game-screen');
const titleScreen = document.getElementById('title-screen');
const gameOverScreen = document.getElementById('game-over-screen');
/* ----------------------------------- -- ----------------------------------- */
/* -------------------------- Title Menu Subscreens ------------------------- */
const titleMenu = document.getElementById('title-menu');
const titleDifficulty = document.getElementById('title-difficulty');
/* ----------------------------------- -- ----------------------------------- */
/* -------------------------- Game Over Sub Screens ------------------------- */
const displayCurrentScore = document.getElementById('game-over-score');
const displayHighScore = document.getElementById('game-over-high-score');
/* ----------------------------------- -- ----------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                   Buttons                                  */
/* -------------------------------------------------------------------------- */
const btnStartGame = document.getElementById('btn-start-game');
const btnDifficultlySelection = document.getElementById('btn-difficulty-selection');
const btnEasy = document.getElementById('btn-difficulty-easy');
const btnMedium = document.getElementById('btn-difficulty-medium');
const btnHard = document.getElementById('btn-difficulty-hard');
const btnDifficultyBack = document.getElementById('btn-difficulty-back');
const btnRestartGame = document.getElementById('game-over-restart');
const btnEndGame = document.getElementById('game-over-end');
/* ----------------------------------- -- ----------------------------------- */
let initialDifficulty = DIFFICULTY_EASY;
localStorage.setItem('difficulty', initialDifficulty);
let highScore = localStorage.getItem('highScore') == null ? 0 : localStorage.getItem('highScore');
let inGameTitleScreen = true;
function startGame() {
    init();
    render();
}
displayTitleScreen();
//displayGameScreen();
displayDifficulty();
buttonSoundEffects();
function displayGameScreen() {
    titleScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    inGameTitleScreen = false;
    startGame();
}
function displayTitleScreen() {
    inGameTitleScreen = true;
    titleScreen.style.display = 'flex';
    gameOverScreen.style.display = 'none';
    gameScreen.style.display = 'none';
    titleDifficulty.style.display = 'none';
    titleMenu.style.display = 'block';
    playAudio(gameAudios.title);
}
function displayGameOverScreen() {
    titleScreen.style.display = 'none';
    gameOverScreen.style.display = 'flex';
    gameScreen.style.display = 'none';
    playAudio(gameAudios.gameOverMusic);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    displayCurrentScore.innerHTML = `Your Score: ${score}`;
    displayHighScore.innerHTML = `High Score: ${highScore}`;
}

/* -------------------------------------------------------------------------- */
/*                          Button On Click Listeners                         */
/* -------------------------------------------------------------------------- */
btnStartGame.addEventListener('click', () => {
    displayGameScreen();
});
btnDifficultlySelection.addEventListener('click', () => {
    titleDifficulty.style.display = 'block';
    titleMenu.style.display = 'none';
});
btnEasy.addEventListener('click', () => {
    localStorage.setItem('difficulty', DIFFICULTY_EASY);
    initialDifficulty = localStorage.getItem('difficulty');
    displayDifficulty();
});
btnMedium.addEventListener('click', () => {
    localStorage.setItem('difficulty', DIFFICULTY_MEDIUM);
    initialDifficulty = localStorage.getItem('difficulty');
    displayDifficulty();
});
btnHard.addEventListener('click', () => {
    localStorage.setItem('difficulty', DIFFICULTY_HARD);
    initialDifficulty = localStorage.getItem('difficulty');
    displayDifficulty();
});
btnRestartGame.addEventListener('click', () => {
    displayGameScreen();
});
btnEndGame.addEventListener('click', () => {
    displayTitleScreen();
});
btnDifficultyBack.addEventListener('click', () => {
    titleDifficulty.style.display = 'none';
    titleMenu.style.display = 'block';
});
/* ----------------------------------- -- ----------------------------------- */
function displayDifficulty() {
    btnEasy.style.color = (initialDifficulty == DIFFICULTY_EASY) ? 'red' : 'white';
    btnMedium.style.color = (initialDifficulty == DIFFICULTY_MEDIUM) ? 'red' : 'white';
    btnHard.style.color = (initialDifficulty == DIFFICULTY_HARD) ? 'red' : 'white';
}

function buttonSoundEffects() {
    const buttons = document.querySelectorAll('.btn-audio');
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            playAudio(gameAudios.menuSelect);
        });
        button.addEventListener('mouseover', () => {
            playAudio(gameAudios.menuHover);
        });
    });
}
