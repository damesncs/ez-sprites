// svg sprites starter

import {
    clearCanvas,
    createSpriteFromSvg,
    drawBorder,
    moveAndDrawSprites, 
    pathArrayFromSvg, 
    rectOverlapsRect,
    setupCanvas
} from "./ez-sprites.js";

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
STICKMAN_SURPRISED;

let stickman, turtle;

async function start() {
    setupCanvas(document.getElementById("canvas"), CANVAS_HEIGHT, CANVAS_WIDTH);

    // stickman states stored in these variables
    STICKMAN_WALKING_FORWARD = await pathArrayFromSvg("stickman-walking-forward.svg");
    STICKMAN_STANDING = await pathArrayFromSvg("stickman-standing.svg");
    STICKMAN_WALKING_LEFT = await pathArrayFromSvg("stickman-walking-left.svg");
    STICKMAN_WALKING_RIGHT = await pathArrayFromSvg("stickman-walking-right.svg");
    STICKMAN_SURPRISED = await pathArrayFromSvg("stickman-surprised.svg");
    
    turtle = await createSpriteFromSvg(500, 300, -0.25, 0, 0.1, "turtle.svg");
    
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