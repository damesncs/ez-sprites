// sprite movement demo #3

import {
    clearCanvas,
    createRectSprite,
    createSpriteFromSvg,
    drawBorder,
    moveAndDrawSprites,
    pathArrayFromSvg,
    rectOverlapsRect,
    setupCanvas
} from "../../js/ez-sprites.js";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 700;

const EVENT_KEY_PRESSED = "keydown";
const EVENT_KEY_RELEASED = "keyup";

// character movement physics constants
const CHARACTER_WALK_SPEED = 3;
const CHARACTER_JUMP_SPEED = 5;
const CHARACTER_GRAVITY = 0.15;
const CHARACTER_BOUNCE_SPEED_LOSS = 3;

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

    // create initial sprites here
    character = await createSpriteFromSvg(200, 200, 0, 0, 0.5, "svg/stickman_standing.svg");

    character.y = FLOOR_Y - character.height;
    character.jumping = false;

    // load paths for alternate states
    CHARACTER_STANDING = await pathArrayFromSvg("svg/stickman_standing.svg");
    CHARACTER_WALKING_LEFT = await pathArrayFromSvg("svg/stickman_walking_left.svg");
    CHARACTER_WALKING_RIGHT = await pathArrayFromSvg("svg/stickman_walking_right.svg");
    CHARACTER_JUMPING_LEFT = await pathArrayFromSvg("svg/stickman_jumping_left.svg");
    CHARACTER_JUMPING_RIGHT = await pathArrayFromSvg("svg/stickman_jumping_right.svg");

    createRandomObstacles(5);

    setInterval(drawEachFrame, 15);

    addEventListener("keydown", onKeyEvent);
    addEventListener("keyup", onKeyEvent);
    addEventListener("mousedown", onMouseDown);
}

function drawEachFrame(){
    clearCanvas();
    drawBorder();
    checkSpriteCollisions();
    moveAndDrawSprites();
}

function checkSpriteCollisions(){
    obstacles.forEach(obstacle => {
        let colliding = false;
        
        if(spriteOverlapsRectTopEdge(character, obstacle)){
            if(character.dy > 0){
                character.dy = -(getSpeedFromCollision(character.dy));
            }
            character.y = obstacle.topEdge - character.height;
            colliding = true;
            // standing on an obstacle, reset jump
            character.jumping = false;  
        }

        else if(spriteOverlapsRectBottomEdge(character, obstacle)){
            character.dy = getSpeedFromCollision(character.dy);
            character.y = obstacle.bottomEdge + 1;
            colliding = true;
        } 
        
        else if(spriteOverlapsRectRightEdge(character, obstacle)){
            character.dx = getSpeedFromCollision(character.dx);
            character.x = obstacle.rightEdge;
            colliding = true;
        }

        else if(spriteOverlapsRectLeftEdge(character, obstacle)){
            character.dx = -(getSpeedFromCollision(character.dx));
            character.x = obstacle.leftEdge - character.width;
            colliding = true;
        }
        
        if(colliding){
            obstacle.color = "red";
        } else {
            obstacle.color = "gray";
        }
    });

    // apply gravity to character
    if(character.bottomEdge <= FLOOR_Y){
        character.dy += CHARACTER_GRAVITY;
    } else {
        // come back to rest on bottom edge since character has gone beyond it
        character.y = FLOOR_Y - character.height;
        // reset jump
        character.jumping = false;
    }
}

function spriteOverlapsRectRightEdge(sprite, rectToCheck){
    return sprite.rightEdge > rectToCheck.rightEdge &&
            sprite.leftEdge > rectToCheck.leftEdge &&
             rectOverlapsRect(sprite, rectToCheck);
}

function spriteOverlapsRectLeftEdge(sprite, rectToCheck){
    return sprite.leftEdge < rectToCheck.leftEdge &&
            sprite.rightEdge < rectToCheck.rightEdge &&
             rectOverlapsRect(sprite, rectToCheck);
}

function spriteOverlapsRectTopEdge(sprite, rectToCheck){
    return sprite.topEdge < rectToCheck.topEdge &&
            sprite.bottomEdge < rectToCheck.bottomEdge &&
             rectOverlapsRect(sprite, rectToCheck);
}

function spriteOverlapsRectBottomEdge(sprite, rectToCheck){
    return sprite.bottomEdge > rectToCheck.bottomEdge &&
            sprite.topEdge > rectToCheck.topEdge &&
             rectOverlapsRect(sprite, rectToCheck);
}

function getSpeedFromCollision(d){
    const absSpeed = Math.abs(d);
    if(absSpeed >= CHARACTER_BOUNCE_SPEED_LOSS){
        return absSpeed - CHARACTER_BOUNCE_SPEED_LOSS;
    }
    return 0;
}


function createRandomObstacles(count){
    for(let i = 0; i < count; i++){
        const width = getRandom(10, 70);
        const height = getRandom(10, 20);
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
        // jump
        if(character.jumping == false){
            character.jumping = true;
            character.dy = -CHARACTER_JUMP_SPEED;
            if(character.dx > 0){
                // moving right, show jumping to the right
                character.paths = CHARACTER_JUMPING_RIGHT;
            } else {
                // moving left, show jumping to the left
                character.paths = CHARACTER_JUMPING_LEFT;
            }
        }
    }
    if(eventType === EVENT_KEY_RELEASED){
        character.paths = CHARACTER_STANDING;
    }
}

function onMouseDown(e){
    const width = getRandom(10, 70);
    const height = getRandom(10, 20);
    obstacles.push(createRectSprite(e.offsetX, e.offsetY, 0, 0, width, height, "gray"));
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
