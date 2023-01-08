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
    mana: SuperToken;

  before(async () => {
    provider = new ethers.providers.JsonRpcBatchProvider(
      "http://localhost:8545"
    );

    accounts = await ethers.getSigners();
    framework = await Framework.create({ provider, chainId: 5 });

    const playerDeployment = await deployments.get("Player");
    const worldDeployment = await deployments.get("World");
    const reserveDeployment = await deployments.get("ManaReserve");
    const manaDeployment = await deployments.get("MANAx");

    player = Player__factory.connect(playerDeployment.address, accounts[0]);
    world = World__factory.connect(worldDeployment.address, provider);
    reserve = ManaReserve__factory.connect(reserveDeployment.address, provider);
    mana = SuperToken__factory.connect(manaDeployment.address, provider);
  });

  afterEach(async () => {
    await snapshot.loadSnapshot();
  });

  describe("Flowrate", () => {
    it("should create a flow between ManaReserve, and World", async () => {
      let balance = await mana.balanceOf(reserve.address);
      let worldBalance = await mana.balanceOf(world.address);

      expect(worldBalance).to.equal(0);

      const flow = await framework.cfaV1.getFlow({
        sender: reserve.address,
        receiver: world.address,
        providerOrSigner: provider,
        superToken: mana.address,
      });

      expect(BigNumber.from(flow.flowRate)).eq(1);

      await mine(100);

      balance = await mana.balanceOf(reserve.address);

      expect(balance).gt(100);
    });

    it("should update flowrate between ManaReserve, and World by MANA_FLOW_PER_PLAYER", async () => {
      let flow = await framework.cfaV1.getFlow({
        sender: reserve.address,
        receiver: world.address,
        providerOrSigner: provider,
        superToken: mana.address,
      });

      expect(BigNumber.from(flow.flowRate)).eq(1);

      await mine(100);

      player.create({ value: parseEther("1") });

      flow = await framework.cfaV1.getFlow({
        sender: reserve.address,
        receiver: world.address,
        providerOrSigner: provider,
        superToken: mana.address,
      });

      expect(BigNumber.from(flow.flowRate)).eq(2);
    });
  });
});
