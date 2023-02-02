import { BigNumber, ethers } from "ethers";
import Decimal from "decimal.js";
import { createNoise2D } from "./simplex-noise";

type uint8 = number;
type int16 = number;
type uint16 = number;
type uint32 = number;
type int32 = number;
type uint64 = number;
type int64 = number;
type int128 = number;
type uint256 = BigInt;

const vecsDenom: int16 = 1000;

// returns a random unit vector
// implicit denominator of vecsDenom
export function getGradientAt(
  x: uint32,
  y: uint32,
  scale: uint32,
  seed: uint32
): int16[] {
  const idx: uint256 = BigInt(
    ethers.utils.keccak256(
      ethers.utils.solidityPack(["uint32", "uint32", "uint32", "uint32"], [x, y, scale, seed]))) % 16n;

  const vecs: int16[][] = [
    [(1000), (0)],
    [(923), (382)],
    [(707), (707)],
    [(382), (923)],
    [(0), (1000)],
    [(-383), (923)],
    [(-708), (707)],
    [(-924), (382)],
    [(-1000), (0)],
    [(-924), (-383)],
    [(-708), (-708)],
    [(-383), (-924)],
    [(-1), (-1000)],
    [(382), (-924)],
    [(707), (-708)],
    [(923), (-383)]
  ];
  return vecs[Number(idx)];
}

export function getCorners(
  x: uint32,
  y: uint32,
  scale: uint32
): uint32[][] {
  const lowerX: uint32 = Math.floor(x / scale) * scale;
  const lowerY: uint32 = Math.floor(y / scale) * scale;

  return [
    [lowerX, lowerY],
    [lowerX + scale, lowerY],
    [lowerX + scale, lowerY + scale],
    [lowerX, lowerY + scale]
  ];
}


// the computed perlin value at a point is a weighted average of dot products with
// gradient vectors at the four corners of a grid square.
// this isn't scaled; there's an implicit denominator of scale ** 2
export function getGradientWeight(
  cornerX: uint32,
  cornerY: uint32,
  x: uint32,
  y: uint32,
  scale: uint32
): uint64 {
  let res: uint64 = 1;

  if (cornerX > x) {
    res *= (scale - (cornerX - x))
  }
  else {
    res *= (scale - (x - cornerX))
  }

  if (cornerY > y) {
    res *= (scale - (cornerY - y))
  }
  else {
    res *= (scale - (y - cornerY))
  }

  return res;
}

export function getSingleScalePerlin(
  x: uint32,
  y: uint32,
  scale: uint32,
  seed: uint32,
  isTest: boolean = false
): Decimal {
  const corners = getCorners(x, y, scale);

  let resNumerator: int128 = 0;


  for (let i: uint8 = 0; i < 4; i++) {
    const [cornerX, cornerY] = corners[i];

    // this has an implicit denominator of vecsDenom
    const gradient = getGradientAt(cornerX, cornerY, scale, seed);

    // this has an implicit denominator of scale ** 2
    const gradientWeight: uint64 = getGradientWeight(cornerX, cornerY, x, y, scale);

    // this has an implicit denominator of scale
    const directionVector: int32[] = [x - cornerX, y - cornerY];

    // this has an implicit denominator of vecsDenom * scale
    const dot: int64 = directionVector[0] * gradient[0] + directionVector[1] * gradient[1];

    // this has an implicit denominator of vecsDenom * scale ** 3
    resNumerator += gradientWeight * dot;
  }

  const divider = vecsDenom * scale ** 3

  const result = new Decimal(resNumerator).div(divider);

  if (isTest) {
    return result.floor();
  }

  return result;
}

/**
 * Returns a number between 0-1
 */
const noiseFn = (nx: number, ny: number, seed = 1) => createNoise2D(mulberry32(seed))(nx, ny) / 2 + 0.5

let useSimplex = true

export function computePerlin(
  x: uint32,
  y: uint32,
  scale: uint32,
  seed: uint32,
  zoom: number,
  /**
   * The number of levels of detail you want you perlin noise to have
   */
  octaves: int32 = 1,
  /**
   * Number that determines how much detail is added or removed at each octave
   */
  lacunarity: int16 = 1,
  /**
   * Number that determines how much each octave contributes to the overall shape
   */
  persistance = 0.25,
  /**
   * The exponential factor to closen up or widen the generated noise values from the center
   */
  smoothness = 1
): number {
  let map = ((noiseFn(x / 55, y / 55, 143) - 0.5) * 1.2) + 0.5

  const weight = 10

  const base = Math.min(0.9, Math.max(0.1, map)) * weight

  let perlin = new Decimal(base);

  // return perlin.toNumber()

  // For computing the average of the octaves
  let maxAmplitude = 0

  for (let i = 0; i < octaves; i++) {
    const frequency = (lacunarity ** i)
    const amplitude = (persistance ** i)

    maxAmplitude += amplitude

    const cx = x * frequency
    const cy = y * frequency

    let noise

    if (useSimplex) {
      noise = new Decimal(noiseFn(cx / 3, cy / 3)).mul(amplitude)
    } else {
      noise = getSingleScalePerlin(cx, cy, scale, seed).mul(amplitude)
    }

    // const l = lerp(0, 10, y)

    // if (y > 0 && perlin.toNumber() > 0) {
    //   noise = noise.mul(1 + l / 10)
    // } else {

    // }

    perlin = perlin.add(noise);
  }

  // perlin = perlin.add(getSingleScalePerlin(x * scale, y * scale, scale *  scale, seed).mul(weight))

  // if ((perlin.toNumber() > 0 && map > 0)) {
  //   perlin = perlin.add(map * 2).div(3)
  // } else if (map > 0) {
  //   perlin = perlin.add(map * 1).div(2)
  // }

  perlin = perlin.div(maxAmplitude + weight).pow(smoothness)

  return perlin.toNumber();
}

function lerp(start: number, end: number, amt: number) {
  return ((1 - amt) * start + amt * end) / 10
}

function mulberry32(a: number) {
  return function () {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
