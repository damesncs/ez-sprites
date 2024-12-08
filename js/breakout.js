// ez sprites - breakout POC

import {
    circleRectangleBottomEdgeAreColliding,
    circleRectangleLeftEdgeAreColliding,
    circleRectangleRightEdgeAreColliding,
    circleRectangleTopEdgeAreColliding,
    clearCanvas,
    createCircleSprite, createCompoundShapeRectSprite,
    createRectSprite,
    drawBorder,
    getRandomColorHexString,
    moveAndDrawSprites, removeSprite, setupCanvas
} from "./ez-sprites.js";

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 300;

const BALL_RADIUS = 10;

const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 50;
const PADDLE_SPEED = 6;

const PADDLE_COLOR = "blue";

const EVENT_KEY_PRESSED = "keydown";
const EVENT_KEY_RELEASED = "keyup";

const BRICK_SPRITES = [];

window.onload = start;

let ballSprite, paddleSprite;

let ghost, ghostShapesObj;

let playerScore = 0;

function start() {
    setupCanvas(document.getElementById("canvas"), CANVAS_HEIGHT, CANVAS_WIDTH);

    createBricks();

    paddleSprite = createRectSprite(0, CANVAS_HEIGHT - PADDLE_HEIGHT, 0, 0, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);

    ballSprite = createCircleSprite(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 3, 3, BALL_RADIUS, getRandomColorHexString());

    ghostShapesObj = JSON.parse(document.getElementById("ghost-sprite").textContent);

    ghost = createCompoundShapeRectSprite(100, 100, 1, 1, 200, 200, 0.125, ghostShapesObj);

    setInterval(drawEachFrame, 15);

    addEventListener("keydown", onKeyEvent);
    addEventListener("keyup", onKeyEvent);
}

function drawEachFrame(){
    clearCanvas();
    drawBorder();
    checkSpriteCollisions();
    moveAndDrawSprites();
}

function createBricks(){
    const brickHeight = 10;
    const brickWidth = 50;
    const brickMargin = 10;
    const nRows = Math.floor(CANVAS_WIDTH / (brickWidth + brickMargin));
    const nCols = 5;

    for(let row = 0; row < nRows; row++){
        for(let col = 0; col < nCols; col++){
            const brickX = row * (brickWidth + brickMargin) + brickMargin;
            const brickY = col * (brickHeight + brickMargin) + brickMargin;
            const newBrick = createRectSprite(brickX, brickY, 0, 0, brickWidth, brickHeight, getRandomColorHexString());
            BRICK_SPRITES.push(newBrick);
        }
    }
}

function checkSpriteCollisions(){
    checkBallWallCollisions(ballSprite);
    checkBallPaddleCollisions(ballSprite, paddleSprite);
    BRICK_SPRITES.forEach(brick => checkBallBrickCollisions(ballSprite, brick));
}

function checkBallWallCollisions(b){
    if (b.leftEdge < 0){
        // bounce
        b.dx = -b.dx;
    }

    if (b.rightEdge > CANVAS_WIDTH){
        // bounce
        b.dx = -b.dx;
    }

    // check if ball is colliding with top wall
    if (b.topEdge < 0){
        // reverse y direction
        b.dy = -b.dy;
    }

    if(b.bottomEdge > CANVAS_HEIGHT){
        // ball went past bottom, player loses
        // TODO game over
        resetBall(b);
    }
}

function checkBallPaddleCollisions(ball, paddle){
    if(circleRectangleTopEdgeAreColliding(ball, paddle)){
        ball.dy = -ball.dy;
        if(paddle.dx > 0){ // paddle moving right
            if(ball.dx < 0) ball.dx -= 1; // ball moving left, subtract vel
            else            ball.dx += 1; // ball moving right, add vel
        } else if(paddle.dx < 0){ // paddle moving left
            if(ball.dx < 0) ball.dx += 1;
            else            ball.dx -= 1;
        }
    }
}

function checkBallBrickCollisions(ball, brick){
    if(circleRectangleTopEdgeAreColliding(ball, brick) ||
            circleRectangleBottomEdgeAreColliding(ball, brick)){
        deleteBrick(brick);
        ball.dy = -ball.dy;
    } else if(circleRectangleRightEdgeAreColliding(ball, brick) || 
                circleRectangleLeftEdgeAreColliding(ball, brick)){
        deleteBrick(brick);
        ball.dx = -ball.dx;
    } 
}

function deleteBrick(brick){
    BRICK_SPRITES.splice(BRICK_SPRITES.indexOf(brick), 1);
    removeSprite(brick);
}

function resetBall(b){
    b.x = CANVAS_WIDTH / 2;
    b.y = CANVAS_HEIGHT / 2;
}

function onKeyEvent(e){
    if(e.code === "ArrowRight"){
        onKeyEventArrowRight(e.type);
    }
    else if (e.code === "ArrowLeft"){
        onKeyEventArrowLeft(e.type);
    }
}

function onKeyEventArrowLeft(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        paddleSprite.dx = -PADDLE_SPEED;
    }
    if(eventType === EVENT_KEY_RELEASED){
        paddleSprite.dx = 0;
    }
}

function onKeyEventArrowRight(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        paddleSprite.dx = PADDLE_SPEED;
    }
    if(eventType === EVENT_KEY_RELEASED){
        paddleSprite.dx = 0;
    }
}



