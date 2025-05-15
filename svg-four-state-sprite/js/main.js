// svg sprites starter

import {
    clearCanvas,
    createRectSprite,
    createSpriteFromSvg,
    drawBorder,
    moveAndDrawSprites, 
    pathArrayFromSvg, 
    rectOverlapsRect,
    setupCanvas
} from "../js/ez-sprites.js";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;


const EVENT_KEY_PRESSED = "keydown";
const EVENT_KEY_RELEASED = "keyup";


const STICKMAN_WALK_SPEED = 2;

window.onload = start;

// put global variables here

 // naming stickman states in ALL CAPS to distinguish them from other variables.. just a style choice
let 
STICKMAN_WALKING_FORWARD,
STICKMAN_WALKING_LEFT,
STICKMAN_WALKING_RIGHT,
STICKMAN_STANDING,
STICKMAN_MAD,
STICKMAN_SURPRISED;

let stickman, turtle;
let walls = [];

async function start() {
    setupCanvas(document.getElementById("canvas"), CANVAS_HEIGHT, CANVAS_WIDTH);

    // stickman states stored in these variables
    STICKMAN_WALKING_FORWARD = await pathArrayFromSvg("stickman-walking-forward.svg");
    STICKMAN_STANDING = await pathArrayFromSvg("stickman-standing.svg");
    STICKMAN_WALKING_LEFT = await pathArrayFromSvg("stickman-walking-left.svg");
    STICKMAN_WALKING_RIGHT = await pathArrayFromSvg("stickman-walking-right.svg");
    STICKMAN_SURPRISED = await pathArrayFromSvg("stickman-surprised.svg");
    STICKMAN_MAD = await pathArrayFromSvg("stickman-mad.svg");
    
    turtle = await createSpriteFromSvg(500, 400, -0.25, 0, 0.15, "turtle.svg");

    walls.push(createRectSprite(250, 150, 0, 0, 10, 200, "gray"));
    walls.push(createRectSprite(550, 150, 0, 0, 10, 200, "gray"));
    walls.push(createRectSprite(250, 150, 0, 0, 300, 10, "gray"));
    
    stickman = await createSpriteFromSvg(300, 300, 0, 0, 0.5, "stickman-standing.svg");

    setInterval(drawEachFrame, 15);

    addEventListener("keydown", onKeyEvent);
    addEventListener("keyup", onKeyEvent);
}

function setBackgroundFromSvg(path, width, height){
    fetch(path).then(r => {
        r.text().then(t =>{
            const ctr = document.getElementById("background-container");
            ctr.innerHTML = t;
            ctr.style.width = width;
            ctr.style.height = height;
        });
    });
}

function drawEachFrame(){
    clearCanvas();
    drawBorder();
    checkSpriteCollisions();
    moveAndDrawSprites();
}

function checkSpriteCollisions(){
    if(rectOverlapsRect(stickman, turtle)){
        stickman.paths = STICKMAN_SURPRISED;
    }

    walls.forEach(wall => {
        let colliding = false;
        if(spriteOverlapsRectRightEdge(stickman, wall)){
            stickman.dx = 0;
            stickman.x = wall.rightEdge;
            colliding = true;
        }
        else if(spriteOverlapsRectLeftEdge(stickman, wall)){
            stickman.dx = 0;
            stickman.x = wall.leftEdge - stickman.width;
            colliding = true;
        }
        else if(spriteOverlapsRectTopEdge(stickman, wall)){
            stickman.dy = 0;
            stickman.y = wall.topEdge - stickman.height;
            colliding = true;
        }
        else if(spriteOverlapsRectBottomEdge(stickman, wall)){
            stickman.dy = 0;
            stickman.y = wall.bottomEdge + 1;
            colliding = true;
        } 
        
        if(colliding){
            stickman.paths = STICKMAN_MAD;
            wall.color = "red";
        } else {
            wall.color = "gray";
        }
    });

}

function spriteOverlapsRectRightEdge(sprite, rectToCheck){
    return sprite.rightEdge > rectToCheck.rightEdge && rectOverlapsRect(sprite, rectToCheck);
}

function spriteOverlapsRectLeftEdge(sprite, rectToCheck){
    return sprite.leftEdge < rectToCheck.leftEdge && rectOverlapsRect(sprite, rectToCheck);
}

function spriteOverlapsRectTopEdge(sprite, rectToCheck){
    return sprite.topEdge < rectToCheck.topEdge && rectOverlapsRect(sprite, rectToCheck);
}

function spriteOverlapsRectBottomEdge(sprite, rectToCheck){
    return sprite.bottomEdge > rectToCheck.bottomEdge && rectOverlapsRect(sprite, rectToCheck);
}

function onKeyEvent(e){
    if(e.code === "ArrowRight"){
        onKeyEventArrowRight(e.type);
    }
    else if (e.code === "ArrowLeft"){
        onKeyEventArrowLeft(e.type);
    } 
    else if (e.code === "ArrowUp"){
        onKeyEventArrowUp(e.type);
    }
    else if (e.code === "ArrowDown"){
        onKeyEventArrowDown(e.type);
    } 
}

function onKeyEventArrowLeft(eventType){
    if(eventType === EVENT_KEY_PRESSED){
       stickman.dx = -STICKMAN_WALK_SPEED;
       stickman.paths = STICKMAN_WALKING_LEFT;

       
    }
    if(eventType === EVENT_KEY_RELEASED){
        stickman.dx = 0;
        stickman.paths = STICKMAN_STANDING;
    }
}

function onKeyEventArrowRight(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        stickman.dx = STICKMAN_WALK_SPEED;
        stickman.paths = STICKMAN_WALKING_RIGHT;
    }
    if(eventType === EVENT_KEY_RELEASED){
        stickman.dx = 0;
        stickman.paths = STICKMAN_STANDING;
    }
}

function onKeyEventArrowUp(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        stickman.dy = -STICKMAN_WALK_SPEED;
        stickman.paths = STICKMAN_WALKING_FORWARD;
    }
    if(eventType === EVENT_KEY_RELEASED){
        stickman.dy = 0;
        stickman.paths = STICKMAN_STANDING;
    }
}

function onKeyEventArrowDown(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        stickman.dy = STICKMAN_WALK_SPEED;
        // stickman.paths = STICKMAN_STANDING; // not really necessary since other key handlers default back to this state
    }
    if(eventType === EVENT_KEY_RELEASED){
        stickman.dy = 0;
        // stickman.paths = STICKMAN_STANDING;
    }
}
