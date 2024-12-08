let _canvas;
let _ctx;

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
