import { JsonRpcProvider } from "@ethersproject/providers";
import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Framework } from "@superfluid-finance/sdk-core";
import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import { deployments, ethers } from "hardhat";

import {
  IERC20Upgradeable,
  IERC20Upgradeable__factory,
  Player,
  Player__factory,
  World,
  World__factory,
} from "../types";

describe("Player", () => {
  let provider: JsonRpcProvider,
    accounts: SignerWithAddress[],
    framework: Framework,
    currency: IERC20Upgradeable,
    world: World,
    player: Player;

  before(async () => {
    provider = new ethers.providers.JsonRpcBatchProvider(
      "http://localhost:8545"
    );

    accounts = await ethers.getSigners();
    framework = await Framework.create({ provider, chainId: 5 });

    const playerDeployment = await deployments.get("Player");
    const worldDeployment = await deployments.get("World");
    const currencyDeployment = await deployments.get("Currency");

    player = Player__factory.connect(playerDeployment.address, accounts[0]);
    world = World__factory.connect(worldDeployment.address, provider);
    currency = IERC20Upgradeable__factory.connect(
      currencyDeployment.address,
      accounts[0]
    );
  });

  beforeEach(async () => {
    const balance = await player.balanceOf(accounts[0].address);

    if (balance.eq(0)) {
      await expect(player.create({ value: parseEther("1") })).to.emit(
        player,
        "Player_PlayerCreated"
      );
    }
  });

  describe.only("Player functionality", () => {
    it("should be able to create one player", async () => {
      expect(await player.getPlayerOf(accounts[0].address)).to.equal(0);
      expect(await player.ownerOf(0)).to.equal(accounts[0].address);
    });

    it("should be able to award xp to the player", async () => {
      let attributes = await player.getAttributes(0);

      expect(attributes.experience).to.equal(0);
      expect(attributes.level).to.equal(1);

      await player.awardXP(0, 120);

      attributes = await player.getAttributes(0);

      expect(attributes.experience).to.equal(120);
      expect(attributes.level).to.equal(1);
    });

    it("should be able to award xp to level up the player", async () => {
      let stats = await player.getStats(0);
      let attributes = await player.getAttributes(0);

      expect(stats.strength).to.equal(6);
      expect(stats.dexterity).to.equal(6);
      expect(stats.constitution).to.equal(6);
      expect(stats.intellect).to.equal(6);
      expect(stats.wit).to.equal(6);
      expect(stats.luck).to.equal(6);

      expect(attributes.level).to.equal(1);

      await player.levelUp(0, [2, 1, 0, 0, 0, 0]);

      stats = await player.getStats(0);
      attributes = await player.getAttributes(0);

      expect(stats.strength).to.equal(8);
      expect(stats.dexterity).to.equal(7);
      expect(stats.constitution).to.equal(6);
      expect(stats.intellect).to.equal(6);
      expect(stats.wit).to.equal(6);
      expect(stats.luck).to.equal(6);

      expect(attributes.experience).to.equal(8);
      expect(attributes.level).to.equal(2);
    });
  });
});
