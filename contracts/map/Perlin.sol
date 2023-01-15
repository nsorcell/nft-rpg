// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "abdk-libraries-solidity/ABDKMath64x64.sol";
import "hardhat/console.sol";

using ABDKMath64x64 for int128;

library Perlin {
  int16 public constant vecsDenom = 1000;
  uint16 constant perlinMax = 64;

  // returns a random unit vector
  // implicit denominator of vecsDenom
  function getGradientAt(
    uint32 x,
    uint32 y,
    uint32 scale,
    uint32 seed
  ) public pure returns (int16[2] memory) {
    uint256 idx = uint256(keccak256(abi.encodePacked(x, y, scale, seed))) % 16;

    int16[2][16] memory vecs = [
      [int16(1000), int16(0)],
      [int16(923), int16(382)],
      [int16(707), int16(707)],
      [int16(382), int16(923)],
      [int16(0), int16(1000)],
      [int16(-383), int16(923)],
      [int16(-708), int16(707)],
      [int16(-924), int16(382)],
      [int16(-1000), int16(0)],
      [int16(-924), int16(-383)],
      [int16(-708), int16(-708)],
      [int16(-383), int16(-924)],
      [int16(-1), int16(-1000)],
      [int16(382), int16(-924)],
      [int16(707), int16(-708)],
      [int16(923), int16(-383)]
    ];

    return vecs[idx];
  }

  function getCorners(
    uint32 x,
    uint32 y,
    uint32 scale
  ) public pure returns (uint32[2][4] memory) {
    uint32 lowerX = (x / scale) * scale;
    uint32 lowerY = (y / scale) * scale;

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
  function getGradientWeight(
    uint32 cornerX,
    uint32 cornerY,
    uint32 x,
    uint32 y,
    uint32 scale
  ) public pure returns (uint64) {
    uint64 res = 1;

    if (cornerX > x) res *= (scale - (cornerX - x));
    else res *= (scale - (x - cornerX));

    if (cornerY > y) res *= (scale - (cornerY - y));
    else res *= (scale - (y - cornerY));

    return res;
  }

  function getSingleScalePerlin(
    uint32 x,
    uint32 y,
    uint32 scale,
    uint32 seed,
    bool isTest
  ) public pure returns (int128) {
    uint32[2][4] memory corners = getCorners(x, y, scale);

    int128 resNumerator = 0;

    for (uint8 i = 0; i < 4; i++) {
      uint32[2] memory corner = corners[i];

      // this has an implicit denominator of vecsDenom
      int16[2] memory gradientVector = getGradientAt(
        corner[0],
        corner[1],
        scale,
        seed
      );

       // this has an implicit denominator of scale ** 2
      uint64 gradientWeight = getGradientWeight(corner[0], corner[1], x, y, scale);

      // this has an implicit denominator of scale
      int32[2] memory directionVector = [
        int32(x) - int32(corner[0]),
        int32(y) - int32(corner[1])
      ];

      // this has an implicit denominator of vecsDenom * scale
      int64 dotProduct = (directionVector[0] * gradientVector[0]) +
        (directionVector[1] * gradientVector[1]);

      // this has an implicit denominator of vecsDenom * scale ** 3
      resNumerator += int128(int64(gradientWeight)) * int128(dotProduct);
    }

    int256 divider = int256(vecsDenom) * int256(int32(scale)) ** 3;

    int128 result = ABDKMath64x64.divi(int256(resNumerator), divider);

    if (isTest) {
      return ABDKMath64x64.toInt(result);
    }

    return result;
  }

  function computePerlin(
    uint32 x,
    uint32 y,
    uint32 scale,
    uint32 seed
  ) public pure returns (uint256) {
    int128 perlin = 0;

    for (uint8 i = 0; i < 4; i++) {
      perlin = perlin.add(
        getSingleScalePerlin(x, y, scale * uint32(2 ** i), seed, false)
      );
    }

    perlin = perlin.div(ABDKMath64x64.fromInt(4));

    int128 perlinMaxHalf = ABDKMath64x64.fromUInt((uint256(perlinMax / 2)));

    int128 perlinScaledShifted = ABDKMath64x64.add(
      ABDKMath64x64.mul(perlin, perlinMaxHalf),
      perlinMaxHalf
    );

    return ABDKMath64x64.toUInt(perlinScaledShifted);
  }
}

function toDecimal(int128 x) pure returns (string memory result) {
  uint256 absX = uint(x >= 0 ? x : -int(x));
  uint fracX = ((absX & 0xFFFFFFFFFFFFFFFF) * 1e20 + 0x8000000000000000) >> 64;
  uint f;
  f = fracX % 10;
  fracX /= 10;
  f |= fracX % 10 << 8;
  fracX /= 10;
  f |= fracX % 10 << 16;
  fracX /= 10;
  f |= fracX % 10 << 24;
  fracX /= 10;
  f |= fracX % 10 << 32;
  fracX /= 10;
  f |= fracX % 10 << 40;
  fracX /= 10;
  f |= fracX % 10 << 48;
  fracX /= 10;
  f |= fracX % 10 << 56;
  fracX /= 10;
  f |= fracX % 10 << 64;
  fracX /= 10;
  f |= fracX % 10 << 72;
  fracX /= 10;
  f |= fracX % 10 << 80;
  fracX /= 10;
  f |= fracX % 10 << 88;
  fracX /= 10;
  f |= fracX % 10 << 96;
  fracX /= 10;
  f |= fracX % 10 << 104;
  fracX /= 10;
  f |= fracX % 10 << 112;
  fracX /= 10;
  f |= fracX % 10 << 120;
  fracX /= 10;
  f |= fracX % 10 << 128;
  fracX /= 10;
  f |= fracX % 10 << 136;
  fracX /= 10;
  f |= fracX % 10 << 144;
  fracX /= 10;
  f |= fracX % 10 << 152;
  fracX /= 10;
  uint fl = 20;
  if (f << 128 == 0) {
    f >>= 128;
    fl -= 16;
  }
  if (f << 192 == 0) {
    f >>= 64;
    fl -= 8;
  }
  if (f << 224 == 0) {
    f >>= 32;
    fl -= 4;
  }
  if (f << 240 == 0) {
    f >>= 16;
    fl -= 2;
  }
  if (f << 248 == 0) {
    f >>= 8;
    fl -= 1;
  }
  if (fl > 20) fl = 1;
  f += 0x003030303030303030303030303030303030303030;
  f <<= 256 - (fl << 3);

  uint intX = absX >> 64;
  uint i = 0;
  i = intX % 10;
  intX /= 10;
  i |= intX % 10 << 8;
  intX /= 10;
  i |= intX % 10 << 16;
  intX /= 10;
  i |= intX % 10 << 24;
  intX /= 10;
  i |= intX % 10 << 32;
  intX /= 10;
  i |= intX % 10 << 40;
  intX /= 10;
  i |= intX % 10 << 48;
  intX /= 10;
  i |= intX % 10 << 56;
  intX /= 10;
  i |= intX % 10 << 64;
  intX /= 10;
  i |= intX % 10 << 72;
  intX /= 10;
  i |= intX % 10 << 80;
  intX /= 10;
  i |= intX % 10 << 88;
  intX /= 10;
  i |= intX % 10 << 96;
  intX /= 10;
  i |= intX % 10 << 104;
  intX /= 10;
  i |= intX % 10 << 112;
  intX /= 10;
  i |= intX % 10 << 120;
  intX /= 10;
  i |= intX % 10 << 128;
  intX /= 10;
  i |= intX % 10 << 136;
  intX /= 10;
  i |= intX % 10 << 144;
  intX /= 10;
  uint il = 32;
  if (i >> 128 == 0) {
    i <<= 128;
    il -= 16;
  }
  if (i >> 192 == 0) {
    i <<= 64;
    il -= 8;
  }
  if (i >> 224 == 0) {
    i <<= 32;
    il -= 4;
  }
  if (i >> 240 == 0) {
    i <<= 16;
    il -= 2;
  }
  if (i >> 248 == 0) {
    i <<= 8;
    il -= 1;
  }
  i += 0x3030303030303030303030303030303030303000000000000000000000000000;
  if (x < 0) {
    i =
      (i >> 8) |
      0x2D00000000000000000000000000000000000000000000000000000000000000;
    il += 1;
  }

  result = new string(il + fl + 1);
  assembly {
    let ptr := add(result, 0x20)
    mstore(ptr, i)
    ptr := add(ptr, il)
    mstore(ptr, ".")
    mstore(add(ptr, 1), f)
  }
}
