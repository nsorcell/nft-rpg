import { JsonRpcProvider } from "@ethersproject/providers";
import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Framework } from "@superfluid-finance/sdk-core";
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

  describe.only("Player functionality", () => {
    it("should be able to create one player", async () => {
      await player.create({ value: parseEther("1") });

      console.log(await player.getPlayerOf(accounts[0].address));
      console.log(await currency.balanceOf(world.address));
      console.log(await player.getStats(0));
      console.log(await player.getAttributes(0));

      await player.awardXP(0, 140);
      await player.levelUp(0, [2, 1, 0, 0, 0, 0]);

      console.log(await player.getStats(0));
      console.log(await player.getAttributes(0));
    });
  });
});
