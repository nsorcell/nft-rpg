import { computePerlin } from '../../utils/perlin';

import Gun from 'gun';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';

const gun = new Gun({ localStorage: false, radisk: true })

type PerlinOptions = {
  scale: number,
  seed: number,
  startX: number,
  startY: number,
  zoom: number,
  chunkSize: number,
}

function wait (ms: number) {
  return new Promise(res => setTimeout(res, ms))
}

addEventListener('message', async (ev) => {
  const { scale, seed, startX, startY, zoom, chunkSize } = ev.data as PerlinOptions

  console.log('Calculating chunk', ev.data)

  let result: number[][] | undefined = undefined;

  try {
    result = await getGunChunk(startX, startY)

    console.log('Chunk found in GUN')
  } catch (err) { }

  if (!result) {
    console.log('Chunk NOT found in GUN')

    result = []

    for (let i = 0; i < chunkSize; i++) {
      result.push([]);

      for (let k = 0; k < chunkSize; k++) {

        const noise = computePerlin((i + startX) * zoom, (k + startY) * zoom, scale, seed)

        result[i][k] = noise //Math.pow(noise / 100, 0.80) * 100
      }
    }

    try {
      saveGunChunk(startX, startY, result)
    } catch (err) {
      console.log(err)
    }
  }

  postMessage(result)
});

function getChunkId(x: number, y: number) {
  return `${x}-${y}`;
}

async function getGunChunk(x: number, y: number): Promise<number[][]> {
  await wait(3000)

  return new Promise((resolve, reject) => {
    gun.get('chunks').get(getChunkId(x, y)).once(({data}) => {
      console.log('read', data)

      if (data) {
        return resolve(JSON.parse(data) || [] as number[][])
      }

      // reject()
    })

    setTimeout(() => reject(), 5000)
  })
}

function saveGunChunk(x: number, y: number, chunk: number[][]) {
  console.log('Saving chunk')

  const matrix = chunk.reduce((acc, curr, i) => {
    return [
      ...acc,
      ...curr.map((h, j) => ({ i, j, h }))
    ]
  }, [] as Array<{ i: number, j: number, h: number }>)

  // console.log(matrix)

  const gunChunk = gun.get('chunks').get(getChunkId(x, y))

  matrix.forEach(({ i, j, h}) => {
    gunChunk.get(getChunkId(i, j)).put(h)
  })

}