import { computePerlin } from '../../utils/perlin';

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
  smoothness: number
  octaves: number
}

const cache: Record<string, number> = {}

addEventListener('message', async (ev) => {
  const { startX, startY, scale, seed, zoom, chunkSizeX, chunkSizeY, octaves, lacunarity, persistance, smoothness } = ev.data as PerlinOptions

  console.log('Calculating chunk', ev.data)

  let result: number[][] | undefined = undefined;

  let min = undefined
  let max = undefined
  let avg = 0

  if (!result) {
    result = []

    for (let i = 0; i < chunkSizeX; i++) {
      result.push([]);

      for (let k = 0; k < chunkSizeY; k++) {
        const key = getKey(startX + i, startY + k, { seed, scale, zoom, octaves, lacunarity, persistance, smoothness })

        if (cache[key]) {
          result[i][k] = cache[key]
        } else {
          const offsetx = startX - chunkSizeX / 2
          const offsety = startY - chunkSizeY / 2

          const cx = (i + offsetx) / zoom
          const cy = (k + offsety) / zoom

          let noise = computePerlin(
            cx,
            cy,
            scale,
            seed,
            zoom,
            octaves,
            lacunarity,
            persistance,
            smoothness,
          )

          result[i][k] = noise
          cache[key] = noise
        }

        if (!max || result[i][k] > max) {
          max = result[i][k]
        }

        if (!min || result[i][k] < min && result[i][k] !== -1) {
          min = result[i][k]
        }

        if (result[i][k] !== -1) {
          avg += result[i][k]
        }
      }
    }

    console.log('max:', max, 'min: ', min, 'avg:', avg / (chunkSizeX * chunkSizeY))
  }

  result[chunkSizeX / 2][chunkSizeY / 2] = -1

  postMessage(result)
});

function getKey(x: number, y: number, other: Object) {
  return `${x}-${y}:${JSON.stringify(other)}`
}