/// <reference types="./global.d.ts" />


import { Constants } from "./geometry/constants.ts";
import { Vector } from "./geometry/vector.ts";

export const init = (opt: IDoodlerOptions) => {
  window['doodler'] = new Doodler(opt);
  window['doodler'].init();
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
    this.startDrawLoop();
  }

  private timer?: number;
  private startDrawLoop() {
    this.timer = setInterval(() => this.draw(), 1000 / this.framerate);
  }

  private draw() {
    this.ctx.fillStyle = this.bg;
    this.ctx.fillRect(0, 0, this.width, this.height);
    for (const [i, l] of (this.layers || []).entries()) {
      l(this.ctx, i);
    }
  }

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

  drawRotated(origin: Vector, angle: number, cb: () => void){
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
}

interface IStyle {
  color?: string;
  fillColor?: string;
  strokeColor?: string;
  weight?: number;
}

interface IDrawable {
  draw: () => void;
}
