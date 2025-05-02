// simple mouse vs sprite movement demo

import {
    clearCanvas,
    createCircleSprite,
    drawBorder,
    moveAndDrawSprites, setupCanvas
} from "/ez-sprites/js/ez-sprites.js";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

const BALL_SPEED = 2;

window.onload = start;

let redBall, greenBall;

let mouseX, mouseY;

async function start() {
    setupCanvas(document.getElementById("canvas"), CANVAS_HEIGHT, CANVAS_WIDTH);

    redBall = createCircleSprite(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0, 0, 15, "red");

    greenBall = createCircleSprite(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0, 0, 15, "green");

    mouseX = redBall.x;
    mouseY = redBall.y;

    setInterval(drawEachFrame, 15);

    addEventListener("mousemove", onMouseMove);
}

function drawEachFrame(){
    clearCanvas();
    drawBorder();
    updateBallMovement();
    moveAndDrawSprites();
}

function updateBallMovement(){
    // drawLine(redBall.x, redBall.y, mouseX, mouseY, "black");

    // red ball moves at constant speed in both dimensions
    if(mouseX < redBall.x) redBall.dx = -BALL_SPEED;
    else if(mouseX > redBall.x) redBall.dx = BALL_SPEED;
    else redBall.dx = 0;

    if(mouseY < redBall.y) redBall.dy = -BALL_SPEED;
    else if(mouseY > redBall.y) redBall.dy = BALL_SPEED;
    else redBall.dy = 0;

    
    // green ball moves faster the further it is away from mouse in each dimension
    const xDist = Math.abs(greenBall.x - mouseX);
    const yDist = Math.abs(greenBall.y - mouseY);
    const speedFactor = 0.01;
    const xSpeed = BALL_SPEED * xDist * speedFactor;
    const ySpeed = BALL_SPEED * yDist * speedFactor;

    if(mouseX < greenBall.x) greenBall.dx = -xSpeed;
    else if(mouseX > greenBall.x) greenBall.dx = xSpeed;
    else greenBall.dx = 0;

    if(mouseY < greenBall.y) greenBall.dy = -ySpeed;
    else if(mouseY > greenBall.y) greenBall.dy = ySpeed;
    else greenBall.dy = 0;

}

function onMouseMove(e){
    mouseX = e.offsetX;
    mouseY = e.offsetY;
}


