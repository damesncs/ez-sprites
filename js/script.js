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

let playerScore = 0;

function start() {
    canvas = document.getElementById("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctx = canvas.getContext("2d");

    ball = createCircleSprite(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 3, 3, BALL_RADIUS, getRandomColorHexString());

    paddle = createRectSprite(0, CANVAS_HEIGHT - PADDLE_HEIGHT, 0, 0, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);

    createNewBall();

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

// function drawScores(){
//     drawText(CANVAS_WIDTH / 3, CANVAS_HEIGHT / 2 - 18, playerOneScore, 36, "black");
//     drawText(CANVAS_WIDTH - (CANVAS_WIDTH / 3), CANVAS_HEIGHT / 2 - 18, playerTwoScore, 36, "black");
// }

function handleCollisions(){
    handleBallWallCollisions(ball);
    handleBallPaddleCollisions(ball, paddle);
    BRICKS.forEach(b => handleBallBrickCollisions(ball, BALL_RADIUS, b));
}

function handleBallWallCollisions(b){
    if (b.leftEdge < 0){
        // bounce
        b.dx = -b.dx;
    }

    if (b.rightEdge > CANVAS_WIDTH){
        // bounce
        b.dx = -b.dx;
    }

    // check if ball is colliding with top wall
    if (b.topEdge < 0){
        // reverse y direction
        b.dy = -b.dy;
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

function handleBallBrickCollisions(b, radius, brick){

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
    return createSprite(x, y, dx, dy, drawRect, [width, height, color], getRectEdges);
}

function createCircleSprite(x, y, dx, dy, radius, color){
    return createSprite(x, y, dx, dy, drawCircle, [radius, color], getCircleEdges);
}

function createSprite(initialX, initialY, initialDX, initialDY, drawFn, drawParams, edgeFn){
    let newSprite = {
        x: initialX,
        y: initialY,
        dx: initialDX,
        dy: initialDY,
        leftEdge: 0,
        rightEdge: 0,
        topEdge: 0,
        bottomEdge: 0,
        draw: drawFn,
        drawParams: drawParams,
        findEdges: edgeFn
    };
    SPRITES.push(newSprite);
    return newSprite;
}

function moveAndDrawSprites(){
    SPRITES.forEach(s => {
        s.x += s.dx;
        s.y += s.dy;
        s.draw(s.x, s.y, ...s.drawParams);
        // maybe there's a terser way to do this
        const edges = s.findEdges(s.x, s.y, ...s.drawParams);
        s.leftEdge = edges.leftEdge;
        s.rightEdge = edges.rightEdge;
        s.topEdge = edges.topEdge;
        s.bottomEdge = edges.bottomEdge
    });
}

function drawBorder(){
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawRect(x, y, width, height, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function getRectEdges(x, y, width, height){
    return {
        leftEdge: x,
        rightEdge: x + width,
        topEdge: y,
        bottomEdge: y + height
    }
}

function drawCircle(x, y, radius, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    // arc(x, y, radius, startAngle, endAngle)
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function getCircleEdges(x, y, radius){
    return {
        leftEdge: x - radius,
        rightEdge: x + radius,
        topEdge: y - radius,
        bottomEdge: y + radius
    }
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
