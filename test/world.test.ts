import { JsonRpcProvider } from "@ethersproject/providers";
import { mine } from "@nomicfoundation/hardhat-network-helpers";
import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { SuperToken } from "@superfluid-finance/ethereum-contracts/build/typechain";
import { Framework, SuperToken__factory } from "@superfluid-finance/sdk-core";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { deployments, ethers } from "hardhat";
import { snapshot } from "../deploy/07-init-world";

import {
  Currency,
  Currency__factory,
  Player,
  Player__factory,
  World,
  World__factory,
} from "../types";

describe("World", () => {
  let provider: JsonRpcProvider,
    accounts: SignerWithAddress[],
    framework: Framework,
    currency: Currency,
    world: World,
    player: Player,
    mana: SuperToken;

  before(async () => {
    provider = new ethers.providers.JsonRpcBatchProvider(
      "http://localhost:8545"
    );

    accounts = await ethers.getSigners();
    framework = await Framework.create({ provider, chainId: 5 });

    const playerDeployment = await deployments.get("Player");
    const worldDeployment = await deployments.get("World");
    const currencyDeployment = await deployments.get("Currency");
    const manaDeployment = await deployments.get("MANAx");

    player = Player__factory.connect(playerDeployment.address, accounts[0]);
    world = World__factory.connect(worldDeployment.address, accounts[0]);
    currency = Currency__factory.connect(
      currencyDeployment.address,
      accounts[0]
    );
    mana = SuperToken__factory.connect(manaDeployment.address, accounts[0]);
  });

  beforeEach(async () => {
    const balance = await player.balanceOf(accounts[0].address);

    if (balance.eq(0)) {
      await player.create({ value: parseEther("1") });
    }
  });

  afterEach(async () => {
    await snapshot.loadSnapshot();
  });

  describe("World functionality", () => {
    it("should be able to award xp to the player", async () => {
      let attributes = await player.getAttributes(0);

      expect(attributes.experience).to.equal(0);
      expect(attributes.level).to.equal(1);

      const xpDistributor = await world.XP_DISTRIBUTOR();
      await world.grantRole(xpDistributor, accounts[0].address);

      await world.awardXP(0, 120);

      attributes = await player.getAttributes(0);

      expect(attributes.experience).to.equal(120);
      expect(attributes.level).to.equal(1);
    });

    it("should be able to award currency to the player", async () => {
      const currencyDistributor = await world.CURRENCY_DISTRIBUTOR();
      await world.grantRole(currencyDistributor, accounts[0].address);

      await world.awardCurrency(0, 500);

      const balance = await player.gameBalanceOf(0);

      expect(balance).to.equal(400);
    });
    it("should be able to burn mana", async () => {
      const manaBurner = await world.MANA_BURNER();
      await world.grantRole(manaBurner, accounts[0].address);

      await mine(100);

      const worldMana1 = await mana.balanceOf(world.address);

      await world.burnMana(100);

      const worldMana2 = await mana.balanceOf(world.address);

      expect(worldMana2).to.closeTo(worldMana1.sub(100), 5);
    });

    it("should be able to burn mana", async () => {
      const manaBurner = await world.MANA_BURNER();
      await world.grantRole(manaBurner, accounts[0].address);

      await mine(100);

      const worldMana1 = await mana.balanceOf(world.address);

      await expect(
        world.burnMana(worldMana1.add(100))
      ).to.revertedWithCustomError(world, "World_NotEnoughMana");
    });

    const END = 2147483647;
    const START = -1000 ///-END + Math.round(END / 2) + Math.round(END / 4);

    it('should generate perlin', async () => {

      let height
      let i = 0;
      do {

        try {
          height = await world.getHeight(START - i, START - i)

          console.log(height, i);
        } catch (err) {
          i++;
        }

      } while (!height)


    });

    it.only('should generate perlin matrix', async () => {
      const tasks: Array<Promise<{ x: number, y: number, i: number, j: number, h: number }>> = []

      for (let i = 0; i < 15; i++) {
        tasks.push()

        for (let j = 0; j < 15; j++) {
          const x = START + i
          const y = START + j

          tasks.push(world.getHeight(x, y).then(([h]) => ({
            i,
            j,
            h: h.toNumber(),
            x,
            y
          })));
        }
      }

      const result = await Promise.all(tasks)

      console.log(START);

      const asd = result.reduce((acc, curr) => {
        if (acc.length - 1 < curr.i) {
          acc.push([]);
        }

        acc[curr.i][curr.j] = curr.h

        return acc
      }, [] as number[][]);

      console.table(asd);
      console.log('min', Math.min(...result.map(r => r.h)), 'max',Math.max(...result.map(r => r.h)) )

    });
  });
});
