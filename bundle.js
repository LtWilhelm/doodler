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
class OriginVector extends Vector {
    origin;
    get halfwayPoint() {
        return {
            x: this.mag() / 2 * Math.sin(this.heading()) + this.origin.x,
            y: this.mag() / 2 * Math.cos(this.heading()) + this.origin.y
        };
    }
    constructor(origin, p){
        super(p.x, p.y, p.z);
        this.origin = origin;
    }
    static from(origin, p) {
        const v = {
            x: p.x - origin.x,
            y: p.y - origin.y
        };
        return new OriginVector(origin, v);
    }
}
const easeInOut = (x)=>x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const map = (value, x1, y1, x2, y2)=>(value - x1) * (y2 - x2) / (y1 - x1) + x2;
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
    dragTarget;
    constructor({ width, height, canvas, bg, framerate }, postInit){
        if (!canvas) {
            canvas = document.createElement("canvas");
            document.body.append(canvas);
        }
        this.bg = bg || "white";
        this.framerate = framerate || 60;
        canvas.width = width;
        canvas.height = height;
        this._canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw "Unable to initialize Doodler: Canvas context not found";
        this.ctx = ctx;
        postInit?.(this.ctx);
    }
    init() {
        this._canvas.addEventListener("mousedown", (e)=>this.onClick(e));
        this._canvas.addEventListener("mouseup", (e)=>this.offClick(e));
        this._canvas.addEventListener("mousemove", (e)=>this.onDrag(e));
        this.startDrawLoop();
    }
    timer;
    startDrawLoop() {
        this.timer = setInterval(()=>this.draw(), 1000 / this.framerate);
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = this.bg;
        this.ctx.fillRect(0, 0, this.width, this.height);
        for (const [i, l] of (this.layers || []).entries()){
            l(this.ctx, i);
            this.drawDeferred();
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
    drawScaled(scale, cb) {
        this.ctx.save();
        this.ctx.transform(scale, 0, 0, scale, 0, 0);
        cb();
        this.ctx.restore();
    }
    drawWithAlpha(alpha, cb) {
        this.ctx.save();
        this.ctx.globalAlpha = Math.min(Math.max(alpha, 0), 1);
        cb();
        this.ctx.restore();
    }
    drawImage(img, at, w, h) {
        w && h ? this.ctx.drawImage(img, at.x, at.y, w, h) : this.ctx.drawImage(img, at.x, at.y);
    }
    drawImageWithOutline(img, at, w, h, style) {
        this.ctx.save();
        const s = (typeof w === "number" || !w ? style?.weight : w.weight) || 1;
        this.ctx.shadowColor = (typeof w === "number" || !w ? style?.color || style?.fillColor : w.color || w.strokeColor) || "red";
        this.ctx.shadowBlur = 0;
        for(let x = -s; x <= s; x++){
            for(let y = -s; y <= s; y++){
                this.ctx.shadowOffsetX = x;
                this.ctx.shadowOffsetY = y;
                typeof w === "number" && h ? this.ctx.drawImage(img, at.x, at.y, w, h) : this.ctx.drawImage(img, at.x, at.y);
            }
        }
        this.ctx.restore();
    }
    drawSprite(img, spritePos, sWidth, sHeight, at, width, height) {
        this.ctx.drawImage(img, spritePos.x, spritePos.y, sWidth, sHeight, at.x, at.y, width, height);
    }
    deferredDrawings = [];
    deferDrawing(cb) {
        this.deferredDrawings.push(cb);
    }
    drawDeferred() {
        while(this.deferredDrawings.length){
            this.deferredDrawings.pop()?.();
        }
    }
    setStyle(style) {
        const ctx = this.ctx;
        ctx.fillStyle = style?.color || style?.fillColor || "black";
        ctx.strokeStyle = style?.color || style?.strokeColor || "black";
        ctx.lineWidth = style?.weight || 1;
        ctx.textAlign = style?.textAlign || ctx.textAlign;
        ctx.textBaseline = style?.textBaseline || ctx.textBaseline;
    }
    fillText(text, pos, maxWidth, style) {
        this.setStyle(style);
        this.ctx.fillText(text, pos.x, pos.y, maxWidth);
    }
    strokeText(text, pos, maxWidth, style) {
        this.setStyle(style);
        this.ctx.strokeText(text, pos.x, pos.y, maxWidth);
    }
    clearRect(at, width, height) {
        this.ctx.clearRect(at.x, at.y, width, height);
    }
    mouseX = 0;
    mouseY = 0;
    registerDraggable(point, radius, style) {
        if (this.draggables.find((d)=>d.point === point)) return;
        const id = this.addUIElement("circle", point, radius, {
            fillColor: "#5533ff50",
            strokeColor: "#5533ff50"
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
    addDragEvents({ onDragEnd, onDragStart, onDrag, point }) {
        const d = this.draggables.find((d)=>d.point === point);
        if (d) {
            d.onDragEnd = onDragEnd;
            d.onDragStart = onDragStart;
            d.onDrag = onDrag;
        }
    }
    onClick(e) {
        const mouse = new Vector(this.mouseX, this.mouseY);
        for (const d of this.draggables){
            if (d.point.dist(mouse) <= d.radius) {
                d.beingDragged = true;
                d.onDragStart?.call(null);
                this.dragTarget = d;
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
        this.dragTarget = undefined;
    }
    onDrag(e) {
        this._canvas.getBoundingClientRect();
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
        for (const d of this.draggables.filter((d)=>d.beingDragged)){
            d.point.add(e.movementX, e.movementY);
            d.onDrag && d.onDrag({
                x: e.movementX,
                y: e.movementY
            });
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
class ZoomableDoodler extends Doodler {
    scale = 1;
    dragging = false;
    origin = {
        x: 0,
        y: 0
    };
    mouse = {
        x: 0,
        y: 0
    };
    previousTouchLength;
    touchTimer;
    hasDoubleTapped = false;
    zooming = false;
    scaleAround = {
        x: 0,
        y: 0
    };
    maxScale = 4;
    constructor(options, postInit){
        super(options, postInit);
        this._canvas.addEventListener("wheel", (e)=>{
            this.scaleAtMouse(e.deltaY < 0 ? 1.1 : .9);
            if (this.scale === 1) {
                this.origin.x = 0;
                this.origin.y = 0;
            }
        });
        this._canvas.addEventListener("dblclick", (e)=>{
            e.preventDefault();
            this.scale = 1;
            this.origin.x = 0;
            this.origin.y = 0;
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        });
        this._canvas.addEventListener("mousedown", (e)=>{
            e.preventDefault();
            this.dragging = true;
        });
        this._canvas.addEventListener("mouseup", (e)=>{
            e.preventDefault();
            this.dragging = false;
        });
        this._canvas.addEventListener("mouseleave", (e)=>{
            this.dragging = false;
        });
        this._canvas.addEventListener("mousemove", (e)=>{
            const prev = this.mouse;
            this.mouse = {
                x: e.offsetX,
                y: e.offsetY
            };
            if (this.dragging && !this.dragTarget) this.drag(prev);
        });
        this._canvas.addEventListener("touchstart", (e)=>{
            e.preventDefault();
            if (e.touches.length === 1) {
                const t1 = e.touches.item(0);
                if (t1) {
                    this.mouse = this.getTouchOffset({
                        x: t1.clientX,
                        y: t1.clientY
                    });
                }
            } else {
                clearTimeout(this.touchTimer);
            }
        });
        this._canvas.addEventListener("touchend", (e)=>{
            if (e.touches.length !== 2) {
                this.previousTouchLength = undefined;
            }
            switch(e.touches.length){
                case 1:
                    break;
                case 0:
                    if (!this.zooming) {
                        this.events.get("touchend")?.map((cb)=>cb(e));
                    }
                    break;
            }
            this.dragging = e.touches.length === 1;
            clearTimeout(this.touchTimer);
        });
        this._canvas.addEventListener("touchmove", (e)=>{
            e.preventDefault();
            if (e.touches.length === 2) {
                const t1 = e.touches.item(0);
                const t2 = e.touches.item(1);
                if (t1 && t2) {
                    const vect = OriginVector.from(this.getTouchOffset({
                        x: t1.clientX,
                        y: t1.clientY
                    }), {
                        x: t2.clientX,
                        y: t2.clientY
                    });
                    if (this.previousTouchLength) {
                        const diff = this.previousTouchLength - vect.mag();
                        this.scaleAt(vect.halfwayPoint, diff < 0 ? 1.01 : .99);
                        this.scaleAround = {
                            ...vect.halfwayPoint
                        };
                    }
                    this.previousTouchLength = vect.mag();
                }
            }
            if (e.touches.length === 1) {
                this.dragging === true;
                const t1 = e.touches.item(0);
                if (t1) {
                    const prev = this.mouse;
                    this.mouse = this.getTouchOffset({
                        x: t1.clientX,
                        y: t1.clientY
                    });
                    this.drag(prev);
                }
            }
        });
        this._canvas.addEventListener("touchstart", (e)=>{
            if (e.touches.length !== 1) return false;
            if (!this.hasDoubleTapped) {
                this.hasDoubleTapped = true;
                setTimeout(()=>this.hasDoubleTapped = false, 300);
                return false;
            }
            console.log(this.mouse);
            if (this.scale > 1) {
                this.frameCounter = map(this.scale, this.maxScale, 1, 0, 59);
                this.zoomDirection = -1;
            } else {
                this.frameCounter = 0;
                this.zoomDirection = 1;
            }
            if (this.zoomDirection > 0) {
                this.scaleAround = {
                    ...this.mouse
                };
            }
            this.events.get("doubletap")?.map((cb)=>cb(e));
        });
    }
    worldToScreen(x, y) {
        x = x * this.scale + this.origin.x;
        y = y * this.scale + this.origin.y;
        return {
            x,
            y
        };
    }
    screenToWorld(x, y) {
        x = (x - this.origin.x) / this.scale;
        y = (y - this.origin.y) / this.scale;
        return {
            x,
            y
        };
    }
    scaleAtMouse(scaleBy) {
        if (this.scale === this.maxScale && scaleBy > 1) return;
        this.scaleAt({
            x: this.mouse.x,
            y: this.mouse.y
        }, scaleBy);
    }
    scaleAt(p, scaleBy) {
        this.scale = Math.min(Math.max(this.scale * scaleBy, 1), this.maxScale);
        this.origin.x = p.x - (p.x - this.origin.x) * scaleBy;
        this.origin.y = p.y - (p.y - this.origin.y) * scaleBy;
        this.constrainOrigin();
    }
    moveOrigin(motion) {
        if (this.scale > 1) {
            this.origin.x += motion.x;
            this.origin.y += motion.y;
            this.constrainOrigin();
        }
    }
    drag(prev) {
        if (this.scale > 1) {
            const xOffset = this.mouse.x - prev.x;
            const yOffset = this.mouse.y - prev.y;
            this.origin.x += xOffset;
            this.origin.y += yOffset;
            this.constrainOrigin();
        }
    }
    constrainOrigin() {
        this.origin.x = Math.min(Math.max(this.origin.x, -this._canvas.width * this.scale + this._canvas.width), 0);
        this.origin.y = Math.min(Math.max(this.origin.y, -this._canvas.height * this.scale + this._canvas.height), 0);
    }
    draw() {
        this.ctx.setTransform(this.scale, 0, 0, this.scale, this.origin.x, this.origin.y);
        this.animateZoom();
        this.ctx.fillStyle = this.bg;
        this.ctx.fillRect(0, 0, this.width / this.scale, this.height / this.scale);
        super.draw();
    }
    getTouchOffset(p) {
        const { x, y } = this._canvas.getBoundingClientRect();
        const offsetX = p.x - x;
        const offsetY = p.y - y;
        return {
            x: offsetX,
            y: offsetY
        };
    }
    onDrag(e) {
        const d = {
            ...e,
            movementX: e.movementX / this.scale,
            movementY: e.movementY / this.scale
        };
        super.onDrag(d);
        const { x, y } = this.screenToWorld(e.offsetX, e.offsetY);
        this.mouseX = x;
        this.mouseY = y;
    }
    zoomDirection = -1;
    frameCounter = 60;
    animateZoom() {
        if (this.frameCounter < 60) {
            const frame = easeInOut(map(this.frameCounter, 0, 59, 0, 1));
            switch(this.zoomDirection){
                case 1:
                    {
                        this.scale = map(frame, 0, 1, 1, this.maxScale);
                    }
                    break;
                case -1:
                    {
                        this.scale = map(frame, 0, 1, this.maxScale, 1);
                    }
                    break;
            }
            this.origin.x = this.scaleAround.x - this.scaleAround.x * this.scale;
            this.origin.y = this.scaleAround.y - this.scaleAround.y * this.scale;
            this.constrainOrigin();
            this.frameCounter++;
        }
    }
    events = new Map();
    registerEvent(eventName, cb) {
        let events = this.events.get(eventName);
        if (!events) events = this.events.set(eventName, []).get(eventName);
        events.push(cb);
    }
}
const init = (opt, zoomable, postInit)=>{
    if (window.doodler) {
        throw "Doodler has already been initialized in this window";
    }
    window.doodler = zoomable ? new ZoomableDoodler(opt, postInit) : new Doodler(opt, postInit);
    window.doodler.init();
};
init({
    width: 400,
    height: 400
}, true, (ctx)=>{
    ctx.imageSmoothingEnabled = false;
});
new Vector(100, 300);
const v = new Vector(30, 30);
doodler.registerDraggable(v, 20);
const img = new Image();
img.src = "./skeleton.png";
img.hidden;
document.body.append(img);
const p = new Vector(200, 200);
doodler.createLayer(()=>{
    const [gamepad] = navigator.getGamepads();
    if (gamepad) {
        const leftX = gamepad.axes[0];
        const leftY = gamepad.axes[1];
        p.add(Math.min(Math.max(leftX - 0.04, 0), leftX + 0.04), Math.min(Math.max(leftY - 0.04, 0), leftY + 0.04));
        const rigthX = gamepad.axes[2];
        const rigthY = gamepad.axes[3];
        doodler.moveOrigin({
            x: -rigthX * 5,
            y: -rigthY * 5
        });
        if (gamepad.buttons[7].value) {
            doodler.scaleAt({
                x: 200,
                y: 200
            }, 1 + gamepad.buttons[7].value / 5);
        }
        if (gamepad.buttons[6].value) {
            doodler.scaleAt({
                x: 200,
                y: 200
            }, 1 - gamepad.buttons[6].value / 5);
        }
    }
    doodler.drawImageWithOutline(img, p);
});
document.addEventListener("keyup", (e)=>{
    e.preventDefault();
    if (e.key === " ") {
        doodler.unregisterDraggable(v);
    }
});
