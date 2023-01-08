import { JsonRpcProvider } from "@ethersproject/providers";
import { mine } from "@nomicfoundation/hardhat-network-helpers";
import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Framework, SuperToken__factory } from "@superfluid-finance/sdk-core";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { deployments, ethers } from "hardhat";
import { Deployment } from "hardhat-deploy/types";
import { snapshot } from "../deploy/07-init-world";

import {
  ManaReserve,
  ManaReserve__factory,
  Player,
  Player__factory,
  World,
  World__factory,
} from "../types";

describe("tokens", () => {
  let provider: JsonRpcProvider,
    accounts: SignerWithAddress[],
    framework: Framework,
    world: World,
    player: Player,
    reserve: ManaReserve,
    manaDeployment: Deployment;

  before(async () => {
    provider = new ethers.providers.JsonRpcBatchProvider(
      "http://localhost:8545"
    );

    accounts = await ethers.getSigners();
    framework = await Framework.create({ provider, chainId: 5 });

    const playerDeployment = await deployments.get("Player");
    const worldDeployment = await deployments.get("World");
    const reserveDeployment = await deployments.get("ManaReserve");

    manaDeployment = await deployments.get("MANAx");

    player = Player__factory.connect(playerDeployment.address, accounts[0]);
    world = World__factory.connect(worldDeployment.address, provider);
    reserve = ManaReserve__factory.connect(reserveDeployment.address, provider);
  });

  beforeEach(async () => {
    await snapshot.loadSnapshot();
  });

  describe("Flowrate", () => {
    it("should create a flowrate between ManaReserve, and World", async () => {
      const mana = SuperToken__factory.connect(
        manaDeployment.address,
        provider
      );

      let balance = await mana.balanceOf(reserve.address);
      let worldBalance = await mana.balanceOf(world.address);

      const flow = await framework.cfaV1.getFlow({
        sender: reserve.address,
        receiver: world.address,
        providerOrSigner: provider,
        superToken: mana.address,
      });

      expect(BigNumber.from(flow.flowRate)).gt(0);

      await mine(100);

      balance = await mana.balanceOf(reserve.address);

      expect(balance).gt(100);
    });
  });
});
