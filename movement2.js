// mouse drag and simple sprite physics

import {
    clearCanvas,
    createCircleSprite,
    drawBorder,
    getRandomColorHexString,
    moveAndDrawSprites, setupCanvas
} from "./ez-sprites.js";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

const BALL_MOUSE_FOLLOW_SPEED = 2;

window.onload = start;

const ballSprites = [];

let mouseX = 0, mouseY = 0;
let mouseDragging = false;

async function start() {
    setupCanvas(document.getElementById("canvas"), CANVAS_HEIGHT, CANVAS_WIDTH);

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
        if(mouseDragging){
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
            // apply gravity
            if(eachBall.bottomEdge <= CANVAS_HEIGHT){
                eachBall.dy += 0.5;
            } else {
                // come back to rest on bottom edge if we have gone beyond it
                eachBall.y = CANVAS_HEIGHT - eachBall.radius;
            }
    
        }


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
    });
}

function createNewBall(){
    ballSprites.push(createCircleSprite(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0, 0, 15, getRandomColorHexString()));
}

function onMouseMove(e){
    if(mouseDragging){
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
}

function onMouseUp(e){
    mouseDragging = false;
}

function onMouseDown(e){
    mouseDragging = true;
    createNewBall();
}

