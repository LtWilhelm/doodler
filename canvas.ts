/// <reference types="./global.d.ts" />


import { Constants } from "./geometry/constants.ts";
import { Vector } from "./geometry/vector.ts";

export const init = (opt: IDoodlerOptions) => {
  if (window.doodler) throw 'Doodler has already been initialized in this window'
  window.doodler = new Doodler(opt);
  window.doodler.init();
}

interface IDoodlerOptions {
  width: number;
  height: number;
  canvas?: HTMLCanvasElement;
  bg?: string;
  framerate?: number;
}

type layer = (ctx: CanvasRenderingContext2D, index: number) => void;

export class Doodler {
  private ctx: CanvasRenderingContext2D;
  private _canvas: HTMLCanvasElement;

  private layers: layer[] = [];

  private bg: string;
  private framerate: number;

  get width() {
    return this.ctx.canvas.width;
  }
  get height() {
    return this.ctx.canvas.height;
  }

  private draggables: Draggable[] = [];

  constructor({
    width,
    height,
    canvas,
    bg,
    framerate
  }: IDoodlerOptions) {
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
    this._canvas.addEventListener('mousedown', e => this.onClick(e));
    this._canvas.addEventListener('mouseup', e => this.offClick(e));
    this._canvas.addEventListener('mousemove', e => {
      const rect = this._canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;

      for (const d of this.draggables.filter(d => d.beingDragged)) {
        d.point.add(e.movementX, e.movementY)
      }
    })
    this.startDrawLoop();
  }

  private timer?: number;
  private startDrawLoop() {
    this.timer = setInterval(() => this.draw(), 1000 / this.framerate);
  }

  private draw() {
    this.ctx.fillStyle = this.bg;
    this.ctx.fillRect(0, 0, this.width, this.height);
    // for (const d of this.draggables.filter(d => d.beingDragged)) {
    //   d.point.set(this.mouseX,this.mouseY);
    // }
    for (const [i, l] of (this.layers || []).entries()) {
      l(this.ctx, i);
    }
    this.drawUI();
  }

  // Layer management

  createLayer(layer: layer) {
    this.layers.push(layer);
  }

  deleteLayer(layer: layer) {
    this.layers = this.layers.filter(l => l !== layer);
  }

  moveLayer(layer: layer, index: number) {
    let temp = this.layers.filter(l => l !== layer);

    temp = [...temp.slice(0, index), layer, ...temp.slice(index)];

    this.layers = temp;
  }

  // Drawing

  line(start: Vector, end: Vector, style?: IStyle) {
    this.setStyle(style);
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
  }
  dot(at: Vector, style?: IStyle) {
    this.setStyle({ ...style, weight: 1 })
    this.ctx.beginPath();

    this.ctx.arc(at.x, at.y, style?.weight || 1, 0, Constants.TWO_PI);
    this.ctx.fill();
  }
  drawCircle(at: Vector, radius: number, style?: IStyle) {
    this.setStyle(style);
    this.ctx.beginPath();

    this.ctx.arc(at.x, at.y, radius, 0, Constants.TWO_PI);
    this.ctx.stroke();
  }
  fillCircle(at: Vector, radius: number, style?: IStyle) {
    this.setStyle(style);
    this.ctx.beginPath();

    this.ctx.arc(at.x, at.y, radius, 0, Constants.TWO_PI);
    this.ctx.fill();
  }
  drawRect(at: Vector, width: number, height: number, style?: IStyle) {
    this.setStyle(style);
    this.ctx.strokeRect(at.x, at.y, width, height);
  }
  fillRect(at: Vector, width: number, height: number, style?: IStyle) {
    this.setStyle(style);
    this.ctx.fillRect(at.x, at.y, width, height);
  }
  drawSquare(at: Vector, size: number, style?: IStyle) {
    this.drawRect(at, size, size, style);
  }
  fillSquare(at: Vector, size: number, style?: IStyle) {
    this.fillRect(at, size, size, style);
  }
  drawCenteredRect(at: Vector, width: number, height: number, style?: IStyle) {
    this.ctx.save();
    this.ctx.translate(-width / 2, -height / 2);
    this.drawRect(at, width, height, style);
    this.ctx.restore();
  }
  fillCenteredRect(at: Vector, width: number, height: number, style?: IStyle) {
    this.ctx.save();
    this.ctx.translate(-width / 2, -height / 2);
    this.fillRect(at, width, height, style);
    this.ctx.restore();
  }
  drawCenteredSquare(at: Vector, size: number, style?: IStyle) {
    this.drawCenteredRect(at, size, size, style);
  }
  fillCenteredSquare(at: Vector, size: number, style?: IStyle) {
    this.fillCenteredRect(at, size, size, style);
  }

