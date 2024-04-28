
const board = document.getElementById('canvas');
const gameStartScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('over-screen');
const playBtn = document.getElementById('play-game');
const playAgainBtn = document.getElementById('play-again');
const userScore = document.getElementById('user-score');

let highScore = localStorage.getItem('high-score') ?? 0;

board.style.display = 'none';
gameOverScreen.style.display = 'none';

playBtn.addEventListener('click', () => {
    playGame()
})

playAgainBtn.addEventListener('click', () => {
    playGame()
})


function playGame() {
    board.style.display = 'block';
    gameStartScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    startGame();
}

function displayGameOver() {
    board.style.display = 'none';
    gameOverScreen.style.display = 'flex';

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('high-score', highScore);
        userScore.innerHTML = "Your score : " + score;
        userScore.innerHTML += "<br>Congratulations !!! <br> New High Score : " + highScore;
    }
    else {
        userScore.innerHTML = "Your score : " + score;
        userScore.innerHTML += "<br>High Score : " + highScore;
    }
}




