/// <reference types="../global.d.ts" />

import { Constants } from "./constants.ts";

export class Vector {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x: number, y: number, z?: number): void;
  set(v: Vector): void;
  set(v: [number, number, number]): void;
  set(v: Vector | [number, number, number] | number, y?: number, z?: number) {
    if (arguments.length === 1 && typeof v !== "number") {
      this.set((v as Vector).x || (v as Array<number>)[0] || 0,
        (v as Vector).y || (v as Array<number>)[1] || 0,
        (v as Vector).z || (v as Array<number>)[2] || 0);
    } else {
      this.x = v as number;
      this.y = y || 0;
      this.z = z || 0;
    }
  }
  get() {
    return new Vector(this.x, this.y, this.z);
  }
  mag() {
    const x = this.x,
      y = this.y,
      z = this.z;
    return Math.sqrt(x * x + y * y + z * z);
  }
  magSq() {
    const x = this.x,
      y = this.y,
      z = this.z;
    return (x * x + y * y + z * z);
  }
  setMag(len: number): void;
  setMag(v: Vector, len: number): Vector
  setMag(v_or_len: Vector | number, len?: number) {
    if (len === undefined) {
      len = v_or_len as number;
      this.normalize();
      this.mult(len);
    } else {
      const v = v_or_len as Vector;
      v.normalize();
      v.mult(len);
      return v;
    }
  }
  add(x: number, y: number, z: number): void;
  add(x: number, y: number): void;
  add(v: Vector): void;
  add(v: Vector | number, y?: number, z?: number) {
    if (arguments.length === 1 && typeof v !== 'number') {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
    } else if (arguments.length === 2) {
      // 2D Vector
      this.x += v as number;
      this.y += y ?? 0;
    } else {
      this.x += v as number;
      this.y += y ?? 0;
      this.z += z ?? 0;
    }
  }
  sub(x: number, y: number, z: number): void;
  sub(x: number, y: number): void;
  sub(v: Vector): void;
  sub(v: Vector | number, y?: number, z?: number) {
    if (arguments.length === 1 && typeof v !== 'number') {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
    } else if (arguments.length === 2) {
      // 2D Vector
      this.x -= v as number;
      this.y -= y ?? 0;
    } else {
      this.x -= v as number;
      this.y -= y ?? 0;
      this.z -= z ?? 0;
    }
  }
  mult(v: number | Vector) {
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
  div(v: number | Vector) {
    if (typeof v === 'number') {
      this.x /= v;
      this.y /= v;
      this.z /= v;
    } else {
      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;
    }
  }
  rotate(angle: number) {
    const prev_x = this.x;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    this.x = c * this.x - s * this.y;
    this.y = s * prev_x + c * this.y;
  }
  dist(v: Vector) {
    const dx = this.x - v.x,
      dy = this.y - v.y,
      dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  dot(x: number, y: number, z: number): number;
  dot(v: Vector): number;
  dot(v: Vector | number, y?: number, z?: number) {
    if (arguments.length === 1 && typeof v !== 'number') {
      return (this.x * v.x + this.y * v.y + this.z * v.z);
    }
    return (this.x * (v as number) + this.y * y! + this.z * z!);
  }
  cross(v: Vector) {
    const x = this.x,
      y = this.y,
      z = this.z;
    return new Vector(y * v.z - v.y * z,
      z * v.x - v.z * x,
      x * v.y - v.x * y);
  }
  lerp(x: number, y: number, z: number): void;
  lerp(v: Vector, amt: number): void;
  lerp(v_or_x: Vector | number, amt_or_y: number, z?: number, amt?: number) {
    const lerp_val = (start: number, stop: number, amt: number) => {
      return start + (stop - start) * amt;
    };
    let x, y: number;
    if (arguments.length === 2 && typeof v_or_x !== 'number') {
      // given vector and amt
      amt = amt_or_y;
      x = v_or_x.x;
      y = v_or_x.y;
      z = v_or_x.z;
    } else {
      // given x, y, z and amt
      x = v_or_x as number;
      y = amt_or_y;
    }
    this.x = lerp_val(this.x, x, amt!);
    this.y = lerp_val(this.y, y, amt!);
    this.z = lerp_val(this.z, z!, amt!);
  }
  normalize() {
    const m = this.mag();
    if (m > 0) {
      this.div(m);
    }
    return this;
  }
  limit(high: number) {
    if (this.mag() > high) {
      this.normalize();
      this.mult(high);
    }
  }
  heading() {
    return (-Math.atan2(-this.y, this.x));
  }
  heading2D() {
    return this.heading();
  }
  toString() {
    return "[" + this.x + ", " + this.y + ", " + this.z + "]";
  }
  array() {
    return [this.x, this.y, this.z];
  }

  copy() {
    return new Vector(this.x, this.y, this.z);
  }

  drawDot() {
    if (!doodler) return;

    doodler.dot(this, {weight: 2, color: 'red'});
  }

  static fromAngle(angle: number, v?: Vector) {
    if (v === undefined || v === null) {
      v = new Vector();
    }
    v.x = Math.cos(angle);
    v.y = Math.sin(angle);
    return v;
  }

  static random2D(v?: Vector) {
    return Vector.fromAngle(Math.random() * (Math.PI * 2), v);
  }

  static random3D(v: Vector) {
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

  static dist(v1: Vector, v2: Vector) {
    return v1.dist(v2);
  }

  static dot(v1: Vector, v2: Vector) {
    return v1.dot(v2);
  }

  static cross(v1: Vector, v2: Vector) {
    return v1.cross(v2);
  }

  static add(v1: Vector, v2: Vector) {
    return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }

  static sub(v1: Vector, v2: Vector) {
    return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  static angleBetween(v1: Vector, v2: Vector) {
    return Math.acos(v1.dot(v2) / Math.sqrt(v1.magSq() * v2.magSq()));
  }

  static lerp(v1: Vector, v2: Vector, amt: number) {
    // non-static lerp mutates object, but this version returns a new vector
    const retval = new Vector(v1.x, v1.y, v1.z);
    retval.lerp(v2, amt);
    return retval;
  }

  static vectorProjection(v1: Vector, v2: Vector) {
    v2 = v2.copy();
    v2.normalize();
    const sp = v1.dot(v2);
    v2.mult(sp);
    return v2;
  }

  static hypot2(a: Vector, b: Vector) {
    return Vector.dot(Vector.sub(a, b), Vector.sub(a, b))
  }
}
