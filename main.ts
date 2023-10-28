/// <reference types="./global.d.ts" />

import { initializeDoodler, Vector } from "./mod.ts";
import { ZoomableDoodler } from "./zoomableCanvas.ts";

initializeDoodler(
  {
    width: 400,
    height: 400,
  },
  true,
  (ctx) => {
    ctx.imageSmoothingEnabled = false;
  },
);

const movingVector = new Vector(100, 300);
let angleMultiplier = 0;
const v = new Vector(30, 30);
doodler.registerDraggable(v, 20);
const img = new Image();
img.src = "./skeleton.png";
img.hidden;
document.body.append(img);

const p = new Vector(200, 200);

doodler.createLayer(() => {
  const [gamepad] = navigator.getGamepads();
  const deadzone = 0.04;
  if (gamepad) {
    const leftX = gamepad.axes[0];
    const leftY = gamepad.axes[1];
    p.add(
      Math.min(Math.max(leftX - deadzone, 0), leftX + deadzone),
      Math.min(Math.max(leftY - deadzone, 0), leftY + deadzone),
    );

    const rigthX = gamepad.axes[2];
    const rigthY = gamepad.axes[3];
    (doodler as ZoomableDoodler).moveOrigin({ x: -rigthX * 5, y: -rigthY * 5 });

    if (gamepad.buttons[7].value) {
      (doodler as ZoomableDoodler).scaleAt(
        { x: 200, y: 200 },
        1 + (gamepad.buttons[7].value / 5),
      );
    }
    if (gamepad.buttons[6].value) {
      (doodler as ZoomableDoodler).scaleAt(
        { x: 200, y: 200 },
        1 - (gamepad.buttons[6].value / 5),
      );
    }
  }
  doodler.drawImageWithOutline(img, p);
  // doodler.line(new Vector(100, 100), new Vector(200, 200))
  // doodler.dot(new Vector(300, 300))
  // doodler.fillCircle(movingVector, 6, { color: 'red' });
  // doodler.drawRect(new Vector(50, 50), movingVector.x, movingVector.y);
  // doodler.fillRect(new Vector(200, 250), 30, 10)

  // doodler.drawCenteredSquare(new Vector(200, 200), 40, { color: 'purple', weight: 5 })
  // doodler.drawBezier(new Vector(100, 150), movingVector, new Vector(150, 300), new Vector(100, 250))

  // let rotatedOrigin = new Vector(200, 200)
  // doodler.drawRotated(rotatedOrigin, Math.PI * angleMultiplier, () => {
  //   doodler.drawCenteredSquare(rotatedOrigin, 30)
  //   doodler.drawSprite(img, new Vector(0, 40), 80, 20, new Vector(160, 300), 80, 20)
  // })

  // movingVector.set((movingVector.x + 1) % 400, movingVector.y);
  // angleMultiplier += .001;

  // doodler.drawSprite(img, new Vector(0, 40), 80, 20, new Vector(100, 300), 80, 20)

  // doodler.drawScaled(1.5, () => {
  //   doodler.line(p.copy().add(-8, 10), p.copy().add(8, 10), {
  //     color: "grey",
  //     weight: 2,
  //   });
  //   doodler.line(p.copy().add(-8, -10), p.copy().add(8, -10), {
  //     color: "grey",
  //     weight: 2,
  //   });
  //   doodler.line(p, p.copy().add(0, 12), { color: "brown", weight: 4 });
  //   doodler.line(p, p.copy().add(0, -12), { color: "brown", weight: 4 });
  // });
});

document.addEventListener("keyup", (e) => {
  e.preventDefault();
  if (e.key === " ") {
    doodler.unregisterDraggable(v);
  }
});
