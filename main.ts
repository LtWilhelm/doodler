import { Doodler } from "./canvas.ts";
/// <reference types="./global.d.ts" />

import { Vector, initializeDoodler } from './mod.ts'

initializeDoodler({
  width: 400,
  height: 400
})

// let doodler = window['doodler'];

const movingVector = new Vector(100, 300);
doodler.createLayer(() => {

  doodler.line(new Vector(100, 100), new Vector(200, 200))
  doodler.dot(new Vector(300, 300))
  doodler.fillCircle(movingVector, 6, { color: 'red' });
  doodler.drawRect(new Vector(50, 50), movingVector.x, movingVector.y);
  doodler.fillRect(new Vector(200, 250), 30, 10)

  doodler.drawCenteredSquare(new Vector(200, 200), 40, { color: 'purple', weight: 5 })
  doodler.drawBezier(new Vector(100, 150), movingVector, new Vector(150, 300), new Vector(100, 250))

  movingVector.set((movingVector.x + 1) % 400, movingVector.y);
});
