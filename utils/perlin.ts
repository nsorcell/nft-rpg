import { BigNumber, ethers } from "ethers";
import Decimal from "decimal.js";

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
const perlinMax: uint16 = 64;

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

export function computePerlin(
  x: uint32,
  y: uint32,
  scale: uint32,
  seed: uint32
): number {
  let perlin = new Decimal(0);

  const rounds = 5

  for (let i = 0; i < rounds; i++) {
    perlin = perlin.add(getSingleScalePerlin(x, y, scale * (2 ** i), seed));
  }

  perlin = perlin.add(getSingleScalePerlin(x, y, scale * scale, seed).mul(3));

  perlin = perlin.minus(0.5).mul(2).abs();

  // Take the average
  perlin = perlin.div(rounds + 1).mul(50).add(50);



  console.log(perlin.toNumber())

  return perlin.floor().toNumber();

  const perlinMaxHalf = perlinMax / 2

  const perlinScaledShifted = (perlin.mul(perlinMaxHalf)).add(perlinMaxHalf)

  return perlinScaledShifted.floor().toNumber();
}
