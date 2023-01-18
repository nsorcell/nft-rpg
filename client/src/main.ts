import './style.css';

import * as PIXI from 'pixi.js';
import chroma from 'chroma-js';
import dat from 'dat.gui';

import MyWorker from './worker?worker'

// Create the application helper and add its render target to the page
let app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
});

document.body.appendChild(app.view as unknown as HTMLElement);

const gui = new dat.GUI();
gui.useLocalStorage = true;

type PerlinOptions = {
  scale: number,
  seed: number,
  startX: number,
  startY: number,
  zoom: number,
  chunkSizeX: number,
  chunkSizeY: number,
  lacunarity: number,
  persistance: number,
  smoothness: number,
  octaves: number
}

console.log(app.view.height)

const options: PerlinOptions = {
  scale: 50,
  seed: 1,
  startX: 0,
  startY: 0,
  zoom: 1,
  chunkSizeX: 100,
  chunkSizeY:  150,
  octaves: 3,
  lacunarity: 7,
  persistance: 0.125,
  smoothness: 1
}

const renderOptions = {
  size: 5,
  seaLevel: 36
}

gui.add(options, "zoom", 1, 200, 0.5).onFinishChange(recomputeEverything);
gui.add(options, "scale", 2, 64, 2).onFinishChange(recomputeEverything);
gui.add(options, "seed", 1, 100, 1).onFinishChange(recomputeEverything);
gui.add(options, "startX", 0, 500, 10).onFinishChange(recomputeEverything);
gui.add(options, "startY", 0, 500, 10).onFinishChange(recomputeEverything);
gui.add(options, 'chunkSizeX', 100, 500, 10).onFinishChange(recomputeEverything);
gui.add(options, 'chunkSizeY', 100, 500, 10).onFinishChange(recomputeEverything);

gui.add(options, 'octaves', 1, 10, 1).onFinishChange(recomputeEverything);
gui.add(options, 'lacunarity', 0, 10, 0.5).onFinishChange(recomputeEverything);
gui.add(options, 'persistance', 0, 1, 0.125 / 2).onFinishChange(recomputeEverything);
gui.add(options, 'smoothness', 0, 2, 0.1).onFinishChange(recomputeEverything);

gui.add(renderOptions, 'size', 1, 100, 1).onChange(render);
gui.add(renderOptions, 'seaLevel', 1, 100, 1).onChange(render);

const { chunkSizeX, chunkSizeY } = options

const worker = new MyWorker()

async function computeHeight(): Promise<number[][]> {
  // const result = await db.get(getChunkId(options.startX, options.startY))

  // if (result) {
  //   return result
  // }

  return new Promise((res => {
    worker.addEventListener('message', async ({ data }) => {
      // await db.put(getChunkId(options.startX, options.startY), result, { pin: true })
      res(data)
    })

    // const octaves = zoom > 8 ? 1 : zoom > 5 ? 2 : zoom > 3 ? 3 : 5;
    worker.postMessage(options);
  }))
}


let matrix: number[][]

async function recomputeEverything() {
  matrix = await computeHeight()
  render()
}

const graphics = new PIXI.Graphics();

function render() {
  graphics.clear();

  const { size, seaLevel } = renderOptions;

  for (let i = 0; i < chunkSizeX; i++) {
    graphics.moveTo(i * size, 0)

    for (let k = 0; k < chunkSizeY; k++) {
      const height = matrix[i][k]

      const scale = chroma.scale(['blue', '#38bdf8', '#fde047', '#84cc16', '#AA8753', '#57534e', 'white'])

      const sc = (height - 10) / 90

      let color = scale(sc).num()

      if (height === -1) {
        color = chroma('red').num()
      }

      graphics.lineStyle({
        color,
        width: size
      })
      graphics.lineTo(i * size, k * size)
    }
  }
}

app.stage.addChild(graphics);

recomputeEverything()


document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
    // up arrow
    options.startY -= 10
  }
  else if (e.keyCode == '40') {
    // down arrow
    options.startY += 10
  }
  else if (e.keyCode == '37') {
    // left arrow
    options.startX -= 10
  }
  else if (e.keyCode == '39') {
    // right arrow
    options.startX += 10
  }
  recomputeEverything()
}