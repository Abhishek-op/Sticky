let isJumping = false, isEndGame = true, dinoPosition = 0, timerGameId, timerControlObstaclesId = [];
const GRAVITY = 0.9;
const MAX_JUMP_HIGH = 200;

function controller(e) {
  if (e.keyCode === 13 && isEndGame) {
    isEndGame = false;
    document.querySelector('.title').innerHTML = '';
    document.querySelector('body').classList.remove('stop');
    loopGame();
    return;
  }
  if ((e.keyCode === 32 || e.keyCode === 38) && !isJumping) {
    jump();
  }

}

function jump() {
  const dino = document.querySelector('.dino');
  isJumping = true;
  let timerUpId = setInterval(() => {
    // * MOVE UP
    dinoPosition += 30;
    dinoPosition = dinoPosition * GRAVITY;
    dino.style.bottom = `${dinoPosition}px`;


    if (dinoPosition >= MAX_JUMP_HIGH) {
      // * MOVE DOWN
      clearInterval(timerUpId);
      let timerDownId = setInterval(() => {
        if (dinoPosition <= 0) {
          clearInterval(timerDownId);
          dino.style.bottom = '0px';
          isJumping = false;
          return;
        }
        dinoPosition -= 5;
        dinoPosition = dinoPosition * GRAVITY;
        dino.style.bottom = `${dinoPosition}px`;
      }, 20);
    }
  }, 20);


}

function controlObstacle(obstaclePosition, obstacle) {
  let timerControlObstacleId = setInterval(function () {

    // * Conditions to game over
    if (obstaclePosition > 0 && obstaclePosition < 60 && dinoPosition < 60) {
      clearInterval(timerGameId);
      timerControlObstaclesId.forEach(id => clearInterval(id));
      document.querySelector('body').classList.add('stop');
      document.querySelector('.title').innerHTML = 'Game Over... Press enter to reset';
      isEndGame = true;
    }
    if (!isEndGame) {
      obstaclePosition -= 10;
      obstacle.style.left = `${obstaclePosition}px`;
    }
  }, 20);
  timerControlObstaclesId.push(timerControlObstacleId);
}

function generateObstacle() {
  const scene = document.querySelector('.scene');
  const obstaclePosition = window.screen.width - 50;
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  scene.appendChild(obstacle);
  obstacle.style.left = obstaclePosition;
  controlObstacle(obstaclePosition, obstacle);
}

function resetGame() {
  document.querySelectorAll('.obstacle').forEach(elem => {
    elem.remove();
  });
  clearInterval(timerGameId);
}

function loopGame() {
  if (!isEndGame) {
    resetGame();
    generateObstacle();
    const randomTime = Math.random() * 4000;
    timerGameId = setInterval(generateObstacle, randomTime);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener('keyup', controller);
});