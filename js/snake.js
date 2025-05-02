// ez sprites - snake example

import {
    clearCanvas,
    createRectSprite,
    drawBorder,
    drawLine,
    drawText,
    moveAndDrawSprites,
    rectOverlapsRect,
    setupCanvas
} from "./ez-sprites.js";

window.onload = start;

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

const D = 10; // grid square dimension in pixels

const GRID_ROWS = CANVAS_HEIGHT / D;
const GRID_COLS = CANVAS_WIDTH / D;

const EVENT_KEY_PRESSED = "keydown";
const EVENT_KEY_RELEASED = "keyup";

const snakeSprites = [];

const SNAKE_START_LENGTH = 10;
const SNAKE_HEAD_START_X = Math.trunc(GRID_COLS / 2) * D; // snake starts with head in the middle
const SNAKE_HEAD_START_Y = Math.trunc(GRID_ROWS / 2) * D;
const SNAKE_COLOR = "green";
const FOOD_COLOR = "red";

const SNAKE_SPEED = D; // move one grid space each frame

let timerId;

let foodSprite;
let foodCounter = 0;

async function start() {
    setupCanvas(document.getElementById("canvas"), CANVAS_HEIGHT, CANVAS_WIDTH);

    foodSprite = createRectSprite(getRandomGridSpaceX(), getRandomGridSpaceY(), 0, 0, D, D, FOOD_COLOR);
    
    for(let i = 0; i < SNAKE_START_LENGTH; i++){
        // all snake sprite segments are initially moving up (towards the top edge of the canvas)
        let s = createRectSprite(SNAKE_HEAD_START_X, SNAKE_HEAD_START_Y + (i * D), 0, -SNAKE_SPEED, D, D, SNAKE_COLOR);
        snakeSprites.push(s);
    }

    timerId = setInterval(drawEachFrame, 150);

    addEventListener("keydown", onKeyEvent);
    // addEventListener("keyup", onKeyEvent);
}

function drawEachFrame(){
    clearCanvas();
    drawBorder();
    drawFoodCounter();
    // drawGridlines(); // uncomment this to see the gridlines for debugging
    moveAndDrawSprites();
    updateSnakeSpritesMovement();
    checkSpriteCollisions();
}

function drawGridlines(){
    // vertical lines
    for(let x = 0; x < CANVAS_WIDTH; x += D){
        drawLine(x, 0, x, CANVAS_HEIGHT, "gray");
    }
    // horizontal lines
    for(let y = 0; y < CANVAS_HEIGHT; y += D){
        drawLine(0, y, CANVAS_WIDTH, y, "gray");
    }
    
}

function gameOver(){
    drawText(CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2, "Game Over", 36, "red");
    clearInterval(timerId); // stop animation
}

function drawFoodCounter(){
    drawText(10, 10, foodCounter, 36, FOOD_COLOR);
}

function checkSpriteCollisions(){
    // is the snake head colliding with left or right walls?
    if(snakeSprites[0].x < 0 || snakeSprites[0].x > CANVAS_WIDTH){
        gameOver();
    }

    // is the snake head colliding with top or bottom walls?
    if(snakeSprites[0].y < 0 || snakeSprites[0].y > CANVAS_HEIGHT){
        gameOver();
    }

    // is the snake head colliding with the food?
    if (rectOverlapsRect(snakeSprites[0], foodSprite)){
        foodCounter++;
        
        // place the food somewhere else randomly
        foodSprite.x = getRandomGridSpaceX();
        foodSprite.y = getRandomGridSpaceY();
        
        // add a new segment to the snake's tail
        const lastSnakeSprite = snakeSprites[snakeSprites.length - 1];
        const newSpriteX = lastSnakeSprite.x - lastSnakeSprite.dx;
        const newSpriteY = lastSnakeSprite.y - lastSnakeSprite.dy;
        snakeSprites.push(createRectSprite(newSpriteX, newSpriteY, lastSnakeSprite.dx, lastSnakeSprite.dy, D, D, SNAKE_COLOR));
    }
}

// This "cascades" the movement of each snake segment sprite to the one following it.
// We do this by iterating "backwards" through the array, so that each segment takes the place of the one ahead of it on the next frame
function updateSnakeSpritesMovement(){
    for(let i = snakeSprites.length - 1; i > 0; i--){
        snakeSprites[i].dx = snakeSprites[i-1].dx;
        snakeSprites[i].dy = snakeSprites[i-1].dy;
    }
}

function onKeyEvent(e){
    if(e.code === "ArrowRight"){
        onKeyEventArrowRight(e.type);
    } else if (e.code === "ArrowLeft"){
        onKeyEventArrowLeft(e.type);
    } else if(e.code ==="ArrowUp"){
        onKeyEventArrowUp(e.type);
    } else if(e.code ==="ArrowDown"){
        onKeyEventArrowDown(e.type);
    }
}


// on arrow key input, change the direction of movement of the first snake segment sprite (the "head")
function onKeyEventArrowLeft(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        snakeSprites[0].dx = -SNAKE_SPEED;
        snakeSprites[0].dy = 0;
    }
}

function onKeyEventArrowRight(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        snakeSprites[0].dx = SNAKE_SPEED;
        snakeSprites[0].dy = 0;
    }
}

function onKeyEventArrowUp(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        snakeSprites[0].dx = 0;
        snakeSprites[0].dy = -SNAKE_SPEED;
    }
}

function onKeyEventArrowDown(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        snakeSprites[0].dx = 0;
        snakeSprites[0].dy = SNAKE_SPEED;
    }
}

function getRandomGridSpaceX(){
    return Math.trunc(Math.random() * GRID_COLS) * D;
}

function getRandomGridSpaceY(){
    return Math.trunc(Math.random() * GRID_ROWS) * D;
}