// simple sprites - breakout POC
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 300;

const BALL_RADIUS = 10;

const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 50;
const PADDLE_SPEED = 4;

const PADDLE_COLOR = "blue";

const EVENT_KEY_PRESSED = "keydown";
const EVENT_KEY_RELEASED = "keyup";

const SPRITES = [];

const BRICKS = [];

let canvas;
let ctx;
window.onload = start;

let ball, paddle;

let bricks = [];

let playerScore = 0;

function start() {
    canvas = document.getElementById("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctx = canvas.getContext("2d");

    ball = createCircleSprite(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 3, 3, BALL_RADIUS, getRandomColorHexString());

    paddle = createRectSprite(0, CANVAS_HEIGHT - PADDLE_HEIGHT, 0, 0, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);

    setInterval(drawEachFrame, 15);

    addEventListener("keydown", onKeyEvent);
    addEventListener("keyup", onKeyEvent);
}

function drawEachFrame(){
    clearCanvas();
    drawBorder();
    handleCollisions();
    moveAndDrawSprites();
    // drawScores();
}

function onKeyEvent(e){
    // console.log(e);
    if(e.code === "ArrowRight"){
        onKeyEventArrowRight(e.type);
    }
    else if (e.code === "ArrowLeft"){
        onKeyEventArrowLeft(e.type);
    }
    // otherwise, do nothing
}

function handleCollisions(){
    handleBallWallCollisions(ball);
    handleBallPaddleCollisions(ball, paddle);
    BRICKS.forEach(b => handleBallBrickCollisions(ball, BALL_RADIUS, b));
}

function handleBallWallCollisions(b){
    if (b.leftEdge < 0){
        // bounce
        b.dx = -b.dx;
        b.color = getRandomColorHexString();
    }

    if (b.rightEdge > CANVAS_WIDTH){
        // bounce
        b.dx = -b.dx;
        b.color = getRandomColorHexString();
    }

    // check if ball is colliding with top wall
    if (b.topEdge < 0){
        // reverse y direction
        b.dy = -b.dy;
        b.color = getRandomColorHexString();
    }

    if(b.bottomEdge > CANVAS_HEIGHT){
        // ball went past bottom, player loses
        // TODO game over
        resetBall(b);
    }
}

function handleBallPaddleCollisions(b, p){
    if(b.bottomEdge > p.topEdge &&
        b.x > p.leftEdge &&
        b.x < p.rightEdge){
        b.dy = -b.dy;
    }
}

function handleBallBrickCollisions(b, brick){
    if(areCircleAndRectangleColliding(b.x, b.y, b.radius, brick.x, brick.y, brick.width, brick.height)){
        // TODO actually need to know which edge we bounced on
    }
}

// returns boolean
// hat tip https://www.jeffreythompson.org/collision-detection/circle-rect.php
function areCircleAndRectangleColliding(cx, cy, cr, rx, ry, rw, rh){
    let testX = cx;
    let testY = cy;

    if (cx < rx)         testX = rx;      // test left edge
    else if (cx > rx+rw) testX = rx+rw;   // right edge
    if (cy < ry)         testY = ry;      // top edge
    else if (cy > ry+rh) testY = ry+rh;   // bottom edge

    let distX = cx - testX;
    let distY = cy - testY;
    const distance = Math.sqrt( (distX*distX) + (distY*distY) );

    // if the distance is less than the radius, collision!
    return distance <= cr;
}

function resetBall(b){
    b.x = CANVAS_WIDTH / 2;
    b.y = CANVAS_HEIGHT / 2;
}

function onKeyEventArrowLeft(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        paddle.dx = -PADDLE_SPEED;
    }
    if(eventType === EVENT_KEY_RELEASED){
        paddle.dx = 0;
    }
}

function onKeyEventArrowRight(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        paddle.dx = PADDLE_SPEED;
    }
    if(eventType === EVENT_KEY_RELEASED){
        paddle.dx = 0;
    }
}

function createRectSprite(x, y, dx, dy, width, height, color){
    const drawRect = (rect) => {
        ctx.fillStyle = rect.color;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }

    const getRectEdges = (rect) => {
        return {
            leftEdge: rect.x,
            rightEdge: rect.x + rect.width,
            topEdge: rect.y,
            bottomEdge: rect.y + rect.height
        }
    }

    let sprite = createSprite(x, y, dx, dy, color, drawRect, getRectEdges);
    sprite.width = width;
    sprite.height = height;
    return sprite;
}

function createCircleSprite(x, y, dx, dy, radius, color){
    const drawCircle = (circle) => {
        ctx.fillStyle = circle.color;
        ctx.beginPath();
        // arc(x, y, radius, startAngle, endAngle)
        ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    const getCircleEdges = (circle) =>{
        return {
            leftEdge: circle.x - circle.radius,
            rightEdge: circle.x + circle.radius,
            topEdge: circle.y - circle.radius,
            bottomEdge: circle.y + circle.radius
        }
    }
    let sprite = createSprite(x, y, dx, dy, color, drawCircle, getCircleEdges);
    sprite.radius = radius;
    return sprite;
}

function createSprite(x, y, dx, dy, color, drawFn, findEdgesFn){
    const sprite= {
        x: x,
        y: y,
        dx: dx,
        dy: dy,
        color: color,
        leftEdge: 0,
        rightEdge: 0,
        topEdge: 0,
        bottomEdge: 0,
        draw: drawFn,
        findEdges: findEdgesFn
    };
    SPRITES.push(sprite);
    return sprite;
}

function moveAndDrawSprites(){
    SPRITES.forEach(s => {
        s.x += s.dx;
        s.y += s.dy;
        s.draw(s);
        // maybe there's a terser way to do this
        const edges = s.findEdges(s);
        s.leftEdge = edges.leftEdge;
        s.rightEdge = edges.rightEdge;
        s.topEdge = edges.topEdge;
        s.bottomEdge = edges.bottomEdge
    });
}

function drawBorder(){
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawText(x, y, text, fontSize, color){
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillText(text, x, y + fontSize);
}

function clearCanvas(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function getRandomColorHexString(){
    const r = getRandom8BitIntegerAsHexString();
    const g = getRandom8BitIntegerAsHexString();
    const b = getRandom8BitIntegerAsHexString();
    return `#${r}${g}${b}`;
}

function getRandom8BitIntegerAsHexString(){
    return Math.trunc(Math.random() * 256).toString(16);
}
