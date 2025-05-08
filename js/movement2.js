// mouse drag and simple sprite physics

import {
    circleRectangleBottomEdgeAreColliding,
    circleRectangleLeftEdgeAreColliding,
    circleRectangleRightEdgeAreColliding,
    circleRectangleTopEdgeAreColliding,
    clearCanvas,
    createCircleSprite,
    createRectSprite,
    drawBorder,
    getRandomColorHexString,
    moveAndDrawSprites, setupCanvas
} from "./ez-sprites.js";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

const BALL_MOUSE_FOLLOW_SPEED = 2;

const BALL_BOUNCE_SPEED_LOSS = 0.01;
const BALL_GRAVITY = 0.4;

window.onload = start;

const ballSprites = [];
const obstacleSprites = [];

let mouseX = 0, mouseY = 0;
let mouseDragging = false;

async function start() {
    setupCanvas(document.getElementById("canvas"), CANVAS_HEIGHT, CANVAS_WIDTH);

    createRandomObstacles(8);


    setInterval(drawEachFrame, 15);

    addEventListener("mousedown", onMouseDown);
    addEventListener("mouseup", onMouseUp);
    addEventListener("mousemove", onMouseMove);
}

function drawEachFrame(){
    clearCanvas();
    drawBorder();
    updateBallMovement();
    moveAndDrawSprites();
}

function updateBallMovement(){
    ballSprites.forEach(eachBall => {

        if(eachBall.dragging){
            // ball is being dragged by the user with the mouse
            // ball moves faster the further it is away from mouse in each dimension
            const xDist = Math.abs(eachBall.x - mouseX);
            const yDist = Math.abs(eachBall.y - mouseY);
            const speedFactor = 0.01;
            const xSpeed = BALL_MOUSE_FOLLOW_SPEED * xDist * speedFactor;
            const ySpeed = BALL_MOUSE_FOLLOW_SPEED * yDist * speedFactor;
    
            if(mouseX < eachBall.x) eachBall.dx = -xSpeed;
            else if(mouseX > eachBall.x) eachBall.dx = xSpeed;
            else eachBall.dx = 0;
    
            if(mouseY < eachBall.y) eachBall.dy = -ySpeed;
            else if(mouseY > eachBall.y) eachBall.dy = ySpeed;
            else eachBall.dy = 0;
    
        } else {
            // this ball is not being dragged by the mouse, so apply physics rules
       
            // apply gravity
            if(eachBall.bottomEdge <= CANVAS_HEIGHT){
                eachBall.dy += BALL_GRAVITY;
            } else {
                // come back to rest on bottom edge since ball has gone beyond it
                eachBall.y = CANVAS_HEIGHT - eachBall.radius;
                if(Math.abs(eachBall.dx) >= BALL_BOUNCE_SPEED_LOSS){
                    eachBall.dx -= BALL_BOUNCE_SPEED_LOSS;
                } else {
                    eachBall.dx = 0;
                }
            }

            // check for collisions with obstacles
            obstacleSprites.forEach(o => {
                if(circleRectangleBottomEdgeAreColliding(eachBall, o) || circleRectangleTopEdgeAreColliding(eachBall, o)){
                    eachBall.dy = -eachBall.dy;
                    eachBall.dy -= BALL_BOUNCE_SPEED_LOSS;
                }
                if(circleRectangleLeftEdgeAreColliding(eachBall, o) || circleRectangleRightEdgeAreColliding(eachBall, o)){
                    eachBall.dx = -eachBall.dx;
                    eachBall.dx -= BALL_BOUNCE_SPEED_LOSS;
                }
            });

             // bounce on right wall
            if(eachBall.rightEdge > CANVAS_WIDTH){
                eachBall.dx = -eachBall.dx;
            }

            // bounce on left wall
            if(eachBall.leftEdge < 0){
                eachBall.dx = -eachBall.dx;
            }

            // bounce on top wall
            if(eachBall.topEdge < 0){
                eachBall.dy = -eachBall.dy;
            }

            // bounce on bottom wall
            if(eachBall.bottomEdge > CANVAS_HEIGHT){
                eachBall.dy = -eachBall.dy + 0.5; // simulate ball losing energy when it bounces
            }
        }
    
       
    });
}

function createNewBall(isDragging){
    let newBall = createCircleSprite(mouseX, mouseY, 0, 0, 15, getRandomColorHexString());
    newBall.dragging = isDragging;
    ballSprites.push(newBall);
}

function createRandomObstacles(count){
    for(let i = 0; i < count; i++){
        const width = getRandom(5, 50);
        const height = getRandom(5, 50);
        const x = getRandom(0, CANVAS_WIDTH - width);
        const y = getRandom(0, CANVAS_HEIGHT - height);
        obstacleSprites.push(createRectSprite(x, y, 0, 0, width, height, getRandomColorHexString()));
    }
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }
  

function onMouseMove(e){
    if(mouseDragging){
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
}

function onMouseUp(e){
    mouseDragging = false;
    ballSprites.forEach(b => b.dragging = false);
}

function onMouseDown(e){
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    mouseDragging = true;
    createNewBall(mouseDragging);
}

