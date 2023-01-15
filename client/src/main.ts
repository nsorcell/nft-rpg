import * as PIXI from 'pixi.js';
import chroma from 'chroma-js';
import dat from 'dat.gui';


import { computePerlin } from '../../utils/perlin';

// Create the application helper and add its render target to the page
let app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,

});

document.body.appendChild(app.view as unknown as HTMLElement);



console.log(app.view.width, app.view.height)

function getNoise(nx: number, ny: number, scale: number, seed: number) {
  return 1 * computePerlin(1 * nx, 1 * ny, scale, seed)
  // + 0.5 * computePerlin(2 * nx, 2 * ny, scale, seed)
  // + 0.25 * computePerlin(4 * nx, 4 * ny, scale, seed)
}

const gui = new dat.GUI();

const options = {
  scale: 8,
  seed: 437682,
  startX: 2100,
  startY: 2100,
  zoom: 1,
  chunkSize: 100,
}

const { scale, seed, startX, startY, zoom, chunkSize } = options

let cache: number[][]

computeHeight()

gui.add(options, "zoom", 1, 64, 2).onFinishChange(recomputeEverything);
gui.add(options, "scale", 1, 64, 2).onFinishChange(recomputeEverything);
gui.add(options, "seed", 1, 100, 1).onFinishChange(recomputeEverything);
gui.add(options, "startX", 0, 10000, 50).onFinishChange(recomputeEverything);
gui.add(options, "startY", 0, 10000, 50).onFinishChange(recomputeEverything);
gui.add(options, 'chunkSize', 100, 500, 10).onFinishChange(recomputeEverything);

function recomputeEverything() {
  console.log('Recompute everything')
  computeHeight()
  console.log(cache[0])
  render()
}


function computeHeight() {
  console.log(options)
  const key = JSON.stringify(options)

  if (!localStorage.getItem(key)) {
    console.log('not found')

    cache = []

    for (let i = 0; i < chunkSize; i++) {
      cache.push([])
      for (let k = 0; k < chunkSize; k++) {
        const noise = getNoise((i + startX) * zoom, (k + startY) * zoom, scale, seed)

        cache[i][k] =  Math.pow(noise / 100, 0.80) * 100
      }
    }

    localStorage.setItem(key, JSON.stringify(cache))
  } else {
    console.log('loaded from local storage')

    cache = JSON.parse(localStorage.getItem(key) || '[]')
  }
}


const renderOptions = {
  size: 10,
  seaLevel: 48
}

gui.add(renderOptions, 'size', 1, 100, 1).onChange(render);
gui.add(renderOptions, 'seaLevel', 1, 100, 1).onChange(render);

const graphics = new PIXI.Graphics();

function render() {
  graphics.clear();

  const { size, seaLevel } = renderOptions;

  let min = cache[0][0]
  let max = cache[0][0]

  for (let i = 0; i < chunkSize; i++) {
    graphics.moveTo(i * size, 0)

    for (let k = 0; k < chunkSize; k++) {
      const height = cache[i][k]

      if (height > max) {
        max = height
      }

      if (height < min) {
        min = height
      }

      const color = height < seaLevel ?
        chroma.scale(['blue', '#38bdf8']).classes(120)(height / seaLevel).num() :
        chroma.scale(['#fde047', '#84cc16', '#AA8753', '#57534e', 'white']).classes(120)((height - seaLevel) / 11).num()

      graphics.lineStyle({
        color,
        width: size
      })
      graphics.lineTo(i * size, k * size)
    }
  }

  console.log('max:', max, 'min: ', min)
}

render()

app.stage.addChild(graphics);