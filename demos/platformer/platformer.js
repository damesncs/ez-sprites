// ez-sprites platformer demo

import {
    circleOverlapsRect,
    clearCanvas,
    createCircleSprite,
    createRectSprite,
    createSpriteFromSvg,
    drawBorder,
    drawText,
    moveAndDrawSprites,
    pathArrayFromSvg,
    rectOverlapsRect,
    removeSprite,
    setupCanvas,
    spriteOverlapsRectBottomEdge,
    spriteOverlapsRectLeftEdge,
    spriteOverlapsRectRightEdge,
    spriteOverlapsRectTopEdge,
    getRandom
} from "../../js/ez-sprites.js";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 640;

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
let turtle;

let playerScore = 0;

let platforms = []; // we will add platform sprites to this array
let coins = []; // we will add coin sprites to this array

const FLOOR_Y = CANVAS_HEIGHT;

// these variables store the alternate versions of the character.
// They are in ALL_CAPS to show that they are "constants"
let 
CHARACTER_WALKING_LEFT,
CHARACTER_WALKING_RIGHT,
CHARACTER_JUMPING_LEFT,
CHARACTER_JUMPING_RIGHT,
CHARACTER_SURPRISED,
CHARACTER_STANDING
;
let background;

async function start() {
    setupCanvas(document.getElementById("canvas"), CANVAS_HEIGHT, CANVAS_WIDTH);

    background = await createSpriteFromSvg(0, 0, 0, 0, 1, "./svg/background.svg");

    character = await createSpriteFromSvg(50, 200, 0, 0, 0.5, "svg/stickman_standing.svg");

    character.y = FLOOR_Y - character.height;
    character.jumping = false;

    // load paths for alternate states
    CHARACTER_STANDING = await pathArrayFromSvg("svg/stickman_standing.svg");
    CHARACTER_WALKING_LEFT = await pathArrayFromSvg("svg/stickman_walking_left.svg");
    CHARACTER_WALKING_RIGHT = await pathArrayFromSvg("svg/stickman_walking_right.svg");
    CHARACTER_JUMPING_LEFT = await pathArrayFromSvg("svg/stickman_jumping_left.svg");
    CHARACTER_JUMPING_RIGHT = await pathArrayFromSvg("svg/stickman_jumping_right.svg");
    CHARACTER_SURPRISED = await pathArrayFromSvg("svg/stickman_surprised.svg");

    // create random platforms
    for(let i = 0; i < 6; i++){
        let width = getRandom(40, 100);
        let x = 100 + width + (i * 100);
        let height = 10;
        let y = CANVAS_HEIGHT - height - (i * height * 10);
        platforms.push(createRectSprite(x, y, 0, 0, width, height, "gray"));
        coins.push(createCircleSprite(x + width / 2, y - 30, 0, 0, 10, "gold"))
    }

    turtle = await createSpriteFromSvg(CANVAS_WIDTH - 100, CANVAS_HEIGHT - 300, -0.5, 0, 0.10, "./svg/turtle.svg");

    addEventListener("keydown", onKeyEvent);
    addEventListener("keyup", onKeyEvent);
    // addEventListener("mousedown", onMouseDown);

    drawEachFrame(0); // start the animation loop
}

function drawEachFrame(timestamp){
    clearCanvas();
    drawBorder();
    checkSpriteCollisions();
    moveAndDrawSprites();
    drawScore();

     // This function is built-in to the browser.
     // It asks the browser to call this function again when ready.
     // This lets the browser manage CPU cycles in order to keep everything running smoothly,
     // especially when there are lots of sprites to draw each frame.
     // Typically, it ends up at about 60 frames per second.
    requestAnimationFrame(drawEachFrame);
}

function drawScore(){
    drawText(10, 0, playerScore, 72, "red");
}

function checkSpriteCollisions(){
    
    coins.forEach(eachCoin => {
        if(circleOverlapsRect(eachCoin, character)){
            playerScore ++;
            eachCoin.collected = true;
            removeSprite(eachCoin); // remove it from the canvas, but a reference will still exist in `coins`
        }
    });
    // remove all collected coins from the list of coins
    coins = coins.filter(c => !c.collected);

    if(rectOverlapsRect(character, turtle)){
        character.paths = CHARACTER_SURPRISED;
        playerScore = 0;                         
    }

    platforms.forEach(obstacle => {
        let colliding = false;
        
        // is character standing on a platform?
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
            // bounce will result in character moving down
            character.dy = getSpeedFromCollision(character.dy);
            character.y = obstacle.bottomEdge + 1;
            colliding = true;
        } 
        
        else if(spriteOverlapsRectRightEdge(character, obstacle)){
            // bounce will result in character moving to the right (positive dx)
            character.dx = getSpeedFromCollision(character.dx);
            character.x = obstacle.rightEdge + 1;
            colliding = true;
        }

        else if(spriteOverlapsRectLeftEdge(character, obstacle)){
            // bounce will result in character moving to left (negative dx)
            character.dx = -(getSpeedFromCollision(character.dx));
            character.x = obstacle.leftEdge - 1 - character.width;
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

// returns absolute value of speed after collision
function getSpeedFromCollision(d){
    const absSpeed = Math.abs(d);
    if(absSpeed >= CHARACTER_BOUNCE_SPEED_LOSS){
        return absSpeed - CHARACTER_BOUNCE_SPEED_LOSS;
    }
    return 0;
}

function onKeyEvent(e){
    // These key codes come from the browser. 
    // see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
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


