const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 300;

const BALL_RADIUS = 10;

const PADDLE_HEIGHT = 50;
const PADDLE_WIDTH = 10;
const PADDLE_SPEED = 4;

const PADDLE_COLOR = "blue";

const EVENT_KEY_PRESSED = "keydown";
const EVENT_KEY_RELEASED = "keyup";

const SPRITES = [];

const BALLS = [];

let canvas;
let ctx;
window.onload = start;

let paddleL, paddleR;

let playerOneScore = 0;
let playerTwoScore = 0;

function start() {
    canvas = document.getElementById("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctx = canvas.getContext("2d");

    paddleL = createRectSprite(0, 0, 0, 0, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);
    paddleR = createRectSprite(CANVAS_WIDTH - PADDLE_WIDTH, 0, 0, 0, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);

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
    drawScores();
}

function drawScores(){
    drawText(CANVAS_WIDTH / 3, CANVAS_HEIGHT / 2 - 18, playerOneScore, 36, "black");
    drawText(CANVAS_WIDTH - (CANVAS_WIDTH / 3), CANVAS_HEIGHT / 2 - 18, playerTwoScore, 36, "black");
}

function createNewBall(){
    const r1 = Math.random() * 3;
    const r2 = Math.random() * 3;
    const color = getRandomColorHexString();
    const ball = createCircleSprite(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, r1, r2, BALL_RADIUS, color);
    BALLS.push(ball);
}

function handleCollisions(){
    BALLS.forEach(b => handleBallPaddleCollisions(b, paddleL, paddleR));
}

function handleBallPaddleCollisions(b, pL, pR){
    if (b.leftEdge < 0){
        // past left edge
        playerTwoScore++;
        b.dx = -b.dx;
        createNewBall();
        resetBall(b);
    }

    if (b.rightEdge > CANVAS_WIDTH){
        // past right edge
        playerOneScore++;
        b.dx = -b.dx;
        createNewBall();
        resetBall(b);
    }

    // check if ball is colliding with top or bottom wall
    if (b.topEdge < 0 || b.bottomEdge > CANVAS_HEIGHT){
        // reverse y direction
        b.dy = -b.dy;
    }

    // bounce on Right paddle
    if (b.rightEdge > pR.leftEdge &&
        b.y > pR.topEdge &&
        b.y < pR.bottomEdge){
        b.dx = -b.dx;
    }

    // bounce on Left paddle
    if (b.leftEdge < pL.rightEdge &&
        b.y > pL.topEdge &&
        b.y < pL.bottomEdge){
        b.dx = -b.dx;
    }
}

function onKeyEvent(e){
    // console.log(e);
    if(e.code === "ArrowDown"){
        onKeyEventArrowDown(e.type);
    } 
    else if (e.code === "ArrowUp"){
        onKeyEventArrowUp(e.type);
    } 
    else if (e.code === "KeyS"){
        onKeyEventS(e.type);
    }
    else if (e.code === "KeyW"){
        onKeyEventW(e.type);
    } 
    // otherwise, do nothing
}

function resetBall(b){
    b.x = CANVAS_WIDTH / 2;
    b.y = CANVAS_HEIGHT / 2;
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

function onKeyEventArrowDown(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        // start moving right paddle down
        paddleR.dy = PADDLE_SPEED;
    }
    if(eventType === EVENT_KEY_RELEASED){
        // stop moving right paddle
        paddleR.dy = 0;
    }
}

function onKeyEventArrowUp(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        // start moving right paddle up
        paddleR.dy = -PADDLE_SPEED;
    }
    if(eventType === EVENT_KEY_RELEASED){
        // stop moving right paddle
        paddleR.dy = 0;
    }
}

function onKeyEventS(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        // start moving left paddle down
        paddleL.dy = PADDLE_SPEED;
    }
    if(eventType === EVENT_KEY_RELEASED){
        // stop moving left paddle
        paddleL.dy = 0;
    }
}

function onKeyEventW(eventType){
    if(eventType === EVENT_KEY_PRESSED){
        // start moving left paddle up
        paddleL.dy = -PADDLE_SPEED;
    }
    if(eventType === EVENT_KEY_RELEASED){
        // stop moving left paddle
        paddleL.dy = 0;
    }
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
