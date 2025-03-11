// neon_serpent/static/neon_serpent/snake.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 }; // Start with no movement
let food = getNewFoodPosition();
let gameOver = false;
let score = 0;
let highScore = 0;
let speed = 100;
let gamePaused = false;

function getRandomGridPosition() {
    return Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
}

function getNewFoodPosition() {
    let newFoodPosition;
    do {
        newFoodPosition = { x: getRandomGridPosition(), y: getRandomGridPosition() };
    } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
    return newFoodPosition;
}

function gameLoop() {
    if (gameOver) {
        drawGameOver();
        return;
    }
    if (!gamePaused) {
        update();
        draw();
    }
    setTimeout(gameLoop, speed);
}

function update() {
    if (direction.x === 0 && direction.y === 0) return; // Prevent movement if no direction is set

    const head = { x: snake[0].x + direction.x * gridSize, y: snake[0].y + direction.y * gridSize };

    // Check for wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOver = true;
        return;
    }

    // Check for self-collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver = true;
            return;
        }
    }

    snake.unshift(head);

    // Check for food consumption
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        if (score > highScore) highScore = score;
        food = getNewFoodPosition();
        if (speed > 50) speed -= 2; // Increase speed
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff00';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, gridSize, gridSize));

    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Draw score
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 50, 20);
    ctx.fillText(`High Score: ${highScore}`, 250, 20);
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 20);

    canvas.addEventListener('click', resetGame, { once: true });
}

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 }; // Reset direction to stop movement
    food = getNewFoodPosition();
    gameOver = false;
    score = 0;
    speed = 100;
    gameLoop();
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
        case 'p': // Pause the game
        case 'Enter': // Pause the game
        case ' ': // Pause the game
            gamePaused = !gamePaused;
            break;
    }
});

gameLoop();