/// <reference types="./global.d.ts" />

import { Vector, initializeDoodler } from './mod.ts'

initializeDoodler({
  width: 400,
  height: 400
})

const movingVector = new Vector(100, 300);
let angleMultiplier = 0;
const v = new Vector(30,30);
doodler.registerDraggable(v, 20)
doodler.createLayer(() => {

  doodler.line(new Vector(100, 100), new Vector(200, 200))
  doodler.dot(new Vector(300, 300))
  doodler.fillCircle(movingVector, 6, { color: 'red' });
  doodler.drawRect(new Vector(50, 50), movingVector.x, movingVector.y);
  doodler.fillRect(new Vector(200, 250), 30, 10)

  doodler.drawCenteredSquare(new Vector(200, 200), 40, { color: 'purple', weight: 5 })
  doodler.drawBezier(new Vector(100, 150), movingVector, new Vector(150, 300), new Vector(100, 250))

  let rotatedOrigin = new Vector(200,200)
  doodler.drawRotated(rotatedOrigin, Math.PI*angleMultiplier, () => {
    doodler.drawCenteredSquare(rotatedOrigin, 30)
  })


  movingVector.set((movingVector.x + 1) % 400, movingVector.y);
  angleMultiplier += .001;
});

document.addEventListener('keyup', e => {
  e.preventDefault();
  if (e.key === ' ') {
    doodler.unregisterDraggable(v);
  }
})