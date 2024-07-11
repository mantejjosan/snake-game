// Snake game implementation

// Game constants
const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

// Game variables
let snake = [{x: 10, y: 10}];
let direction = {x: 0, y: 0};
let food = {};
let score = 0;
let gameLoop;
let inputQueue = [];

// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = canvas.height = CANVAS_SIZE;

// Initialize the game
function init() {
    createFood();
    document.addEventListener('keydown', handleKeyPress);
    gameLoop = setInterval(update, 100);
}

// Handle key presses
function handleKeyPress(e) {
    const key = e.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        inputQueue.push(key);
    }
}

// Update game state
function update() {
    // Process the next direction from the input queue
    if (inputQueue.length > 0) {
        const nextDirection = inputQueue.shift();
        switch (nextDirection) {
            case 'ArrowUp':
                if (direction.y === 0) direction = {x: 0, y: -1};
                break;
            case 'ArrowDown':
                if (direction.y === 0) direction = {x: 0, y: 1};
                break;
            case 'ArrowLeft':
                if (direction.x === 0) direction = {x: -1, y: 0};
                break;
            case 'ArrowRight':
                if (direction.x === 0) direction = {x: 1, y: 0};
                break;
        }
    }

    // Move the snake
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score++;
        createFood();
    } else {
        snake.pop();
    }

    // Check for game over conditions
    if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        clearInterval(gameLoop);
        alert(`Game Over! Your score: ${score}`);
        return;
    }

    // Clear the canvas and redraw
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    drawSnake();
    drawFood();
    drawScore();
}

// Draw the snake
function drawSnake() {
    ctx.fillStyle = '#00ff00'; // Bright green color for the snake
    snake.forEach(segment => {
        ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
}

// Draw the food
function drawFood() {
    ctx.fillStyle = '#800080'; // Purple color for the food
    ctx.beginPath();
    ctx.arc(
        (food.x + 0.5) * CELL_SIZE,
        (food.y + 0.5) * CELL_SIZE,
        CELL_SIZE / 2,
        0,
        2 * Math.PI
    );
    ctx.fill();
}

// Draw the score
function drawScore() {
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Create new food
function createFood() {
    do {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

// Start the game
init();