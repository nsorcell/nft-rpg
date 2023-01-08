import { JsonRpcProvider } from "@ethersproject/providers";
import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Framework } from "@superfluid-finance/sdk-core";
import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import { deployments, ethers } from "hardhat";
import { snapshot } from "../deploy/07-init-world";

import {
  IERC20Upgradeable,
  IERC20Upgradeable__factory,
  Player,
  Player__factory,
  World,
  World__factory,
} from "../types";

describe("World", () => {
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
    world = World__factory.connect(worldDeployment.address, accounts[0]);
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
  });
});
