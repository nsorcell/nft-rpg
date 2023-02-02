// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "abdk-libraries-solidity/ABDKMath64x64.sol";

using ABDKMath64x64 for int128;

contract Simplex {
  // const F2 = /*#__PURE__*/ (Math.sqrt(3.0) - 1.0) * 0.5;
  // const G2 = /*#__PURE__*/ (3.0 - Math.sqrt(3.0)) / 6.0;

  int128 immutable F2;
  int128 immutable G2;

  uint8[] public s_permutation;

  constructor(int32 _seed) {
    int128 n1 = ABDKMath64x64.fromInt(1);
    int128 n2 = ABDKMath64x64.fromInt(2);
    int128 n3 = ABDKMath64x64.fromInt(3);
    int128 n6 = ABDKMath64x64.fromInt(6);
    int128 half = n1.div(n2);

    int128 sqrt3 = n3.sqrt();

    F2 = sqrt3.sub(n1).mul(half);
    G2 = n3.sub(sqrt3).div(n6);

    s_permutation = buildPermutationTable(_seed);
  }

  function buildPermutationTable(
    int32 _seed
  ) public pure returns (uint8[] memory) {
    Mulberry.Seed memory seed = Mulberry.Seed(_seed);

    uint16 tableSize = 512;
    uint8[] memory p = new uint8[](tableSize);

    unchecked {
      for (uint8 i = 0; i < tableSize / 2; i++) {
        p[i] = i;
      }

      for (uint8 i = 0; i < tableSize / 2 - 1; i++) {
        uint r = i +
          Mulberry
            .getRandom(seed)
            .mul(ABDKMath64x64.fromUInt(256 - i))
            .toUInt();
        uint aux = p[i];
        p[i] = p[r];
        p[r] = uint8(aux);
      }

      for (uint16 i = 256; i < tableSize; i++) {
        p[i] = p[i - 256];
      }
    }

    return p;
  }
}

library Mulberry {
  struct Seed {
    int32 value;
  }

  function getRandom(Seed memory seed) public pure returns (int128) {
    unchecked {
      seed.value += 0x6D2B79F5;

      int32 t = seed.value;

      int32 x1 = (t >> 15) & 131071;
      int32 x = t ^ x1;
      t = x * (t | 1);

      int32 y1 = (t >> 7) & 33554431;
      int32 y = t ^ y1;
      t ^= t + y * (t | 61);

      int32 z = t ^ ((t >> 14) & 262143);
      t = z >> 0;

      int128 result = ABDKMath64x64.fromInt(t).div(
        ABDKMath64x64.fromInt(4294967296)
      );

      return result;
    }
  }
}
