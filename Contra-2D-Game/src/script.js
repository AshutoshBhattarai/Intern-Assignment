/* -------------------------------------------------------------------------- */
/*                                Main Screens                                */
/* -------------------------------------------------------------------------- */
const gameScreen = document.getElementById('game-screen');
const titleScreen = document.getElementById('title-screen');
const gameOverScreen = document.getElementById('game-over-screen');

const titleMenu = document.getElementById('title-menu');
const titleDifficulty = document.getElementById('title-difficulty');

const displayCurrentScore = document.getElementById('game-over-score');
const displayHighScore = document.getElementById('game-over-high-score');

const btnStartGame = document.getElementById('btn-start-game');
const btnDifficultlySelection = document.getElementById('btn-difficulty-selection');
const btnEasy = document.getElementById('btn-difficulty-easy');
const btnMedium = document.getElementById('btn-difficulty-medium');
const btnHard = document.getElementById('btn-difficulty-hard');
const btnDifficultyBack = document.getElementById('btn-difficulty-back');
const btnRestartGame = document.getElementById('game-over-restart');
const btnEndGame = document.getElementById('game-over-end');



let initialDifficulty = DIFFICULTY_EASY;
localStorage.setItem('difficulty', initialDifficulty);
let highScore = localStorage.getItem('highScore') == null ? 0 : localStorage.getItem('highScore');
const titleMusic = new Audio(gameAudios.title);
const gameOverMusic = new Audio(gameAudios.gameOverMusic);

function startGame() {
    init();
    render();
}


displayTitleScreen();
displayDifficulty();
buttonSoundEffects();

function displayGameScreen() {
    titleScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    startGame();
    titleMusic.pause();
    gameOverMusic.pause();

}

function displayTitleScreen() {
    titleScreen.style.display = 'flex';
    gameOverScreen.style.display = 'none';
    gameScreen.style.display = 'none';
    titleDifficulty.style.display = 'none';
    titleMenu.style.display = 'block';
    titleMusic.play();
    gameOverMusic.pause();
}

function displayGameOverScreen() {
    titleScreen.style.display = 'none';
    gameOverScreen.style.display = 'flex';
    gameScreen.style.display = 'none';
    gameOverMusic.play();
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    displayCurrentScore.innerHTML = `Your Score: ${score}`;
    displayHighScore.innerHTML = `High Score: ${highScore}`;
}

/* --------------------- Button On Click Listeners -------------------------- */
btnStartGame.addEventListener('click', () => {
    displayGameScreen();
});
// Show difficulty selection section in menu
btnDifficultlySelection.addEventListener('click', () => {
    titleDifficulty.style.display = 'block';
    titleMenu.style.display = 'none';
});
// Select easy difficulty
btnEasy.addEventListener('click', () => {
    localStorage.setItem('difficulty', DIFFICULTY_EASY);
    initialDifficulty = localStorage.getItem('difficulty');
    displayDifficulty();
});
// Select medium difficulty
btnMedium.addEventListener('click', () => {
    localStorage.setItem('difficulty', DIFFICULTY_MEDIUM);
    initialDifficulty = localStorage.getItem('difficulty');
    displayDifficulty();
});
// Select hard difficulty
btnHard.addEventListener('click', () => {
    localStorage.setItem('difficulty', DIFFICULTY_HARD);
    initialDifficulty = localStorage.getItem('difficulty');
    displayDifficulty();
});


btnRestartGame.addEventListener('click', () => {
    displayGameScreen();
});

// Go back to the title screen
btnEndGame.addEventListener('click', () => {
    displayTitleScreen();
});


btnDifficultyBack.addEventListener('click', () => {
    titleDifficulty.style.display = 'none';
    titleMenu.style.display = 'block';
});


/* --------------------- Show Selected difficulty -------------------------- */
function displayDifficulty() {
    btnEasy.style.color = (initialDifficulty == DIFFICULTY_EASY) ? 'red' : 'white';
    btnMedium.style.color = (initialDifficulty == DIFFICULTY_MEDIUM) ? 'red' : 'white';
    btnHard.style.color = (initialDifficulty == DIFFICULTY_HARD) ? 'red' : 'white';
}


/* --------------------- Apply sound effects to buttons --------------------- */
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
