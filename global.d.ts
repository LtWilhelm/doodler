import { Doodler } from "./canvas.ts";

declare global {
  interface Window { doodler: Doodler; }
  // interface global {
  //   doodler: Doodler;
  // }
  let doodler: Doodler;
}

export{}