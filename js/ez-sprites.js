// v0.1.1

let _canvas;
let _ctx;

export const SHAPE_TYPE_RECT = "rect";
export const SHAPE_TYPE_CIRC = "circle";
export const SHAPE_TYPE_POINT = "point";

const POINT_RADIUS = 3;
const POINT_COLOR = "black";

const SPRITES = [];

export function setupCanvas (cvs, height, width){
    _canvas = cvs;
    _canvas.width = width;
    _canvas.height = height;
    _ctx = _canvas.getContext("2d");
}

export function drawBorder (){
    _ctx.strokeRect(0, 0, _canvas.width, _canvas.height);
}

export function drawRect (x, y, width, height, color) {
    _ctx.fillStyle = color;
    _ctx.fillRect(x, y, width, height);
}

export function drawCircle (x, y, radius, color) {
    _ctx.fillStyle = color;
    _ctx.beginPath();
    // arc(x, y, radius, startAngle, endAngle)
    _ctx.arc(x, y, radius, 0, 2 * Math.PI);
    _ctx.fill();
}

export function drawText (x, y, text, fontSize, color){
    _ctx.fillStyle = color;
    _ctx.font = `${fontSize}px sans-serif`;
    _ctx.fillText(text, x, y + fontSize);
}

export function clearCanvas(){
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
}

export function getRandomColorHexString(){
    const r = getRandom8BitIntegerAsHexString();
    const g = getRandom8BitIntegerAsHexString();
    const b = getRandom8BitIntegerAsHexString();
    return `#${r}${g}${b}`;
}

export function getRandom8BitIntegerAsHexString(){
    return Math.trunc(Math.random() * 256).toString(16);
}

function getRectEdges (rect) {
    return {
        leftEdge: rect.x,
        rightEdge: rect.x + rect.width,
        topEdge: rect.y,
        bottomEdge: rect.y + rect.height
    }
}

export function createRectSprite(x, y, dx, dy, width, height, color){
    const draw = (r) => {
        drawRect(r.x, r.y, r.width, r.height, r.color);
    }

    let sprite = createSprite(x, y, dx, dy, color, draw, getRectEdges);
    sprite.width = width;
    sprite.height = height;
    return sprite;
}

export function createCircleSprite(x, y, dx, dy, radius, color){
    const draw = (c) => {
        drawCircle(c.x, c.y, c.radius, c.color);
    }

    const getCircleEdges = (circle) =>{
        return {
            leftEdge: circle.x - circle.radius,
            rightEdge: circle.x + circle.radius,
            topEdge: circle.y - circle.radius,
            bottomEdge: circle.y + circle.radius
        }
    }
    let sprite = createSprite(x, y, dx, dy, color, draw, getCircleEdges);
    sprite.radius = radius;
    return sprite;
}

export function createCompoundShapeRectSprite(x, y, dx, dy, width, height, scale, shapesObj) {
    const draw = (s) => {
        drawShapesObj(s.shapesObj, s.x, s.y, s.scale);
    }

    let sprite = createSprite(x, y, dx, dy, null, draw, getRectEdges);
    sprite.width = width;
    sprite.height = height;
    sprite.scale = scale;
    sprite.shapesObj = shapesObj;
    return sprite;
}

export function createSprite(x, y, dx, dy, color, drawFn, findEdgesFn){
    const sprite = {
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

export function moveAndDrawSprites(){
    SPRITES.forEach(s => {
        s.x += s.dx;
        s.y += s.dy;
        s.draw(s);
        const edges = s.findEdges(s);
        s.leftEdge = edges.leftEdge;
        s.rightEdge = edges.rightEdge;
        s.topEdge = edges.topEdge;
        s.bottomEdge = edges.bottomEdge
    });
}

export function removeSprite(sprite){
    SPRITES.splice(SPRITES.indexOf(sprite), 1);
}

// returns true if circle sprite is colliding with rectangle sprite's top edge
export function circleRectangleTopEdgeAreColliding(c, r){
    if (c.y < r.topEdge && c.rightEdge > r.leftEdge && c.leftEdge < r.rightEdge){
        return checkDistanceToPointLessThanRadius(c, c.x, r.topEdge);
    }
    return false;
}

export function circleRectangleBottomEdgeAreColliding(c, r){
    if (c.y > r.bottomEdge && c.rightEdge > r.leftEdge && c.leftEdge < r.rightEdge){
        return checkDistanceToPointLessThanRadius(c, c.x, r.bottomEdge);
    }
    return false;
}

export function circleRectangleRightEdgeAreColliding(c, r){
    if (c.x > r.rightEdge && c.bottomEdge > r.topEdge && c.topEdge < r.bottomEdge){
        return checkDistanceToPointLessThanRadius(c, r.rightEdge, c.y);
    }
    return false;
}

export function circleRectangleLeftEdgeAreColliding(c, r){
    if (c.x < r.leftEdge && c.bottomEdge > r.topEdge && c.topEdge < r.bottomEdge){
        return checkDistanceToPointLessThanRadius(c, r.leftEdge, c.y);
    }
    return false;
}

// hat tip https://www.jeffreythompson.org/collision-detection/circle-rect.php
export function checkDistanceToPointLessThanRadius(circle, testX, testY){
    let distX = circle.x - testX;
    let distY = circle.y - testY;
    const distance = Math.sqrt( (distX*distX) + (distY*distY) );
    return distance <= circle.radius;
}

export function drawShapesObj(sObj, originX, originY, scale){
    if(!scale) scale = 1;
    if(!originX) originX = 0;
    if(!originY) originY = 0;
    try {
        sObj.shapes.forEach((s, i) => {
            if(s.type){
                const shapeX = originX + s.x * scale;
                const shapeY = originY + s.y * scale;
                switch(s.type) {
                    case SHAPE_TYPE_RECT:
                        drawRect(shapeX, shapeY, s.w * scale, s.h * scale, s.constantColor);
                        break;
                    case SHAPE_TYPE_CIRC:
                        drawCircle(shapeX, shapeY, s.r * scale, s.constantColor);
                        break;
                    case SHAPE_TYPE_POINT: // designer only
                        drawCircle(shapeX, shapeY, POINT_RADIUS, POINT_COLOR);
                        break;
                }
            }
            else {
                throw new Error("no shape type for shape at index " + i);
            }
        });
    }
    catch(e) {
        console.error(e);
    }
}
