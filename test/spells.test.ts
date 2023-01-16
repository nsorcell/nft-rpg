import { JsonRpcProvider } from "@ethersproject/providers";
import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Framework } from "@superfluid-finance/sdk-core";
import { deployments, ethers } from "hardhat";
import { snapshot } from "../deploy/10-init-world";

import {
  Player,
  Player__factory,
  Spell,
  Spell__factory,
  World,
  World__factory,
} from "../types";

describe("Spells", () => {
  let provider: JsonRpcProvider,
    accounts: SignerWithAddress[],
    framework: Framework,
    world: World,
    player: Player,
    spell: Spell;

  before(async () => {
    provider = new ethers.providers.JsonRpcBatchProvider(
      "http://localhost:8545"
    );

    accounts = await ethers.getSigners();
    framework = await Framework.create({ provider, chainId: 5 });

    const playerDeployment = await deployments.get("Player");
    const worldDeployment = await deployments.get("World");
    const spellDeployment = await deployments.get("Spell");

    player = Player__factory.connect(playerDeployment.address, accounts[0]);
    world = World__factory.connect(worldDeployment.address, provider);
    spell = Spell__factory.connect(spellDeployment.address, accounts[0]);
  });

  afterEach(async () => {
    await snapshot.loadSnapshot();
  });

  describe("Casting spells", () => {
    it("should create a flow between ManaReserve, and World", async () => {});
  });
});
