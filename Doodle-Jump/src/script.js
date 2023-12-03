/* -------------------------------------------------------------------------- */
/*                         Logics before and after game                       */
/* -------------------------------------------------------------------------- */

/* ------------------- Getting elements from the HTML DOM ------------------- */
const board = document.getElementById('canvas');
const gameStartScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('over-screen');
const playBtn = document.getElementById('play-game');
const playAgainBtn = document.getElementById('play-again');
const userScore = document.getElementById('user-score');

// If high score is available use it or set 0
let highScore = localStorage.getItem('high-score') == null ? 0 : localStorage.getItem('high-score');

//Displays only the start screen
board.style.display = 'none';
gameOverScreen.style.display = 'none';

/* ------------------ Function to start/restart the game ------------------ */
playBtn.addEventListener('click', () => {
    playGame()
})

playAgainBtn.addEventListener('click', () => {
    playGame()
})


/* ------------- Displays only the game screen and hides others ------------- */
function playGame() {
    board.style.display = 'block';
    gameStartScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    startGame();
}

/* ------------- Displays the game over screen and shows scores ------------- */
function displayGameOver() {
    board.style.display = 'none';
    gameOverScreen.style.display = 'flex';

    //If current score is greater than high score set the high score to current score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('high-score', highScore);
        userScore.innerHTML = "Your score : " + score;
        userScore.innerHTML += "<br>Congratualtions !!! <br> New High Score : " + highScore;
    }
    else {
        userScore.innerHTML = "Your score : " + score;
        userScore.innerHTML += "<br>High Score : " + highScore;
    }


}




