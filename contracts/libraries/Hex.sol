// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

struct Hex {
  int256 q;
  int256 r;
  int256 s;
}

library HexUtils {
  function _directions(uint256 dir) private pure returns (Hex memory) {
    return
      [
        Hex(1, 0, -1),
        Hex(1, -1, 0),
        Hex(0, -1, 1),
        Hex(-1, 0, 1),
        Hex(-1, 1, 0),
        Hex(0, 1, -1)
      ][dir];
  }

  function _diagonals(uint256 dir) private pure returns (Hex memory) {
    return
      [
        Hex(2, -1, -1),
        Hex(1, -2, 1),
        Hex(-1, -1, 2),
        Hex(-2, 1, 1),
        Hex(-1, 2, -1),
        Hex(1, 1, -2)
      ][dir];
  }

  function add(
    Hex calldata self,
    Hex memory b
  ) public pure returns (Hex memory) {
    return Hex(self.q + b.q, self.r + b.r, self.s + b.s);
  }

  function subtract(
    Hex calldata self,
    Hex calldata b
  ) public pure returns (Hex memory) {
    return Hex(self.q - b.q, self.r - b.r, self.s - b.s);
  }

  function scale(Hex calldata self, int256 k) public pure returns (Hex memory) {
    return Hex(self.q * k, self.r * k, self.s * k);
  }

  function rotateLeft(Hex calldata self) public pure returns (Hex memory) {
    return Hex(-self.s, -self.q, -self.r);
  }

  function rotateRight(Hex calldata self) public pure returns (Hex memory) {
    return Hex(-self.r, -self.s, -self.q);
  }

  function neighbor(
    Hex calldata self,
    uint256 dir
  ) public pure returns (Hex memory) {
    Hex memory dirVector = _directions(dir);

    return add(self, dirVector);
  }

  function diagonalNeighbor(
    Hex calldata self,
    uint256 dir
  ) public pure returns (Hex memory) {
    Hex memory dirVector = _diagonals(dir);

    return add(self, dirVector);
  }

  function len(Hex memory self) public pure returns (int256) {
    return (abs(self.q) + abs(self.r) + abs(self.s)) / 2;
  }

  function distance(
    Hex calldata self,
    Hex calldata b
  ) public pure returns (int256) {
    return len(subtract(self, b));
  }

  function radius(
    Hex memory self,
    uint256 dist
  ) public pure returns (Hex[] memory) {
    uint256 count = 0;

    for (uint256 i; i <= dist; i++) {
      count += i * 6;
    }

    Hex[] memory results = new Hex[](count);

    uint256 k;

    for (
      int8 q;
      (self.q - int256(dist) <= q) && (q <= self.q + int256(dist));
      q++
    ) {
      for (
        int8 r;
        q >= max(self.r - int256(dist), -q - self.r - int256(dist)) &&
          q <= min(self.r + int256(dist), -q + self.r + int256(dist));
        r++
      ) {
        results[k] = Hex(q, r, -q - r);
        k++;
      }
    }

    return results;
  }

  function toAxial(Hex memory self) public pure returns (int, int) {
    return (self.q, self.r);
  }

  function fromAxial(int q, int r) public pure returns (Hex memory) {
    return Hex(q, r, -q - r);
  }
}

function abs(int256 x) pure returns (int256) {
  return x >= 0 ? x : -x;
}

function max(int256 a, int256 b) pure returns (int256) {
  return a >= b ? a : b;
}

function min(int256 a, int256 b) pure returns (int256) {
  return a >= b ? a : b;
}
