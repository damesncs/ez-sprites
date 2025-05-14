// ez sprites - breakout POC

import {
    circleRectangleBottomEdgeAreColliding,
    circleRectangleLeftEdgeAreColliding,
    circleRectangleRightEdgeAreColliding,
    circleRectangleTopEdgeAreColliding,
    clearCanvas,
    createCircleSprite,
    createRectSprite,
    drawBorder,
    drawText,
    getRandomColorHexString,
    moveAndDrawSprites, setupCanvas
} from "./ez-sprites.js";

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 500;

const BALL_RADIUS = 10;
const START_BALL_SPEED = 3;

const PADDLE_COLOR = "blue";

const PADDLE_HEIGHT = 70;
const PADDLE_WIDTH = 10;
const PADDLE_SPEED = 6;

const EVENT_KEY_PRESSED = "keydown";
const EVENT_KEY_RELEASED = "keyup";
window.onload = start;

let ball, leftPaddle, rightPaddle;

let leftPlayerScore = 0;
let rightPlayerScore = 0;

function start() {
    setupCanvas(document.getElementById("canvas"), CANVAS_HEIGHT, CANVAS_WIDTH);

    leftPaddle = createRectSprite(0, 0, 0, 0, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);
    rightPaddle = createRectSprite(CANVAS_WIDTH - PADDLE_WIDTH, 0, 0, 0, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);

    ball = createCircleSprite(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, START_BALL_SPEED, START_BALL_SPEED, BALL_RADIUS, getRandomColorHexString());

    setInterval(drawEachFrame, 15);

    addEventListener("keydown", onKeyEvent);
    addEventListener("keyup", onKeyEvent);
}

function drawEachFrame(){
    clearCanvas();
    drawBorder();
    detectBallCollisions();
    moveAndDrawSprites();
    drawScores();
}


function drawScores(){
    drawText(CANVAS_WIDTH / 3, CANVAS_HEIGHT / 2, leftPlayerScore, 36);
    drawText(CANVAS_WIDTH / 3 * 2, CANVAS_HEIGHT / 2, rightPlayerScore, 36);
}

function detectBallCollisions(){
    if (ball.leftEdge < 0){
        // going past left wall - player two scores
        rightPlayerScore++;
        resetBall();
    }
    
    if (ball.rightEdge > CANVAS_WIDTH){
        // going past right wall - player one scores
        leftPlayerScore++;
        resetBall();
    }
    
    // check if ball is colliding with top or bottom wall
    if (ball.topEdge < 0 || ball.bottomEdge > CANVAS_HEIGHT){
        // reverse y direction
        ball.dy = -ball.dy;
    }
    
    // bounce on Right paddle
    if (circleRectangleLeftEdgeAreColliding(ball, rightPaddle)){
        ball.dx += ball.dx * 0.1;
        ball.dx = -ball.dx;
    }
    
    // bounce on Left paddle
    if (circleRectangleRightEdgeAreColliding(ball, leftPaddle)){
        ball.dx += ball.dx * 0.1;
        ball.dx = -ball.dx;
    }
}



function resetBall(){
    ball.x = CANVAS_WIDTH / 2;
    ball.y = CANVAS_HEIGHT / 2;
    ball.dx = START_BALL_SPEED;
    ball.dy = START_BALL_SPEED;
}

function onKeyEvent(e){
    if(e.code === "ArrowUp"){
        onKeyEventArrowUp(e.type);
    }
    else if (e.code === "ArrowDown"){
        onKeyEventArrowDown(e.type);
    }
    else if (e.code === "KeyW"){
        onKeyEventW(e.type);
    }
    else if (e.code === "KeyS"){
        onKeyEventS(e.type);
    }
}

function onKeyEventArrowDown(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        rightPaddle.dy = PADDLE_SPEED;
    }
    if(eventType === EVENT_KEY_RELEASED){
        rightPaddle.dy = 0;
    }
}

function onKeyEventArrowUp(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        rightPaddle.dy = -PADDLE_SPEED;
    }
    if(eventType === EVENT_KEY_RELEASED){
        rightPaddle.dy = 0;
    }
}
function onKeyEventW(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        leftPaddle.dy = -PADDLE_SPEED;
    }
    if(eventType === EVENT_KEY_RELEASED){
        leftPaddle.dy = 0;
    }
}
function onKeyEventS(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        leftPaddle.dy = PADDLE_SPEED;
    }
    if(eventType === EVENT_KEY_RELEASED){
        leftPaddle.dy = 0;
    }
}