  drawBezier(a: Vector, b: Vector, c: Vector, d: Vector, style?: IStyle) {
    this.setStyle(style);
    this.ctx.beginPath();
    this.ctx.moveTo(a.x, a.y);
    this.ctx.bezierCurveTo(b.x, b.y, c.x, c.y, d.x, d.y);
    this.ctx.stroke();
  }

  drawRotated(origin: Vector, angle: number, cb: () => void) {
    this.ctx.save();
    this.ctx.translate(origin.x, origin.y);
    this.ctx.rotate(angle);
    this.ctx.translate(-origin.x, -origin.y);
    cb();
    this.ctx.restore();
  }

  setStyle(style?: IStyle) {
    const ctx = this.ctx;
    ctx.fillStyle = style?.color || style?.fillColor || 'black';
    ctx.strokeStyle = style?.color || style?.strokeColor || 'black';

    ctx.lineWidth = style?.weight || 1;
  }

  // Interaction

  mouseX = 0;
  mouseY = 0;


  registerDraggable(point: Vector, radius: number, style?: IStyle & { shape: 'square' | 'circle' }) {
    if (this.draggables.find(d => d.point === point)) return;
    const id = this.addUIElement('circle', point, radius, { fillColor: '#5533ff50', strokeColor: '#5533ff50' })
    this.draggables.push({ point, radius, style, id });
  }
  unregisterDraggable(point: Vector) {
    for (const d of this.draggables) {
      if (d.point === point) {
        this.removeUIElement(d.id);
      }
    }
    this.draggables = this.draggables.filter(d => d.point !== point);
  }

  onClick(e: MouseEvent) {
    for (const d of this.draggables) {
      if (d.point.dist(new Vector(this.mouseX, this.mouseY)) <= d.radius) {
        d.beingDragged = true;
      } else d.beingDragged = false;
    }
  }

  offClick(e:MouseEvent){
    for (const d of this.draggables) {
      d.beingDragged = false;
    }
  }

  // UI Layer
  uiElements: Map<string, [keyof uiDrawing, ...any]> = new Map();
  private uiDrawing: uiDrawing = {
    rectangle: (...args: any[]) => {
      !args[3].noFill && this.fillRect(args[0], args[1], args[2], args[3])
      !args[3].noStroke && this.drawRect(args[0], args[1], args[2], args[3])
    },
    square: (...args: any[]) => {
      !args[2].noFill && this.fillSquare(args[0], args[1], args[2])
      !args[2].noStroke && this.drawSquare(args[0], args[1], args[2])
    },
    circle: (...args: any[]) => {
      !args[2].noFill && this.fillCircle(args[0], args[1], args[2])
      !args[2].noStroke && this.drawCircle(args[0], args[1], args[2])
    },
  }

  private drawUI() {
    for (const [shape, ...args] of this.uiElements.values()) {
      this.uiDrawing[shape].apply(null, args as [])
    }
  }

  addUIElement(shape: 'rectangle', at: Vector, width: number, height: number, style?: IStyle): string;
  addUIElement(shape: 'square', at: Vector, size: number, style?: IStyle): string;
  addUIElement(shape: 'circle', at: Vector, radius: number, style?: IStyle): string;
  addUIElement(shape: keyof uiDrawing, ...args: any[]) {
    const id = crypto.randomUUID();
    for (const arg of args) {
      delete arg.color;
    }
    this.uiElements.set(id, [shape, ...args]);
    return id;
  }

  removeUIElement(id: string) {
    this.uiElements.delete(id);
  }
}

interface IStyle {
  color?: string;
  fillColor?: string;
  strokeColor?: string;
  weight?: number;

  noStroke?: boolean;
  noFill?: boolean;
}

interface IDrawable {
  draw: () => void;
}

type Draggable = {
  point: Vector;
  radius: number;
  style?: IStyle & { shape: 'square' | 'circle' };
  beingDragged?: boolean;
  id: string;
}

type uiDrawing = {
  circle: () => void;
  square: () => void;
  rectangle: () => void;
}