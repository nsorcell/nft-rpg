import { JsonRpcProvider } from "@ethersproject/providers";
import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Framework } from "@superfluid-finance/sdk-core";
import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
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
import { PrimaryClass } from "../utils/player-utils";

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

  beforeEach(async () => {
    const balance = await player.balanceOf(accounts[0].address);

    if (balance.eq(0)) {
      await player.create(PrimaryClass.Enchanter, { value: parseEther("1") });
    }
  });

  afterEach(async () => {
    await snapshot.loadSnapshot();
  });

  describe.only("Casting spells", () => {
    it("should be able to cast a spell", async () => {
      await spell.cast(0, [0], 1);
    });

    it("should not be able to cast a spell if the level requirement is not met.", async () => {
      await expect(spell.cast(1, [0], 1)).to.be.reverted;
    });
  });
});
