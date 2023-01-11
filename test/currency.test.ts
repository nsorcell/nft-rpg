import { JsonRpcProvider } from "@ethersproject/providers";
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

describe("Currency", () => {
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
    const balance1 = await player.balanceOf(accounts[0].address);
    const balance2 = await player.balanceOf(accounts[1].address);

    if (balance1.eq(0)) {
      await player.create({ value: parseEther("1") });
    }
    if (balance2.eq(0)) {
      await player.connect(accounts[1]).create({ value: parseEther("1") });
    }
  });

  afterEach(async () => {
    await snapshot.loadSnapshot();
  });

  describe("Currency functionality", () => {
    it("should be transfer currency to another player, which is taxed.", async () => {
      const currencyDistributor = await world.CURRENCY_DISTRIBUTOR();
      await world.grantRole(currencyDistributor, accounts[0].address);

      await world.awardCurrency(0, 500); // taxed for 100

      let balance1 = await player.gameBalanceOf(0);
      let balance2 = await player.gameBalanceOf(1);

      expect(balance1).to.equal(400);
      expect(balance2).to.equal(0);

      await currency.approve(player.address, 400); // approve transfer amount

      await player.connect(accounts[0]).transferCurrency(1, 400); // taxed for 80

      balance1 = await player.gameBalanceOf(0);
      balance2 = await player.gameBalanceOf(1);

      expect(balance1).to.equal(0);
      expect(balance2).to.equal(320);
    });
  });
});
