import * as PIXI from 'pixi.js';
import chroma from 'chroma-js';

import { computePerlin } from '../../utils/perlin';

// Create the application helper and add its render target to the page
let app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,

});

document.body.appendChild(app.view as unknown as HTMLElement);

const graphics = new PIXI.Graphics();

console.log(app.view.width, app.view.height)

function getNoise(nx: number, ny: number, scale: number, seed: number) {
  return 1 * computePerlin(1 * nx, 1 * ny, scale, seed)
  // + 0.5 * computePerlin(2 * nx, 2 * ny, scale, seed)
  // + 0.25 * computePerlin(4 * nx, 4 * ny, scale, seed)
}

const scale = 8
const seed = 437682
const startX = 2000
const startY = 2100
const zoom = 1.
const chunkSize = 100

const key = JSON.stringify({ scale, seed, startX, startY, chunkSize, zoom })

let cache: number[][] = JSON.parse(localStorage.getItem(key) || '[]')

const IS_TESTING = false

if (!localStorage.getItem(key) || IS_TESTING) {
  console.log('not found')

  for (let i = 0; i < chunkSize; i++) {
    cache.push([])
    for (let k = 0; k < chunkSize; k++) {
      const noise = getNoise((i + startX) * zoom, (k + startY) * zoom, scale, seed)

      cache[i][k] = noise;//  Math.pow(noise / 100, 0.80) * 100
    }
  }

  localStorage.setItem(key, JSON.stringify(cache))
}

let min = cache[0][0]
let max = cache[0][0]

for (let i = 0; i < chunkSize; i++) {
  for (let k = 0; k < chunkSize; k++) {
    const height = cache[i][k]

    if (height > max) {
      max = height
    }

    if (height < min) {
      min = height
    }

    const seaLevel = 48

    const color = height < seaLevel ?
      chroma.scale(['blue', '#38bdf8']).classes(20)(height/seaLevel).num() :
      chroma.scale(['#84cc16', '#AA8753', '#57534e', 'white']).classes(20)((height % seaLevel) / 12).num()

    const size = 5;

    graphics.beginFill(Number(color));
    graphics.drawRect(i * size, k * size, size, size);
    graphics.endFill();

    graphics.on('pointerover', (e) => console.log(i, k))
  }
}
console.log('asd')
console.log('max:', max, 'min: ', min)

app.stage.addChild(graphics);