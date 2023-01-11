import { JsonRpcProvider } from "@ethersproject/providers";
import { mine } from "@nomicfoundation/hardhat-network-helpers";
import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Framework } from "@superfluid-finance/sdk-core";
import { expect } from "chai";
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

describe("Player", () => {
  let provider: JsonRpcProvider,
    accounts: SignerWithAddress[],
    framework: Framework,
    currency: Currency,
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
    world = World__factory.connect(worldDeployment.address, accounts[0]);
    currency = Currency__factory.connect(
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

  afterEach(async () => {
    await snapshot.loadSnapshot();
  });

  describe("Player basic functionality", () => {
    it("should be able to create one player", async () => {
      expect(await player.getPlayerOf(accounts[0].address)).to.equal(0);
      expect(await player.ownerOf(0)).to.equal(accounts[0].address);
    });
  });

  describe("levelUp", () => {
    it("should be able to level up the player", async () => {
      let attributes = await player.getAttributes(0);

      expect(attributes.stats[0]).to.equal(6);
      expect(attributes.stats[1]).to.equal(6);
      expect(attributes.stats[2]).to.equal(6);
      expect(attributes.stats[3]).to.equal(6);
      expect(attributes.stats[4]).to.equal(6);
      expect(attributes.stats[5]).to.equal(6);
      expect(attributes.level).to.equal(1);

      const xpDistributor = await world.XP_DISTRIBUTOR();
      await world.grantRole(xpDistributor, accounts[0].address);

      await world.awardXP(0, 120);

      await player.levelUp(0, [2, 1, 0, 0, 0, 0]);

      attributes = await player.getAttributes(0);

      expect(attributes.stats[0]).to.equal(8);
      expect(attributes.stats[1]).to.equal(7);
      expect(attributes.stats[2]).to.equal(6);
      expect(attributes.stats[3]).to.equal(6);
      expect(attributes.stats[4]).to.equal(6);
      expect(attributes.stats[5]).to.equal(6);

      expect(attributes.experience).to.equal(8);
      expect(attributes.level).to.equal(2);
    });
  });

  describe("travel & arrive", () => {
    it("should be able to initiate travel", async () => {
      await expect(player.travel(0, [1000, 2250])).to.emit(
        player,
        "Player_StartedTraveling"
      );

      let travelInfo = await player.getTravelInfo(0);
      let block = await provider.getBlock("latest");

      expect(travelInfo.isTraveling).to.be.true;
      expect(travelInfo.arrival.sub(block.timestamp)).to.equal(273);

      await mine(100);

      travelInfo = await player.getTravelInfo(0);
      block = await provider.getBlock("latest");

      expect(travelInfo.arrival.sub(block.timestamp)).to.equal(173);
    });

    it("should not allow to travel, when already traveling", async () => {
      await expect(player.travel(0, [1000, 2250])).to.emit(
        player,
        "Player_StartedTraveling"
      );

      await expect(player.travel(0, [1000, 2250])).to.revertedWithCustomError(
        player,
        "Player_AlreadyTraveling"
      );
    });

    it("should not allow to arrive, when not traveling", async () => {
      await expect(player.arrive(0)).to.revertedWithCustomError(
        player,
        "Player_NotTraveling"
      );
    });

    it("should not be able to arrive when travel is not finished", async () => {
      await expect(player.travel(0, [1000, 2250])).to.emit(
        player,
        "Player_StartedTraveling"
      );

      let travelInfo = await player.getTravelInfo(0);
      let block = await provider.getBlock("latest");

      expect(travelInfo.arrival.sub(block.timestamp)).to.equal(273);

      await mine(100);

      travelInfo = await player.getTravelInfo(0);
      block = await provider.getBlock("latest");

      expect(travelInfo.arrival.sub(block.timestamp)).to.equal(173);

      await expect(player.arrive(0)).to.revertedWithCustomError(
        player,
        "Player_TravelNotFinished"
      );

      travelInfo = await player.getTravelInfo(0);
      block = await provider.getBlock("latest");

      expect(travelInfo.isTraveling).to.be.true;
    });

    it("should be able to arrive when travel is finished", async () => {
      await expect(player.travel(0, [1000, 100])).to.emit(
        player,
        "Player_StartedTraveling"
      );

      let travelInfo = await player.getTravelInfo(0);
      let block = await provider.getBlock("latest");

      expect(travelInfo.arrival.sub(block.timestamp)).to.equal(111);

      await mine(111);

      travelInfo = await player.getTravelInfo(0);
      block = await provider.getBlock("latest");

      expect(travelInfo.arrival.sub(block.timestamp)).to.equal(0);

      await expect(player.arrive(0)).to.emit(
        player,
        "Player_FinishedTraveling"
      );

      travelInfo = await player.getTravelInfo(0);
      block = await provider.getBlock("latest");

      expect(travelInfo.isTraveling).to.be.false;
    });
  });
});
