// svg sprite movement demo

import {
    clearCanvas,
    createRectSprite,
    createSpriteFromSvg,
    drawBorder,
    getRandomColorHexString,
    moveAndDrawSprites,
    pathArrayFromSvg,
    rectOverlapsRect,
    setupCanvas,
    getRandom
} from "./ez-sprites.js";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;


const EVENT_KEY_PRESSED = "keydown";
const EVENT_KEY_RELEASED = "keyup";

const CHARACTER_WALK_SPEED = 3;
const CHARACTER_JUMP_SPEED = 5;
const CHARACTER_GRAVITY = 0.15;


window.onload = start;

// put global variables here
let character;

const obstacles = [];

const FLOOR_Y = CANVAS_HEIGHT;

let 
CHARACTER_WALKING_LEFT,
CHARACTER_WALKING_RIGHT,
CHARACTER_JUMPING_LEFT,
CHARACTER_JUMPING_RIGHT,
CHARACTER_STANDING;


async function start() {
    setupCanvas(document.getElementById("canvas"), CANVAS_HEIGHT, CANVAS_WIDTH);

    // optionally load a static background from an svg file:
    // setBackgroundFromSvg("svg/background.svg", CANVAS_WIDTH, CANVAS_HEIGHT);

    // create initial sprites here
    character = await createSpriteFromSvg(200, 200, 0, 0, 0.5, "svg/stickman_standing.svg");

    character.y = FLOOR_Y - character.height;

    // load paths for alternate states
    CHARACTER_STANDING = await pathArrayFromSvg("svg/stickman_standing.svg");
    CHARACTER_WALKING_LEFT = await pathArrayFromSvg("svg/stickman_walking_left.svg");
    CHARACTER_WALKING_RIGHT = await pathArrayFromSvg("svg/stickman_walking_right.svg");
    CHARACTER_JUMPING_LEFT = await pathArrayFromSvg("svg/stickman_jumping_left.svg");
    CHARACTER_JUMPING_RIGHT = await pathArrayFromSvg("svg/stickman_jumping_right.svg");

    createRandomObstacles(10);

    setInterval(drawEachFrame, 15);

    addEventListener("keydown", onKeyEvent);
    addEventListener("keyup", onKeyEvent);
    // add additional event handlers here (e.g., mouse events)
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
    // here's a spot to check if sprites are colliding and handle those situations

    obstacles.forEach(obstacle => {
        let colliding = false;
        if(spriteOverlapsRectRightEdge(character, obstacle)){
            character.dx = 0;
            character.x = obstacle.rightEdge;
            colliding = true;
        }
        else if(spriteOverlapsRectLeftEdge(character, obstacle)){
            character.dx = 0;
            character.x = obstacle.leftEdge - character.width;
            colliding = true;
        }
        else if(spriteOverlapsRectTopEdge(character, obstacle)){
            character.dy = 0;
            character.y = obstacle.topEdge - character.height;
            colliding = true;
        }
        else if(spriteOverlapsRectBottomEdge(character, obstacle)){
            character.dy = 0;
            character.y = obstacle.bottomEdge + 1;
            colliding = true;
        } 
        
        if(colliding){
            // character.paths = character_MAD;
            obstacle.color = "red";
        } else {
            obstacle.color = "gray";
        }
    });

    // apply gravity to character
    if(character.bottomEdge <= CANVAS_HEIGHT){
        character.dy += CHARACTER_GRAVITY;
    } else {
        // come back to rest on bottom edge since ball has gone beyond it
        character.y = CANVAS_HEIGHT - character.height;
    }

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


function createRandomObstacles(count){
    for(let i = 0; i < count; i++){
        const width = getRandom(5, 50);
        const height = getRandom(5, 50);
        const x = getRandom(0, CANVAS_WIDTH - width);
        const y = getRandom(0, CANVAS_HEIGHT - height);
        obstacles.push(createRectSprite(x, y, 0, 0, width, height, "gray"));
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
    // else if (e.code === "ArrowDown"){
    //     onKeyEventArrowDown(e.type);
    // } 
}

function onKeyEventArrowLeft(eventType){
    if(eventType === EVENT_KEY_PRESSED){
       character.dx = -CHARACTER_WALK_SPEED;
       character.paths = CHARACTER_WALKING_LEFT;
    }
    if(eventType === EVENT_KEY_RELEASED){
        character.dx = 0;
        character.paths = CHARACTER_STANDING;
    }
}

function onKeyEventArrowRight(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        character.dx = CHARACTER_WALK_SPEED;
        character.paths = CHARACTER_WALKING_RIGHT;
    }
    if(eventType === EVENT_KEY_RELEASED){
        character.dx = 0;
        character.paths = CHARACTER_STANDING;
    }
}

function onKeyEventArrowUp(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        character.dy = -CHARACTER_JUMP_SPEED;
        if(character.dx > 0){
            // moving right
            character.paths = CHARACTER_JUMPING_RIGHT;
        } else {
            character.paths = CHARACTER_JUMPING_LEFT;
        }
        
    }
    if(eventType === EVENT_KEY_RELEASED){
        character.dy = 0;
        character.paths = CHARACTER_STANDING;
    }
}

// function onKeyEventArrowDown(eventType){
//     if(eventType === EVENT_KEY_PRESSED){
//         // character.dy = CHARACTER_WALK_SPEED;
//         character.paths = CH;
//     }
//     if(eventType === EVENT_KEY_RELEASED){
//         character.dy = 0;
//         character.paths = CHARACTER_STANDING;
//     }
// }



