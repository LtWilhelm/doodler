// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const Constants = {
    TWO_PI: Math.PI * 2
};
class Vector {
    x;
    y;
    z;
    constructor(x = 0, y = 0, z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    set(v, y, z) {
        if (arguments.length === 1 && typeof v !== "number") {
            this.set(v.x || v[0] || 0, v.y || v[1] || 0, v.z || v[2] || 0);
        } else {
            this.x = v;
            this.y = y || 0;
            this.z = z || 0;
        }
    }
    get() {
        return new Vector(this.x, this.y, this.z);
    }
    mag() {
        const x = this.x, y = this.y, z = this.z;
        return Math.sqrt(x * x + y * y + z * z);
    }
    magSq() {
        const x = this.x, y = this.y, z = this.z;
        return x * x + y * y + z * z;
    }
    setMag(v_or_len, len) {
        if (len === undefined) {
            len = v_or_len;
            this.normalize();
            this.mult(len);
        } else {
            const v = v_or_len;
            v.normalize();
            v.mult(len);
            return v;
        }
    }
    add(v, y, z) {
        if (arguments.length === 1 && typeof v !== 'number') {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
        } else if (arguments.length === 2) {
            this.x += v;
            this.y += y ?? 0;
        } else {
            this.x += v;
            this.y += y ?? 0;
            this.z += z ?? 0;
        }
        return this;
    }
    sub(v, y, z) {
        if (arguments.length === 1 && typeof v !== 'number') {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
        } else if (arguments.length === 2) {
            this.x -= v;
            this.y -= y ?? 0;
        } else {
            this.x -= v;
            this.y -= y ?? 0;
            this.z -= z ?? 0;
        }
        return this;
    }
    mult(v) {
        if (typeof v === 'number') {
            this.x *= v;
            this.y *= v;
            this.z *= v;
        } else {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
        }
        return this;
    }
    div(v) {
        if (typeof v === 'number') {
            this.x /= v;
            this.y /= v;
            this.z /= v;
        } else {
            this.x /= v.x;
            this.y /= v.y;
            this.z /= v.z;
        }
        return this;
    }
    rotate(angle) {
        const prev_x = this.x;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        this.x = c * this.x - s * this.y;
        this.y = s * prev_x + c * this.y;
        return this;
    }
    dist(v) {
        const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    dot(v, y, z) {
        if (arguments.length === 1 && typeof v !== 'number') {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        }
        return this.x * v + this.y * y + this.z * z;
    }
    cross(v) {
        const x = this.x, y = this.y, z = this.z;
        return new Vector(y * v.z - v.y * z, z * v.x - v.z * x, x * v.y - v.x * y);
    }
    lerp(v_or_x, amt_or_y, z, amt) {
        const lerp_val = (start, stop, amt)=>{
            return start + (stop - start) * amt;
        };
        let x, y;
        if (arguments.length === 2 && typeof v_or_x !== 'number') {
            amt = amt_or_y;
            x = v_or_x.x;
            y = v_or_x.y;
            z = v_or_x.z;
        } else {
            x = v_or_x;
            y = amt_or_y;
        }
        this.x = lerp_val(this.x, x, amt);
        this.y = lerp_val(this.y, y, amt);
        this.z = lerp_val(this.z, z, amt);
        return this;
    }
    normalize() {
        const m = this.mag();
        if (m > 0) {
            this.div(m);
        }
        return this;
    }
    limit(high) {
        if (this.mag() > high) {
            this.normalize();
            this.mult(high);
        }
        return this;
    }
    heading() {
        return -Math.atan2(-this.y, this.x);
    }
    heading2D() {
        return this.heading();
    }
    toString() {
        return "[" + this.x + ", " + this.y + ", " + this.z + "]";
    }
    array() {
        return [
            this.x,
            this.y,
            this.z
        ];
    }
    copy() {
        return new Vector(this.x, this.y, this.z);
    }
    drawDot() {
        if (!doodler) return;
        doodler.dot(this, {
            weight: 2,
            color: 'red'
        });
    }
    static fromAngle(angle, v) {
        if (v === undefined || v === null) {
            v = new Vector();
        }
        v.x = Math.cos(angle);
        v.y = Math.sin(angle);
        return v;
    }
    static random2D(v) {
        return Vector.fromAngle(Math.random() * (Math.PI * 2), v);
    }
    static random3D(v) {
        const angle = Math.random() * Constants.TWO_PI;
        const vz = Math.random() * 2 - 1;
        const mult = Math.sqrt(1 - vz * vz);
        const vx = mult * Math.cos(angle);
        const vy = mult * Math.sin(angle);
        if (v === undefined || v === null) {
            v = new Vector(vx, vy, vz);
        } else {
            v.set(vx, vy, vz);
        }
        return v;
    }
    static dist(v1, v2) {
        return v1.dist(v2);
    }
    static dot(v1, v2) {
        return v1.dot(v2);
    }
    static cross(v1, v2) {
        return v1.cross(v2);
    }
    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    static angleBetween(v1, v2) {
        return Math.acos(v1.dot(v2) / Math.sqrt(v1.magSq() * v2.magSq()));
    }
    static lerp(v1, v2, amt) {
        const retval = new Vector(v1.x, v1.y, v1.z);
        retval.lerp(v2, amt);
        return retval;
    }
    static vectorProjection(v1, v2) {
        v2 = v2.copy();
        v2.normalize();
        const sp = v1.dot(v2);
        v2.mult(sp);
        return v2;
    }
    static hypot2(a, b) {
        return Vector.dot(Vector.sub(a, b), Vector.sub(a, b));
    }
}
const init = (opt)=>{
    if (window.doodler) throw 'Doodler has already been initialized in this window';
    window.doodler = new Doodler(opt);
    window.doodler.init();
};
class Doodler {
    ctx;
    _canvas;
    layers = [];
    bg;
    framerate;
    get width() {
        return this.ctx.canvas.width;
    }
    get height() {
        return this.ctx.canvas.height;
    }
    draggables = [];
    clickables = [];
    constructor({ width , height , canvas , bg , framerate  }){
        if (!canvas) {
            canvas = document.createElement('canvas');
            document.body.append(canvas);
        }
        this.bg = bg || 'white';
        this.framerate = framerate || 60;
        canvas.width = width;
        canvas.height = height;
        this._canvas = canvas;
        const ctx = canvas.getContext('2d');
        console.log(ctx);
        if (!ctx) throw 'Unable to initialize Doodler: Canvas context not found';
        this.ctx = ctx;
    }
    init() {
        this._canvas.addEventListener('mousedown', (e)=>this.onClick(e));
        this._canvas.addEventListener('mouseup', (e)=>this.offClick(e));
        this._canvas.addEventListener('mousemove', (e)=>{
            const rect = this._canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
            for (const d of this.draggables.filter((d)=>d.beingDragged)){
                d.point.add(e.movementX, e.movementY);
            }
        });
        this.startDrawLoop();
    }
    timer;
    startDrawLoop() {
        this.timer = setInterval(()=>this.draw(), 1000 / this.framerate);
    }
    draw() {
        this.ctx.fillStyle = this.bg;
        this.ctx.fillRect(0, 0, this.width, this.height);
        for (const [i, l] of (this.layers || []).entries()){
            l(this.ctx, i);
        }
        this.drawUI();
    }
    createLayer(layer) {
        this.layers.push(layer);
    }
    deleteLayer(layer) {
        this.layers = this.layers.filter((l)=>l !== layer);
    }
    moveLayer(layer, index) {
        let temp = this.layers.filter((l)=>l !== layer);
        temp = [
            ...temp.slice(0, index),
            layer,
            ...temp.slice(index)
        ];
        this.layers = temp;
    }
    line(start, end, style) {
        this.setStyle(style);
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
    }
    dot(at, style) {
        this.setStyle({
            ...style,
            weight: 1
        });
        this.ctx.beginPath();
        this.ctx.arc(at.x, at.y, style?.weight || 1, 0, Constants.TWO_PI);
        this.ctx.fill();
    }
    drawCircle(at, radius, style) {
        this.setStyle(style);
        this.ctx.beginPath();
        this.ctx.arc(at.x, at.y, radius, 0, Constants.TWO_PI);
        this.ctx.stroke();
    }
    fillCircle(at, radius, style) {
        this.setStyle(style);
        this.ctx.beginPath();
        this.ctx.arc(at.x, at.y, radius, 0, Constants.TWO_PI);
        this.ctx.fill();
    }
    drawRect(at, width, height, style) {
        this.setStyle(style);
        this.ctx.strokeRect(at.x, at.y, width, height);
    }
    fillRect(at, width, height, style) {
        this.setStyle(style);
        this.ctx.fillRect(at.x, at.y, width, height);
    }
    drawSquare(at, size, style) {
        this.drawRect(at, size, size, style);
    }
    fillSquare(at, size, style) {
        this.fillRect(at, size, size, style);
    }
    drawCenteredRect(at, width, height, style) {
        this.ctx.save();
        this.ctx.translate(-width / 2, -height / 2);
        this.drawRect(at, width, height, style);
        this.ctx.restore();
    }
    fillCenteredRect(at, width, height, style) {
        this.ctx.save();
        this.ctx.translate(-width / 2, -height / 2);
        this.fillRect(at, width, height, style);
        this.ctx.restore();
    }
    drawCenteredSquare(at, size, style) {
        this.drawCenteredRect(at, size, size, style);
    }
    fillCenteredSquare(at, size, style) {
        this.fillCenteredRect(at, size, size, style);
    }
    drawBezier(a, b, c, d, style) {
        this.setStyle(style);
        this.ctx.beginPath();
        this.ctx.moveTo(a.x, a.y);
        this.ctx.bezierCurveTo(b.x, b.y, c.x, c.y, d.x, d.y);
        this.ctx.stroke();
    }
    drawRotated(origin, angle, cb) {
        this.ctx.save();
        this.ctx.translate(origin.x, origin.y);
        this.ctx.rotate(angle);
        this.ctx.translate(-origin.x, -origin.y);
        cb();
        this.ctx.restore();
    }
    drawImage(img, at, w, h) {
        w && h ? this.ctx.drawImage(img, at.x, at.y, w, h) : this.ctx.drawImage(img, at.x, at.y);
    }
    drawSprite(img, spritePos, sWidth, sHeight, at, width, height) {
        this.ctx.drawImage(img, spritePos.x, spritePos.y, sWidth, sHeight, at.x, at.y, width, height);
    }
    setStyle(style) {
        const ctx = this.ctx;
        ctx.fillStyle = style?.color || style?.fillColor || 'black';
        ctx.strokeStyle = style?.color || style?.strokeColor || 'black';
        ctx.lineWidth = style?.weight || 1;
    }
    mouseX = 0;
    mouseY = 0;
    registerDraggable(point, radius, style) {
        if (this.draggables.find((d)=>d.point === point)) return;
        const id = this.addUIElement('circle', point, radius, {
            fillColor: '#5533ff50',
            strokeColor: '#5533ff50'
        });
        this.draggables.push({
            point,
            radius,
            style,
            id
        });
    }
    unregisterDraggable(point) {
        for (const d of this.draggables){
            if (d.point === point) {
                this.removeUIElement(d.id);
            }
        }
        this.draggables = this.draggables.filter((d)=>d.point !== point);
    }
    registerClickable(p1, p2, cb) {
        const top = Math.min(p1.y, p2.y);
        const left = Math.min(p1.x, p2.x);
        const bottom = Math.max(p1.y, p2.y);
        const right = Math.max(p1.x, p2.x);
        this.clickables.push({
            onClick: cb,
            checkBound: (p)=>p.y >= top && p.x >= left && p.y <= bottom && p.x <= right
        });
    }
    unregisterClickable(cb) {
        this.clickables = this.clickables.filter((c)=>c.onClick !== cb);
    }
    addDragEvents({ onDragEnd , onDragStart , point  }) {
        const d = this.draggables.find((d)=>d.point === point);
        if (d) {
            d.onDragEnd = onDragEnd;
            d.onDragStart = onDragStart;
        }
    }
    onClick(e) {
        const mouse = new Vector(this.mouseX, this.mouseY);
        for (const d of this.draggables){
            if (d.point.dist(mouse) <= d.radius) {
                d.beingDragged = true;
                d.onDragStart?.call(null);
            } else d.beingDragged = false;
        }
        for (const c of this.clickables){
            if (c.checkBound(mouse)) {
                c.onClick();
            }
        }
    }
    offClick(e) {
        for (const d of this.draggables){
            d.beingDragged = false;
            d.onDragEnd?.call(null);
        }
    }
    uiElements = new Map();
    uiDrawing = {
        rectangle: (...args)=>{
            !args[3].noFill && this.fillRect(args[0], args[1], args[2], args[3]);
            !args[3].noStroke && this.drawRect(args[0], args[1], args[2], args[3]);
        },
        square: (...args)=>{
            !args[2].noFill && this.fillSquare(args[0], args[1], args[2]);
            !args[2].noStroke && this.drawSquare(args[0], args[1], args[2]);
        },
        circle: (...args)=>{
            !args[2].noFill && this.fillCircle(args[0], args[1], args[2]);
            !args[2].noStroke && this.drawCircle(args[0], args[1], args[2]);
        }
    };
    drawUI() {
        for (const [shape, ...args] of this.uiElements.values()){
            this.uiDrawing[shape].apply(null, args);
        }
    }
    addUIElement(shape, ...args) {
        const id = crypto.randomUUID();
        for (const arg of args){
            delete arg.color;
        }
        this.uiElements.set(id, [
            shape,
            ...args
        ]);
        return id;
    }
    removeUIElement(id) {
        this.uiElements.delete(id);
    }
}
init({
    width: 400,
    height: 400
});
const movingVector = new Vector(100, 300);
let angleMultiplier = 0;
const v = new Vector(30, 30);
doodler.registerDraggable(v, 20);
const img = new Image();
img.src = './EngineSprites.png';
img.hidden;
document.body.append(img);
doodler.createLayer(()=>{
    doodler.line(new Vector(100, 100), new Vector(200, 200));
    doodler.dot(new Vector(300, 300));
    doodler.fillCircle(movingVector, 6, {
        color: 'red'
    });
    doodler.drawRect(new Vector(50, 50), movingVector.x, movingVector.y);
    doodler.fillRect(new Vector(200, 250), 30, 10);
    doodler.drawCenteredSquare(new Vector(200, 200), 40, {
        color: 'purple',
        weight: 5
    });
    doodler.drawBezier(new Vector(100, 150), movingVector, new Vector(150, 300), new Vector(100, 250));
    let rotatedOrigin = new Vector(200, 200);
    doodler.drawRotated(rotatedOrigin, Math.PI * angleMultiplier, ()=>{
        doodler.drawCenteredSquare(rotatedOrigin, 30);
        doodler.drawSprite(img, new Vector(0, 40), 80, 20, new Vector(160, 300), 80, 20);
    });
    movingVector.set((movingVector.x + 1) % 400, movingVector.y);
    angleMultiplier += .001;
    doodler.drawSprite(img, new Vector(0, 40), 80, 20, new Vector(100, 300), 80, 20);
});
document.addEventListener('keyup', (e)=>{
    e.preventDefault();
    if (e.key === ' ') {
        doodler.unregisterDraggable(v);
    }
});
