const gameBoard = document.getElementById("game-board");
const scoreInfo = document.getElementById("score-info");
const restartButton = document.getElementById("restart-button");
const bestScoreInfo = document.getElementById("best-score");


// рисуем на канвасе
const context = gameBoard.getContext("2d");

// цвета объектов
const boardColor = "black";
const snakeColor = "cyan";
const foodColor = "crimson";

const boardWidth = gameBoard.width;
const boardHeight = gameBoard.height;
const cellSize = 30;

// инициализация змейки на карте
const initialSnake = [
    { x: cellSize * 10, y: 230 },
    { x: cellSize * 9, y: 230 },
];
let snake = JSON.parse(JSON.stringify(initialSnake));
let snakeHead = {
    x: snake[0].x,
    y: snake[0].y,
};
const food = {
    x: 0,
    y: 0,
};
const velocity = {
    x: cellSize,
    y: 0,
};
let score = 0;
let interval;

// рисование полотна игры
function drawBoard() {
    context.fillStyle = boardColor;
    context.fillRect(0, 0, boardWidth, boardHeight);
}
// придаем змейке цвет
function drawSnake() {
    for(let index = 0; index < snake.length; index++) {
        const snakePart = snake[index];
        if(
            index !== 0 &&
            snakePart.x === snakeHead.x &&
            snakePart.y === snakeHead.y
        ) {
            return finishGame();
        }
        context.fillStyle = snakeColor;
        context.fillRect(snakePart.x, snakePart.y, cellSize, cellSize);
    }
}

function drawFood() {
    context.fillStyle = foodColor;
    context.fillRect(food.x, food.y, cellSize, cellSize);
}

function getRandomCoords() {
    // реализация выхода за границы
    return Math.floor(Math.random() * (boardWidth / cellSize)) * cellSize;
}

function placeFood() {
    // реализация спавна яблочка не в змейке
    let overlapping;
    do {
        overlapping = false;
        food.x = getRandomCoords();
        food.y = getRandomCoords();
        for (let i = 0; i < snake.length; i++) {
            if (food.x === snake[i].x && food.y === snake[i].y) {
                overlapping = true;
                break;
            }
        }
    } while (overlapping);
}

function updateScore(newScore) {
    score = newScore;
    let bestScore;
    if(localStorage.getItem("bestScore")) {
        let storageScore = localStorage.getItem('bestScore');
        if(storageScore > score) {
            bestScore = storageScore;
        }else{
            bestScore = newScore;
            localStorage.setItem('bestScore', bestScore);
        }
    }else{
        bestScore = newScore;
    }
    scoreInfo.textContent = score;
    bestScoreInfo.textContent = bestScore;
}

function checkIfEat(){
    if(snakeHead.x === food.x && snakeHead.y === food.y) {
        placeFood();
        updateScore(score + 1);
        return true;
    }
    return false;
}

function move() {
    snakeHead.x += velocity.x;
    snakeHead.y += velocity.y;

    if(snakeHead.x < 0) {
        snakeHead.x = boardWidth - cellSize;
    } else if(snakeHead.x > boardWidth - cellSize) {
        snakeHead.x = 0;
    } else if(snakeHead.y < 0) {
        snakeHead.y = boardHeight - cellSize;
    } else if(snakeHead.y > boardHeight - cellSize) {
        snakeHead.y = 0;
    }
    snake.unshift({
        x: snakeHead.x,
        y: snakeHead.y,
    });
    if(!checkIfEat()) {
        snake.pop();
    }
}

function changeDirection(ev) {
    const isGoingRight = velocity.x > 0;
    const isGoingLeft = velocity.x < 0;
    const isGoingUp = velocity.y < 0;
    const isGoingDown = velocity.y > 0;

    if(ev.key === "ArrowRight" && !isGoingLeft) {
        velocity.x = cellSize;
        velocity.y = 0;
    } else if(ev.key === "ArrowLeft" && !isGoingRight) {
        velocity.x = -cellSize;
        velocity.y = 0;
    } else if(ev.key === "ArrowUp" && !isGoingDown) {
        velocity.x = 0;
        velocity.y = -cellSize;
    } else if(ev.key === "ArrowDown" && !isGoingUp) {
        velocity.x = 0;
        velocity.y = cellSize;
    }
}

function nextTick() {
    drawBoard();
    drawFood();
    drawSnake();
    // checkIfEat();
    move();
}

function finishGame() {
    context.clearRect(0, 0, boardWidth, boardHeight);
    clearInterval(interval);
    context.fillStyle = "red";
    context.font = "50px serif";
    context.fillText("ВЫ ПРОИГРАЛИ", 100, 200);
}

function startGame() {
    snake = JSON.parse(JSON.stringify(initialSnake));
    snakeHead = {
        x: snake[0].x,
        y: snake[0].y
    }
    velocity.x = cellSize;
    velocity.y = 0;
    updateScore(0);
    placeFood();
    restartButton.addEventListener("click", restartGame);
    window.addEventListener("keydown", changeDirection);
    interval = setInterval(nextTick, 300);
}

function restartGame() {
    finishGame();
    startGame();
}


window.addEventListener("load", startGame);




