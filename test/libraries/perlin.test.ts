import { JsonRpcProvider } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ContractFactory } from "ethers";
import { deployments, ethers } from "hardhat";
import { Perlin, Perlin__factory } from "../../types";
import { computePerlin, getCorners, getGradientAt, getSingleScalePerlin, getGradientWeight } from "../../utils/perlin";

describe("PerlinLibrary", () => {
  let perlinLib: Perlin;

  before(async () => {
    const accounts = await ethers.getSigners();

    const perlinDeployment = await deployments.get("Perlin");
    perlinLib = Perlin__factory.connect(perlinDeployment.address, accounts[0]);
  });

  const END = 2_147_483_647;

  it('should match perlin.js generated gradient', async () => {
    for (let i = 0; i < 1000; i++) {
      const x = getRandomInt(END);
      const y = getRandomInt(END);
      const scale = getRandomInt(100) + 1;
      const seed = getRandomInt(END);

      const res = await perlinLib.getGradientAt(x, y, scale, seed)
      const res2 = getGradientAt(x, y, scale, seed)

      expect(res).deep.eq(res2)
    }
  });

  it('should match perlin.js generated corners', async () => {
    for (let i = 0; i < 1000; i++) {
      const x = getRandomInt(END);
      const y = getRandomInt(END);
      const scale = getRandomInt(100) + 1;

      const res = await perlinLib.getCorners(x, y, scale)
      const res2 = getCorners(x, y, scale)

      expect(res).to.deep.eq(res2)
    }
  });

  it('should match perlin.js generated weight', async () => {
    for (let i = 0; i < 1000; i++) {
      const x = getRandomInt(END);
      const y = getRandomInt(END);
      const scale = getRandomInt(100) + 1;

      const corners = getCorners(x, y, scale);

      for (let corner of corners) {
        const res2 = getGradientWeight(corner[0], corner[1], x, y, scale)
        const res = await perlinLib.getGradientWeight(corner[0], corner[1], x, y, scale)

        expect(res).deep.eq(res2)
      }
    }
  });

  it('should match perlin.js generated single scale perlin', async () => {
    for (let i = 0; i < 1000; i++) {
      const x = getRandomInt(END);
      const y = getRandomInt(END);
      const scale = getRandomInt(100) + 1;
      const seed = getRandomInt(END) + 1;

      console.log('Params: ', x, y, scale, seed)

      const res2 = getSingleScalePerlin(x, y, scale, seed, true)
      const res = await perlinLib.getSingleScalePerlin(x, y, scale, seed, true)

      console.log(res, res2);

      expect(res).deep.eq(res2.toNumber())
    }
  });

  it('should match perlin.js generated perlin noise', async () => {
    for (let i = 0; i < 1000; i++) {
      const x = getRandomInt(END / 2);
      const y = getRandomInt(END / 2);
      const scale = getRandomInt(100) + 2;
      const seed = getRandomInt(END) + 1;

      console.log('Params: ', x, y, scale, seed)

      const res = await perlinLib.computePerlin(x, y, scale, seed)
      const res2 = computePerlin(x, y, scale, seed)

      console.log(res, res2);

      expect(res).deep.eq(res2)
    }
  });
});

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}